import fp from "fastify-plugin";

async function jwtAuthenticator(fastify, opts) {
    fastify.decorate("authenticate", async (request, reply) => {
        try {
            await request.jwtVerify();
            const { tokenObj } = request.user;
            if (new Date(tokenObj.expiration) < new Date()) {
                reply.code(401).send({
                    status: "error",
                    message: "Token expirado",
                });
            }
        } catch (err) {
            reply.code(401).send({
                status: "error",
                message: "Autenticação falhou: " + err.message,
            });
        }
    });
}

export default fp(jwtAuthenticator);
