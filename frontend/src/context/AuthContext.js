import { authInstance, checkAuthStatusAPI, reissue, signOut as signOutAPI } from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from "react";
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
    checkAuthStatus:() => {},
    signInSuccess: () => {},
});

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN_KEY)); 
    const [isSignIn, setIsSignIn] = useState(false);
    const [user, setUser] = useState(null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN_KEY)); 
    const navigate = useNavigate(); 
    
    const setAuthTokens = useCallback((accessTokenValue, refreshTokenValue) => {
        if (accessTokenValue) {
            localStorage.setItem(ACCESS_TOKEN_KEY, accessTokenValue);
            setToken(accessTokenValue);
            try {
                const decoded = jwtDecode(accessTokenValue);
            } catch (e) {
                console.error("JWT 디코딩 실패:", e);
            }
        } else {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            setToken(null);
        }

        if (refreshTokenValue) {
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshTokenValue);
            setRefreshToken(refreshTokenValue);
        } else {
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            setRefreshToken(null);
        }
    }, []);
    
    const signInSuccess = useCallback((tokenData) => {
        const { accessToken, refreshToken, tokenExpiresIn } = tokenData;
        
        setAuthTokens(accessToken, refreshToken); 

        try {
            const decoded = jwtDecode(accessToken);
            setUser({
                uid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                tutor: decoded.tutor,
            });
            setIsSignIn(true);
        } catch (e) {
            console.error("JWT 디코딩 실패:", e);
            signout();
        }

    }, [setAuthTokens]);


    const checkAuthStatus = useCallback(async () => {
        const currentToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        
        if (!currentToken) {
            console.log("Local Storage에 토큰 없음.");
            setIsSignIn(false);
            setUser(null);
            return false;
        }

        try {
            const response = await checkAuthStatusAPI();
            
            setUser(response.data);
            setIsSignIn(true);
            setToken(currentToken);
            
            return true;
        } catch (error){
            console.log("Access Token 만료 또는 유효하지 않음.");
            setIsSignIn(false);
            setUser(null);
            return false;
        }
    }, [setIsSignIn, setUser, setToken]);

    const signout = useCallback(async () => {
        try{
            await signOutAPI(); 
        } catch (error){
            console.error("Logout API request failed, proceeding with local clear", error);
        }
        
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);

        setToken(null);
        setRefreshToken(null);
        setUser(null);
        setIsSignIn(false);
        navigate('/');
    }, [setToken, setRefreshToken, setUser, setIsSignIn, navigate]);
    
    const reissueToken = useCallback(async () => {
        const currentRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

        if (!currentRefreshToken) {
            console.error("Refresh Token이 Local Storage에 없습니다.");
            signout();
            return false;
        }
        
        try {
            const response = await reissue({
                refreshToken: currentRefreshToken 
            }); 

            const newAccessToken = response.data.accessToken;
            const newRefreshToken = response.data.refreshToken;
            
            setAuthTokens(newAccessToken, newRefreshToken || currentRefreshToken);
            
            return true; 
        }catch (error) {
            console.error("Token reissue failed:", error);
            signout();
            return false;
        }
    }, [signout, setAuthTokens]);
    
    const interceptors = useMemo(() => {
        const interceptors = authInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry){ 
                    originalRequest._retry = true;

                    try{
                        console.log("Access Token expired. Attempting reissue.");
                        const success = await reissueToken(); 
                        if (success){
                            return authInstance(originalRequest); 
                        }
                    }catch(reissueError){
                        return Promise.reject(reissueError);
                    }
                    return Promise.reject(error);
                }
                return Promise.reject(error);
            }
        );
            return () => {
                authInstance.interceptors.response.eject(interceptors);
            };
        }, [signout, reissueToken]);
        
    useEffect(() => {
        checkAuthStatus();
        return interceptors;
    }, [interceptors, checkAuthStatus]);

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
    
    return(
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};