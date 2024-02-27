import ProdutoModel from "../models/produtoModel.js";

class ProdutoService {
    constructor(db) {
        this.produtoModel = new ProdutoModel(db);
    }

    async getProdutos({ paginate, page, limit }) {
        return await this.produtoModel.findAll({ paginate, page, limit });
    }

    async createProduto(produtoData) {
        return await this.produtoModel.create(produtoData);
    }

    async updateProduto(id, produtoData) {
        return await this.produtoModel.update(id, produtoData);
    }

    async deleteProduto(id) {
        return await this.produtoModel.delete(id);
    }
}

export default ProdutoService;
