import { AppDataSource } from './database';
import { User } from '../models/User';
import { Role } from '../models/Role';
import * as bcrypt from 'bcryptjs';

export async function seedDatabase() {
    try {
        // Create roles
        const roleRepository = AppDataSource.getRepository(Role);
        
        const userRole = await roleRepository.save({
            name: 'user',
            description: 'Standard user role'
        });

        const adminRole = await roleRepository.save({
            name: 'admin',
            description: 'Administrator role'
        });

        // Create test user
        const userRepository = AppDataSource.getRepository(User);
        const hashedPassword = await bcrypt.hash('test123', 10);
        
        await userRepository.save({
            username: 'test',
            email: 'test@example.com',
            password: hashedPassword,
            roles: [userRole],
            startPage: '/'
        });

        // Create admin user
        await userRepository.save({
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            roles: [userRole, adminRole],
            startPage: '/admin'
        });

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
} 