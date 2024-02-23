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
import { limitNameString, limitDescriptionString } from "../../../config/utils";

function Categorias() {
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [dataInfo, setDataInfo] = useState([]);
    const [item, setItem] = useState({});
    const [showModalEditAdd, setShowModalEditAdd] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        document.title = "gb-teste-app - Categorias";
        fetchData(page);
    }, [page, refetchTrigger]);

    const refreshItems = async () => {
        setShowModalEditAdd(false);
        setItem({});
        setPage(1);
        setRefetchTrigger(prev => prev + 1);
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
            if (!item.categoria_id) {
                await categoriaService.submitData("add", item);
            } else {
                await categoriaService.submitData("update", item);
            }
            refreshItems();
        } catch (err) {
            setLoad(false);
            setErrorMessage(err.message || "Erro na operação de categoria");
        }
    };

    const fetchData = async (pageNumber = 1) => {
        setLoad(true);
        try {
            const result = await categoriaService.fetchData(true, pageNumber);
            setData(result.data);
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
            text: "Tem certeza que deseja excluir esta categoria?",
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
                await categoriaService.deleteData(id);
                refreshItems();
            } catch (err) {
                setErrorMessage(err.message || "Erro ao excluir categoria");
            } finally {
                setLoad(false);
            }
        }
    };

    return (
        <>
            <Sidebar pageName="Categorias" pageUrl="/dashboard/categorias">
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
                                Adicionar Categoria
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
                                            Nome da Categoria
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={7}>
                                            Descrição
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
                                                title={"Nome da Categoria:"}
                                                value={limitNameString(data.nome_categoria)}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={7}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Descrição:"}
                                                value={limitDescriptionString(data.descricao_categoria)}
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
                                                            data.categoria_id
                                                        );
                                                    }}
                                                >
                                                    Remover Categoria
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
                onHide={() => {
                    setShowModalEditAdd(false);
                }}
                title={
                    item.categoria_id
                        ? "Editar Categoria"
                        : "Adicionar Categoria"
                }
                submitLabel={
                    item.categoria_id
                        ? "Salvar Alterações"
                        : "Adicionar Categoria"
                }
                onSubmit={submitData}
                errorMessage={errorMessage}
            >
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={12}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Nome
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="nome_categoria"
                                value={item.nome_categoria}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
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
                                name="descricao_categoria"
                                value={item.descricao_categoria}
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

export default Categorias;
