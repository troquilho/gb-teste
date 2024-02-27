import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/categoriaService.js';

async function getCategoriasHandler(request, reply) {
    try {
        const paginate = request.query.paginate === "true";
        const page = parseInt(request.query.page, 10) || 1;
        const limit = parseInt(request.query.limit, 10) || 10;

        const result = await getCategorias(this.db, { paginate, page, limit });

        reply.code(200).send({
            status: "success",
            ...result,
        });
    } catch (error) {
        console.log(error);
        reply.code(400).send({
            status: "error",
            message: error.message || "Erro ao buscar categorias",
        });
    }
}

async function createCategoriaHandler(request, reply) {
    try {
        const { nome_categoria, descricao_categoria } = request.body;
        const result = await createCategoria(this.db, { nome_categoria, descricao_categoria });

        reply.code(201).send({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.log(error);
        reply.code(400).send({
            status: "error",
            message: error.message || "Erro ao criar categoria",
        });
    }
}

async function updateCategoriaHandler(request, reply) {
    try {
        const { id } = request.params;
        const { nome_categoria, descricao_categoria } = request.body;
        const result = await updateCategoria(this.db, id, { nome_categoria, descricao_categoria });

        reply.code(200).send({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.log(error);
        reply.code(400).send({
            status: "error",
            message: error.message || "Erro ao atualizar categoria",
        });
    }
}

async function deleteCategoriaHandler(request, reply) {
    try {
        const { id } = request.params;
        const result = await deleteCategoria(this.db, id);

        if (result) {
            reply.code(200).send({
                status: "success",
                data: result,
            });
        } else {
            reply.code(404).send({
                status: "error",
                message: "Categoria não encontrada",
            });
        }
    } catch (error) {
        console.log(error);
        reply.code(400).send({
            status: "error",
            message: error.message || "Erro ao deletar categoria",
        });
    }
}

export { getCategoriasHandler, createCategoriaHandler, updateCategoriaHandler, deleteCategoriaHandler };
