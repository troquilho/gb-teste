class EnderecoModel {
    constructor(db) {
        this.db = db;
    }

    async findAll(paginate = false, page = 1, limit = 10) {
        if (paginate) {
            const offset = (page - 1) * limit;
            const data = await this.db.query(
                "SELECT * FROM public.endereco ORDER BY endereco_id DESC LIMIT $1 OFFSET $2;",
                [limit, offset]
            );
            const countResult = await this.db.query(
                "SELECT COUNT(*) FROM public.endereco;"
            );
            const totalItems = parseInt(countResult.rows[0].count, 10);
            return { data: data.rows, totalItems };
        } else {
            const result = await this.db.query(
                "SELECT * FROM public.endereco ORDER BY endereco_id DESC;"
            );
            return { data: result.rows };
        }
    }

    async findById(enderecoId) {
        const result = await this.db.query(
            "SELECT * FROM public.endereco WHERE endereco_id = $1;",
            [enderecoId]
        );
        return result.rows[0];
    }

    async create(cep, rua, bairro, cidade, numero, complemento, uf) {
        const result = await this.db.query(
            "INSERT INTO public.endereco (cep, rua, bairro, cidade, numero, complemento, uf) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;",
            [cep, rua, bairro, cidade, numero, complemento, uf]
        );
        return result.rows[0];
    }

    async update(id, cep, rua, bairro, cidade, numero, complemento, uf) {
        const result = await this.db.query(
            "UPDATE public.endereco SET cep = $1, rua = $2, bairro = $3, cidade = $4, numero = $5, complemento = $6, uf = $7 WHERE endereco_id = $8 RETURNING *;",
            [cep, rua, bairro, cidade, numero, complemento, uf, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await this.db.query(
            "DELETE FROM public.endereco WHERE endereco_id = $1 RETURNING *;",
            [id]
        );
        return result.rows[0];
    }
}

export default EnderecoModel;
