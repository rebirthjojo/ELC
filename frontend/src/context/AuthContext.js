import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, {createContext, useState, useContext, useEffect, useMemo, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

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
});

export const AuthProvider = ({ children }) => {
    
    const [token, setToken] = useState(null);
    const [isSignIn, setIsSignIn] = useState(false);
    const [user, setUser] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const navigate = useNavigate();    
    const checkAuthStatus = useCallback(async () => {
        
        const USER_INFO_ENDPOINT = '/sign/users/me';
        try {
            const response = await axios.get(USER_INFO_ENDPOINT);
            
            setUser(response.data);
            setIsSignIn(true);

            return true;
        } catch (error){
            console.log("No valid token found in cookie or token expired.");
            setIsSignIn(false);
            setUser(null);
            return false;
        }
    }, [setIsSignIn, setUser]);

    const setAuthToken = useCallback((tokenValue) => {
        setToken(tokenValue);

        if (tokenValue) {
            try {
                const decoded =jwtDecode(tokenValue);
                setUser({
                    uid: decoded.uid,
                    email: decoded.email,
                    name: decoded.name,
                    tutor: decoded.tutor,
                });
                setIsSignIn(true);
            }catch (e) {
                console.error("JWT 디코딩 실패:", e);
                setUser(null);
                setIsSignIn(false);
            }
        } else {
            setUser(null);
            setIsSignIn(false);
        }
    }, [setToken, setUser, setIsSignIn]);

    const signout = useCallback(async () => {
        try{
            await axios.post('/signOut');
        } catch (error){
            console.error("Logout API request failed, proceeding with local clear", error);
        }
            setToken(null);
            setRefreshToken(null);
            setUser(null);
            setIsSignIn(false);
            navigate('/');
        }, [setToken, setRefreshToken, setUser, setIsSignIn, navigate]);
    
    const reissueToken = useCallback(async () => {
        
        try {
            await axios.post('/reissue');

            return await checkAuthStatus();
        }catch (error) {
            console.error("Token reissue failed:", error);
            signout();
            return false;
        }
    }, [checkAuthStatus, signout]);

    

    const interceptors = useMemo(() => {
        const interceptors = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry){
                    originalRequest._retry = true;

                    try{
                        console.log("Access Token expired.");
                        const success = await reissueToken();
                        if (success){
                            return axios(originalRequest);
                        }
                    }catch(reissueError){
                    return Promise.reject(reissueError);
                    }
                    return Promise.reject(error);
                }
            }
        );
            return () => {
                axios.interceptors.response.eject(interceptors);
            };
        }, [signout, reissueToken]);
        useEffect(() => {
            checkAuthStatus();
            return interceptors;
        }, [interceptors, checkAuthStatus]);

    const contextValue = {
        isSignIn,
        token,
        setToken: setAuthToken,
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