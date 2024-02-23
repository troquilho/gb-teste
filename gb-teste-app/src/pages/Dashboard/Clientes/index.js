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
import clienteService from "../../../services/clienteService";
import enderecoService from "../../../services/enderecoService";
import { limitNameString, formatDateForInput } from "../../../config/utils";

function Clientes() {
    const [load, setLoad] = useState(false);
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [dataInfo, setDataInfo] = useState([]);
    const [item, setItem] = useState({});
    const [showModalEditAdd, setShowModalEditAdd] = useState(false);
    const [showModalAddress, setShowModalAddress] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [zipcode, setZipcode] = useState("");
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        document.title = "gb-teste-app - Clientes";
        fetchData(page);
    }, [page, refetchTrigger]);

    const refreshItems = async () => {
        setShowModalEditAdd(false);
        setShowModalAddress(false);
        setItem({});
        setZipcode("");
        setErrorMessage("");
        setPage(1);
        setRefetchTrigger((prev) => prev + 1);
    };

    const changePage = (newPage) => {
        if (newPage >= 1 && newPage <= dataInfo.totalPages) {
            setPage(newPage);
        }
    };

    const handleInputChange = async (event) => {
        const { name, value } = event.target;

        if (name === "zipcode") {
            const cleanedValue = value.replace(/[^0-9]/g, "").slice(0, 8);
            setZipcode(cleanedValue);

            if (cleanedValue.length === 8) {
                setLoad(true);
                try {
                    const response = await enderecoService.getAddressByZipcode(
                        cleanedValue
                    );
                    if (!response.erro) {
                        setItem((prevItem) => ({
                            ...prevItem,
                            rua: response.logradouro,
                            bairro: response.bairro,
                            cidade: response.localidade,
                            uf: response.uf,
                            cep: cleanedValue,
                        }));
                    } else {
                        setErrorMessage("CEP não encontrado");
                    }
                } catch (error) {
                    setErrorMessage(error.message);
                }
                setLoad(false);
            } else {
                setErrorMessage("");
                setItem((prevItem) => ({
                    ...prevItem,
                    rua: "",
                    bairro: "",
                    cidade: "",
                    uf: "",
                }));
            }
        } else {
            setItem((prevItem) => ({
                ...prevItem,
                [name]: value,
            }));
        }
    };

    const submitData = async () => {
        setLoad(true);
        try {
            const endereco = {
                cep: item.cep,
                rua: item.rua,
                bairro: item.bairro,
                cidade: item.cidade,
                numero: item.numero,
                complemento: item.complemento,
                uf: item.uf,
            };
            let cliente = {
                nome: item.nome,
                email: item.email,
                username: item.username,
                senha: item.senha,
                cpf: item.cpf,
                telefone: item.telefone,
                data_nascimento: item.data_nascimento,
            };

            if (!item.endereco_id) {
                const enderecoResponse = await enderecoService.submitData(
                    "add",
                    endereco
                );
                cliente.endereco_id = enderecoResponse.data.endereco_id;
            }

            if (!item.cliente_id) {
                await clienteService.submitData("add", cliente);
            } else {
                cliente.cliente_id = item.cliente_id;
                cliente.endereco_id = item.endereco_id;
                await clienteService.submitData("update", cliente);
            }
            refreshItems();
        } catch (err) {
            setLoad(false);
            setErrorMessage(err.message || "Erro na operação de cliente");
        }
    };

    const updateAddress = async () => {
        setLoad(true);
        try {
            await enderecoService.submitData("update", item);
            refreshItems();
        } catch (err) {
            setLoad(false);
            setErrorMessage(err.message || "Erro na operação de endereço");
        }
    };

    const fetchData = async (pageNumber = 1) => {
        setLoad(true);
        try {
            const result = await clienteService.fetchData(true, pageNumber);
            setData(result.data);
            setDataInfo(result.pagination);
        } catch (err) {
            setErrorMessage(err.message || "Erro ao buscar categorias");
        } finally {
            setLoad(false);
        }
    };

    const deleteData = async (data) => {
        const result = await Swal.fire({
            title: "Atenção!",
            text: "Tem certeza que deseja excluir este cliente? O endereço também será excluído.",
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
                await clienteService.deleteData(data.cliente_id);
                await enderecoService.deleteData(data.endereco_id);
                refreshItems();
            } catch (err) {
                setErrorMessage(err.message || "Erro ao excluir cliente");
            } finally {
                setLoad(false);
            }
        }
    };

    return (
        <>
            <Sidebar pageName="Clientes" pageUrl="/dashboard/clientes">
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
                                    setZipcode("");
                                    setErrorMessage("");
                                    setShowModalEditAdd(!showModalEditAdd);
                                }}
                            >
                                Adicionar Cliente
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
                                            Nome do Cliente
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={3}>
                                            E-mail
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={2}>
                                            Usuário
                                        </CardListHeaderItem>
                                        <CardListHeaderItem xs={12} lg={2}>
                                            Cidade/UF
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
                                                title={"Nome do Cliente:"}
                                                value={limitNameString(
                                                    data.nome
                                                )}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={3}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"E-mail do Cliente:"}
                                                value={limitNameString(
                                                    data.email
                                                )}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={2}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Usuário do Cliente:"}
                                                value={limitNameString(
                                                    data.username
                                                )}
                                            />
                                            <CardListBodyItem
                                                xs={12}
                                                lg={2}
                                                className="d-inline-flex align-items-center text-muted small"
                                                title={"Cidade/UF:"}
                                                value={limitNameString(
                                                    `${data.cidade}/${data.uf}`
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
                                                            !showModalEditAdd
                                                        );
                                                        setItem(data);
                                                    }}
                                                >
                                                    Editar Informações
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    className="text-primary font-semi-bold text-center"
                                                    onClick={() => {
                                                        setShowModalAddress(
                                                            !showModalAddress
                                                        );
                                                        setItem(data);
                                                    }}
                                                >
                                                    Editar Endereço
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    className="text-danger font-semi-bold text-center"
                                                    onClick={() => {
                                                        deleteData(data);
                                                    }}
                                                >
                                                    Remover Cliente
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
                onHide={() => setShowModalEditAdd(!showModalEditAdd)}
                title={item.cliente_id ? "Editar Cliente" : "Adicionar Cliente"}
                submitLabel={
                    item.cliente_id ? "Salvar Alterações" : "Adicionar Cliente"
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
                                name="nome"
                                value={item.nome}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                E-mail
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={item.email}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Usuário
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={item.username}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Senha
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="password"
                                name="senha"
                                value={item.senha}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                CPF
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="cpf"
                                value={item.cpf}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Data de Nascimento
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="date"
                                name="data_nascimento"
                                onChange={handleInputChange}
                                value={formatDateForInput(item.data_nascimento)}
                                max={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Telefone
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="telefone"
                                value={item.telefone}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                {!item.endereco_id && (
                    <>
                        <h4 className="text-center mb-4 font-semi-bold">
                            Endereço
                        </h4>
                        <Row className="mb-0 mb-md-3">
                            <Col xs={12} md={4}>
                                <Form.Group className="mb-3 mb-md-2">
                                    <Form.Label className="text-uppercase">
                                        CEP
                                        <sup className="ms-1 text-danger fw-bold">
                                            *
                                        </sup>
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="zipcode"
                                        onChange={handleInputChange}
                                        defaultValue={
                                            item.cliente_id ? item.cep : zipcode
                                        }
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={4}>
                                <Form.Group className="mb-3 mb-md-2">
                                    <Form.Label className="text-uppercase">
                                        Rua
                                        <sup className="ms-1 text-danger fw-bold">
                                            *
                                        </sup>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="rua"
                                        onChange={handleInputChange}
                                        value={item.rua}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={4}>
                                <Form.Group className="mb-3 mb-md-2">
                                    <Form.Label className="text-uppercase">
                                        Complemento
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="complemento"
                                        onChange={handleInputChange}
                                        value={
                                            !item.complemento
                                                ? ""
                                                : item.complemento
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-0 mb-md-3">
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3 mb-md-2">
                                    <Form.Label className="text-uppercase">
                                        Número
                                        <sup className="ms-1 text-danger fw-bold">
                                            *
                                        </sup>
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="numero"
                                        onChange={handleInputChange}
                                        value={item.numero}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3 mb-md-2">
                                    <Form.Label className="text-uppercase">
                                        Bairro
                                        <sup className="ms-1 text-danger fw-bold">
                                            *
                                        </sup>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="bairro"
                                        onChange={handleInputChange}
                                        value={item.bairro}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3 mb-md-2">
                                    <Form.Label className="text-uppercase">
                                        Cidade
                                        <sup className="ms-1 text-danger fw-bold">
                                            *
                                        </sup>
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="cidade"
                                        onChange={handleInputChange}
                                        value={item.cidade}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={3}>
                                <Form.Group className="mb-3 mb-md-2">
                                    <Form.Label className="text-uppercase">
                                        UF
                                        <sup className="ms-1 text-danger fw-bold">
                                            *
                                        </sup>
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="uf"
                                        onChange={handleInputChange}
                                        value={item.uf}
                                        required
                                    >
                                        <option value="" disabled>
                                            Selecione o Estado
                                        </option>
                                        {[
                                            "AC",
                                            "AL",
                                            "AP",
                                            "AM",
                                            "BA",
                                            "CE",
                                            "DF",
                                            "ES",
                                            "GO",
                                            "MA",
                                            "MT",
                                            "MS",
                                            "MG",
                                            "PA",
                                            "PB",
                                            "PR",
                                            "PE",
                                            "PI",
                                            "RJ",
                                            "RN",
                                            "RS",
                                            "RO",
                                            "RR",
                                            "SC",
                                            "SP",
                                            "SE",
                                            "TO",
                                        ].map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                )}
            </CustomModal>
            <CustomModal
                show={showModalAddress}
                onHide={() => {
                    setShowModalAddress(!showModalAddress);
                    setErrorMessage("");
                }}
                title={"Editar Endereço"}
                submitLabel={"Salvar alterações"}
                onSubmit={updateAddress}
                errorMessage={errorMessage}
                buttonCanBeDisabled={true}
            >
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                CEP
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="zipcode"
                                onChange={handleInputChange}
                                defaultValue={item.cep ? item.cep : zipcode}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Rua
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="rua"
                                onChange={handleInputChange}
                                value={item.rua}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={4}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Complemento
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="complemento"
                                onChange={handleInputChange}
                                value={
                                    !item.complemento ? "" : item.complemento
                                }
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-0 mb-md-3">
                    <Col xs={12} md={3}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Número
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="number"
                                name="numero"
                                onChange={handleInputChange}
                                value={item.numero}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Bairro
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="bairro"
                                onChange={handleInputChange}
                                value={item.bairro}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                Cidade
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="cidade"
                                onChange={handleInputChange}
                                value={item.cidade}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={3}>
                        <Form.Group className="mb-3 mb-md-2">
                            <Form.Label className="text-uppercase">
                                UF
                                <sup className="ms-1 text-danger fw-bold">
                                    *
                                </sup>
                            </Form.Label>
                            <Form.Control
                                as="select"
                                name="uf"
                                onChange={handleInputChange}
                                value={item.uf}
                                required
                            >
                                <option value="" disabled>
                                    Selecione o Estado
                                </option>
                                {[
                                    "AC",
                                    "AL",
                                    "AP",
                                    "AM",
                                    "BA",
                                    "CE",
                                    "DF",
                                    "ES",
                                    "GO",
                                    "MA",
                                    "MT",
                                    "MS",
                                    "MG",
                                    "PA",
                                    "PB",
                                    "PR",
                                    "PE",
                                    "PI",
                                    "RJ",
                                    "RN",
                                    "RS",
                                    "RO",
                                    "RR",
                                    "SC",
                                    "SP",
                                    "SE",
                                    "TO",
                                ].map((item, index) => (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
            </CustomModal>
            <Loading show={load} />
        </>
    );
}

export default Clientes;
