import { buildFastify } from "../../server.js";
let fastify;

beforeAll(async () => {
    fastify = await buildFastify();
    await fastify.ready();
});

afterAll(async () => {
    await fastify.close();
});

describe("Auth Routes", () => {
    test("POST `/login` route", async () => {
        const response = await fastify.inject({
            method: "POST",
            url: "/login",
            payload: {
                username: "invalid_username",
                password: "invalid_password",
            },
        });

        expect(response.statusCode).toBe(401);
        const body = JSON.parse(response.body);
        expect(body.message).toBe("Usuário ou senha inválidos");
    });
});
