const createCategoriaSchema = {
    type: "object",
    required: ["nome_categoria", "descricao_categoria"],
    properties: {
        nome_categoria: { type: "string" },
        descricao_categoria: { type: "string" },
    },
};

const updateCategoriaSchema = {
    type: "object",
    properties: {
        nome_categoria: { type: "string" },
        descricao_categoria: { type: "string" },
    },
};

export { createCategoriaSchema, updateCategoriaSchema };