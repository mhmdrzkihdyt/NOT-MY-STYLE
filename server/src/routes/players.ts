import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate, requireDeveloper } from '../middleware/auth.js';

const router = Router();

// GET /api/players - List all players (developer only)
router.get('/', authenticate, requireDeveloper, async (_req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.query(`
      SELECT 
        "Id"          AS "id",
        "Name"        AS "name",
        "Username"    AS "username",
        "Email"       AS "email",
        "Password"    AS "password",
        "Role"        AS "role",
        "Lives"       AS "lives",
        "TotalScore"  AS "totalScore",
        "LevelsPlayed" AS "levelsPlayed",
        "TotalStars"  AS "stars",
        "TotalTime"   AS "totalTime",
        "CreatedAt"   AS "createdAt"
      FROM "Users"
      WHERE "Role" = 'player'
      ORDER BY "CreatedAt" DESC
    `);
    
    res.json(result.rows);
  } catch (err: any) {
    console.error('[PLAYERS] List error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/players/:username - Get player detail (developer only)
router.get('/:username', authenticate, requireDeveloper, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    
    // Menggunakan parameter $1 dan destructuring rows
    const userResult = await pool.query(
      'SELECT "Id", "Name", "Username", "Email", "Role", "Lives", "TotalScore", "LevelsPlayed", "TotalStars", "TotalTime", "CreatedAt" FROM "Users" WHERE "Username" = $1',
      [req.params.username]
    );

    if (userResult.rows.length === 0) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    const u = userResult.rows[0];

    // Ambil data progres menggunakan PostgreSQL parameter
    const progressResult = await pool.query(
      `SELECT "LevelId" AS "levelId", "Stars" AS "stars", "IsUnlocked" AS "isUnlocked", 
              "BestTime" AS "bestTime", "Score" AS "score"
       FROM "PlayerProgress" WHERE "Username" = $1`,
      [req.params.username]
    );

    res.json({
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
      createdAt: u.CreatedAt, 
      progress: progressResult.rows,
    });
  } catch (err: any) {
    console.error('[PLAYERS] Detail error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/players/:username - Delete player (developer only)
router.delete('/:username', authenticate, requireDeveloper, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    
    await pool.query(
      'DELETE FROM "Users" WHERE "Username" = $1 AND "Role" = \'player\'',
      [req.params.username]
    );
    
    res.json({ message: 'Player deleted' });
  } catch (err: any) {
    console.error('[PLAYERS] Delete error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;