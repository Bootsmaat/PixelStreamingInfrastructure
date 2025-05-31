import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config/config';

export class AuthService {
    constructor(private userRepository: Repository<User>) {}

    async register(username: string, email: string, password: string): Promise<User> {
        const existingUser = await this.userRepository.findOne({ 
            where: [{ username }, { email }] 
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({
            username,
            email,
            password: hashedPassword
        });

        return this.userRepository.save(user);
    }

    async login(usernameOrEmail: string, password: string): Promise<{ user: User; token: string }> {
        const user = await this.userRepository.findOne({
            where: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ],
            relations: ['roles']
        });

        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        // Update last login
        user.lastLoginAt = new Date();
        await this.userRepository.save(user);

        const token = jwt.sign(
            { 
                id: user.id,
                roles: user.roles.map(role => role.name)
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        return { user, token };
    }

    async validateToken(token: string): Promise<any> {
        try {
            return jwt.verify(token, config.jwt.secret);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
} 