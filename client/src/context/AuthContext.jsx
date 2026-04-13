import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: verify the token with the backend here

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    console.warn("Stored token is expired.");
                    localStorage.removeItem('token');
                } else {
                    setUser({ ...payload, token });
                }
            } catch (e) {
                console.error("Invalid token", e);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        setUser({ ...userData, token });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
