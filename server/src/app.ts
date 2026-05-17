import express from 'express';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { connectDB } from './config/db';
import { logger } from './config/logger';
import { applySecurityMiddleware } from './middleware/security.middleware';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import leadRoutes from './routes/lead.routes';
import healthRoutes from './routes/health.routes';

const app = express();

// Body parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use(pinoHttp({ logger }));

// Security
applySecurityMiddleware(app);

// Routes
app.use('/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/leads', leadRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
