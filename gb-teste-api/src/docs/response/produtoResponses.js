const getProdutosResponse = {
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
                        data_cadastro_produto: { type: "string" },
                        categoria_id: { type: "integer" },
                        imagem: { type: "string" },
                        nome_categoria: { type: "string" },
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

const createProdutoResponse = {
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
};

const updateProdutoResponse = {
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
    404: {
        type: "object",
        properties: {
            status: { type: "string", enum: ["error"] },
            message: { type: "string" },
        },
    },
};

const deleteProdutoResponse = {
    200: {
        type: "object",
        properties: {
            status: { type: "string", enum: ["success"] },
            data: {
                type: "object",
                properties: {
                    produto_id: { type: "integer" },
                },
            },
        },
    },
    404: {
        type: "object",
        properties: {
            status: { type: "string", enum: ["error"] },
            message: { type: "string" },
        },
    },
};

export { getProdutosResponse, createProdutoResponse, updateProdutoResponse, deleteProdutoResponse  };