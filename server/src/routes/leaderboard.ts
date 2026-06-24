import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/leaderboard - Get ranked player list
// Sort order: 1) all dasar levels completed (priority), 2) TotalScore DESC, 3) TotalTime ASC
router.get('/', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();

    // Count total dasar levels to determine "all completed" threshold
    const dasarCountResult = await pool.query(
      'SELECT COUNT(*) AS total FROM "Levels" WHERE "LevelType" = \'dasar\''
    );
    
    // Di PostgreSQL, hasil COUNT(*) biasanya bertipe string (BigInt), jadi kita parsing ke integer
    const totalDasar: number = parseInt(dasarCountResult.rows[0]?.total ?? '0', 10);

    // Eksekusi query dengan format PostgreSQL ($1 untuk parameter) dan properti .rows
    const result = await pool.query(`
      SELECT
        u."Username",
        u."Name",
        u."TotalScore",
        u."LevelsPlayed",
        u."TotalStars",
        u."TotalTime",
        CASE WHEN u."LevelsPlayed" >= $1 THEN 0 ELSE 1 END AS "AllDasarBonus",
        RANK() OVER (
          ORDER BY
            CASE WHEN u."LevelsPlayed" >= $1 THEN 0 ELSE 1 END ASC,
            u."TotalScore" DESC,
            u."TotalTime" ASC
        ) AS "Rank"
      FROM "Users" u
      WHERE u."Role" = 'player'
      ORDER BY "Rank"
    `, [totalDasar]);

    // Memetakan properti dari result.rows
    const leaderboard = result.rows.map((p: any) => ({
      rank: Number(p.Rank),
      username: p.Username,
      name: p.Name,
      totalScore: p.TotalScore,
      levelsPlayed: p.LevelsPlayed,
      stars: p.TotalStars,
      totalTime: p.TotalTime,
    }));

    res.json(leaderboard);
  } catch (err: any) {
    console.error('[LEADERBOARD] Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;