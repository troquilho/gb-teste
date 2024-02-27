const getEnderecosResponse = {
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
};

const createEnderecoResponse = {
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
};

const updateEnderecoResponse = {
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
};

const deleteEnderecoResponse = {
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
};

export { getEnderecosResponse, createEnderecoResponse, updateEnderecoResponse, deleteEnderecoResponse };
