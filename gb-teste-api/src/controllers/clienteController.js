import ClienteService from "../services/clienteService.js";

async function getClientesHandler(request, reply) {
    try {
        const { paginate, page, limit } = request.query;
        const clienteService = new ClienteService(request.server.db);
        const result = await clienteService.getClientes({
            paginate,
            page,
            limit: parseInt(limit, 10) || 10,
        });

        reply.code(200).send({
            status: "success",
            ...result,
        });
    } catch (error) {
        console.error(error);
        reply.code(400).send({
            status: "error",
            message: "Erro ao buscar clientes",
        });
    }
}

async function createClienteHandler(request, reply) {
    try {
        const clienteService = new ClienteService(request.server.db);
        const result = await clienteService.createCliente(request.body);

        reply.code(201).send({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.error(error);
        reply.code(400).send({
            status: "error",
            message: error.message,
        });
    }
}

async function updateClienteHandler(request, reply) {
    try {
        const { id } = request.params;
        const { senha, ...updatedData } = request.body;

        const clienteService = new ClienteService(request.server.db);
        const updatedCliente = await clienteService.updateCliente(id, {
            senha,
            ...updatedData,
        });

        reply.code(200).send({
            status: "success",
            data: updatedCliente,
        });
    } catch (error) {
        console.error(error);
        reply.code(error.status || 500).send({
            status: "error",
            message: error.message || "Erro ao atualizar cliente",
        });
    }
}

async function deleteClienteHandler(request, reply) {
    try {
        const { id } = request.params;

        const clienteService = new ClienteService(request.server.db);
        await clienteService.deleteCliente(id);

        reply.code(200).send({
            status: "success",
            message: "Cliente deletado com sucesso.",
        });
    } catch (error) {
        console.error(error);
        reply.code(error.status || 500).send({
            status: "error",
            message: error.message || "Erro ao deletar cliente",
        });
    }
}

export {
    getClientesHandler,
    createClienteHandler,
    updateClienteHandler,
    deleteClienteHandler,
};
