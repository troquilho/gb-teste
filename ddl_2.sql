failed to get console mode for stdout: The handle is invalid.
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2 (Debian 16.2-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categoria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categoria (
    categoria_id integer NOT NULL,
    nome_categoria character varying(20),
    descricao_categoria character varying(200)
);


--
-- Name: categoria_categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.categoria_categoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: categoria_categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.categoria_categoria_id_seq OWNED BY public.categoria.categoria_id;


--
-- Name: cliente; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cliente (
    cliente_id integer NOT NULL,
    email character varying(50),
    username character varying(15),
    senha character varying(100),
    nome character varying(200),
    cpf character varying(11) NOT NULL,
    telefone character varying(11),
    data_nascimento date,
    endereco_id integer NOT NULL
);


--
-- Name: cliente_cliente_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cliente_cliente_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: cliente_cliente_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cliente_cliente_id_seq OWNED BY public.cliente.cliente_id;


--
-- Name: endereco; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.endereco (
    endereco_id integer NOT NULL,
    cep character varying(9),
    rua character varying(100),
    bairro character varying(30),
    cidade character varying(30),
    numero character varying(10),
    complemento character varying(100),
    uf character varying(2)
);


--
-- Name: endereco_endereco_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.endereco_endereco_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: endereco_endereco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.endereco_endereco_id_seq OWNED BY public.endereco.endereco_id;


--
-- Name: pedido; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pedido (
    pedido_id integer NOT NULL,
    numero_pedido integer,
    valor_total_pedido numeric,
    data_pedido date DEFAULT now() NOT NULL,
    status boolean,
    cliente_id integer NOT NULL
);


--
-- Name: pedido_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pedido_pedido_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pedido_pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pedido_pedido_id_seq OWNED BY public.pedido.pedido_id;


--
-- Name: produto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.produto (
    produto_id integer NOT NULL,
    nome_produto character varying(50),
    descricao_produto character varying(200),
    preco_produto numeric,
    qtd_estoque integer,
    data_cadastro_produto date DEFAULT now(),
    categoria_id integer NOT NULL,
    imagem character varying
);


--
-- Name: produto_pedido; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.produto_pedido (
    produto_pedido_id integer NOT NULL,
    qtd_produto_pedido integer,
    preco_produto_pedido numeric,
    produto_id integer,
    pedido_id integer
);


--
-- Name: produto_pedido_produto_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.produto_pedido_produto_pedido_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: produto_pedido_produto_pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.produto_pedido_produto_pedido_id_seq OWNED BY public.produto_pedido.produto_pedido_id;


--
-- Name: produto_produto_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.produto_produto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: produto_produto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.produto_produto_id_seq OWNED BY public.produto.produto_id;


--
-- Name: categoria categoria_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria ALTER COLUMN categoria_id SET DEFAULT nextval('public.categoria_categoria_id_seq'::regclass);


--
-- Name: cliente cliente_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente ALTER COLUMN cliente_id SET DEFAULT nextval('public.cliente_cliente_id_seq'::regclass);


--
-- Name: endereco endereco_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.endereco ALTER COLUMN endereco_id SET DEFAULT nextval('public.endereco_endereco_id_seq'::regclass);


--
-- Name: pedido pedido_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido ALTER COLUMN pedido_id SET DEFAULT nextval('public.pedido_pedido_id_seq'::regclass);


--
-- Name: produto produto_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produto ALTER COLUMN produto_id SET DEFAULT nextval('public.produto_produto_id_seq'::regclass);


--
-- Name: produto_pedido produto_pedido_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produto_pedido ALTER COLUMN produto_pedido_id SET DEFAULT nextval('public.produto_pedido_produto_pedido_id_seq'::regclass);


--
-- Data for Name: categoria; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.categoria VALUES (3, 'teste categoria 3', 'descri├º├úo teste categoria 3');
INSERT INTO public.categoria VALUES (2, 'teste categoria 2', 'descri├º├úo teste categoria 2');
INSERT INTO public.categoria VALUES (4, 'teste categoria 4', 'descri├º├úo teste categoria 4');
INSERT INTO public.categoria VALUES (5, 'teste categoria 5', 'descricao teste categoria 5');
INSERT INTO public.categoria VALUES (6, 'teste categoria 6', 'descricao teste categoria 6');


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cliente VALUES (4, 'teste@email.com', 'teste', '$2a$10$zL4fMWITK9r0cI29qvDnO.3GodzwV9SrMv69GGaH6r6/AOW4gabhO', 'cliente teste', '99489333204', '4546546', '2024-02-08', 2);
INSERT INTO public.cliente VALUES (5, 'teste2@email.com', 'teste2', '$2a$10$kbSIDN9HT.Ppes5ZmVDYnOe3Xtffr/pL62BqWvUn.WmkZB5pQLeyG', 'cliente teste 2', '41457166046', '4444', '2024-02-01', 4);
INSERT INTO public.cliente VALUES (6, 'teste3@email.com', 'teste3', '$2a$10$WUlm6q3fHbwKtUt/nPFdKOFloyRVuWJ7GDxFbaWDC83GvV5ipnqW.', 'cliente teste asdsa', '66006078074', '65454', '2024-01-31', 5);


--
-- Data for Name: endereco; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.endereco VALUES (3, '80420210', 'Rua Visconde do Rio Branco', 'Centro', 'Curitiba', '142', NULL, 'PR');
INSERT INTO public.endereco VALUES (5, '65911412', 'Rua Carolina', 'Vila Brasil', 'Imperatriz', '150', 'asdsad', 'MA');
INSERT INTO public.endereco VALUES (4, '69313475', 'Travessa Cambar├í', 'Cambar├í', 'Boa Vista', '142', '', 'RR');
INSERT INTO public.endereco VALUES (2, '68908054', 'Rua Monte Alegre', 'Infraero', 'Macap├í', '1800', 'aasdsad', 'AP');


--
-- Data for Name: pedido; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.pedido VALUES (1, 74032, 1323.6, '2024-02-22', true, 4);
INSERT INTO public.pedido VALUES (4, 91024, 81.18, '2024-02-22', true, 4);
INSERT INTO public.pedido VALUES (5, 42349, 180, '2024-02-22', true, 6);


--
-- Data for Name: produto; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.produto VALUES (5, 'teste produto 5', 'descricao teste produto 5', 20.35, 45, '2024-02-23', 6, 'https://fakeimg.pl/150x150/6E6E6E/8DC63F/?text=produto');
INSERT INTO public.produto VALUES (1, 'produto teste 1', 'descri├º├úo produto teste 1', 51.18, 178, '2024-02-22', 2, 'https://fakeimg.pl/150x150/6E6E6E/8DC63F/?text=produto');
INSERT INTO public.produto VALUES (2, 'produdo teste 2', 'asdasd', 30, 773, '2024-02-23', 2, 'https://fakeimg.pl/150x150/6E6E6E/8DC63F/?text=produto');
INSERT INTO public.produto VALUES (4, 'teste produto', 'descricao teste produto', 20.35, 45, '2024-02-23', 5, 'https://fakeimg.pl/150x150/6E6E6E/8DC63F/?text=produto');


--
-- Data for Name: produto_pedido; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.produto_pedido VALUES (1, 20, 51.18, 1, 1);
INSERT INTO public.produto_pedido VALUES (8, 10, 30, 2, 1);
INSERT INTO public.produto_pedido VALUES (13, 1, 51.18, 1, 4);
INSERT INTO public.produto_pedido VALUES (11, 1, 30, 2, 4);
INSERT INTO public.produto_pedido VALUES (15, 6, 30, 2, 5);


--
-- Name: categoria_categoria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categoria_categoria_id_seq', 6, true);


--
-- Name: cliente_cliente_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cliente_cliente_id_seq', 6, true);


--
-- Name: endereco_endereco_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.endereco_endereco_id_seq', 5, true);


--
-- Name: pedido_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pedido_pedido_id_seq', 5, true);


--
-- Name: produto_pedido_produto_pedido_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.produto_pedido_produto_pedido_id_seq', 15, true);


--
-- Name: produto_produto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.produto_produto_id_seq', 5, true);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (categoria_id);


--
-- Name: cliente cliente_cpf_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_cpf_key UNIQUE (cpf);


--
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (cliente_id);


--
-- Name: endereco endereco_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.endereco
    ADD CONSTRAINT endereco_pkey PRIMARY KEY (endereco_id);


--
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (pedido_id);


--
-- Name: produto_pedido produto_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produto_pedido
    ADD CONSTRAINT produto_pedido_pkey PRIMARY KEY (produto_pedido_id);


--
-- Name: produto produto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_pkey PRIMARY KEY (produto_id);


--
-- Name: pedido pedido_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.cliente(cliente_id);


--
-- Name: produto produto_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produto
    ADD CONSTRAINT produto_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categoria(categoria_id);


--
-- Name: produto_pedido produto_pedido_pedido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produto_pedido
    ADD CONSTRAINT produto_pedido_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedido(pedido_id);


--
-- Name: produto_pedido produto_pedido_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.produto_pedido
    ADD CONSTRAINT produto_pedido_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(produto_id);


--
-- PostgreSQL database dump complete
--

