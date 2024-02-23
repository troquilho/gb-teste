import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Loading from "../../components/Loading";
import Sidebar from "../../components/Sidebar";
import WidgetNumber from "../../components/WidgetNumber";
import dashboardService from "../../services/dashboardService"

function Login() {
    const [load, setLoad] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        document.title = "gb-teste-app - Dashboard";
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoad(true);
        try {
            const result = await dashboardService.fetchData();
            setData(result.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoad(false);
        }
    }

    return (
        <>
            <Sidebar pageName="Dashboard" pageUrl="/dashboard">
                <Container fluid>
                    <Row className="my-2 mx-2 mx-md-4">
                        <Col xs={12} md={3} className="mb-3 mb-md-0">
                            <WidgetNumber
                                title="Categorias"
                                link="/dashboard/categorias"
                                value={data.categorias}
                                icon={"category"}
                            />
                        </Col>
                        <Col xs={12} md={3} className="mb-3 mb-md-0">
                            <WidgetNumber
                                title="Produtos"
                                link="/dashboard/produtos"
                                value={data.produtos}
                                icon={"shopping_cart"}
                            />
                        </Col>
                        <Col xs={12} md={3} className="mb-3 mb-md-0">
                            <WidgetNumber
                                title="Clientes"
                                link="/dashboard/clientes"
                                value={data.clientes}
                                icon={"people_alt"}
                            />
                        </Col>
                        <Col xs={12} md={3} className="mb-3 mb-md-0">
                            <WidgetNumber
                                title="Pedidos"
                                link="/dashboard/pedidos"
                                value={data.pedidos}
                                icon={"add_shopping_cart"}
                            />
                        </Col>
                    </Row>
                </Container>
            </Sidebar>
            <Loading show={load} />
        </>
    );
}

export default Login;
