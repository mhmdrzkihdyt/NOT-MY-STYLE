import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/leaderboard - Real-time leaderboard dihitung langsung dari PlayerProgress
// Sort: 1) semua level dasar selesai (prioritas), 2) TotalScore DESC, 3) TotalTime ASC
router.get('/', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();

    // Hitung jumlah level dasar sebagai threshold "semua dasar selesai"
    const dasarCountResult = await pool.query(
      'SELECT COUNT(*) AS "total" FROM "Levels" WHERE "LevelType" = \'dasar\''
    );
    const totalDasar: number = parseInt(dasarCountResult.rows[0]?.total ?? '0', 10);

    // Query leaderboard yang langsung aggregate dari PlayerProgress
    // Ini memastikan data selalu akurat meski kolom Users belum di-sync
    const result = await pool.query(`
      WITH PlayerStats AS (
        SELECT
          pp."Username",
          COUNT(*)           FILTER (WHERE pp."Stars" IS NOT NULL AND pp."Attempts" > 0) AS "levelsPlayed",
          COALESCE(SUM(pp."Stars")    FILTER (WHERE pp."Stars"    IS NOT NULL AND pp."Attempts" > 0), 0) AS "totalStars",
          COALESCE(SUM(pp."Score")    FILTER (WHERE pp."Score"    IS NOT NULL AND pp."Attempts" > 0), 0) AS "totalScore",
          COALESCE(SUM(pp."BestTime") FILTER (WHERE pp."BestTime" IS NOT NULL AND pp."Attempts" > 0), 0) AS "totalTime"
        FROM "PlayerProgress" pp
        GROUP BY pp."Username"
      )
      SELECT
        u."Username"  AS "username",
        u."Name"      AS "name",
        COALESCE(ps."totalScore",    0) AS "totalScore",
        COALESCE(ps."levelsPlayed",  0) AS "levelsPlayed",
        COALESCE(ps."totalStars",    0) AS "stars",
        COALESCE(ps."totalTime",     0) AS "totalTime",
        RANK() OVER (
          ORDER BY
            CASE WHEN COALESCE(ps."levelsPlayed", 0) >= $1 THEN 0 ELSE 1 END ASC,
            COALESCE(ps."totalScore", 0)  DESC,
            COALESCE(ps."totalTime",  0)  ASC
        ) AS "rank"
      FROM "Users" u
      LEFT JOIN PlayerStats ps ON ps."Username" = u."Username"
      WHERE u."Role" = 'player'
      ORDER BY "rank"
    `, [totalDasar]);

    const leaderboard = result.rows.map((p: any, idx: number) => ({
      rank:         Number(p.rank)         || (idx + 1),
      username:     p.username,
      name:         p.name,
      totalScore:   Number(p.totalScore)   || 0,
      levelsPlayed: Number(p.levelsPlayed) || 0,
      stars:        Number(p.stars)        || 0,
      totalTime:    Number(p.totalTime)    || 0,
    }));

    res.json(leaderboard);
  } catch (err: any) {
    console.error('[LEADERBOARD] Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
