import {
    getPedidosHandler,
    createPedidoHandler,
    updatePedidoHandler,
    deletePedidoHandler,
} from "../controllers/pedidoController.js";
import {
    createPedidoSchema,
    updatePedidoSchema,
} from "../docs/request/pedidoSchemas.js";
import {
    getPedidosResponse,
    createPedidoResponse,
    updatePedidoResponse,
    deletePedidoResponse,
} from "../docs/response/pedidoResponses.js";

export default async function (fastify, opts) {
    fastify.get(
        "/pedido",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: getPedidosResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        getPedidosHandler
    );

    fastify.post(
        "/pedido",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: createPedidoSchema,
                response: createPedidoResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        createPedidoHandler
    );

    fastify.put(
        "/pedido/:pedido_id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                params: {
                    type: "object",
                    properties: {
                        pedido_id: { type: "integer" },
                    },
                },
                body: updatePedidoSchema,
                response: updatePedidoResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        updatePedidoHandler
    );

    fastify.delete(
        "/pedido/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: deletePedidoResponse,
                security: [{ bearerAuth: [] }],
            },
        },
        deletePedidoHandler
    );
}
