import bcrypt from "bcryptjs";
import { validateCPF, normalizeCPF } from "../config/utils.js";

export default async function (fastify, opts) {
    fastify.get(
        "/cliente",
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
                                        cliente_id: { type: "integer" },
                                        email: { type: "string" },
                                        username: { type: "string" },
                                        nome: { type: "string" },
                                        telefone: { type: "string" },
                                        data_nascimento: {
                                            type: "string",
                                            format: "date",
                                        },
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
                    "SELECT c.*, e.cep, e.rua, e.bairro, e.cidade, e.numero, e.complemento, e.uf FROM public.cliente c INNER JOIN public.endereco e ON c.endereco_id = e.endereco_id ORDER BY cliente_id DESC LIMIT $1 OFFSET $2;",
                    [limit, offset]
                );

                const countResult = await fastify.db.query(
                    "SELECT COUNT(*) FROM public.cliente;"
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
                    "SELECT c.*, e.cep, e.rua, e.bairro, e.cidade, e.numero, e.complemento, e.uf FROM public.cliente c INNER JOIN public.endereco e ON c.endereco_id = e.endereco_id ORDER BY cliente_id DESC;"
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
        "/cliente",
        {
            preValidation: [fastify.authenticate],
            schema: {
                body: {
                    type: "object",
                    required: [
                        "email",
                        "username",
                        "nome",
                        "telefone",
                        "data_nascimento",
                        "endereco_id",
                        "senha",
                        "cpf",
                    ],
                    properties: {
                        email: { type: "string" },
                        username: { type: "string" },
                        nome: { type: "string" },
                        telefone: { type: "string" },
                        data_nascimento: { type: "string", format: "date" },
                        endereco_id: { type: "integer" },
                        senha: { type: "string" },
                        cpf: { type: "string" },
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
                                    cliente_id: { type: "integer" },
                                    email: { type: "string" },
                                    username: { type: "string" },
                                    nome: { type: "string" },
                                    telefone: { type: "string" },
                                    data_nascimento: {
                                        type: "string",
                                        format: "date",
                                    },
                                    endereco_id: { type: "integer" },
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
                email,
                username,
                nome,
                telefone,
                data_nascimento,
                endereco_id,
            } = request.body;
            let { senha, cpf } = request.body;

            if (!validateCPF(cpf)) {
                return reply.code(400).send({ message: "CPF inválido." });
            }

            cpf = normalizeCPF(cpf);
            senha = await bcrypt.hash(senha, 10);
            const existingCPF = await fastify.db.query(
                "SELECT cpf FROM public.cliente WHERE cpf = $1;",
                [cpf]
            );
            if (existingCPF.rows.length > 0) {
                return reply.code(400).send({ message: "CPF já cadastrado." });
            }

            console.log(request.body);
            const enderecoExistente = await fastify.db.query(
                "SELECT endereco_id FROM public.endereco WHERE endereco_id = $1;",
                [endereco_id]
            );
            if (enderecoExistente.rows.length === 0) {
                return reply
                    .code(400)
                    .send({ message: "Endereço não encontrado." });
            }

            const result = await fastify.db.query(
                "INSERT INTO public.cliente (email, username, senha, nome, cpf, telefone, data_nascimento, endereco_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;",
                [
                    email,
                    username,
                    senha,
                    nome,
                    cpf,
                    telefone,
                    data_nascimento,
                    endereco_id,
                ]
            );

            return reply
                .code(201)
                .send({ status: "success", data: result.rows[0] });
        }
    );

    fastify.put(
        "/cliente/:id",
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
                        email: { type: "string" },
                        username: { type: "string" },
                        nome: { type: "string" },
                        telefone: { type: "string" },
                        data_nascimento: { type: "string", format: "date" },
                        endereco_id: { type: "integer" },
                        senha: { type: "string" },
                        cpf: { type: "string" },
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
                                    cliente_id: { type: "integer" },
                                    email: { type: "string" },
                                    username: { type: "string" },
                                    nome: { type: "string" },
                                    telefone: { type: "string" },
                                    data_nascimento: {
                                        type: "string",
                                        format: "date",
                                    },
                                    endereco_id: { type: "integer" },
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
            const { senha: newPass, ...updatedData } = request.body;

            const {
                rows: [actualClient],
            } = await fastify.db.query(
                "SELECT senha FROM public.cliente WHERE cliente_id = $1;",
                [id]
            );

            if (!actualClient) {
                return reply
                    .code(404)
                    .send({ message: "Cliente não encontrado." });
            }

            let passToUpdate = actualClient.senha;
            if (
                newPass &&
                !(await bcrypt.compare(newPass, actualClient.senha))
            ) {
                passToUpdate = await bcrypt.hash(newPass, 10);
            }

            const updatedFields = {
                ...updatedData,
                senha: passToUpdate,
            };

            const setFields = Object.keys(updatedFields)
                .map((key, index) => `${key} = $${index + 2}`)
                .join(", ");
            const values = Object.values(updatedFields);

            const result = await fastify.db.query(
                `UPDATE public.cliente SET ${setFields} WHERE cliente_id = $1 RETURNING *;`,
                [id, ...values]
            );

            if (result.rowCount === 0) {
                return reply
                    .code(404)
                    .send({ message: "Cliente não encontrado." });
            }

            return reply
                .code(200)
                .send({ status: "success", data: result.rows[0] });
        }
    );

    fastify.delete(
        "/cliente/:id",
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
                                    cliente_id: { type: "integer" },
                                    email: { type: "string" },
                                    username: { type: "string" },
                                    nome: { type: "string" },
                                    telefone: { type: "string" },
                                    data_nascimento: {
                                        type: "string",
                                        format: "date",
                                    },
                                    endereco_id: { type: "integer" },
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
                "DELETE FROM public.cliente WHERE cliente_id = $1",
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
