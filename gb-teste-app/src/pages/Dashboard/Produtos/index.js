import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import Loading from "../../../components/Loading";
import Sidebar from "../../../components/Sidebar";
import {
    CardList,
    CardListHeader,
    CardListHeaderItem,
    CardListBody,
    CardListBodyItem,
    CardListBodyItemOptions,
} from "../../../components/CardList";
import { CustomModal } from "../../../components/Modal";
import categoriaService from "../../../services/categoriaService";
import produtoService from "../../../services/produtoService";
import {
    formatDate,
    limitNameString,
    limitDescriptionString,
} from "../../../config/utils";

function Produtos() {
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [dataInfo, setDataInfo] = useState([]);
    const [item, setItem] = useState({});
    const [showModalEditAdd, setShowModalEditAdd] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        document.title = "gb-teste-app - Produtos";
        fetchData(page);
    }, [page, refetchTrigger]);

    const refreshItems = async () => {
        setShowModalEditAdd(false);
        setLoad(false);
        setItem({});
        setErrorMessage("");
        setPage(1);
        setRefetchTrigger((prev) => prev + 1);
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= dataInfo.totalPages) {
            setPage(newPage);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const submitData = async () => {
        setLoad(true);
        try {
            if (!item.produto_id) {
                await produtoService.submitData("add", item);
            } else {
                await produtoService.submitData("update", item);
            }
            refreshItems();
        } catch (err) {
            setLoad(false);
            setErrorMessage(err.message || "Erro na operação de produto");
        }
    };

    const fetchData = async (pageNumber = 1) => {
        setLoad(true);
        try {
            const result = await produtoService.fetchData(true, pageNumber);
            const categories = await categoriaService.fetchData(false);
            setData(result.data);
            setCategories(categories.data);
            setDataInfo(result.pagination);
        } catch (err) {
            setErrorMessage(err.message || "Erro ao buscar categorias");
        } finally {
            setLoad(false);
        }
    };

    const deleteData = async (id) => {
        const result = await Swal.fire({
            title: "Atenção!",
            text: "Tem certeza que deseja excluir este produto?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim",
            cancelButtonText: "Não",
            dangerMode: true,
        });

        if (result.isConfirmed) {
            setLoad(true);
            try {
                await produtoService.deleteData(id);
                refreshItems();
            } catch (err) {
                setErrorMessage(err.message || "Erro ao excluir produto");
            } finally {
                setLoad(false);
            }
        }
    };

    return (
        <>
            <Sidebar pageName="Produtos" pageUrl="/dashboard/produtos">
                <Container fluid>
                    <Row className="m-2 justify-content-end">
                        <Col
                            xs={12}
                            sm={3}
                            className="d-flex align-items-end justify-content-end"
                        >
                            <Button
                                className="custom-btn btn-app btt-add"
                                onClick={() => {
                                    setItem({});
                                    setShowModalEditAdd(true);
                                }}
                            >
                                Adicionar Produto
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <CardList
                                page={dataInfo.currentPage}
                                data={data}
                                pages={dataInfo.totalPages}
                                onChangePage={changePage}
                            >
                                <CardListHeader className="bg-color-light-gray">
                                    <Row>
                                        <CardListHeaderItem xs={12} lg={3}>
                                            Nome do Produto
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={3}>
                                            Descrição
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={2}>
                                            Estoque
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={2}>
                                            Criação
                                        </CardListHeaderItem>
                                        <CardListHeaderItem
                                            xs={12}
                                            lg={2}
                                            className="text-center"
                                        >
                                            Gerenciar
                                        </CardListHeaderItem>
                                    </Row>
                                </CardListHeader>
                                {data.map((data, index) => (
                                    <CardListBody key={index}>
                                        <Row>
                                            <CardListBodyItem
                                                xs={12}
                                                lg={3}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Nome do Produto:"}
                                                value={limitNameString(
                                                    data.nome_produto
                                                )}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={3}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Descrição:"}
                                                value={limitDescriptionString(
                                                    data.descricao_produto
                                                )}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={2}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Estoque:"}
                                                value={data.qtd_estoque}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={2}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Criação:"}
                                                value={formatDate(
                                                    data.data_cadastro_produto
                                                )}
                                            />
                                            <CardListBodyItemOptions
                                                xs={12}
                                                lg={2}
                                                className="d-inline-flex align-items-center justify-content-center"
                                            >
                                                <Dropdown.Item
                                                    className="text-primary font-semi-bold text-center"
                                                    onClick={() => {
                                                        setShowModalEditAdd(
                                                            true
                                                        );
                                                        setItem(data);
                                                    }}
                                                >
                                                    Editar Informações
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    className="text-danger font-semi-bold text-center"
                                                    onClick={() => {
                                                        deleteData(
                                                            data.produto_id
                                                        );
                                                    }}
                                                >
                                                    Remover Produto
                                                </Dropdown.Item>
                                            </CardListBodyItemOptions>
                                        </Row>
                                    </CardListBody>
                                ))}
                                {data.length === 0 ? (
                                    <>
                                        <CardListBody>
                                            <Col
                                                xs={12}
                                                className="d-inline-flex align-items-center text-muted small justify-content-center"
                                            >
                                                Nenhum item encontrado.
                                            </Col>
                                        </CardListBody>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </CardList>
                        </Col>
                    </Row>
                </Container>
            </Sidebar>
            <CustomModal
                show={showModalEditAdd}
                onHide={() => setShowModalEditAdd(false)}
                title={item.produto_id ? "Editar Produto" : "Adicionar Produto"}
                submitLabel={
                    item.produto_id ? "Salvar Alterações" : "Adicionar Produto"
                }
                onSubmit={submitData}
                errorMessage={errorMessage}
            >
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Nome
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="nome_produto"
                                value={item.nome_produto}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Categoria
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                as="select"
                                name="categoria_id"
                                value={item.categoria_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value=""></option>
                                {categories.map((item, index) => (
                                    <option
                                        value={item.categoria_id}
                                        key={index}
                                    >
                                        {item.nome_categoria}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Preço
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="preco_produto"
                                value={item.preco_produto}
                                onChange={handleInputChange}
                                step=".01"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Estoque
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="qtd_estoque"
                                value={item.qtd_estoque}
                                onChange={handleInputChange}
                                min="0"
                                step="1"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                URL da Imagem
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="imagem"
                                value={item.imagem}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={12}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Descrição
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows="3"
                                name="descricao_produto"
                                value={item.descricao_produto}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </CustomModal>
            <Loading show={load} />
        </>
    );
}

export default Produtos;
