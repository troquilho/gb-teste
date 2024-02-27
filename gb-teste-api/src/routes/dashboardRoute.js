import { getCountsHandler } from "../controllers/dashboardController.js";
import { getCountsResponse } from "../docs/response/dashboardResponses.js";

export default async function (fastify, opts) {
    fastify.get(
        "/dashboard",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: getCountsResponse,
                security: [{ bearerAuth: [] }],
            },
        }, getCountsHandler
    );
}
