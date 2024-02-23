export default async function (fastify, opts) {
    fastify.get(
        "/categoria",
        {
            preValidation: [fastify.authenticate],
            schema: {
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["success"] },
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        categoria_id: { type: "integer" },
                                        nome_categoria: { type: "string" },
                                        descricao_categoria: { type: "string" },
                                    },
                                },
                            },
                            pagination: {
                                type: "object",
                                properties: {
                                    totalItems: { type: "integer" },
                                    totalPages: { type: "integer" },
                                    currentPage: { type: "integer" },
                                    itemsPerPage: { type: "integer" },
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
            const paginate = request.query.paginate === "true";

            if (paginate) {
                const page = parseInt(request.query.page, 10) || 1;
                const limit = parseInt(request.query.limit, 10) || 10;
                const offset = (page - 1) * limit;

                const result = await fastify.db.query(
                    "SELECT * FROM public.categoria ORDER BY categoria_id DESC LIMIT $1 OFFSET $2;",
                    [limit, offset]
                );

                const countResult = await fastify.db.query(
                    "SELECT COUNT(*) FROM public.categoria;"
                );
                const totalItems = parseInt(countResult.rows[0].count, 10);
                const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

                return reply
                    .code(200)
                    .header("Content-Type", "application/json; charset=utf-8")
                    .send({
                        status: "success",
                        data: result.rows,
                        pagination: {
                            totalItems,
                            totalPages,
                            currentPage: page,
                            itemsPerPage: limit,
                        },
                    });
            } else {
                const result = await fastify.db.query(
                    "SELECT * FROM public.categoria ORDER BY categoria_id ASC;"
                );
                return reply
                    .code(200)
                    .header("Content-Type", "application/json; charset=utf-8")
                    .send({
                        status: "success",
                        data: result.rows,
                    });
            }
        }
    );

    fastify.post(
        "/categoria",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: {
                    type: "object",
                    properties: {
                        nome_categoria: { type: "string" },
                        descricao_categoria: { type: "string" },
                    },
                    required: ["nome_categoria", "descricao_categoria"],
                },
                response: {
                    201: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["success"] },
                            data: {
                                type: "object",
                                properties: {
                                    categoria_id: { type: "integer" },
                                    nome_categoria: { type: "string" },
                                    descricao_categoria: { type: "string" },
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
            const { nome_categoria, descricao_categoria } = request.body;
            const result = await fastify.db.query(
                "INSERT INTO public.categoria (nome_categoria, descricao_categoria) VALUES ($1, $2) RETURNING *;",
                [nome_categoria, descricao_categoria]
            );
            return reply
                .code(201)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({
                    status: "success",
                    data: result.rows[0],
                });
        }
    );

    fastify.put(
        "/categoria/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: {
                    type: "object",
                    properties: {
                        nome_categoria: { type: "string" },
                        descricao_categoria: { type: "string" },
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
                                    categoria_id: { type: "integer" },
                                    nome_categoria: { type: "string" },
                                    descricao_categoria: { type: "string" },
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
            const { id } = request.params;
            const { nome_categoria, descricao_categoria } = request.body;
            const result = await fastify.db.query(
                "UPDATE public.categoria SET nome_categoria = $1, descricao_categoria = $2 WHERE categoria_id = $3 RETURNING *;",
                [nome_categoria, descricao_categoria, id]
            );
            return reply
                .code(200)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({
                    status: "success",
                    data: result.rows[0],
                });
        }
    );

    fastify.delete(
        "/categoria/:id",
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
                                    categoria_id: { type: "integer" },
                                    nome_categoria: { type: "string" },
                                    descricao_categoria: { type: "string" },
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
            const { id } = request.params;
            const result = await fastify.db.query(
                "DELETE FROM public.categoria WHERE categoria_id = $1 RETURNING *;",
                [id]
            );
            return reply
                .code(200)
                .header("Content-Type", "application/json; charset=utf-8")
                .send({
                    status: "success",
                    data: result.rows[0],
                });
        }
    );
}
