import axios from 'axios';
import {AuthContext} from './AuthContext';

let authContextRef = {};

export const setupInterceptors = (store) => {
    authContextRef = store;

    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken');
            if (token && !config.headers.Authorization){
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );


    axios.interceptors.response.use(
        (response) => response,

        async (error) => {
            const originalRequest = error.config;
            const { reissueToken, signout} = authContextRef;

            if (error.response.status === 401 && !originalRequest._retry){
                originalRequest._retry = true;

                console.log("Access Token 만료. Refresh Token으로 재발급 시도");

                const success = await reissueToken();

                if (success){
                    const newAccessToken = localStorage.getItem('accessToken');
                    if (newAccessToken) {
                        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

                        return axios(originalRequest);
                    }
                }else {
                    console.error("토큰 재발급 실패.");
                    signout();
                    window.location.href = '/';
                }
            }
            return Promise.reject(error);
        }
    );
};