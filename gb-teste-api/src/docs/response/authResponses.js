const loginSuccessResponse = {
    200: {
        type: "object",
        properties: {
            status: { type: "string", enum: ["success"] },
            data: {
                type: "object",
                properties: {
                    token: { type: "string" },
                },
            },
        },
    },
};

const loginErrorResponse = {
    401: {
        type: "object",
        properties: {
            status: { type: "string", enum: ["error"] },
            message: { type: "string" },
        },
    },
};

export { loginSuccessResponse, loginErrorResponse };