import axios from "axios";
import React, {createContext, useState, useContext, useEffect, children} from "react";

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
});

export const AuthProvider = ({ children }) => {
    const initialToken = localStorage.getItem('accessToken');
    const [token, setToken] = useState(initialToken);
    const [isSignIn, setIsSignIn] = useState(!!initialToken);
    const [user, setUser] = useState(null);
    const initialRefreshToken = localStorage.getItem('refreshToken');
    const [refreshToken, setRefreshToken] = useState(initialRefreshToken);
    const signout = () => {
            setToken(null);
            setRefreshToken(null);
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            setUser(null);
        };
    
    useEffect(() => {
        if (token) {
            setIsSignIn(true);
            localStorage.setItem('accessToken', token);
        }else {
            setIsSignIn(false);
            localStorage.removeItem('accessToken');
        }
    }, [token]);

    const reissueToken = async () => {
        if (!refreshToken) {
            console.error("Refresh token not found.");
            return false;
        }

        try {
            const response = await axios.post('/reissue', {
                refreshToken: refreshToken
            });

            const { accessToken: newAccessToken, refreshToken: newrefreshToken} = response.data;
            setToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            setRefreshToken(newrefreshToken);
            localStorage.setItem('refreshToken', newrefreshToken);

            return true;
        }catch (error) {
            console.error("Token reissue failed:", error);
            signout();
            return false;
        }
    };

    const contextValue = {
        isSignIn,
        token,
        setToken,
        user,
        setUser,
        reissueToken,
        refreshToken,
        signout,
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