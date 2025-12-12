import axios from "axios";

const AUTH_BASE_URL = process.env.REACT_APP_SIGN_API_URL;
const COURSE_BASE_URL = process.env.REACT_APP_COURSE_API_URL;

export const authInstance = axios.create({
    baseURL: AUTH_BASE_URL,
});

export const courseInstance = axios.create({
    baseURL: COURSE_BASE_URL,
});

const injectAuthHeader = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken'); 

            if (token) {
                config.headers.Authorization = `Bearer ${token}`; 
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

injectAuthHeader(authInstance);
injectAuthHeader(courseInstance);


export const signUp = (data) => {
    return authInstance.post(`/signUp`, data)
}

export const signIn = (data) => {
    return authInstance.post(`/signIn`, data);
};

export const signOut = () => {
    return authInstance.post(`/signOut`);
};

export const reissue = (data) => {
    return authInstance.post(`/reissue`, data);
};

export const checkAuthStatusAPI = () => {
    return authInstance.get(`/users/me`);
};

export const fetchSwiperCourses = () => {
    return courseInstance.get(`/swiper-courses`);
};

export const fetchCoursesByLine = (line) => {
    return courseInstance.get(`/courses/line/${line}`);
};