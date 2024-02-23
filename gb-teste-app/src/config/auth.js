import { jwtDecode as jwt_decode } from "jwt-decode";

export const getToken = () => {
    return localStorage.getItem("GB_TESTE") || null;
};

export const decodeToken = (token) => {
    if (token && (new Date(jwt_decode(token).tokenObj.expiration) > new Date())) {
        return jwt_decode(token);
    }
    return null;
};

export const isAuthenticated = () => {
    const token = getToken();
    const isValid =
        token &&
        new Date(jwt_decode(token).tokenObj.expiration) > new Date();

    if (!isValid) {
        logout();
    }

    return isValid;
};

export const logout = () => {
    localStorage.removeItem("GB_TESTE");
    window.location.href = '/';
};