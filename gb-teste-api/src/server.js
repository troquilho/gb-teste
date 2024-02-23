import dotenv from "dotenv";
dotenv.config();

import fastifyLib from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import appConfig from "./config/appConfig.js";
import dbPlugin from "./plugins/db.js";
import jwtAuthenticator from "./middleware/index.js";

import categoriaRoute from "./routes/categoriaRoute.js";
import enderecoRoute from "./routes/enderecoRoute.js";
import produtoRoute from "./routes/produtoRoute.js";
import clienteRoute from "./routes/clienteRoute.js";
import pedidoRoute from "./routes/pedidoRoute.js";
import authRoute from "./routes/authRoute.js";
import configRoute from "./routes/configRoute.js";
import dashboardRoute from "./routes/dashboardRoute.js";

const fastify = fastifyLib({ logger: true });

await fastify.register(import("@fastify/swagger"), {
    swagger: {
        info: {
            title: "gb-teste-api documentation",
            description: "API documentation for gb-teste-api application.",
            version: "1.0.0",
        },
        externalDocs: {
            url: "https://swagger.io",
            description: "Find more info here",
        },
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        securityDefinitions: {
            bearerAuth: {
                type: "apiKey",
                name: "Authorization",
                in: "header",
                description: "JWT Authorization header using the Bearer scheme",
                scheme: "Bearer", 
            },
        },
    },
});

await fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    swagger: {
        url: "/documentation/json",
    },
    uiConfig: {
        docExpansion: "list",
        deepLinking: false,
    },
});

fastify
    .register(dbPlugin)
    .register(jwt, { secret: appConfig.jwtSecret })
    .register(cors, { origin: appConfig.corsOrigin })
    .register(jwtAuthenticator)
    .register(authRoute)
    .register(configRoute)
    .register(dashboardRoute)
    .register(categoriaRoute)
    .register(produtoRoute)
    .register(enderecoRoute)
    .register(clienteRoute)
    .register(pedidoRoute);

const start = async () => {
    try {
        await fastify.listen({ port: appConfig.port });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
