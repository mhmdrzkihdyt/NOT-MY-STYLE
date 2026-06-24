import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPool } from './db.js';

import authRoutes from './routes/auth.js';
import levelRoutes from './routes/levels.js';
import progressRoutes from './routes/progress.js';
import leaderboardRoutes from './routes/leaderboard.js';
import playerRoutes from './routes/players.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'https://not-my-style.vercel.app/', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/players', playerRoutes);

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    const pool = await getPool();
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err: any) {
    res.status(500).json({ status: 'error', db: err.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  try {
    await getPool();
    console.log(`[Server] Database connected: ${process.env.DB_NAME}`);
  } catch (err: any) {
    console.error(`[Server] Database connection failed:`, err.message);
    console.error(`[Server] Make sure to:`);
    console.error(`  1. Run database_schema.sql in SSMS`);
    console.error(`  2. Update .env with correct DB credentials`);
    console.error(`  3. Ensure SQL Server is running`);
  }
});

// Start server (Hanya berjalan di lokal, di Vercel tidak akan memblokir)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
    try {
      await getPool();
      console.log(`[Server] Database connected`);
    } catch (err: any) {
      console.error(`[Server] Database connection failed:`, err.message);
    }
  });
}

// WAJIB TAMBAHKAN INI UNTUK VERCEL
export default app;