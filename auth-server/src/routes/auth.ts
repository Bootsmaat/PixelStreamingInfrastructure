import { Router } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Login route
router.post('/login', async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        // Find user
        const user = await userRepository.findOne({
            where: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ],
            relations: ['roles']
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLoginAt = new Date();
        await userRepository.save(user);

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                roles: user.roles.map(role => role.name)
            },
            process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        // Return user info and token
        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                roles: user.roles.map(role => role.name),
                startPage: user.startPage
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export const authRouter = router; 