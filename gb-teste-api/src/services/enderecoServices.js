import EnderecoModel from "../models/enderecoModel.js";

class EnderecoService {
    constructor(db) {
        this.enderecoModel = new EnderecoModel(db);
    }

    async getEnderecos(paginate, page, limit) {
        const { data, totalItems } = await this.enderecoModel.findAll(
            paginate,
            page,
            limit
        );
        if (paginate) {
            const totalPages = Math.ceil(totalItems / limit);
            return {
                data,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            };
        }
        return { data };
    }

    async createEndereco(cep, rua, bairro, cidade, numero, complemento, uf) {
        return await this.enderecoModel.create(cep, rua, bairro, cidade, numero, complemento, uf);
    }

    async updateEndereco(id, cep, rua, bairro, cidade, numero, complemento, uf) {
        return await this.enderecoModel.update(id, cep, rua, bairro, cidade, numero, complemento, uf);
    }

    async deleteEndereco(id) {
        return await this.enderecoModel.delete(id);
    }
}

export default EnderecoService;