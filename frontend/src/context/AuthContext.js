import React, {createContext, useState, useContext, useEffect, children} from "react";

export const AuthContext = createContext({
    isSignIn: false,
    setIsSignIn: () => {},
    token: null,
    setToken: () => {},
});

export const AuthProvider = ({ children }) => {
    const initialToken = localStorage.getItem('jwtToken');
    const[token, setToken] = useState(initialToken);
    const[isSignIn, setIsSignIn] = useState(!!initialToken);
    
    useEffect(() => {
        if (token) {
            setIsSignIn(true);
            localStorage.setItem('jwtToken', token);
        }else {
            setIsSignIn(false);
            localStorage.removeItem('jwtToken');
        }
    }, [token]);

    const contextValue = {
        isSignIn,
        token,
        setToken,
        setIsSignIn,
        signout: () => {
            setToken(null);
        }
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