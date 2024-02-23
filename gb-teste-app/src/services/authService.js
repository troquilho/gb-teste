import api from "../config/api.js";

const login = async (user) => {
    try {
        const response = await api.post("/login", user);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const apiMethods = { login };
export default apiMethods;