import { authInstance, checkAuthStatusAPI, reissue, signOut as signOutAPI, getPaidCoursesAPI } from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const AuthContext = createContext({
    isSignIn: false,
    setIsSignIn: () => {},
    token: null,
    setToken: () => {},
    user: null,
    setUser: () => {},
    refreshToken: null, 
    reissueToken: () => Promise.resolve(false),
    signout: () => {},
    checkAuthStatus: () => {},
    signInSuccess: () => {},
});

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(
        localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
    const [refreshToken, setRefreshToken] = useState(
        localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY)
    );
    const [isSignIn, setIsSignIn] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate(); 

    const setAuthTokens = useCallback((accessTokenValue, refreshTokenValue, isRemember = false) => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);

        const storage = isRemember ? localStorage : sessionStorage;

        if (accessTokenValue) {
            storage.setItem(ACCESS_TOKEN_KEY, accessTokenValue);
            setToken(accessTokenValue);
        } else {
            setToken(null);
        }

        if (refreshTokenValue) {
            storage.setItem(REFRESH_TOKEN_KEY, refreshTokenValue);
            setRefreshToken(refreshTokenValue);
        } else {
            setRefreshToken(null);
        }
    }, []);

    const signout = useCallback(async () => {
        try { await signOutAPI(); } catch (e) {}
        
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);

        setToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsSignIn(false);
        navigate('/');
    }, [navigate]);

    const reissueToken = useCallback(async () => {
        const isRemember = !!localStorage.getItem(REFRESH_TOKEN_KEY);
        const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);

        if (!currentRefreshToken) {
            signout();
            return false;
        }
        
        try {
            const response = await reissue({ refreshToken: currentRefreshToken }); 
            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;
            
            setAuthTokens(newAccessToken, newRefreshToken || currentRefreshToken, isRemember);
            return true; 
        } catch (error) {
            signout();
            return false;
        }
    }, [signout, setAuthTokens]);

    const signInSuccess = useCallback(async (tokenData, isRemember = false) => {
        const { accessToken, refreshToken } = tokenData;
        setAuthTokens(accessToken, refreshToken, isRemember); 

        try {
            const decoded = jwtDecode(accessToken);
            const paymentRes = await getPaidCoursesAPI(decoded.uid);
            
            setUser({
                uid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                tutor: decoded.tutor,
                paidCourses: paymentRes.data,
            });
            setIsSignIn(true);
        } catch (e) {
            console.error("인증 데이터 처리 실패:", e);
            signout();
        }
    }, [setAuthTokens, signout]);

    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await checkAuthStatusAPI();
            const userData = response.data;
            
            if (userData && userData.uid){
                try {
                    const paymentRes = await getPaidCoursesAPI(userData.uid);
                    setUser({
                        ...userData,
                        paidCourses: paymentRes.data
                    });
                } catch (paymentError) {
                    console.error("결제 정보 병합 실패", paymentError);
                    setUser({ ...userData, paidCourses: [] });
                }
                setIsSignIn(true);
                return true;
            }
            return false;
        } catch (error){
            setIsSignIn(false);
            setUser(null);
            return false;
        }
    }, []);

    useEffect(() => {
        const resInterceptor = authInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry){ 
                    originalRequest._retry = true;

                    try {
                        console.log("Access Token expired. Attempting reissue.");
                        const success = await reissueToken(); 
                        if (success){
                            return authInstance(originalRequest); 
                        }
                    } catch (reissueError) {
                        return Promise.reject(reissueError);
                    }
                }
                return Promise.reject(error);
            }
        );

        checkAuthStatus();

        return () => {
            authInstance.interceptors.response.eject(resInterceptor);
        };
    }, [reissueToken, checkAuthStatus]);

    const contextValue = {
        isSignIn,
        token,
        signInSuccess,
        user,
        setUser,
        reissueToken,
        refreshToken,
        signout,
        checkAuthStatus,
    };
    
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};