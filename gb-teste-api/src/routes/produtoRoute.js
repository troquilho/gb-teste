import {
    getProdutosHandler,
    createProdutoHandler,
    updateProdutoHandler,
    deleteProdutoHandler,
} from "../controllers/produtoController.js";
import {
    getProdutosRequest,
    createProdutoSchema,
    updateProdutoSchema,
} from "../docs/request/produtoSchema.js";
import {
    getProdutosResponse,
    createProdutoResponse,
    updateProdutoResponse,
    deleteProdutoResponse,
} from "../docs/response/produtoResponses.js";

export default async function (fastify, opts) {
    fastify.get(
        "/produto",
        {
            preValidation: [fastify.authenticate],
            schema: {
                querystring: getProdutosRequest.querystring,
                response: getProdutosResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        getProdutosHandler
    );

    fastify.post(
        "/produto",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: createProdutoSchema,
                response: createProdutoResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        createProdutoHandler
    );

    fastify.put(
        "/produto/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                querystring: updateProdutoSchema,
                response: updateProdutoResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        updateProdutoHandler
    );

    fastify.delete(
        "/produto/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: deleteProdutoResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        deleteProdutoHandler
    );
}
