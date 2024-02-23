import fp from "fastify-plugin";
import pkg from "pg";
const { Pool } = pkg;
import config from "../config/db.js";

async function dbConnector(fastify, options) {
    const pool = new Pool(config.db);

    const db = {
        query: pool.query.bind(pool),
        getClient: async () => {
            const client = await pool.connect();
            const query = client.query.bind(client);
            const release = client.release.bind(client);
            await query("BEGIN");
            return { query, release };
        },
    };

    fastify.decorate("db", db);
}

export default fp(dbConnector);
