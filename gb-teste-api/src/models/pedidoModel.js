class PedidoModel {
    constructor(db) {
        this.db = db;
    }

    async findAll({ paginate, page, limit }) {
        if (paginate) {
            const offset = (page - 1) * limit;
            const pedidos = await this.db.query(
                `SELECT p.pedido_id, p.numero_pedido, p.valor_total_pedido, p.data_pedido, p.status, c.cliente_id, c.nome AS nome_cliente
                 FROM public.pedido p
                 INNER JOIN public.cliente c ON p.cliente_id = c.cliente_id
                 ORDER BY p.pedido_id DESC
                 LIMIT $1 OFFSET $2;`,
                [limit, offset]
            );
            const count = await this.db.query(
                "SELECT COUNT(*) FROM public.pedido;"
            );
            const totalItems = parseInt(count.rows[0].count, 10);
            const totalPages = Math.max(Math.ceil(totalItems / limit), 1);

            return {
                data: pedidos.rows,
                pagination: {
                    totalItems,
                    totalPages,
                    currentPage: page,
                    itemsPerPage: limit,
                },
            };
        } else {
            const pedidos = await this.db.query(
                `SELECT p.pedido_id, p.numero_pedido, p.valor_total_pedido, p.data_pedido, p.status, c.cliente_id, c.nome AS nome_cliente
                 FROM public.pedido p
                 INNER JOIN public.cliente c ON p.cliente_id = c.cliente_id
                 ORDER BY p.pedido_id DESC;`
            );
            return { data: pedidos.rows };
        }
    }

    async create({ cliente_id, numero_pedido, client }) {
        const result = await client.query(
            "INSERT INTO pedido (cliente_id, numero_pedido, status) VALUES ($1, $2, true) RETURNING *",
            [cliente_id, numero_pedido]
        );
        return result.rows[0];
    }

    async updateValorTotal({ pedido_id, valor_total, client }) {
        console.log(pedido_id, valor_total);
        const result = await client.query(
            "UPDATE public.pedido SET valor_total_pedido = $1 WHERE pedido_id = $2;",
            [valor_total, pedido_id]
        );
        return result.rows[0];
    }

    async updateClienteId({ pedido_id, cliente_id, client }) {
        const result = await client.query(
            "UPDATE public.pedido SET cliente_id = $1 WHERE pedido_id = $2;",
            [cliente_id, pedido_id]
        )
        return result.rows[0];
    }

    async findById(pedido_id, client) {
        const result = await client.query(
            "SELECT * FROM public.pedido WHERE pedido_id = $1;",
            [pedido_id]
        );
        return result.rows[0];
    }

    async count() {
        const result = await this.db.query(
            "SELECT COUNT(*) FROM public.pedido;"
        );
        return parseInt(result.rows[0].count, 10);
    }

    async delete(pedido_id, client) {
        const result = await client.query(
            "DELETE FROM public.pedido WHERE pedido_id = $1;",
            [pedido_id]
        )
        return result.rows[0];
    }
}

export default PedidoModel;
