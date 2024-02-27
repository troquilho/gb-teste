import {
    getClientesHandler,
    createClienteHandler,
    updateClienteHandler,
    deleteClienteHandler,
} from "../controllers/clienteController.js";
import {
    getClientesResponse,
    createClienteResponse,
    updateClienteResponse,
    deleteClienteResponse,
} from "../docs/response/clienteResponses.js";
import {
    createClienteSchema,
    updateClienteSchema,
} from "../docs/request/clienteSchemas.js";

export default async function (fastify, opts) {
    fastify.get(
        "/cliente",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: getClientesResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        getClientesHandler
    );

    fastify.post(
        "/cliente",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: createClienteSchema,
                response: createClienteResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        createClienteHandler
    );

    fastify.put(
        "/cliente/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: updateClienteSchema,
                response: updateClienteResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        updateClienteHandler
    );

    fastify.delete(
        "/cliente/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: deleteClienteResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        deleteClienteHandler
    );
}
