class CategoriaModel {
    constructor(db) {
        this.db = db;
    }

    async findAll({ paginate, page, limit }) {
        if (paginate) {
            const offset = (page - 1) * limit;
            const result = await this.db.query(
                "SELECT * FROM public.categoria ORDER BY categoria_id DESC LIMIT $1 OFFSET $2;",
                [limit, offset]
            );
            const countResult = await this.db.query(
                "SELECT COUNT(*) FROM public.categoria;"
            );
            const totalItems = parseInt(countResult.rows[0].count, 10);
            const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

            return {
                data: result.rows,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            };
        } else {
            const result = await this.db.query(
                "SELECT * FROM public.categoria ORDER BY categoria_id ASC;"
            );
            return { data: result.rows };
        }
    }

    async create({ nome_categoria, descricao_categoria }) {
        const result = await this.db.query(
            "INSERT INTO public.categoria (nome_categoria, descricao_categoria) VALUES ($1, $2) RETURNING *;",
            [nome_categoria, descricao_categoria]
        );
        return result.rows[0];
    }

    async update(id, { nome_categoria, descricao_categoria }) {
        const result = await this.db.query(
            "UPDATE public.categoria SET nome_categoria = $1, descricao_categoria = $2 WHERE categoria_id = $3 RETURNING *;",
            [nome_categoria, descricao_categoria, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await this.db.query(
            "DELETE FROM public.categoria WHERE categoria_id = $1 RETURNING *;",
            [id]
        );
        return result.rows[0];
    }

    async count() {
        const result = await this.db.query(
            "SELECT COUNT(*) AS count FROM public.categoria;"
        );
        return parseInt(result.rows[0].count, 10);
    }
}

export default CategoriaModel;
