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
import pedidoService from "../../../services/pedidoService";
import clienteService from "../../../services/clienteService";
import produtoService from "../../../services/produtoService";
import { useOrderManagement } from "../../../hooks/useOrderManagement";
import { formatDate, limitNameString } from "../../../config/utils";

function Pedidos() {
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [dataInfo, setDataInfo] = useState([]);
    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [item, setItem] = useState({});
    const [showModalEditAdd, setShowModalEditAdd] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const {
        productsInOrder,
        setProductsInOrder,
        addNewProduct,
        removeProduct,
        updateProductDetails,
    } = useOrderManagement();

    useEffect(() => {
        document.title = "gb-teste-app - Pedidos";
        fetchData(page);
    }, [page, refetchTrigger]);

    const refreshItems = async () => {
        setShowModalEditAdd(false);
        setItem({});
        setProductsInOrder([]);
        setPage(1);
        setErrorMessage("");
        setRefetchTrigger((prev) => prev + 1);
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= dataInfo.totalPages) {
            setPage(newPage);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setItem((prevItem) => ({
            ...prevItem,
            [name]: value,
        }));
    };

    const handleAddNewProduct = () => {
        addNewProduct(products);
    };

    const calculateTotalValue = () => {
        return productsInOrder.reduce((acc, product) => {
            const productDetails = products.find(
                (p) => p.produto_id === product.produto_id
            );
            return (
                acc +
                (productDetails
                    ? productDetails.preco_produto * product.qtd_produto_pedido
                    : 0)
            );
        }, 0);
    };

    const submitData = async () => {
        setLoad(true);
        let data = { ...item, produtos: productsInOrder };
        try {
            if (!item.pedido_id) {
                await pedidoService.submitData("add", data);
            } else {
                await pedidoService.submitData("update", data);
            }
            refreshItems();
        } catch (err) {
            setLoad(false);
            setErrorMessage(err.message || "Erro na operação do pedido");
        }
    };

    const fetchData = async (pageNumber = 1) => {
        setLoad(true);
        try {
            const result = await pedidoService.fetchData(true, pageNumber);
            const clients = await clienteService.fetchData(false);
            const products = await produtoService.fetchData(false);
            setData(result.data);
            setDataInfo(result.pagination);
            setClients(clients.data);
            setProducts(products.data);
        } catch (err) {
            setErrorMessage(err.message || "Erro ao buscar pedidos");
        } finally {
            setLoad(false);
        }
    };

    const deleteData = async (id) => {
        const result = await Swal.fire({
            title: "Atenção!",
            text: "Tem certeza que deseja excluir este pedido?",
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
                await pedidoService.deleteData(id);
                refreshItems();
            } catch (err) {
                setErrorMessage(err.message || "Erro ao excluir pedido");
            } finally {
                setLoad(false);
            }
        }
    };

    return (
        <>
            <Sidebar pageName="Pedidos" pageUrl="/dashboard/pedidos">
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
                                    setProductsInOrder([]);
                                    setErrorMessage("");
                                    setShowModalEditAdd(true);
                                }}
                            >
                                Atrelar Pedido
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
                                        <CardListHeaderItem xs={12} lg={2}>
                                            Número do Pedido
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={3}>
                                            Cliente
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={2}>
                                            Data
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={1}>
                                            Status
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={2}>
                                            Valor Total
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
                                                lg={2}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Número do Pedido:"}
                                                value={`#${data.numero_pedido}`}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={3}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Nome do Cliente:"}
                                                value={limitNameString(
                                                    data.nome_cliente
                                                )}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={2}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Data do Pedido:"}
                                                value={formatDate(
                                                    data.data_pedido
                                                )}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={1}
                                                className={`d-inline-flex align-items-center font-semi-bold small ${
                                                    data.status
                                                        ? "text-success"
                                                        : "text-danger"
                                                }`}
                                                title={"Status do Pedido:"}
                                                value={`${
                                                    data.status
                                                        ? "Aberto"
                                                        : "Fechado"
                                                }`}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={2}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Número do Pedido:"}
                                                value={`R$ ${data.valor_total_pedido}`}
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
                                                        setProductsInOrder(
                                                            data.produtos
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
                                                            data.pedido_id
                                                        );
                                                    }}
                                                >
                                                    Remover Pedido
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
                title={item.pedido_id ? "Editar Pedido" : "Atrelar Pedido"}
                submitLabel={
                    item.pedido_id ? "Salvar Alterações" : "Atrelar Pedido"
                }
                onSubmit={submitData}
                errorMessage={errorMessage}
                buttonCanBeDisabled={
                    !productsInOrder.length || !item.cliente_id
                }
                buttonWithoutLength={true}
            >
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={12}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Cliente
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                as="select"
                                name="cliente_id"
                                value={item.cliente_id}
                                onChange={handleInputChange}
                                required
                            >
                                <option value=""></option>
                                {clients.map((item, index) => (
                                    <option value={item.cliente_id} key={index}>
                                        {item.nome}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                {item.cliente_id && (
                    <>
                        <h4 className="text-center mb-4 font-semi-bold">
                            Produtos
                        </h4>
                        {productsInOrder.map((product, index) => (
                            <Row className="mb-0 mb-md-3" key={index}>
                                <Col md={6}>
                                    <Form.Control
                                        as="select"
                                        value={product.produto_id}
                                        onChange={(e) =>
                                            updateProductDetails(
                                                products,
                                                index,
                                                "produto_id",
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                        required
                                    >
                                        {products
                                            .filter(
                                                (prod) =>
                                                    !productsInOrder.some(
                                                        (p) =>
                                                            p.produto_id ===
                                                                prod.produto_id &&
                                                            index !==
                                                                productsInOrder.indexOf(
                                                                    p
                                                                )
                                                    )
                                            )
                                            .map((prod) => (
                                                <option
                                                    key={prod.produto_id}
                                                    value={prod.produto_id}
                                                >
                                                    {prod.nome_produto}
                                                </option>
                                            ))}
                                    </Form.Control>
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={product.qtd_produto_pedido}
                                        onChange={(e) =>
                                            updateProductDetails(
                                                products,
                                                index,
                                                "qtd_produto_pedido",
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                        required
                                    />
                                </Col>
                                <Col md={2}>
                                    <Button
                                        variant="danger"
                                        className="btn-remove"
                                        onClick={() => removeProduct(index)}
                                    >
                                        Remover
                                    </Button>
                                </Col>
                            </Row>
                        ))}
                        <Row>
                            <Col xs={12}>
                                <Button onClick={handleAddNewProduct}>
                                    Adicionar Produto
                                </Button>
                            </Col>
                        </Row>
                        <h4>
                            Valor Total do Pedido: R${" "}
                            {calculateTotalValue().toFixed(2)}
                        </h4>
                    </>
                )}
            </CustomModal>
            <Loading show={load} />
        </>
    );
}

export default Pedidos;
