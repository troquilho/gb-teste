import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Navbar,
    Nav,
    Accordion,
    Card,
    Dropdown,
    DropdownButton,
} from "react-bootstrap";
import { decodeToken, logout } from "../../config/auth";
import LogoImage from "../../assets/img/logo_250x250.png";

function Sidebar(props) {
    const [session] = useState(decodeToken(localStorage.getItem("GB_TESTE")));
    const [sidebar, setSidebar] = useState(true);

    const toggleSidebar = () => {
        setSidebar((prevSidebar) => {
            return !prevSidebar;
        });
    };

    const user = session?.tokenObj;

    return (
        <div className={sidebar ? "d-flex" : "d-flex toggled"} id="wrapper">
            <div id="sidebar-wrapper">
                <div className="sidebar-heading d-flex align-items-center justify-content-center flex-column">
                    <a href={"/dashboard"}>
                        <img
                            src={LogoImage}
                            alt=""
                            className="img-fluid mb-2 rounded-circle"
                        />
                    </a>
                </div>
                <Accordion>
                    {/* DASHBOARD */}
                    <Card className="border-0">
                        <Card.Header className="p-0 border-0">
                            <NavItem
                                icon={"dashboard"}
                                name={"Dashboard"}
                                link="/dashboard"
                            />
                            <NavItem
                                icon={"category"}
                                name={"Categorias"}
                                link="/dashboard/categorias"
                            />
                            <NavItem
                                icon={"shopping_cart"}
                                name={"Produtos"}
                                link="/dashboard/produtos"
                            />
                            <NavItem
                                icon={"people_alt"}
                                name={"Clientes"}
                                link="/dashboard/clientes"
                            />
                            <NavItem
                                icon={"add_shopping_cart"}
                                name={"Pedidos"}
                                link="/dashboard/pedidos"
                            />
                        </Card.Header>
                    </Card>
                </Accordion>
                <div className="sidebar-logout-container">
                    <LogoutItem
                        icon={"logout"}
                        name={"Logout"}
                        onClick={logout}
                    />
                </div>
            </div>
            <div
                id="page-content-wrapper"
                className="d-flex justify-content-between flex-column"
            >
                <div className="d-flex flex-column w-100 h-100 overflow-auto justify-content-between">
                    <div>
                        <Navbar
                            collapseOnSelect
                            expand="lg"
                            className="py-3 bg-color-light-gray justify-content-between"
                        >
                            <div className="ms-3 d-flex justify-content-center align-items-center">
                                <span
                                    className="material-icons"
                                    onClick={toggleSidebar}
                                >
                                    reorder
                                </span>
                                <h6 className="ms-3 mt-1 mb-0 lh-1">
                                    <a
                                        href={props.pageUrl}
                                        className="text-decoration-none me-2 color-dark-gray fw-bold menu"
                                    >
                                        {props.pageName}
                                    </a>
                                </h6>
                            </div>
                            <Nav className="ms-auto me-3 me-md-0 p-0">
                                <Nav.Link
                                    className="p-0 d-flex d-sm-none"
                                    href="#"
                                    onClick={logout}
                                >
                                    Sair
                                </Nav.Link>
                                <DropdownButton
                                    align={{ lg: "end" }}
                                    title={
                                        <>
                                            {user && (
                                                <span className="color-dark-gray me-3">
                                                    Olá, usuário!
                                                </span>
                                            )}
                                        </>
                                    }
                                    id="dropdown-menu-align-right"
                                    className="p-0 d-none d-sm-flex"
                                >
                                    <Dropdown.Item
                                        eventKey="4"
                                        onClick={logout}
                                    >
                                        Sair
                                    </Dropdown.Item>
                                </DropdownButton>
                            </Nav>
                        </Navbar>
                        <div className="p-sm-4 px-md-0 py-md-2">
                            {props.children}
                        </div>
                    </div>
                    <div className="w-100 py-3 text-center small">
                        <p className="color-gray">
                            © {new Date().getFullYear()} - Gustavo Troquilho.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavItem(props) {
    const location = useLocation();
    const isActive = location.pathname === props.link;

    return (
        <div className="list-group list-group-flush">
            <Link
                className={`list-group-item list-group-item-action ${
                    isActive ? `item-active` : ``
                }`}
                to={props.link}
            >
                <span className="d-flex align-items-center">
                    <span className="material-icons">{props.icon}</span>
                    <span className="name-list">{props.name}</span>
                </span>
            </Link>
        </div>
    );
}

function LogoutItem(props) {
    const { onClick } = props;

    return (
        <div className="list-group list-group-flush">
            <div
                className="list-group-item list-group-item-action"
                onClick={onClick}
            >
                <span className="d-flex align-items-center">
                    <span className="material-icons">{props.icon}</span>
                    <span className="name-list">{props.name}</span>
                </span>
            </div>
        </div>
    );
}

export default Sidebar;
