import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Role } from '../models/Role';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: process.env.DB_PATH || './db.sqlite',
    synchronize: process.env.NODE_ENV === 'development', // Auto-create database schema in development
    logging: process.env.NODE_ENV === 'development',
    entities: [User, Role],
    migrations: [],
    subscribers: [],
}); 