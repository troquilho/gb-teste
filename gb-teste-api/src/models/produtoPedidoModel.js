class ProdutoPedidoModel {
    constructor(db) {
        this.db = db;
    }

    async create({
        pedido_id,
        produto_id,
        qtd_produto_pedido,
        preco_produto_pedido,
        client,
    }) {
        const result = await client.query(
            "INSERT INTO public.produto_pedido (pedido_id, produto_id, qtd_produto_pedido, preco_produto_pedido) VALUES ($1, $2, $3, $4) RETURNING *;",
            [pedido_id, produto_id, qtd_produto_pedido, preco_produto_pedido]
        );
        return result.rows[0];
    }

    async findByPedidoId(pedidoId) {
        const result = await this.db.query(
            `SELECT pp.produto_id, pp.qtd_produto_pedido, pp.preco_produto_pedido, p.nome_produto
             FROM public.produto_pedido pp
             INNER JOIN public.produto p ON pp.produto_id = p.produto_id
             WHERE pp.pedido_id = $1;`,
            [pedidoId]
        );
        return result.rows;
    }

    async findByPedidoIdAndProdutoId({ pedido_id, produto_id, client }) {
        const result = await client.query(
            "SELECT * FROM public.produto_pedido WHERE pedido_id = $1 AND produto_id = $2;",
            [pedido_id, produto_id]
        );
        console.log(result.rows);
        return result.rows[0];
    }

    async updateQtd({ pedido_id, produtos_id, qtd_produto_pedido, client }) {
        const result = await client.query(
            "UPDATE public.produto_pedido SET qtd_produto_pedido = $1 WHERE pedido_id = $2 AND produto_id = $3;",
            [qtd_produto_pedido, pedido_id, produtos_id]
        );
        return result.rows[0];
    }

    async sumQtd({ pedido_id, produtos_id, qtd_produto_pedido, client }) {
        const result = await client.query(
            "UPDATE public.produto_pedido SET qtd_produto_pedido = qtd_produto_pedido + $1 WHERE produto_id = $2 AND pedido_id = $3;",
            [qtd_produto_pedido, produtos_id, pedido_id]
        );
        return result.rows[0];
    }

    async updateOrderProducts ({ pedido_id, client }) {
        const result = await client.query(
            "SELECT p.preco_produto, pp.qtd_produto_pedido FROM public.produto_pedido pp JOIN public.produto p ON pp.produto_id = p.produto_id WHERE pp.pedido_id = $1",
            [pedido_id]
        )
        return result.rows;
    }

    async delete({ pedido_id, produto_id, client }) {
        const result = await client.query(
            "DELETE FROM public.produto_pedido WHERE pedido_id = $1 AND produto_id = $2;",
            [pedido_id, produto_id]
        );
        return result.rows[0];
    }

    async deleteByPedidoId({ pedido_id, client }) {
        const result = await client.query(
            "DELETE FROM public.produto_pedido WHERE pedido_id = $1;",
            [pedido_id]
        )
        return result.rows[0];
    }
}

export default ProdutoPedidoModel;
