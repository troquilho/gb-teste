import api from "../config/api.js";

const fetchData = async () => {
    try {
        const response = await api.get("/dashboard");
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const apiMethods = { fetchData };
export default apiMethods;