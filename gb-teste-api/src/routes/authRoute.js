import bcrypt from "bcryptjs";

export default async function (fastify, opts) {
    fastify.post(
        "/login",
        {
            schema: {
                body: {
                    type: "object",
                    required: ["username", "password"],
                    properties: {
                        username: { type: "string" },
                        password: { type: "string" },
                    },
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["success"] },
                            data: {
                                type: "object",
                                properties: {
                                    token: { type: "string" },
                                },
                            },
                        },
                    },
                    401: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["error"] },
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        async (request, reply) => {
            const { username, password } = request.body;

            try {
                const passwordMatch = await bcrypt.compare(
                    password,
                    process.env.NODE_PASSWORD_ENCRYPTED
                );

                if (username === process.env.NODE_USER && passwordMatch) {
                    const expiration = new Date().setHours(
                        new Date().getHours() + 4
                    );
                    let tokenObj = {
                        username,
                        expiration,
                    };
                    const token = fastify.jwt.sign(
                        { tokenObj },
                        process.env.NODE_KEY,
                        {
                            expiresIn: "4h",
                        }
                    );
                    return reply.code(200).send({
                        status: "success",
                        data: { token },
                    });
                }
            } catch (error) {
                reply.code(401).send({
                    status: "error",
                    message: "Usuário ou senha inválidos",
                });
            }
        }
    );
}
