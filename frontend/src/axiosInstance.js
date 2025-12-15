import axios from "axios";

const SIGN_API_PORT = process.env.REACT_APP_SIGN_API_PORT || '8081';
const COURSE_API_PORT = process.env.REACT_APP_COURSE_API_PORT || '8082';

const getDynamicBaseURL = (port) => {
    return `${window.location.protocol}//${window.location.hostname}:${port}`;
};

const getCourseBaseURL = () => {
    return `${getDynamicBaseURL(COURSE_API_PORT)}/api`;
};

export const authInstance = axios.create({
    baseURL: getDynamicBaseURL(SIGN_API_PORT),
    headers: {
        'Content-Type': 'application/json',
    },
});

export const courseInstance = axios.create({
    baseURL: getCourseBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
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