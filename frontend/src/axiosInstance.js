import axios from "axios";

export const authInstance = axios.create({
    baseURL: process.env.REACT_APP_SIGN_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const courseInstance = axios.create({
    baseURL: process.env.REACT_APP_COURSE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const reviewInstance = axios.create({
    baseURL: process.env.REACT_APP_REVIEW_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export const paymentInstance = axios.create({
    baseURL: process.env.REACT_APP_PAYMENT_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const injectAuthHeader = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

injectAuthHeader(authInstance);
injectAuthHeader(courseInstance);
injectAuthHeader(reviewInstance);
injectAuthHeader(paymentInstance);

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
    return courseInstance.get(`/line/${line}`);
};

export const getPaidCoursesAPI = (uid) => {
    return paymentInstance.get(`/api/payments/courses/${uid}`);
};

export const fetchReviewsAPI = (courseUid) => {
    return reviewInstance.get(`/${courseUid}`);
};

export const createReviewAPI = (data) => {
    return reviewInstance.post('', data);
};

export const createPayment = (data) => {
    return paymentInstance.post(`/api/payments`, data);
};

export const addWishlist = (data) => {
    return paymentInstance.post(`/api/wishlist`, data);
};