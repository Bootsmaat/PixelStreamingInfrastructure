import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    token: string | null;
    user: any | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        console.log('AuthContext state updated:', { token, user, isAuthenticated: !!token });
    }, [token, user]);

    useEffect(() => {
        if (token) {
            // For development, set a mock user immediately
            setUser({
                id: 1,
                username: 'test',
                roles: ['user']
            });
        }
    }, [token]);

    const login = (newToken: string) => {
        console.log('Login called with token:', newToken);
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        console.log('Logout called');
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    const value = {
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token
    };

    console.log('AuthContext rendering with value:', value);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 