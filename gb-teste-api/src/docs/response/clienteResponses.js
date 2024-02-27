const getClientesResponse = {
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
                        senha: { type: "string" },
                        cpf: { type: "string" },
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
};

const createClienteResponse = {
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
};

const updateClienteResponse = {
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
};

const deleteClienteResponse = {
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
};

export { getClientesResponse, createClienteResponse, updateClienteResponse, deleteClienteResponse };
