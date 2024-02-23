export default async function (fastify, opts) {
    fastify.get(
        "/endereco",
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
                                        endereco_id: { type: "integer" },
                                        cep: { type: "string" },
                                        rua: { type: "string" },
                                        bairro: { type: "string" },
                                        cidade: { type: "string" },
                                        numero: { type: "string" },
                                        complemento: { type: "string" },
                                        uf: { type: "string" },
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
                    "SELECT * FROM public.endereco ORDER BY endereco_id DESC LIMIT $1 OFFSET $2;",
                    [limit, offset]
                );

                const countResult = await fastify.db.query(
                    "SELECT COUNT(*) FROM public.endereco;"
                );
                const totalItems = parseInt(countResult.rows[0].count, 10);
                const totalPages = Math.ceil(totalItems / limit);

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
                    "SELECT * FROM public.endereco ORDER BY endereco_id DESC;"
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
        "/endereco",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: {
                    type: "object",
                    required: [
                        "cep",
                        "rua",
                        "bairro",
                        "cidade",
                        "numero",
                        "complemento",
                        "uf",
                    ],
                    properties: {
                        cep: { type: "string" },
                        rua: { type: "string" },
                        bairro: { type: "string" },
                        cidade: { type: "string" },
                        numero: { type: "string" },
                        complemento: { type: "string" },
                        uf: { type: "string" },
                    },
                },
                response: {
                    201: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["success"] },
                            data: {
                                type: "object",
                                properties: {
                                    endereco_id: { type: "integer" },
                                    cep: { type: "string" },
                                    rua: { type: "string" },
                                    bairro: { type: "string" },
                                    cidade: { type: "string" },
                                    numero: { type: "string" },
                                    complemento: { type: "string" },
                                    uf: { type: "string" },
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
            const { cep, rua, bairro, cidade, numero, complemento, uf } =
                request.body;
            const result = await fastify.db.query(
                "INSERT INTO public.endereco (cep, rua, bairro, cidade, numero, complemento, uf) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
                [cep, rua, bairro, cidade, numero, complemento, uf]
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
                body: {
                    type: "object",
                    properties: {
                        cep: { type: "string" },
                        rua: { type: "string" },
                        bairro: { type: "string" },
                        cidade: { type: "string" },
                        numero: { type: "string" },
                        complemento: { type: "string" },
                        uf: { type: "string" },
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
                                    endereco_id: { type: "integer" },
                                    cep: { type: "string" },
                                    rua: { type: "string" },
                                    bairro: { type: "string" },
                                    cidade: { type: "string" },
                                    numero: { type: "string" },
                                    complemento: { type: "string" },
                                    uf: { type: "string" },
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
            const { cep, rua, bairro, cidade, numero, complemento, uf } =
                request.body;
            const result = await fastify.db.query(
                "UPDATE public.endereco SET cep = $1, rua = $2, bairro = $3, cidade = $4, numero = $5, complemento = $6, uf = $7 WHERE endereco_id = $8 RETURNING *;",
                [cep, rua, bairro, cidade, numero, complemento, uf, id]
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
        "/endereco/:id",
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
                                    endereco_id: { type: "integer" },
                                    cep: { type: "string" },
                                    rua: { type: "string" },
                                    bairro: { type: "string" },
                                    cidade: { type: "string" },
                                    numero: { type: "string" },
                                    complemento: { type: "string" },
                                    uf: { type: "string" },
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
                "DELETE FROM public.endereco WHERE endereco_id = $1 RETURNING *;",
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
