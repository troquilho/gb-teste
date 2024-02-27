import PedidoService from "../services/pedidoService.js";
import ProdutoPedidoModel from "../models/produtoPedidoModel.js";

async function getPedidosHandler(request, reply) {
    try {
        const { paginate, page, limit } = request.query;
        const pedidoService = new PedidoService(request.server.db);
        const produtoPedidoModel = new ProdutoPedidoModel(request.server.db);

        const result = await pedidoService.getPedidos({
            paginate,
            page,
            limit: parseInt(limit, 10) || 10,
        });

        if (paginate && result.data) {
            const pedidosComProdutos = await Promise.all(
                result.data.map(async (pedido) => {
                    const produtos = await produtoPedidoModel.findByPedidoId(
                        pedido.pedido_id
                    );
                    return { ...pedido, produtos };
                })
            );

            result.data = pedidosComProdutos;
        }

        reply.code(200).send({
            status: "success",
            ...result,
        });
    } catch (error) {
        console.error(error);
        reply.code(400).send({
            status: "error",
            message: "Erro ao buscar pedidos",
        });
    }
}

async function createPedidoHandler(request, reply) {
    const { cliente_id, produtos } = request.body;

    try {
        const pedidoService = new PedidoService(request.server.db);
        const result = await pedidoService.createPedido({
            cliente_id,
            produtos,
        });

        reply
            .code(201)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                status: "success",
                data: result,
            });
    } catch (error) {
        console.error(error);
        reply
            .code(400)
            .send({ status: "error", message: "Erro ao criar pedido" });
    }
}

async function updatePedidoHandler(request, reply) {
    const { pedido_id } = request.params;
    const { cliente_id, produtos } = request.body;

    try {
        const pedidoService = new PedidoService(request.server.db);

        await pedidoService.updatePedido({
            pedido_id,
            cliente_id,
            produtos,
        });

        reply
            .code(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                status: "success",
                message: "Pedido atualizado com sucesso",
            });
    } catch (error) {
        console.error(error);
        reply
            .code(400)
            .send({ status: "error", message: "Erro ao atualizar pedido" });
    }
}

const deletePedidoHandler = async (request, reply) => {
    
    try {
        const { id } = request.params;

        const pedidoService = new PedidoService(request.server.db);
        await pedidoService.delete(id);

        reply
            .code(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                status: "success",
                message: "Pedido excluido com sucesso"
            })
    } catch (error) {
        console.error(error);
        reply
            .code(400)
            .send({ status: "error", message: "Erro ao excluir pedido" });
    }
}

export { getPedidosHandler, createPedidoHandler, updatePedidoHandler, deletePedidoHandler };
