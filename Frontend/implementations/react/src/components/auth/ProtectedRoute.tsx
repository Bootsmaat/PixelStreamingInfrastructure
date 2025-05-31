import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requiredRoles = [] 
}) => {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        console.log('ProtectedRoute state:', {
            isAuthenticated,
            user,
            path: location.pathname,
            token: localStorage.getItem('auth_token')
        });
    }, [isAuthenticated, user, location]);

    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login...');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => 
            user?.roles?.includes(role)
        );

        if (!hasRequiredRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
}; 