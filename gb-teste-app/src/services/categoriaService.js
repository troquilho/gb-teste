import api from "../config/api.js";

const fetchData = async (paginate = true, page = 1) => {
    try {
        let response = []
        if (paginate) {
            response = await api.get("/categoria", { params: { paginate, page, limit: 2 } });
        } else {
            response = await api.get("/categoria", { params: { paginate } });
        }
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const submitData = async (type, data) => {
    if (type === "add") {
        try {
            const response = await api.post("/categoria", data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } else {
        try {
            const response = await api.put(`/categoria/${data.categoria_id}`, data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
}

const deleteData = async (id) => {
    try {
        const response = await api.delete(`/categoria/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const apiMethods = { fetchData, submitData, deleteData };
export default apiMethods;