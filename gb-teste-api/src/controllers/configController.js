import axios from "axios";
import { normalizeNumber } from "../config/utils.js";

const healthHandler = async function (request, reply) {
    return reply.code(200).send({
        status: "success",
        data: {
            message: "gb-teste-api está funcionando perfeitamente!",
        },
    });
};

const getCepByZipcode = async function (request, reply) {
    const { cep } = request.params;

    try {
        const response = await axios.get(
            `https://viacep.com.br/ws/${normalizeNumber(cep)}/json/`
        );

        if (response.data.erro) {
            return reply.code(400).send({ message: "CEP inválido." });
        }

        return reply.code(200).send(response.data);
    } catch (error) {
        return reply
            .code(400)
            .send({ message: "Erro ao buscar informações do CEP." });
    }
};

export { healthHandler, getCepByZipcode };
