import api from "../config/api.js";

const fetchData = async (paginate = true, page = 1) => {
    try {
        const response = await api.get("/cliente", { params: { paginate, page, limit: 2 } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const submitData = async (type, data) => {
    if (type === "add") {
        try {
            const response = await api.post("/cliente", data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } else {
        try {
            const response = await api.put(`/cliente/${data.cliente_id}`, data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
}

const deleteData = async (id) => {
    try {
        const response = await api.delete(`/cliente/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const apiMethods = { fetchData, submitData, deleteData };
export default apiMethods;