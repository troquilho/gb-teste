-- public.categoria definition

-- Drop table

-- DROP TABLE public.categoria;

CREATE TABLE public.categoria (
	categoria_id serial NOT NULL,
	nome_categoria varchar(20) NULL,
	descricao_categoria varchar(200) NULL,
	CONSTRAINT categoria_pkey PRIMARY KEY (categoria_id)
);

-- public.cliente definition

-- Drop table

-- DROP TABLE public.cliente;

CREATE TABLE public.cliente (
	cliente_id serial NOT NULL,
	email varchar(50) NULL,
	username varchar(15) NULL,
	senha varchar(100) NULL,
	nome varchar(200) NULL,
	cpf varchar(11) NOT NULL,
	telefone varchar(11) NULL,
	data_nascimento date NULL,
	endereco_id int4 NOT NULL,
	CONSTRAINT cliente_cpf_key UNIQUE (cpf),
	CONSTRAINT cliente_pkey PRIMARY KEY (cliente_id)
);

-- public.endereco definition

-- Drop table

-- DROP TABLE public.endereco;

CREATE TABLE public.endereco (
	endereco_id serial NOT NULL,
	cep varchar(9) NULL,
	rua varchar(100) NULL,
	bairro varchar(30) NULL,
	cidade varchar(30) NULL,
	numero varchar(10) NULL,
	complemento varchar(100) NULL,
	uf varchar(2) NULL,
	CONSTRAINT endereco_pkey PRIMARY KEY (endereco_id)
);

-- public.pedido definition

-- Drop table

-- DROP TABLE public.pedido;

CREATE TABLE public.pedido (
	pedido_id serial NOT NULL,
	numero_pedido int4 NULL,
	valor_total_pedido numeric NULL,
	data_pedido date NOT NULL DEFAULT now(),
	status bool NULL,
	cliente_id int4 NOT NULL,
	CONSTRAINT pedido_pkey PRIMARY KEY (pedido_id)
);


-- public.pedido foreign keys

ALTER TABLE public.pedido ADD CONSTRAINT pedido_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);

-- public.produto definition

-- Drop table

-- DROP TABLE public.produto;

CREATE TABLE public.produto (
	produto_id serial NOT NULL,
	nome_produto varchar(50) NULL,
	descricao_produto varchar(200) NULL,
	preco_produto numeric NULL,
	qtd_estoque int4 NULL,
	data_cadastro_produto date NULL DEFAULT now(),
	categoria_id int4 NOT NULL,
	imagem varchar NULL,
	CONSTRAINT produto_pkey PRIMARY KEY (produto_id)
);


-- public.produto foreign keys

ALTER TABLE public.produto ADD CONSTRAINT produto_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categoria(categoria_id);

-- public.produto_pedido definition

-- Drop table

-- DROP TABLE public.produto_pedido;

CREATE TABLE public.produto_pedido (
	produto_pedido_id serial NOT NULL,
	qtd_produto_pedido int4 NULL,
	preco_produto_pedido numeric NULL,
	produto_id int4 NULL,
	pedido_id int4 NULL,
	CONSTRAINT produto_pedido_pkey PRIMARY KEY (produto_pedido_id)
);


-- public.produto_pedido foreign keys

ALTER TABLE public.produto_pedido ADD CONSTRAINT produto_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedido(pedido_id);
ALTER TABLE public.produto_pedido ADD CONSTRAINT produto_pedido_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(produto_id);