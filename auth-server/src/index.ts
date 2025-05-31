import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import { seedDatabase } from './config/seed';
import { authRouter } from './routes/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Routes
app.use('/auth', authRouter);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Initialize database and start server
AppDataSource.initialize()
    .then(async () => {
        console.log('Database initialized');
        
        if (process.env.NODE_ENV === 'development') {
            try {
                await seedDatabase();
            } catch (error) {
                console.error('Error seeding database:', error);
            }
        }

        app.listen(port, () => {
            console.log(`Auth server running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error('Error initializing database:', error);
        process.exit(1);
    }); 