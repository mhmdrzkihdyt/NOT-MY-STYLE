import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/progress/:username - Get player's level progress
router.get('/:username', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.query(
      'SELECT "LevelId", "Stars", "IsUnlocked", "BestTime", "Score", "HintsUsed", "Attempts" FROM "PlayerProgress" WHERE "Username" = $1',
      [req.params.username]
    );

    const progress: Record<string, any> = {};
    for (const p of result.rows) {
      progress[p.LevelId] = {
        stars: p.Stars,
        unlocked: !!p.IsUnlocked,
        timeUsed: p.BestTime,
        score: p.Score,
        hintsUsed: p.HintsUsed,
        attempts: p.Attempts,
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

    if (!levelId) {
      res.status(400).json({ error: 'levelId required' });
      return;
    }

    const pool = await getPool();
    const username = req.params.username;

    // Cek apakah progress sudah ada
    const existing = await pool.query(
      'SELECT "Id", "Stars", "BestTime", "Attempts" FROM "PlayerProgress" WHERE "Username" = $1 AND "LevelId" = $2',
      [username, levelId]
    );

    if (existing.rows.length > 0) {
      // Replay: update hanya jika skor/bintang lebih baik
      const old = existing.rows[0];
      const newStars = Math.max(old.Stars || 0, stars || 0);
      const newBestTime = (timeUsed !== undefined && (old.BestTime === null || timeUsed < old.BestTime)) ? timeUsed : old.BestTime;

      await pool.query(`
        UPDATE "PlayerProgress" 
        SET "Stars" = $1, "BestTime" = $2, "Score" = $3, "HintsUsed" = $4, "Attempts" = $5, "UpdatedAt" = NOW() 
        WHERE "Id" = $6
      `, [newStars, newBestTime, score || 0, hintsUsed || 0, (old.Attempts || 0) + 1, old.Id]);

      // Update total user jika ini penyelesaian pertama (Attempts sebelumnya kosong/0 pada logic logika Anda)
      if (old.Attempts === 0) {
        await pool.query(`
          UPDATE "Users" 
          SET "TotalScore" = "TotalScore" + $1, "LevelsPlayed" = "LevelsPlayed" + 1,
              "TotalStars" = "TotalStars" + $2, "TotalTime" = "TotalTime" + $3, "UpdatedAt" = NOW() 
          WHERE "Username" = $4
        `, [score || 0, stars || 0, timeUsed || 0, username]);
      } else if (timeUsed !== undefined && timeUsed < (old.BestTime || Infinity)) {
        // Jika replay lebih cepat: kurangi total waktu keseluruhan
        const diff = (old.BestTime || 0) - timeUsed;
        await pool.query(
          'UPDATE "Users" SET "TotalTime" = "TotalTime" - $1, "UpdatedAt" = NOW() WHERE "Username" = $2',
          [diff, username]
        );
      }
    } else {
      // Penyelesaian pertama: Pastikan level terdaftar (Upsert ala PostgreSQL menggunakan ON CONFLICT)
      // Catatan: Ini membutuhkan constraint UNIQUE/PRIMARY KEY pada kolom Id di tabel Levels
      await pool.query(`
        INSERT INTO "Levels" ("Id", "Title", "Description", "LevelType", "Difficulty", "HtmlStructure", "TimeLimit", "SortOrder")
        VALUES ($1, $1, '', 'dasar', 'Mudah', '', 60, 0)
        ON CONFLICT ("Id") DO NOTHING
      `, [levelId]);

      await pool.query(`
        INSERT INTO "PlayerProgress" ("Username", "LevelId", "Stars", "IsUnlocked", "BestTime", "Score", "HintsUsed", "Attempts", "CompletedAt")
        VALUES ($1, $2, $3, 1, $4, $5, $6, 1, NOW())
      `, [username, levelId, stars || 0, timeUsed ?? null, score || 0, hintsUsed || 0]);

      // Update total data user
      await pool.query(`
        UPDATE "Users" 
        SET "TotalScore" = "TotalScore" + $1, "LevelsPlayed" = "LevelsPlayed" + 1,
            "TotalStars" = "TotalStars" + $2, "TotalTime" = "TotalTime" + $3, "UpdatedAt" = NOW() 
        WHERE "Username" = $4
      `, [score || 0, stars || 0, timeUsed || 0, username]);
    }

    // Unlock level berikutnya jika dilampirkan
    if (unlockNextLevelId) {
      // Pastikan level berikutnya ada di tabel Levels
      await pool.query(`
        INSERT INTO "Levels" ("Id", "Title", "Description", "LevelType", "Difficulty", "HtmlStructure", "TimeLimit", "SortOrder")
        VALUES ($1, $1, '', 'dasar', 'Mudah', '', 60, 0)
        ON CONFLICT ("Id") DO NOTHING
      `, [unlockNextLevelId]);

      // Upsert status buka kunci level berikutnya (buka jika belum ada, update jika sudah ada)
      // Catatan: Membutuhkan composite UNIQUE constraint pada (Username, LevelId) di tabel PlayerProgress
      await pool.query(`
        INSERT INTO "PlayerProgress" ("Username", "LevelId", "IsUnlocked") 
        VALUES ($1, $2, 1)
        ON CONFLICT ("Username", "LevelId") DO UPDATE SET "IsUnlocked" = 1
      `, [username, unlockNextLevelId]);
    }

    res.json({ message: 'Progress updated' });
  } catch (err: any) {
    console.error('[PROGRESS] Update error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/progress/:username/lives - Update lives
router.put('/:username/lives', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { lives } = req.body;
    const pool = await getPool();
    await pool.query(
      'UPDATE "Users" SET "Lives" = $1, "UpdatedAt" = NOW() WHERE "Username" = $2',
      [Math.max(0, Math.min(3, lives)), req.params.username]
    );
    res.json({ message: 'Lives updated' });
  } catch (err: any) {
    console.error('[PROGRESS] Lives error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;