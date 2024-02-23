import axios from "axios";

export default async function (fastify, opts) {
    fastify.get("/health", async (request, reply) => {
        return reply.code(200).send({
            status: "success",
            data: {
                message: "gb-teste-api está funcionando perfeitamente!",
            },
        });
    });

    fastify.get("/config/cep/:cep", async (request, reply) => {
        const { cep } = request.params;

        try {
            const response = await axios.get(
                `https://viacep.com.br/ws/${cep}/json/`
            );

            if (response.data.erro) {
                return reply.code(400).send({ message: "CEP inválido." });
            }

            return reply.code(200).send(response.data);
        } catch (error) {
            return reply
                .code(500)
                .send({ message: "Erro ao buscar informações do CEP." });
        }
    });
}
