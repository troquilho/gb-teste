export default async function (fastify, opts) {
    fastify.get(
        "/dashboard",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["success"] },
                            data: {
                                type: "object",
                                properties: {
                                    categorias: { type: "integer" },
                                    produtos: { type: "integer" },
                                    clientes: { type: "integer" },
                                    pedidos: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                security: [
                    {
                        bearerAuth: [],
                    },
                ],
            },
        },
        async (request, reply) => {
            const client = await fastify.db.getClient();
            try {
                const categoriaCount = await client.query(
                    "SELECT COUNT(*) AS count FROM public.categoria;"
                );
                const produtoCount = await client.query(
                    "SELECT COUNT(*) AS count FROM public.produto;"
                );
                const clienteCount = await client.query(
                    "SELECT COUNT(*) AS count FROM public.cliente;"
                );
                const pedidoCount = await client.query(
                    "SELECT COUNT(*) AS count FROM public.pedido;"
                );

                const dashboardData = {
                    categorias: parseInt(categoriaCount.rows[0].count, 10),
                    produtos: parseInt(produtoCount.rows[0].count, 10),
                    clientes: parseInt(clienteCount.rows[0].count, 10),
                    pedidos: parseInt(pedidoCount.rows[0].count, 10),
                };

                return reply.code(200).send({
                    status: "success",
                    data: dashboardData,
                });
            } catch (error) {
                fastify.log.error(error);
                return reply.send({
                    status: "error",
                    message: "Erro ao recuperar dados do dashboard.",
                });
            } finally {
                client.release();
            }
        }
    );
}
