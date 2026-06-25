import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/leaderboard - Get ranked player list
// Sort order: 1) all dasar levels completed (priority), 2) TotalScore DESC, 3) TotalTime ASC
router.get('/', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();

    const dasarCountResult = await pool.query(
      'SELECT COUNT(*) AS "total" FROM "Levels" WHERE "LevelType" = \'dasar\''
    );
    const totalDasar: number = parseInt(dasarCountResult.rows[0]?.total ?? '0', 10);

    const result = await pool.query(`
      SELECT
        u."Username"     AS "username",
        u."Name"         AS "name",
        u."TotalScore"   AS "totalScore",
        u."LevelsPlayed" AS "levelsPlayed",
        u."TotalStars"   AS "stars",
        u."TotalTime"    AS "totalTime",
        RANK() OVER (
          ORDER BY
            CASE WHEN u."LevelsPlayed" >= $1 THEN 0 ELSE 1 END ASC,
            u."TotalScore" DESC,
            u."TotalTime" ASC
        ) AS "rank"
      FROM "Users" u
      WHERE u."Role" = 'player'
      ORDER BY "rank"
    `, [totalDasar]);

    const leaderboard = result.rows.map((p: any, idx: number) => ({
      rank: Number(p.rank) || (idx + 1),
      username: p.username,
      name: p.name,
      totalScore: Number(p.totalScore) || 0,
      levelsPlayed: Number(p.levelsPlayed) || 0,
      stars: Number(p.stars) || 0,
      totalTime: Number(p.totalTime) || 0,
    }));

    res.json(leaderboard);
  } catch (err: any) {
    console.error('[LEADERBOARD] Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/leaderboard/recalculate-all - Recalculate stats semua player dari PlayerProgress
// Dipanggil developer saat load overview agar data selalu akurat
router.post('/recalculate-all', authenticate, async (_req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();

    const players = await pool.query(
      'SELECT "Username" AS "username" FROM "Users" WHERE "Role" = \'player\''
    );

    for (const row of players.rows) {
      const username = row.username;
      if (!username) continue;

      const agg = await pool.query(
        `SELECT
           COUNT(*)           FILTER (WHERE "Stars" IS NOT NULL AND "Attempts" > 0) AS "levelsPlayed",
           COALESCE(SUM("Stars")    FILTER (WHERE "Stars"    IS NOT NULL AND "Attempts" > 0), 0) AS "totalStars",
           COALESCE(SUM("Score")    FILTER (WHERE "Score"    IS NOT NULL AND "Attempts" > 0), 0) AS "totalScore",
           COALESCE(SUM("BestTime") FILTER (WHERE "BestTime" IS NOT NULL AND "Attempts" > 0), 0) AS "totalTime"
         FROM "PlayerProgress" WHERE "Username" = $1`,
        [username]
      );

      const a = agg.rows[0];
      await pool.query(
        `UPDATE "Users"
         SET "TotalScore"=$1, "LevelsPlayed"=$2, "TotalStars"=$3, "TotalTime"=$4, "UpdatedAt"=NOW()
         WHERE "Username"=$5`,
        [
          Number(a.totalScore)   || 0,
          Number(a.levelsPlayed) || 0,
          Number(a.totalStars)   || 0,
          Number(a.totalTime)    || 0,
          username,
        ]
      );
    }

    res.json({ message: 'All players recalculated', count: players.rows.length });
  } catch (err: any) {
    console.error('[LEADERBOARD] Recalculate-all error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
