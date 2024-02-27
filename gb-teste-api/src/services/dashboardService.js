import CategoriaModel from "../models/categoriaModel.js";
import ClienteModel from "../models/clienteModel.js";
import PedidoModel from "../models/pedidoModel.js";
import ProdutoModel from "../models/produtoModel.js";

class DashboardService {
    constructor(db) {
        this.categoriaModel = new CategoriaModel(db);
        this.clienteModel = new ClienteModel(db);
        this.pedidoModel = new PedidoModel(db);
        this.produtoModel = new ProdutoModel(db);
    }

    async getCounts() {
        try {
            const [categoriaCount, clienteCount, pedidoCount, produtoCount] =
                await Promise.all([
                    this.categoriaModel.count(),
                    this.clienteModel.count(),
                    this.pedidoModel.count(),
                    this.produtoModel.count(),
                ]);

            return {
                categorias: categoriaCount,
                clientes: clienteCount,
                pedidos: pedidoCount,
                produtos: produtoCount,
            };
        } catch (error) {
            throw new Error(error);
        }
    }
}

export default DashboardService;
