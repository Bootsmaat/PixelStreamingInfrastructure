import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        roles: string[];
    };
}

export const authMiddleware = (authService: AuthService) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ message: 'No authorization header' });
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = await authService.validateToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    };
};

export const requireRoles = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const hasRequiredRole = req.user.roles.some(role => roles.includes(role));
        if (!hasRequiredRole) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        next();
    };
}; 