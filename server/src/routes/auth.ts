import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getPool } from '../db.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'notmystyle_secret_key_2026';
const router = Router();

// POST /api/auth/register
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
    if (password.length < 5) {
      res.status(400).json({ error: 'Password must be at least 5 characters' });
      return;
    }

    const pool = await getPool();

    // Check existing user
    const existing = await pool.request()
      .input('username', username)
      .input('email', email)
      .query('SELECT Id FROM Users WHERE Username = @username OR Email = @email');

    if (existing.recordset.length > 0) {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }

    // Store password as plain text (school project)
    await pool.request()
      .input('name', name)
      .input('username', username)
      .input('email', email)
      .input('password', password)
      .query(`INSERT INTO Users (Name, Username, Email, Password, Role, Lives, TotalScore, LevelsPlayed, TotalStars, TotalTime)
              VALUES (@name, @username, @email, @password, 'player', 3, 0, 0, 0, 0)`);

    const user = await pool.request()
      .input('username', username)
      .query('SELECT Id, Name, Username, Email, Role, Lives, TotalScore, LevelsPlayed, TotalStars, TotalTime, CreatedAt FROM Users WHERE Username = @username');

    const u = user.recordset[0];
    const token = jwt.sign({ id: u.Id, username: u.Username, role: u.Role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: u.Id, name: u.Name, username: u.Username, email: u.Email,
        role: u.Role, lives: u.Lives, totalScore: u.TotalScore,
        levelsPlayed: u.LevelsPlayed, stars: u.TotalStars,
        totalTime: u.TotalTime, levelProgress: {}, createdAt: u.CreatedAt,
      },
    });
  } catch (err: any) {
    console.error('[AUTH] Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username and password required' });
      return;
    }

    const pool = await getPool();
    const result = await pool.request()
      .input('username', username)
      .query('SELECT Id, Name, Username, Email, Password, Role, Lives, TotalScore, LevelsPlayed, TotalStars, TotalTime, CreatedAt FROM Users WHERE Username = @username');

    if (result.recordset.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const u = result.recordset[0];
    const valid = password === u.Password;
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Load player progress
    const progress = await pool.request()
      .input('username', u.Username)
      .query('SELECT LevelId, Stars, IsUnlocked, BestTime FROM PlayerProgress WHERE Username = @username');

    const levelProgress: Record<string, any> = {};
    for (const p of progress.recordset) {
      levelProgress[p.LevelId] = { stars: p.Stars, unlocked: !!p.IsUnlocked, timeUsed: p.BestTime };
    }

    const token = jwt.sign({ id: u.Id, username: u.Username, role: u.Role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: u.Id, name: u.Name, username: u.Username, email: u.Email,
        role: u.Role, lives: u.Lives, totalScore: u.TotalScore,
        levelsPlayed: u.LevelsPlayed, stars: u.TotalStars,
        totalTime: u.TotalTime, levelProgress, createdAt: u.CreatedAt,
      },
    });
  } catch (err: any) {
    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me - verify token & get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('username', req.user!.username)
      .query('SELECT Id, Name, Username, Email, Role, Lives, TotalScore, LevelsPlayed, TotalStars, TotalTime, CreatedAt FROM Users WHERE Username = @username');

    if (result.recordset.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const u = result.recordset[0];
    const progress = await pool.request()
      .input('username', u.Username)
      .query('SELECT LevelId, Stars, IsUnlocked, BestTime FROM PlayerProgress WHERE Username = @username');

    const levelProgress: Record<string, any> = {};
    for (const p of progress.recordset) {
      levelProgress[p.LevelId] = { stars: p.Stars, unlocked: !!p.IsUnlocked, timeUsed: p.BestTime };
    }

    res.json({
      id: u.Id, name: u.Name, username: u.Username, email: u.Email,
      role: u.Role, lives: u.Lives, totalScore: u.TotalScore,
      levelsPlayed: u.LevelsPlayed, stars: u.TotalStars,
      totalTime: u.TotalTime, levelProgress, createdAt: u.CreatedAt,
    });
  } catch (err: any) {
    console.error('[AUTH] Me error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
