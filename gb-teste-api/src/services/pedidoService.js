import PedidoModel from "../models/pedidoModel.js";
import ProdutoModel from "../models/produtoModel.js";
import ProdutoPedidoModel from "../models/produtoPedidoModel.js";
import { generateOrderNumber } from "../config/utils.js";

class PedidoService {
    constructor(db) {
        this.db = db;
        this.pedidoModel = new PedidoModel(db);
        this.produtoModel = new ProdutoModel(db);
        this.produtoPedidoModel = new ProdutoPedidoModel(db);
    }

    async getPedidos({ paginate, page, limit }) {
        return await this.pedidoModel.findAll({ paginate, page, limit });
    }

    async createPedido({ cliente_id, produtos }) {
        const client = await this.db.getClient();
        try {
            await client.query("BEGIN");

            const numero_pedido = generateOrderNumber();
            const order = await this.pedidoModel.create({
                cliente_id,
                numero_pedido,
                client,
            });

            let totalValue = 0;
            for (const { produto_id, qtd_produto_pedido } of produtos) {
                const produtoResult = await this.produtoModel.findById(
                    produto_id,
                    client
                );

                let product = produtoResult;

                if (product.qtd_estoque < qtd_produto_pedido) {
                    throw new Error(
                        `Estoque insuficiente para o produto de ID ${produto_id}`
                    );
                }

                product.qtd_estoque -= qtd_produto_pedido;

                await this.produtoModel.updateQtdEstoque(
                    produto_id,
                    product.qtd_estoque,
                    client
                );

                totalValue += product.preco_produto * qtd_produto_pedido;

                await this.produtoPedidoModel.create({
                    pedido_id: order.pedido_id,
                    produto_id: produto_id,
                    qtd_produto_pedido,
                    preco_produto_pedido: product.preco_produto,
                    client,
                });
            }

            await this.pedidoModel.updateValorTotal({
                pedido_id: order.pedido_id,
                valor_total: totalValue,
                client: client,
            });

            await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async updatePedido({ pedido_id, cliente_id, produtos: updatedProducts }) {
        const client = await this.db.getClient();
        try {
            await client.query("BEGIN");

            const existingOrder = await this.pedidoModel.findById(
                pedido_id,
                client
            );
            if (!existingOrder || existingOrder.length === 0) {
                throw new Error("Pedido não encontrado");
            }

            if (cliente_id && cliente_id !== existingOrder.cliente_id) {
                await this.pedidoModel.updateClienteId({
                    pedido_id,
                    cliente_id,
                });
            }

            const currentOrderProducts =
                await this.produtoPedidoModel.findByPedidoId(pedido_id);

            const currentProductsMap = currentOrderProducts.reduce(
                (map, product) => {
                    map[product.produto_id] = product.qtd_produto_pedido;
                    return map;
                },
                {}
            );

            const updatedProductsMap = updatedProducts.reduce(
                (map, product) => {
                    if (!map[product.produto_id]) {
                        map[product.produto_id] = 0;
                    }
                    map[product.produto_id] += product.qtd_produto_pedido;
                    return map;
                },
                {}
            );

            const productsToAdd = [];
            const productsToRemove = [];
            const quantitiesToUpdate = {};

            for (const [produtoId, qty] of Object.entries(updatedProductsMap)) {
                if (currentProductsMap[produtoId]) {
                    const diff = qty - currentProductsMap[produtoId];
                    if (diff !== 0) {
                        quantitiesToUpdate[produtoId] = diff;
                    }
                } else {
                    productsToAdd.push({ produtoId, qty });
                }
            }

            for (const [produtoId, qty] of Object.entries(currentProductsMap)) {
                if (!updatedProductsMap[produtoId]) {
                    productsToRemove.push({ produtoId, qty });
                }
            }

            for (const { produtoId, qty } of productsToRemove) {
                await this.produtoModel.updateEstoque({
                    produtoId,
                    qty,
                    client,
                });
                await this.produtoPedidoModel.delete({
                    pedido_id,
                    produto_id: produtoId,
                    client,
                });
            }

            for (const { produtoId, qty } of productsToAdd) {
                const productData = await this.produtoModel.findById(produtoId);
                await this.produtoModel.removeEstoque({
                    produtoId,
                    qty,
                    client,
                });
                await this.produtoPedidoModel.create({
                    pedido_id,
                    produto_id: produtoId,
                    qtd_produto_pedido: qty,
                    preco_produto_pedido: productData.preco_produto,
                    client,
                });
            }

            for (const [produtoId, qtyDiff] of Object.entries(
                quantitiesToUpdate
            )) {
                await this.produtoModel.removeEstoque({
                    produtoId,
                    qty: qtyDiff,
                    client,
                });
                await this.produtoPedidoModel.sumQtd({
                    pedido_id: pedido_id,
                    produtos_id: produtoId,
                    qtd_produto_pedido: qtyDiff,
                    client,
                });
            }

            const updatedOrderProducts =
                await this.produtoPedidoModel.updateOrderProducts({
                    pedido_id,
                    client,
                });
            const totalValue = updatedOrderProducts.reduce(
                (acc, { preco_produto, qtd_produto_pedido }) =>
                    acc + preco_produto * qtd_produto_pedido,
                0
            );
            await this.pedidoModel.updateValorTotal({
                pedido_id,
                valor_total: totalValue,
                client,
            });

            await client.query("COMMIT");
            client.release();
        } catch (error) {
            await client.query("ROLLBACK");
            client.release();
            throw error;
        }
    }

    async delete(pedidoId) {
        const client = await this.db.getClient();

        try {
            await client.query("BEGIN");

            const existingOrder = await this.pedidoModel.findById(
                pedidoId,
                client
            );
            if (!existingOrder || existingOrder.length === 0) {
                throw new Error("Pedido não encontrado");
            }

            const currentOrderProducts =
                await this.produtoPedidoModel.findByPedidoId(pedidoId);

            for (const {
                produto_id,
                qtd_produto_pedido,
            } of currentOrderProducts) {
                await this.produtoModel.updateEstoque({
                    produtoId: produto_id,
                    qty: qtd_produto_pedido,
                    client,
                });
            }

            await this.produtoPedidoModel.deleteByPedidoId({
                pedido_id: pedidoId,
                client,
            });
            await this.pedidoModel.delete(pedidoId, client);

            await client.query("COMMIT");
            client.release();
        } catch (error) {
            await client.query("ROLLBACK");
            client.release();
            throw error;
        }
    }
}

export default PedidoService;
