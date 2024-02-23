import { generateOrderNumber } from "../config/utils.js";

export default async function (fastify, opts) {
    fastify.get(
        "/pedido",
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
                                        pedido_id: { type: "integer" },
                                        numero_pedido: { type: "string" },
                                        valor_total_pedido: { type: "number" },
                                        data_pedido: {
                                            type: "string",
                                            format: "date-time",
                                        },
                                        status: { type: "string" },
                                        cliente_id: { type: "integer" },
                                        nome_cliente: { type: "string" },
                                        produtos: {
                                            type: "array",
                                            items: {
                                                type: "object",
                                                properties: {
                                                    produto_id: {
                                                        type: "integer",
                                                    },
                                                    qtd_produto_pedido: {
                                                        type: "integer",
                                                    },
                                                    preco_produto_pedido: {
                                                        type: "number",
                                                    },
                                                    nome_produto: {
                                                        type: "string",
                                                    },
                                                },
                                            },
                                        },
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
                    `SELECT p.pedido_id, p.numero_pedido, p.valor_total_pedido, p.data_pedido, p.status, c.cliente_id, c.nome AS nome_cliente
                     FROM public.pedido p
                     INNER JOIN public.cliente c ON p.cliente_id = c.cliente_id
                     ORDER BY p.pedido_id DESC
                     LIMIT $1 OFFSET $2;`,
                    [limit, offset]
                );

                const countResult = await fastify.db.query(
                    "SELECT COUNT(*) FROM public.pedido;"
                );
                const totalItems = parseInt(countResult.rows[0].count, 10);
                const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

                const orderWithProd = await Promise.all(
                    result.rows.map(async (order) => {
                        const prodResult = await fastify.db.query(
                            `SELECT pp.produto_id, pp.qtd_produto_pedido, pp.preco_produto_pedido, p.nome_produto
                         FROM public.produto_pedido pp
                         INNER JOIN public.produto p ON pp.produto_id = p.produto_id
                         WHERE pp.pedido_id = $1;`,
                            [order.pedido_id]
                        );

                        return {
                            ...order,
                            produtos: prodResult.rows,
                        };
                    })
                );

                return reply
                    .code(200)
                    .header("Content-Type", "application/json; charset=utf-8")
                    .send({
                        status: "success",
                        data: orderWithProd,
                        pagination: {
                            totalItems,
                            totalPages,
                            currentPage: page,
                            itemsPerPage: limit,
                        },
                    });
            } else {
                const result = await fastify.db.query(
                    "SELECT * FROM public.pedido ORDER BY pedido_id ASC;"
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
        "/pedido",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: {
                    type: "object",
                    required: ["cliente_id", "produtos"],
                    properties: {
                        cliente_id: { type: "integer" },
                        produtos: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["produto_id", "qtd_produto_pedido"],
                                properties: {
                                    produto_id: { type: "integer" },
                                    qtd_produto_pedido: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                response: {
                    201: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["success"] },
                            message: { type: "string" },
                            data: {
                                type: "object",
                                properties: {
                                    pedido_id: { type: "integer" },
                                    numero_pedido: { type: "string" },
                                    valor_total_pedido: { type: "number" },
                                    data_pedido: {
                                        type: "string",
                                        format: "date-time",
                                    },
                                    status: { type: "string" },
                                    cliente_id: { type: "integer" },
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
            const { cliente_id, produtos } = request.body;
            const client = await fastify.db.getClient();

            try {
                await client.query("BEGIN");

                let orderNUmber = generateOrderNumber();

                const pedidoResult = await client.query(
                    "INSERT INTO public.pedido (numero_pedido, cliente_id, status, data_pedido) VALUES ($1, $2, true, $3) RETURNING *;",
                    [orderNUmber, cliente_id, new Date()]
                );
                const order = pedidoResult.rows[0];

                let totalValue = 0;
                for (const { produto_id, qtd_produto_pedido } of produtos) {
                    const produtoResult = await client.query(
                        "SELECT preco_produto, qtd_estoque FROM public.produto WHERE produto_id = $1;",
                        [produto_id]
                    );
                    const product = produtoResult.rows[0];

                    if (product.qtd_estoque < qtd_produto_pedido) {
                        throw new Error(
                            `Estoque insuficiente para o produto de ID ${produto_id}`
                        );
                    }

                    await client.query(
                        "UPDATE public.produto SET qtd_estoque = qtd_estoque - $1 WHERE produto_id = $2;",
                        [qtd_produto_pedido, produto_id]
                    );

                    totalValue += product.preco_produto * qtd_produto_pedido;

                    await client.query(
                        "INSERT INTO public.produto_pedido (produto_id, pedido_id, qtd_produto_pedido, preco_produto_pedido) VALUES ($1, $2, $3, $4);",
                        [
                            produto_id,
                            order.pedido_id,
                            qtd_produto_pedido,
                            product.preco_produto,
                        ]
                    );
                }

                await client.query(
                    "UPDATE public.pedido SET valor_total_pedido = $1 WHERE pedido_id = $2;",
                    [totalValue, order.pedido_id]
                );

                await client.query("COMMIT");
                client.release();

                return reply.code(201).send({
                    status: "success",
                    message: "Pedido criado com sucesso.",
                    data: order,
                });
            } catch (error) {
                await client.query("ROLLBACK");
                client.release();

                fastify.log.error(error);
                return reply.send({
                    status: "error",
                    message: "Erro ao criar pedido.",
                });
            }
        }
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
                body: {
                    type: "object",
                    required: ["cliente_id", "produtos"],
                    properties: {
                        cliente_id: { type: "integer" },
                        produtos: {
                            type: "array",
                            items: {
                                type: "object",
                                required: ["produto_id", "qtd_produto_pedido"],
                                properties: {
                                    produto_id: { type: "integer" },
                                    qtd_produto_pedido: { type: "integer" },
                                },
                            },
                        },
                    },
                },
                response: {
                    200: {
                        type: "object",
                        properties: {
                            status: { type: "string", enum: ["success"] },
                            message: { type: "string" },
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
            const { pedido_id } = request.params;
            const { cliente_id, produtos: updatedProducts } = request.body;

            const client = await fastify.db.getClient();

            try {
                await client.query("BEGIN");

                const { rows: existingOrder } = await client.query(
                    "SELECT * FROM public.pedido WHERE pedido_id = $1",
                    [pedido_id]
                );
                if (existingOrder.length === 0) {
                    throw new Error("Pedido não encontrado.");
                }

                if (cliente_id && cliente_id !== existingOrder[0].cliente_id) {
                    await client.query(
                        "UPDATE public.pedido SET cliente_id = $1 WHERE pedido_id = $2",
                        [cliente_id, pedido_id]
                    );
                }

                const { rows: currentOrderProducts } = await client.query(
                    "SELECT produto_id, qtd_produto_pedido FROM public.produto_pedido WHERE pedido_id = $1",
                    [pedido_id]
                );

                const currentProductsMap = currentOrderProducts.reduce(
                    (map, product) => {
                        map[product.produto_id] = product.qtd_produto_pedido;
                        return map;
                    },
                    {}
                );

                const updatedProductsMap = updatedProducts.reduce(
                    (map, product) => {
                        if (!map[product.produto_id]) {
                            map[product.produto_id] = 0;
                        }
                        map[product.produto_id] += product.qtd_produto_pedido;
                        return map;
                    },
                    {}
                );

                const productsToAdd = [];
                const productsToRemove = [];
                const quantitiesToUpdate = {};

                for (const [produtoId, qty] of Object.entries(
                    updatedProductsMap
                )) {
                    if (currentProductsMap[produtoId]) {
                        const diff = qty - currentProductsMap[produtoId];
                        if (diff !== 0) {
                            quantitiesToUpdate[produtoId] = diff;
                        }
                    } else {
                        productsToAdd.push({ produtoId, qty });
                    }
                }

                for (const [produtoId, qty] of Object.entries(
                    currentProductsMap
                )) {
                    if (!updatedProductsMap[produtoId]) {
                        productsToRemove.push({ produtoId, qty });
                    }
                }

                for (const { produtoId, qty } of productsToRemove) {
                    await client.query(
                        "UPDATE public.produto SET qtd_estoque = qtd_estoque + $1 WHERE produto_id = $2",
                        [qty, produtoId]
                    );
                    await client.query(
                        "DELETE FROM public.produto_pedido WHERE produto_id = $1 AND pedido_id = $2",
                        [produtoId, pedido_id]
                    );
                }

                for (const { produtoId, qty } of productsToAdd) {
                    const {
                        rows: [productData],
                    } = await client.query(
                        "SELECT preco_produto FROM public.produto WHERE produto_id = $1",
                        [produtoId]
                    );
                    await client.query(
                        "UPDATE public.produto SET qtd_estoque = qtd_estoque - $1 WHERE produto_id = $2",
                        [qty, produtoId]
                    );
                    await client.query(
                        "INSERT INTO public.produto_pedido (produto_id, pedido_id, qtd_produto_pedido, preco_produto_pedido) VALUES ($1, $2, $3, $4)",
                        [produtoId, pedido_id, qty, productData.preco_produto]
                    );
                }

                for (const [produtoId, qtyDiff] of Object.entries(
                    quantitiesToUpdate
                )) {
                    await client.query(
                        "UPDATE public.produto SET qtd_estoque = qtd_estoque - $1 WHERE produto_id = $2",
                        [qtyDiff, produtoId]
                    );
                    await client.query(
                        "UPDATE public.produto_pedido SET qtd_produto_pedido = qtd_produto_pedido + $1 WHERE produto_id = $2 AND pedido_id = $3",
                        [qtyDiff, produtoId, pedido_id]
                    );
                }

                const { rows: updatedOrderProducts } = await client.query(
                    "SELECT p.preco_produto, pp.qtd_produto_pedido FROM public.produto_pedido pp JOIN public.produto p ON pp.produto_id = p.produto_id WHERE pp.pedido_id = $1",
                    [pedido_id]
                );
                const totalValue = updatedOrderProducts.reduce(
                    (acc, { preco_produto, qtd_produto_pedido }) =>
                        acc + preco_produto * qtd_produto_pedido,
                    0
                );
                await client.query(
                    "UPDATE public.pedido SET valor_total_pedido = $1 WHERE pedido_id = $2",
                    [totalValue, pedido_id]
                );

                await client.query("COMMIT");
                client.release();
                return reply.code(200).send({
                    status: "success",
                    message: "Pedido atualizado com sucesso.",
                });
            } catch (error) {
                await client.query("ROLLBACK");
                client.release();
                fastify.log.error(error);
                return reply.send({
                    status: "error",
                    message: error.message,
                });
            }
        }
    );

    fastify.delete(
        "/pedido/:id",
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
                                    pedido_id: { type: "integer" },
                                    numero_pedido: { type: "string" },
                                    valor_total_pedido: { type: "number" },
                                    data_pedido: {
                                        type: "string",
                                        format: "date-time",
                                    },
                                    status: { type: "string" },
                                    cliente_id: { type: "integer" },
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
            await fastify.db.query(
                "DELETE FROM public.produto_pedido WHERE pedido_id = $1;",
                [id]
            );
            const result = await fastify.db.query(
                "DELETE FROM public.pedido WHERE pedido_id = $1 RETURNING *;",
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
