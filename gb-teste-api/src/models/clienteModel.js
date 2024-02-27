class ClienteModel {
    constructor(db) {
        this.db = db;
    }

    async findAll({ paginate, page, limit }) {
        if (paginate) {
            const offset = (page - 1) * limit;
            const clientes = await this.db.query(
                "SELECT c.*, e.cep, e.rua, e.bairro, e.cidade, e.numero, e.complemento, e.uf FROM public.cliente c INNER JOIN public.endereco e ON c.endereco_id = e.endereco_id ORDER BY cliente_id DESC LIMIT $1 OFFSET $2;",
                [limit, offset]
            );
            const count = await this.db.query(
                "SELECT COUNT(*) FROM public.cliente;"
            );
            const totalItems = parseInt(count.rows[0].count, 10);
            const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

            return {
                data: clientes.rows,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            };
        } else {
            const clientes = await this.db.query(
                "SELECT c.*, e.cep, e.rua, e.bairro, e.cidade, e.numero, e.complemento, e.uf FROM public.cliente c INNER JOIN public.endereco e ON c.endereco_id = e.endereco_id ORDER BY cliente_id DESC;"
            );
            return { data: clientes.rows };
        }
    }

    async create(clienteData) {
        const result = await this.db.query(
            "INSERT INTO public.cliente (email, username, senha, nome, cpf, telefone, data_nascimento, endereco_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;",
            [
                clienteData.email,
                clienteData.username,
                clienteData.senha,
                clienteData.nome,
                clienteData.cpf,
                clienteData.telefone,
                clienteData.data_nascimento,
                clienteData.endereco_id,
            ]
        );
        return result.rows[0];
    }

    async update(id, clienteData) {
        const setFields = Object.keys(clienteData)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(", ");
        const values = Object.values(clienteData);

        const result = await this.db.query(
            `UPDATE public.cliente SET ${setFields} WHERE cliente_id = $1 RETURNING *;`,
            [id, ...values]
        );
        return result.rows[0];
    }

    async findByCPF(cpf) {
        const result = await this.db.query(
            "SELECT 1 FROM public.cliente WHERE cpf = $1;",
            [cpf]
        );
        return result.rows.length > 0;
    }

    async findById(clienteId) {
        const result = await this.db.query(
            "SELECT c.*, e.cep, e.rua, e.bairro, e.cidade, e.numero, e.complemento, e.uf FROM public.cliente c INNER JOIN public.endereco e ON c.endereco_id = e.endereco_id WHERE cliente_id = $1;",
            [clienteId]
        )
        return result.rows[0];
    }

    async delete(id) {
        const result = await this.db.query(
            "DELETE FROM public.cliente WHERE cliente_id = $1 RETURNING *;",
            [id]
        );
        return result.rowCount;
    }

    async count() {
        const result = await this.db.query(
            "SELECT COUNT(*) AS count FROM public.cliente;"
        )
        return parseInt(result.rows[0].count, 10);
    }
}

export default ClienteModel;
