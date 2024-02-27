const createClienteSchema = {
    type: "object",
    required: [
        "email",
        "username",
        "nome",
        "telefone",
        "data_nascimento",
        "endereco_id",
        "senha",
        "cpf",
    ],
    properties: {
        email: { type: "string" },
        username: { type: "string" },
        nome: { type: "string" },
        telefone: { type: "string" },
        data_nascimento: { type: "string", format: "date" },
        endereco_id: { type: "integer" },
        senha: { type: "string" },
        cpf: { type: "string" },
    },
};

const updateClienteSchema = {
    type: "object",
    properties: {
        email: { type: "string" },
        username: { type: "string" },
        nome: { type: "string" },
        telefone: { type: "string" },
        data_nascimento: { type: "string", format: "date" },
        endereco_id: { type: "integer" },
        senha: { type: "string" },
        cpf: { type: "string" },
    },
};

export { createClienteSchema, updateClienteSchema };
