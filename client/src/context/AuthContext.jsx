import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // 1. Quick local check to avoid unnecessary network request
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.exp && payload.exp * 1000 < Date.now()) {
                        throw new Error("Stored token is expired locally.");
                    }

                    // 2. Ask backend to verify signature and ensure user still exists
                    const res = await fetch('http://localhost:5000/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (res.ok) {
                        const userData = await res.json();
                        // Merge backend data with the token
                        setUser({ ...userData, token });
                    } else {
                        throw new Error("Backend verification failed.");
                    }
                } catch (e) {
                    console.warn("Session invalid:", e.message);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        verifyUser();
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
