const getProdutosRequest = {
    querystring: {
        type: "object",
        properties: {
            paginate: {
                type: "string",
                enum: ["true", "false"],
                default: "true",
            },
            page: { type: "integer", default: 1 },
            limit: { type: "integer", default: 10 },
        },
        additionalProperties: false,
    },
};

const createProdutoSchema = {
    type: "object",
    properties: {
        nome_produto: { type: "string" },
        descricao_produto: { type: "string" },
        preco_produto: { type: "number" },
        qtd_estoque: { type: "integer" },
        categoria_id: { type: "integer" },
        imagem: { type: "string", default: null },
    },
    required: [
        "nome_produto",
        "descricao_produto",
        "preco_produto",
        "qtd_estoque",
        "categoria_id",
    ],
};

const updateProdutoSchema = {
    type: "object",
    properties: {
        nome_produto: { type: "string" },
        descricao_produto: { type: "string" },
        preco_produto: { type: "number" },
        qtd_estoque: { type: "integer" },
        categoria_id: { type: "integer" },
        imagem: { type: "string" },
    },
};

export { getProdutosRequest, createProdutoSchema, updateProdutoSchema };
