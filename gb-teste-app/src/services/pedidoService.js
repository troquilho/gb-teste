import api from "../config/api.js";

const fetchData = async (paginate = true, page = 1) => {
    try {
        const response = await api.get("/pedido", { params: { paginate, page, limit: 2 } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const submitData = async (type, data) => {
    if (type === "add") {
        try {
            const response = await api.post("/pedido", data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } else {
        try {
            const response = await api.put(`/pedido/${data.pedido_id}`, data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
}

const deleteData = async (id) => {
    try {
        const response = await api.delete(`/pedido/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const apiMethods = { fetchData, submitData, deleteData };
export default apiMethods;