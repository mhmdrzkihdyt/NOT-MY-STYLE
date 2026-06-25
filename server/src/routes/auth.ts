import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getPool } from '../db.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'notmystyle_secret_key_2026';
const router = Router();

// Kolom Users yang diambil di setiap query
const USER_COLS = `
  "Id", "Name", "Username", "Email", "Role",
  "Lives", "TotalScore", "LevelsPlayed", "TotalStars", "TotalTime",
  "ReviveEndAt", "CreatedAt"
`;

function buildUserPayload(u: any, levelProgress: Record<string, any>) {
  return {
    id: u.Id,
    name: u.Name,
    username: u.Username,
    email: u.Email,
    role: u.Role,
    lives: u.Lives,
    totalScore: u.TotalScore,
    levelsPlayed: u.LevelsPlayed,
    stars: u.TotalStars,
    totalTime: u.TotalTime,
    // ReviveEndAt: epoch ms kapan satu nyawa berikutnya selesai dipulihkan (null jika penuh)
    reviveEndAt: u.ReviveEndAt ? Number(u.ReviveEndAt) : null,
    levelProgress,
    createdAt: u.CreatedAt,
  };
}

async function loadLevelProgress(pool: any, username: string) {
  const progress = await pool.query(
    `SELECT "LevelId" AS "levelId", "Stars" AS "stars",
            "IsUnlocked" AS "isUnlocked", "BestTime" AS "bestTime"
     FROM "PlayerProgress" WHERE "Username" = $1`,
    [username]
  );
  const levelProgress: Record<string, any> = {};
  for (const p of progress.rows) {
    levelProgress[p.levelId] = {
      stars: p.stars,
      unlocked: !!p.isUnlocked,
      timeUsed: p.bestTime,
    };
  }
  return levelProgress;
}

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
    const existing = await pool.query(
      'SELECT "Id" FROM "Users" WHERE "Username" = $1 OR "Email" = $2',
      [username, email]
    );

    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Username or email already exists' });
      return;
    }

    await pool.query(
      `INSERT INTO "Users" ("Name","Username","Email","Password","Role","Lives","TotalScore","LevelsPlayed","TotalStars","TotalTime")
       VALUES ($1,$2,$3,$4,'player',3,0,0,0,0)`,
      [name, username, email, password]
    );

    const userResult = await pool.query(
      `SELECT ${USER_COLS} FROM "Users" WHERE "Username" = $1`,
      [username]
    );
    const u = userResult.rows[0];
    const token = jwt.sign({ id: u.Id, username: u.Username, role: u.Role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: buildUserPayload(u, {}) });
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
    const result = await pool.query(
      `SELECT ${USER_COLS}, "Password" FROM "Users" WHERE "Username" = $1`,
      [username]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const u = result.rows[0];
    if (password !== u.Password) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const levelProgress = await loadLevelProgress(pool, u.Username);
    const token = jwt.sign({ id: u.Id, username: u.Username, role: u.Role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: buildUserPayload(u, levelProgress) });
  } catch (err: any) {
    console.error('[AUTH] Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me - verify token & get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.query(
      `SELECT ${USER_COLS} FROM "Users" WHERE "Username" = $1`,
      [req.user!.username]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const u = result.rows[0];
    const levelProgress = await loadLevelProgress(pool, u.Username);

    res.json(buildUserPayload(u, levelProgress));
  } catch (err: any) {
    console.error('[AUTH] Me error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
