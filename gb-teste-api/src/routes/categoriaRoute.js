import {
    getCategoriasHandler,
    createCategoriaHandler,
    updateCategoriaHandler,
    deleteCategoriaHandler,
} from "../controllers/categoriaController.js";
import {
    createCategoriaSchema,
    updateCategoriaSchema,
} from "../docs/request/categoriaSchemas.js";
import {
    getCategoriaResponse,
    categoriaOperationResponse,
} from "../docs/response/categoriaResponses.js";

export default async function (fastify, opts) {
    fastify.get(
        "/categoria",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: getCategoriaResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        getCategoriasHandler
    );

    fastify.post(
        "/categoria",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: createCategoriaSchema,
                response: categoriaOperationResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        createCategoriaHandler
    );

    fastify.put(
        "/categoria/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: updateCategoriaSchema,
                response: categoriaOperationResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        updateCategoriaHandler
    );

    fastify.delete(
        "/categoria/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: categoriaOperationResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        deleteCategoriaHandler
    );
}
