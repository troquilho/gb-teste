import api from "../config/api.js";

const fetchData = async (paginate = true, page = 1) => {
    try {
        const response = await api.get("/produto", { params: { paginate, page, limit: 2 } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const submitData = async (type, data) => {
    if (type === "add") {
        try {
            const response = await api.post("/produto", data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } else {
        try {
            const response = await api.put(`/produto/${data.produto_id}`, data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
}

const deleteData = async (id) => {
    try {
        const response = await api.delete(`/produto/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const apiMethods = { fetchData, submitData, deleteData };
export default apiMethods;