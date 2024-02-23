import api from "../config/api.js";

const fetchData = async (paginate = true, page = 1) => {
    try {
        const response = await api.get("/endereco", { params: { paginate, page, limit: 2 } });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const submitData = async (type, data) => {
    if (type === "add") {
        try {
            const response = await api.post("/endereco", data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    } else {
        try {
            const response = await api.put(`/endereco/${data.endereco_id}`, data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
}

const deleteData = async (id) => {
    try {
        const response = await api.delete(`/endereco/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const getAddressByZipcode = async (zipcode) => {
    try {
        const response = await api.get(`/config/cep/${zipcode}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

const apiMethods = { fetchData, submitData, deleteData, getAddressByZipcode };
export default apiMethods;