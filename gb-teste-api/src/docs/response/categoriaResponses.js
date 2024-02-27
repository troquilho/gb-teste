const getCategoriaResponse = {
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
};

const categoriaOperationResponse = {
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
};

export { getCategoriaResponse, categoriaOperationResponse };
