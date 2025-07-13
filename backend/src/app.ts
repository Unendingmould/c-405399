import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config';

// Import routes
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';
import userRoutes from './routes/userRoutes';
import investmentRoutes from './routes/investmentRoutes';
import transactionRoutes from './routes/transactionRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import notificationRoutes from './routes/notificationRoutes';
import reportRoutes from './routes/reportRoutes';
import marketDataRoutes from './routes/marketDataRoutes';

// Initialize express app
const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS handling
app.use(morgan(config.server.nodeEnv === 'development' ? 'dev' : 'combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv
  });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Investment Dashboard API',
    version: '1.0.0',
    docs: '/api/docs'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', userRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/market', marketDataRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error: ${err.message}`);
  res.status(500).json({
    status: 'error',
    message: config.server.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

export default app;
