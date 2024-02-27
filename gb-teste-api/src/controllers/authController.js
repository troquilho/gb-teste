import AuthService from "../services/authService.js";

const login = async function (request, reply) {
    const { username, password } = request.body;
    try {
        const token = await AuthService.login(username, password, this);
        return reply.code(200).send({
            status: "success",
            data: { token },
        });
    } catch (error) {
        console.log(error);
        reply.code(error.statusCode || 401).send({
            status: "error",
            message: error.message,
        });
    }
};

export default { login };
