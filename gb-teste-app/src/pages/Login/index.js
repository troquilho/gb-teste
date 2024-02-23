import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Loading from "../../components/Loading";
import FormLogin from "../../components/Forms/Login";

function Login() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "gb-teste-app - Login";
        if (localStorage.getItem("GB_TESTE")) {
            window.location.href = "/dashboard";
        }
    }, []);

    return (
        <div className="bg-color-primary">
            <Row className="min-vh-100 m-0">
                <Col xs={12} md={12} className="d-flex justify-content-center align-items-center">
                    <FormLogin setIsLoading={setIsLoading} />
                </Col>
            </Row>
            <Loading show={isLoading} />
        </div>
    );
}

export default Login;