import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/progress/:username - Get player's level progress
router.get('/:username', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.query(
      `SELECT "LevelId" AS "levelId", "Stars" AS "stars", "IsUnlocked" AS "isUnlocked",
              "BestTime" AS "bestTime", "Score" AS "score", "HintsUsed" AS "hintsUsed", "Attempts" AS "attempts"
       FROM "PlayerProgress" WHERE "Username" = $1`,
      [req.params.username]
    );

    const progress: Record<string, any> = {};
    for (const p of result.rows) {
      progress[p.levelId] = {
        stars: p.stars,
        unlocked: !!p.isUnlocked,
        timeUsed: p.bestTime,
        score: p.score,
        hintsUsed: p.hintsUsed,
        attempts: p.attempts,
      };
    }
    res.json(progress);
  } catch (err: any) {
    console.error('[PROGRESS] Get error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/progress/:username - Update progress after level completion
router.put('/:username', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { levelId, stars, timeUsed, score, hintsUsed, unlockNextLevelId } = req.body;
    if (!levelId) { res.status(400).json({ error: 'levelId required' }); return; }

    const pool = await getPool();
    const username = req.params.username;

    const existing = await pool.query(
      `SELECT "Id" AS "id", "Stars" AS "stars", "BestTime" AS "bestTime", "Attempts" AS "attempts"
       FROM "PlayerProgress" WHERE "Username" = $1 AND "LevelId" = $2`,
      [username, levelId]
    );

    if (existing.rows.length > 0) {
      const old = existing.rows[0];
      const newStars = Math.max(old.stars || 0, stars || 0);
      const newBestTime = (timeUsed !== undefined && (old.bestTime === null || timeUsed < old.bestTime))
        ? timeUsed : old.bestTime;

      await pool.query(
        `UPDATE "PlayerProgress"
         SET "Stars"=$1,"BestTime"=$2,"Score"=$3,"HintsUsed"=$4,"Attempts"=$5,"UpdatedAt"=NOW()
         WHERE "Id"=$6`,
        [newStars, newBestTime, score || 0, hintsUsed || 0, (old.attempts || 0) + 1, old.id]
      );

      if (!old.attempts || old.attempts === 0) {
        await pool.query(
          `UPDATE "Users"
           SET "TotalScore"="TotalScore"+$1,"LevelsPlayed"="LevelsPlayed"+1,
               "TotalStars"="TotalStars"+$2,"TotalTime"="TotalTime"+$3,"UpdatedAt"=NOW()
           WHERE "Username"=$4`,
          [score || 0, stars || 0, timeUsed || 0, username]
        );
      } else if (timeUsed !== undefined && timeUsed < (old.bestTime || Infinity)) {
        const diff = (old.bestTime || 0) - timeUsed;
        await pool.query(
          'UPDATE "Users" SET "TotalTime"="TotalTime"-$1,"UpdatedAt"=NOW() WHERE "Username"=$2',
          [diff, username]
        );
      }
    } else {
      await pool.query(
        `INSERT INTO "Levels" ("Id","Title","Description","LevelType","Difficulty","HtmlStructure","TimeLimit","SortOrder")
         VALUES ($1,$1,'','dasar','Mudah','',60,0) ON CONFLICT ("Id") DO NOTHING`,
        [levelId]
      );
      await pool.query(
        `INSERT INTO "PlayerProgress"
           ("Username","LevelId","Stars","IsUnlocked","BestTime","Score","HintsUsed","Attempts","CompletedAt")
         VALUES ($1,$2,$3,TRUE,$4,$5,$6,1,NOW())`,
        [username, levelId, stars || 0, timeUsed ?? null, score || 0, hintsUsed || 0]
      );
      await pool.query(
        `UPDATE "Users"
         SET "TotalScore"="TotalScore"+$1,"LevelsPlayed"="LevelsPlayed"+1,
             "TotalStars"="TotalStars"+$2,"TotalTime"="TotalTime"+$3,"UpdatedAt"=NOW()
         WHERE "Username"=$4`,
        [score || 0, stars || 0, timeUsed || 0, username]
      );
    }

    if (unlockNextLevelId) {
      await pool.query(
        `INSERT INTO "Levels" ("Id","Title","Description","LevelType","Difficulty","HtmlStructure","TimeLimit","SortOrder")
         VALUES ($1,$1,'','dasar','Mudah','',60,0) ON CONFLICT ("Id") DO NOTHING`,
        [unlockNextLevelId]
      );
      await pool.query(
        `INSERT INTO "PlayerProgress" ("Username","LevelId","IsUnlocked")
         VALUES ($1,$2,TRUE) ON CONFLICT ("Username","LevelId") DO UPDATE SET "IsUnlocked"=TRUE`,
        [username, unlockNextLevelId]
      );
    }

    res.json({ message: 'Progress updated' });
  } catch (err: any) {
    console.error('[PROGRESS] Update error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/progress/:username/lives - Update lives + reviveEndAt (authenticated)
router.put('/:username/lives', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { lives, reviveEndAt } = req.body;
    const pool = await getPool();
    await pool.query(
      `UPDATE "Users"
       SET "Lives"=$1, "ReviveEndAt"=$2, "UpdatedAt"=NOW()
       WHERE "Username"=$3`,
      [Math.max(0, Math.min(3, lives ?? 3)), reviveEndAt ?? null, req.params.username]
    );
    res.json({ message: 'Lives updated' });
  } catch (err: any) {
    console.error('[PROGRESS] Lives error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/progress/:username/lives-beacon - Update lives+reviveEndAt via sendBeacon
router.post('/:username/lives-beacon', async (req: AuthRequest, res: Response) => {
  try {
    const { lives, reviveEndAt, token } = req.body;
    if (!token) { res.status(401).json({ error: 'Token required' }); return; }

    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'notmystyle_secret_key_2026';
    let decoded: any;
    try { decoded = jwt.default.verify(token, JWT_SECRET) as { username: string }; }
    catch { res.status(401).json({ error: 'Invalid token' }); return; }
    if (decoded.username !== req.params.username) { res.status(403).json({ error: 'Forbidden' }); return; }

    const pool = await getPool();
    if (lives !== undefined) {
      await pool.query(
        `UPDATE "Users" SET "Lives"=$1,"ReviveEndAt"=$2,"UpdatedAt"=NOW() WHERE "Username"=$3`,
        [Math.max(0, Math.min(3, lives)), reviveEndAt ?? null, req.params.username]
      );
    }
    res.json({ message: 'Lives updated' });
  } catch (err: any) {
    console.error('[PROGRESS] Lives beacon error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/progress/:username/bulk-beacon - Bulk update progress+lives+reviveEndAt via sendBeacon
router.post('/:username/bulk-beacon', async (req: AuthRequest, res: Response) => {
  try {
    const { lives, reviveEndAt, progress, token } = req.body;
    if (!token) { res.status(401).json({ error: 'Token required' }); return; }

    const jwt = await import('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'notmystyle_secret_key_2026';
    let decoded: any;
    try { decoded = jwt.default.verify(token, JWT_SECRET) as { username: string }; }
    catch { res.status(401).json({ error: 'Invalid token' }); return; }
    if (decoded.username !== req.params.username) { res.status(403).json({ error: 'Forbidden' }); return; }

    const pool = await getPool();
    const username = req.params.username;

    if (lives !== undefined) {
      await pool.query(
        `UPDATE "Users" SET "Lives"=$1,"ReviveEndAt"=$2,"UpdatedAt"=NOW() WHERE "Username"=$3`,
        [Math.max(0, Math.min(3, lives)), reviveEndAt ?? null, username]
      );
    }

    if (Array.isArray(progress) && progress.length > 0) {
      for (const entry of progress) {
        const { levelId, stars, timeUsed } = entry;
        if (!levelId) continue;
        await pool.query(
          `INSERT INTO "Levels" ("Id","Title","Description","LevelType","Difficulty","HtmlStructure","TimeLimit","SortOrder")
           VALUES ($1,$1,'','dasar','Mudah','',60,0) ON CONFLICT ("Id") DO NOTHING`,
          [levelId]
        );
        await pool.query(
          `INSERT INTO "PlayerProgress" ("Username","LevelId","Stars","IsUnlocked","BestTime","Attempts","CompletedAt")
           VALUES ($1,$2,$3,TRUE,$4,1,NOW())
           ON CONFLICT ("Username","LevelId") DO UPDATE
             SET "Stars"     = GREATEST("PlayerProgress"."Stars", EXCLUDED."Stars"),
                 "IsUnlocked"= TRUE,
                 "BestTime"  = CASE
                                 WHEN EXCLUDED."BestTime" IS NOT NULL AND (
                                   "PlayerProgress"."BestTime" IS NULL OR
                                   EXCLUDED."BestTime" < "PlayerProgress"."BestTime")
                                 THEN EXCLUDED."BestTime"
                                 ELSE "PlayerProgress"."BestTime"
                               END,
                 "UpdatedAt" = NOW()`,
          [username, levelId, stars ?? 0, timeUsed ?? null]
        );
      }
    }
    res.json({ message: 'Bulk update ok' });
  } catch (err: any) {
    console.error('[PROGRESS] Bulk beacon error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/progress/:username/recalculate - Recalculate Users aggregate stats dari PlayerProgress
router.post('/:username/recalculate', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const username = req.params.username;

    const aggResult = await pool.query(
      `SELECT
         COUNT(*)           FILTER (WHERE "Stars" IS NOT NULL AND "Attempts" > 0) AS "levelsPlayed",
         COALESCE(SUM("Stars")    FILTER (WHERE "Stars"    IS NOT NULL AND "Attempts" > 0), 0) AS "totalStars",
         COALESCE(SUM("Score")    FILTER (WHERE "Score"    IS NOT NULL AND "Attempts" > 0), 0) AS "totalScore",
         COALESCE(SUM("BestTime") FILTER (WHERE "BestTime" IS NOT NULL AND "Attempts" > 0), 0) AS "totalTime"
       FROM "PlayerProgress" WHERE "Username" = $1`,
      [username]
    );

    const agg = aggResult.rows[0];
    const levelsPlayed = Number(agg.levelsPlayed) || 0;
    const totalStars   = Number(agg.totalStars)   || 0;
    const totalScore   = Number(agg.totalScore)   || 0;
    const totalTime    = Number(agg.totalTime)     || 0;

    await pool.query(
      `UPDATE "Users"
       SET "TotalScore"=$1,"LevelsPlayed"=$2,"TotalStars"=$3,"TotalTime"=$4,"UpdatedAt"=NOW()
       WHERE "Username"=$5`,
      [totalScore, levelsPlayed, totalStars, totalTime, username]
    );

    res.json({ message: 'Recalculated', totalScore, levelsPlayed, totalStars, totalTime });
  } catch (err: any) {
    console.error('[PROGRESS] Recalculate error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
