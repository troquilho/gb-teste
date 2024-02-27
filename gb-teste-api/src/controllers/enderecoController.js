import EnderecoService from "../services/enderecoServices.js";

async function getEnderecosHandler(request, reply) {
    const paginate = request.query.paginate === "true";
    const page = parseInt(request.query.page, 10) || 1;
    const limit = parseInt(request.query.limit, 10) || 10;

    try {
        const enderecoService = new EnderecoService(request.server.db);
        const result = await enderecoService.getEnderecos(
            paginate,
            page,
            limit
        );

        reply
            .code(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                status: "success",
                ...result,
            });
    } catch (error) {
        console.error(error);
        reply
            .code(400)
            .send({ status: "error", message: "Erro ao buscar endereços" });
    }
}

async function createEnderecoHandler(request, reply) {
    const { cep, rua, bairro, cidade, numero, complemento, uf } = request.body;

    try {
        const enderecoService = new EnderecoService(request.server.db);
        const newEndereco = await enderecoService.createEndereco(
            cep,
            rua,
            bairro,
            cidade,
            numero,
            complemento,
            uf
        );

        reply
            .code(201)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                status: "success",
                data: newEndereco,
            });
    } catch (error) {
        console.error(error);
        reply
            .code(400)
            .send({ status: "error", message: "Erro ao criar endereço" });
    }
}

async function updateEnderecoHandler(request, reply) {
    const { id } = request.params;
    const { cep, rua, bairro, cidade, numero, complemento, uf } = request.body;

    try {
        const enderecoService = new EnderecoService(request.server.db);
        const updatedEndereco = await enderecoService.updateEndereco(
            id,
            cep,
            rua,
            bairro,
            cidade,
            numero,
            complemento,
            uf
        );

        if (!updatedEndereco) {
            return reply
                .code(404)
                .send({ status: "error", message: "Endereço não encontrado." });
        }

        reply
            .code(200)
            .header("Content-Type", "application/json; charset=utf-8")
            .send({
                status: "success",
                data: updatedEndereco,
            });
    } catch (error) {
        console.error(error);
        reply
            .code(400)
            .send({ status: "error", message: "Erro ao atualizar endereço" });
    }
}

async function deleteEnderecoHandler(request, reply) {
    const { id } = request.params;

    try {
        const enderecoService = new EnderecoService(request.server.db);
        const deletedEndereco = await enderecoService.deleteEndereco(id);

        if (!deletedEndereco) {
            return reply.code(404).send({ status: "error", message: "Endereço não encontrado." });
        }

        reply.code(200).header("Content-Type", "application/json; charset=utf-8").send({
            status: "success",
            data: deletedEndereco,
        });
    } catch (error) {
        console.error(error);
        reply.code(400).send({ status: "error", message: "Erro ao excluir endereço" });
    }
}

export { getEnderecosHandler, createEnderecoHandler, updateEnderecoHandler, deleteEnderecoHandler  };
