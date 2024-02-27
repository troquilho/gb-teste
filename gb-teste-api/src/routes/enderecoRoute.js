import {
    getEnderecosHandler,
    createEnderecoHandler,
    updateEnderecoHandler,
    deleteEnderecoHandler,
} from "../controllers/enderecoController.js";
import {
    createEnderecoSchema,
    updateEnderecoSchema,
} from "../docs/request/enderecoSchemas.js";
import {
    getEnderecosResponse,
    createEnderecoResponse,
    updateEnderecoResponse,
    deleteEnderecoResponse,
} from "../docs/response/enderecoResponses.js";

export default async function (fastify, opts) {
    fastify.get(
        "/endereco",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: getEnderecosResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        getEnderecosHandler
    );

    fastify.post(
        "/endereco",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: createEnderecoSchema,
                response: createEnderecoResponse,
            },
        },
        createEnderecoHandler
    );

    fastify.put(
        "/endereco/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                params: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                    },
                },
                body: updateEnderecoSchema,
                response: updateEnderecoResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        updateEnderecoHandler
    );

    fastify.delete(
        "/endereco/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: deleteEnderecoResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        deleteEnderecoHandler
    );
}
