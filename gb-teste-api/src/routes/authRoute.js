import AuthController from "../controllers/authController.js";
import { loginSchema } from "../docs/request/authSchemas.js";
import { loginSuccessResponse, loginErrorResponse } from "../docs/response/authResponses.js";

export default async function (fastify, opts) {
    fastify.post(
        "/login",
        {
            schema: {
                body: loginSchema,
                response: {
                    ...loginSuccessResponse,
                    ...loginErrorResponse,
                },
            },
        },
        AuthController.login
    );
}
