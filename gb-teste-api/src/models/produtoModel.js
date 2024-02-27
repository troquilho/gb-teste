class ProdutoModel {
    constructor(db) {
        this.db = db;
    }

    async findAll({ paginate, page, limit }) {
        if (paginate) {
            const offset = (page - 1) * limit;
            const produtos = await this.db.query(
                "SELECT p.*, c.nome_categoria FROM public.produto p INNER JOIN public.categoria c ON p.categoria_id = c.categoria_id ORDER BY produto_id DESC LIMIT $1 OFFSET $2;",
                [limit, offset]
            );
            const count = await this.db.query(
                "SELECT COUNT(*) FROM public.produto;"
            );
            const totalItems = parseInt(count.rows[0].count, 10);
            const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

            return {
                data: produtos.rows,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            };
        } else {
            const produtos = await this.db.query(
                "SELECT p.*, c.nome_categoria FROM public.produto p INNER JOIN public.categoria c ON p.categoria_id = c.categoria_id ORDER BY produto_id DESC;"
            );
            return { data: produtos.rows };
        }
    }

    async create({
        nome_produto,
        descricao_produto,
        preco_produto,
        qtd_estoque,
        categoria_id,
        imagem,
    }) {
        const result = await this.db.query(
            "INSERT INTO public.produto (nome_produto, descricao_produto, preco_produto, qtd_estoque, categoria_id, imagem) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
            [
                nome_produto,
                descricao_produto,
                preco_produto,
                qtd_estoque,
                categoria_id,
                imagem,
            ]
        );
        return result.rows[0];
    }

    async update(id, produtoData) {
        const result = await this.db.query(
            "UPDATE public.produto SET nome_produto = $1, descricao_produto = $2, preco_produto = $3, qtd_estoque = $4, categoria_id = $5, imagem = $6 WHERE produto_id = $7 RETURNING *;",
            [
                produtoData.nome_produto,
                produtoData.descricao_produto,
                produtoData.preco_produto,
                produtoData.qtd_estoque,
                produtoData.categoria_id,
                produtoData.imagem,
                id,
            ]
        );
        return result.rows[0];
    }

    async delete(id) {
        const result = await this.db.query(
            "DELETE FROM public.produto WHERE produto_id = $1 RETURNING *;",
            [id]
        );
        return result.rows[0];
    }

    async findById(id) {
        const result = await this.db.query(
            "SELECT * FROM public.produto WHERE produto_id = $1;",
            [id]
        );
        return result.rows[0];
    }

    async updateQtdEstoque(produtoId, qtdEstoque) {
        const result = await this.db.query(
            "UPDATE public.produto SET qtd_estoque = $1 WHERE produto_id = $2;",
            [qtdEstoque, produtoId]
        );
        return result.rows[0];
    }

    async updateEstoque({ produtoId, qty, client }) {
        const result = await client.query(
            "UPDATE public.produto SET qtd_estoque = qtd_estoque + $1 WHERE produto_id = $2",
            [qty, produtoId]
        );

        return result.rows[0];
    }

    async removeEstoque({ produtoId, qty, client }) {
        const result = await client.query(
            "UPDATE public.produto SET qtd_estoque = qtd_estoque - $1 WHERE produto_id = $2",
            [qty, produtoId]
        );
        return result.rows[0];
    }

    async count() {
        const result = await this.db.query(
            "SELECT COUNT(*) AS count FROM public.produto;"
        );
        return parseInt(result.rows[0].count, 10);
    }
}

export default ProdutoModel;
