import dotenv from 'dotenv';
dotenv.config();

const appConfig = {
    jwtSecret: process.env.JWT_SECRET || 'supersecret',
    corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : "*",
    port: process.env.PORT || 3000,
};

export default appConfig;