const getCountsResponse = {
    200: {
        type: "object",
        properties: {
            status: { type: "string", enum: ["success"] },
            data: {
                type: "object",
                properties: {
                    categorias: { type: "integer" },
                    produtos: { type: "integer" },
                    clientes: { type: "integer" },
                    pedidos: { type: "integer" },
                },
            },
        },
    },
};

export { getCountsResponse };
