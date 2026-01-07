import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Import routes
import authRoutes from './routes/auth';
import leaderboardRoutes from './routes/leaderboard';
import dailyRoutes from './routes/daily';
import { generalRateLimit } from './middleware/rateLimit';

// Apply rate limiting to all API routes
app.use('/api/', generalRateLimit);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sudoku API is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/daily', dailyRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Sudoku API running on http://localhost:${PORT}`);
});
