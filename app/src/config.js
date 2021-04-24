const {
    REACT_APP_SERVER_PORT: port,
    REACT_APP_BASE_URL
} = process.env;
export const headerName = "auth-token";
export const baseURL = `${REACT_APP_BASE_URL}:${port}/api/`;
export const SOCKET_ENDPOINT = `${REACT_APP_BASE_URL}:${port}`;
