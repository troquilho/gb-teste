const createPedidoSchema = {
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
};

const updatePedidoSchema = {
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
};

export { createPedidoSchema, updatePedidoSchema };
