import axios from "axios";

const api = axios.create({
    baseURL:'/',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token){
            config.headers['Anthorization'] = `Bearer &{token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;