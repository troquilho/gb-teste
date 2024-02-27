const getPedidosResponse = {
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
};

const createPedidoResponse = {
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
};

const updatePedidoResponse = {
    200: {
        type: "object",
        properties: {
            status: { type: "string", enum: ["success"] },
            message: { type: "string" },
        },
    },
};

const deletePedidoResponse = {
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
};

export { getPedidosResponse, createPedidoResponse, updatePedidoResponse, deletePedidoResponse };
