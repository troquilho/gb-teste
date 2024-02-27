const createEnderecoSchema = {
    type: "object",
    required: ["cep", "rua", "bairro", "cidade", "numero", "uf"],
    properties: {
        cep: { type: "string" },
        rua: { type: "string" },
        bairro: { type: "string" },
        cidade: { type: "string" },
        numero: { type: "string" },
        complemento: { type: "string" },
        uf: { type: "string" },
    },
};

const updateEnderecoSchema = {
    type: "object",
    properties: {
        cep: { type: "string" },
        rua: { type: "string" },
        bairro: { type: "string" },
        cidade: { type: "string" },
        numero: { type: "string" },
        complemento: { type: "string" },
        uf: { type: "string" },
    },
};

export { createEnderecoSchema, updateEnderecoSchema };
