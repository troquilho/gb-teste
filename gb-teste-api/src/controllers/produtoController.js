import ProdutoService from "../services/produtoService.js";

async function getProdutosHandler(request, reply) {
    try {
        const { paginate, page, limit } = request.query;
        const produtoService = new ProdutoService(request.server.db);
        const result = await produtoService.getProdutos({
            paginate,
            page,
            limit: parseInt(limit, 10) || 10,
        });

        reply.code(200).send({
            status: "success",
            ...result,
        });
    } catch (error) {
        console.log(error);
        reply.code(400).send({
            status: "error",
            message: "Erro ao buscar produtos",
        });
    }
}

async function createProdutoHandler(request, reply) {
    const produtoService = new ProdutoService(request.server.db);
    try {
        const produtoData = request.body;
        const novoProduto = await produtoService.createProduto(produtoData);

        reply.code(201).send({
            status: "success",
            data: novoProduto,
        });
    } catch (error) {
        console.error(error);
        reply.code(400).send({
            status: "error",
            message: "Erro ao criar produto",
        });
    }
}

async function updateProdutoHandler(request, reply) {
    try {
        const { id } = request.params;
        const produtoData = request.body;
        const produtoService = new ProdutoService(request.server.db);
        const updatedProduto = await produtoService.updateProduto(
            id,
            produtoData
        );

        reply.code(200).send({
            status: "success",
            data: updatedProduto,
        });
    } catch (error) {
        console.error(error);
        reply.code(400).send({
            status: "error",
            message: "Erro ao atualizar produto",
        });
    }
};

async function deleteProdutoHandler(request, reply) {
    try {
        const { id } = request.params;
        const produtoService = new ProdutoService(request.server.db);
        const deletedProduto = await produtoService.deleteProduto(id);

        if (deletedProduto) {
            reply.code(200).send({
                status: "success",
                data: deletedProduto,
            });
        } else {
            reply.code(404).send({
                status: "error",
                message: "Produto não encontrado",
            });
        }
    } catch (error) {
        console.error(error);
        reply.code(400).send({
            status: "error",
            message: "Erro ao deletar produto",
        });
    }
}

export { getProdutosHandler, createProdutoHandler, updateProdutoHandler, deleteProdutoHandler };
