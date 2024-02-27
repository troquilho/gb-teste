import { healthHandler, getCepByZipcode } from "../controllers/configController.js";

export default async function (fastify, opts) {
    fastify.get("/health", healthHandler);

    fastify.get("/config/cep/:cep", getCepByZipcode);
}
