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
    const dasarCountResult = await pool.request().query(
      "SELECT COUNT(*) AS total FROM Levels WHERE LevelType = 'dasar'"
    );
    const totalDasar: number = dasarCountResult.recordset[0]?.total ?? 0;

    const result = await pool.request()
      .input('totalDasar', totalDasar)
      .query(`
        SELECT
          u.Username,
          u.Name,
          u.TotalScore,
          u.LevelsPlayed,
          u.TotalStars,
          u.TotalTime,
          CASE WHEN u.LevelsPlayed >= @totalDasar THEN 0 ELSE 1 END AS AllDasarBonus,
          RANK() OVER (
            ORDER BY
              CASE WHEN u.LevelsPlayed >= @totalDasar THEN 0 ELSE 1 END ASC,
              u.TotalScore DESC,
              u.TotalTime ASC
          ) AS Rank
        FROM Users u
        WHERE u.Role = 'player'
        ORDER BY Rank
      `);

    const leaderboard = result.recordset.map((p: any) => ({
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
