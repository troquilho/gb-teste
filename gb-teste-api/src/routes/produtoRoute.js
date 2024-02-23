export default async function (fastify, opts) {
    fastify.get(
        "/produto",
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
                                        produto_id: { type: "integer" },
                                        nome_produto: { type: "string" },
                                        descricao_produto: { type: "string" },
                                        preco_produto: { type: "number" },
                                        qtd_estoque: { type: "integer" },
                                        categoria_id: { type: "integer" },
                                        imagem: { type: "string" },
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
                    "SELECT p.*, c.nome_categoria FROM public.produto p INNER JOIN public.categoria c ON p.categoria_id = c.categoria_id ORDER BY produto_id DESC LIMIT $1 OFFSET $2;",
                    [limit, offset]
                );

                const countResult = await fastify.db.query(
                    "SELECT COUNT(*) FROM public.produto;"
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
                    "SELECT p.*, c.nome_categoria FROM public.produto p INNER JOIN public.categoria c ON p.categoria_id = c.categoria_id ORDER BY produto_id DESC;"
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
        "/produto",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: {
                    type: "object",
                    properties: {
                        nome_produto: { type: "string" },
                        descricao_produto: { type: "string" },
                        preco_produto: { type: "number" },
                        qtd_estoque: { type: "integer" },
                        categoria_id: { type: "integer" },
                        imagem: { type: "string" },
                    },
                    required: [
                        "nome_produto",
                        "descricao_produto",
                        "preco_produto",
                        "qtd_estoque",
                        "categoria_id",
                    ],
                },
                response: {
                    201: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["success"] },
                            data: {
                                type: "object",
                                properties: {
                                    produto_id: { type: "integer" },
                                    nome_produto: { type: "string" },
                                    descricao_produto: { type: "string" },
                                    preco_produto: { type: "number" },
                                    qtd_estoque: { type: "integer" },
                                    categoria_id: { type: "integer" },
                                    imagem: { type: "string" },
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
            const {
                nome_produto,
                descricao_produto,
                preco_produto,
                qtd_estoque,
                categoria_id,
            } = request.body;
            const imagem =
                request.body.imagem ||
                "https://fakeimg.pl/150x150/6E6E6E/8DC63F/?text=produto";
            const result = await fastify.db.query(
                "INSERT INTO public.produto (nome_produto, descricao_produto, preco_produto, qtd_estoque, categoria_id, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
                [
                    nome_produto,
                    descricao_produto,
                    preco_produto,
                    qtd_estoque,
                    categoria_id,
                    imagem,
                ]
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
        "/produto/:id",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: {
                    type: "object",
                    properties: {
                        nome_produto: { type: "string" },
                        descricao_produto: { type: "string" },
                        preco_produto: { type: "number" },
                        qtd_estoque: { type: "integer" },
                        categoria_id: { type: "integer" },
                        imagem: { type: "string" },
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
                                    produto_id: { type: "integer" },
                                    nome_produto: { type: "string" },
                                    descricao_produto: { type: "string" },
                                    preco_produto: { type: "number" },
                                    qtd_estoque: { type: "integer" },
                                    categoria_id: { type: "integer" },
                                    imagem: { type: "string" },
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
            const {
                nome_produto,
                descricao_produto,
                preco_produto,
                qtd_estoque,
                categoria_id,
                imagem,
            } = request.body;
            const result = await fastify.db.query(
                "UPDATE public.produto SET nome_produto = $1, descricao_produto = $2, preco_produto = $3, qtd_estoque = $4, categoria_id = $5, imagem = $6 WHERE produto_id = $7 RETURNING *;",
                [
                    nome_produto,
                    descricao_produto,
                    preco_produto,
                    qtd_estoque,
                    categoria_id,
                    imagem,
                    id,
                ]
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
        "/produto/:id",
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
                                    produto_id: { type: "integer" },
                                    nome_produto: { type: "string" },
                                    descricao_produto: { type: "string" },
                                    preco_produto: { type: "number" },
                                    qtd_estoque: { type: "integer" },
                                    categoria_id: { type: "integer" },
                                    imagem: { type: "string" },
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
                "DELETE FROM public.produto WHERE produto_id = $1 RETURNING *;",
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
