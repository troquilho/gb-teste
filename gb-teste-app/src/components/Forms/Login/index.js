import React, { useState } from "react";
import { Row, Col, Card, Form, Alert } from "react-bootstrap";
import { ButtonPrimary } from "../../Buttons/index.js";
import authService from "../../../services/authService";

function FormLogin({ setIsLoading }) {
    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const startLoginProcess = () => {
        setError(false);
        setErrorMessage("");
        setIsLoading(true);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        startLoginProcess();

        await authService.login(user)
        .then((response) => {
            setIsLoading(false);
            localStorage.setItem("GB_TESTE", response.data.token);
            window.location.href = "/dashboard";
        })
        .catch((error) => {
            setIsLoading(false);
            setError(true);
            setErrorMessage(error.message);
        })
    };

    return (
        <Card className="card-form card-login">
            <Row className="m-0">
                <Col xs={12} className="padding-card">
                    <h2 className="text-uppercase font-semi-bold mb-5 text-center">
                        gb-teste-app
                    </h2>
                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-4">
                            <Col xs={12}>
                                <Form.Group className="mb-2">
                                    <Form.Label className="text-uppercase">
                                        Usuário
                                        <sup className="ms-1 text-danger fw-bold">
                                            *
                                        </sup>
                                    </Form.Label>
                                    <Form.Control
                                        type="username"
                                        name="username"
                                        placeholder="Digite seu usuário"
                                        onChange={handleInputChange}
                                        value={user.username}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12}>
                                <Form.Group>
                                    <Form.Label className="text-uppercase">
                                        Senha
                                        <sup className="ms-1 text-danger fw-bold">
                                            *
                                        </sup>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Digite sua Senha"
                                        onChange={handleInputChange}
                                        value={user.password}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                xs={12}
                                className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end"
                            >
                                <ButtonPrimary
                                    type="submit"
                                    btnText="ENTRAR NA MINHA CONTA"
                                    className={"w-100"}
                                />
                            </Col>
                            {error && (
                                <Col
                                    xs={12}
                                    className="mt-3 mb-0 text-center small"
                                >
                                    <Alert variant={"danger"}>
                                        <strong>{errorMessage}</strong>
                                    </Alert>
                                </Col>
                            )}
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Card>
    );
}

export default FormLogin;
