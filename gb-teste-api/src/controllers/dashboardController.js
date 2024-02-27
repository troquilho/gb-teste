import DashboardService from "../services/dashboardService.js";

async function getCountsHandler(request, reply) {
    try {
        const dashboardService = new DashboardService(request.server.db);
        const result = await dashboardService.getCounts();
        reply.code(200).send({
            status: "success",
            data: result,
        });
    } catch (error) {
        console.error(error);
        reply.code(400).send({
            status: "error",
            message: "Erro ao recuperar dados do dashboard.",
        });
    }
}

export { getCountsHandler };