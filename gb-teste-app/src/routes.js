import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
    Outlet
} from "react-router-dom";
import { isAuthenticated } from "./config/auth";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categorias from "./pages/Dashboard/Categorias";
import Produtos from "./pages/Dashboard/Produtos";
import Pedidos from "./pages/Dashboard/Pedidos";
import Clientes from "./pages/Dashboard/Clientes";

const PrivateRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
};

const RedirectToHome = () => <Navigate to="/" />;

const RootElement = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Login />} />
            {/* Autenticado */}
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/categorias" element={<Categorias />} />
                <Route path="/dashboard/produtos" element={<Produtos />} />
                <Route path="/dashboard/clientes" element={<Clientes />} />
                <Route path="/dashboard/pedidos" element={<Pedidos />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<RedirectToHome />} />
        </Routes>
    </Router>
);

export default RootElement;
