import axios from "axios";

export const authInstance = axios.create({
    baseURL: process.env.REACT_APP_SIGN_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export const courseInstance = axios.create({
    baseURL: process.env.REACT_APP_COURSE_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export const reviewInstance = axios.create({
    baseURL: process.env.REACT_APP_REVIEW_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

export const paymentInstance = axios.create({
    baseURL: process.env.REACT_APP_PAYMENT_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

const injectAuthHeader = (instance) => {
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken'); 
            
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
};

injectAuthHeader(authInstance);
injectAuthHeader(courseInstance);
injectAuthHeader(reviewInstance);
injectAuthHeader(paymentInstance);

export const signUp = (data) => authInstance.post(`/signUp`, data);
export const signIn = (data) => authInstance.post(`/signIn`, data);
export const signOut = () => authInstance.post(`/signOut`);
export const reissue = (data) => authInstance.post(`/reissue`, data);
export const checkAuthStatusAPI = () => authInstance.get(`/users/me`);
export const fetchSwiperCourses = () => courseInstance.get(`/swiper-courses`);
export const fetchCoursesByLine = (line) => courseInstance.get(`/line/${line}`);
export const getPaidCoursesAPI = (uid) => paymentInstance.get(`/courses/${uid}`);
export const fetchReviewsAPI = (courseUid) => reviewInstance.get(`/${courseUid}`);
export const createReviewAPI = (data) => {
    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
    
    console.log("🚀 [Review API] 요청 시도");
    console.log("📍 저장소 토큰 존재 여부:", !!token);
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };

    console.log("📤 최종 전송 헤더:", headers);
    console.log("📦 전송 데이터:", data);

    return reviewInstance.post('', data, { headers })
        .then(response => {
            console.log("✅ 리뷰 등록 성공:", response.data);
            return response;
        })
        .catch(error => {
            console.error("❌ 리뷰 등록 실패 상세:", error.response || error);
            throw error;
        });
};

export const createPayment = (data) => paymentInstance.post(``, data);
export const addWishlist = (data) => paymentInstance.post(`/wishlist`, data);
export const deleteWishlistItem = (courseUid) => paymentInstance.delete(`/wishlist/${courseUid}`);
export const clearWishlistAPI = () => paymentInstance.delete(`/wishlist/all`);