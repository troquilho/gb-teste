import bcrypt from "bcryptjs";

import ClienteModel from "../models/clienteModel.js";
import EnderecoModel from "../models/enderecoModel.js";
import { validateCPF, normalizeCPF } from "../config/utils.js";

class ClienteService {
    constructor(db) {
        this.clienteModel = new ClienteModel(db);
        this.enderecoModel = new EnderecoModel(db);
    }

    async getClientes({ paginate, page, limit }) {
        return await this.clienteModel.findAll({ paginate, page, limit });
    }

    async createCliente(clienteData) {
        clienteData.cpf = normalizeCPF(clienteData.cpf);
        if (!validateCPF(clienteData.cpf)) {
            throw new Error("CPF inválido.");
        }

        const cpfExists = await this.clienteModel.findByCPF(clienteData.cpf);
        if (cpfExists) {
            throw new Error("CPF já cadastrado.");
        }

        clienteData.senha = await bcrypt.hash(clienteData.senha, 10);

        let endereco = await this.enderecoModel.findById(
            clienteData.endereco_id
        );
        if (!endereco) {
            throw new Error("Endereço especificado não existe.");
        }

        return await this.clienteModel.create(clienteData);
    }

    async updateCliente(id, updatedData) {
        const actualClient = await this.clienteModel.findById(id);
        if (!actualClient) {
            throw new Error("Cliente não encontrado.");
        }

        let passToUpdate = actualClient.senha;
        if (
            updatedData.senha &&
            !(await bcrypt.compare(updatedData.senha, actualClient.senha))
        ) {
            passToUpdate = await bcrypt.hash(updatedData.senha, 10);
        }

        const updatedFields = {
            ...updatedData,
            senha: passToUpdate,
        };

        return await this.clienteModel.update(id, updatedFields);
    }

    async deleteCliente(id) {
        const deletedCount = await this.clienteModel.delete(id);
        if (deletedCount === 0) {
            throw new Error("Cliente não encontrado ou já foi removido.");
        }
        return { message: "Cliente deletado com sucesso." };
    }
}

export default ClienteService;
