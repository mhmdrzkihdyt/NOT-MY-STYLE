import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';

const router = Router();

// GET /api/progress/:username - Get player's level progress
router.get('/:username', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('username', req.params.username)
      .query('SELECT LevelId, Stars, IsUnlocked, BestTime, Score, HintsUsed, Attempts FROM PlayerProgress WHERE Username = @username');

    const progress: Record<string, any> = {};
    for (const p of result.recordset) {
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

    // Check if progress exists for this level
    const existing = await pool.request()
      .input('username', username)
      .input('levelId', levelId)
      .query('SELECT Id, Stars, BestTime, Attempts FROM PlayerProgress WHERE Username = @username AND LevelId = @levelId');

    if (existing.recordset.length > 0) {
      // Replay: update only if better
      const old = existing.recordset[0];
      const newStars = Math.max(old.Stars || 0, stars || 0);
      const newBestTime = (timeUsed !== undefined && (old.BestTime === null || timeUsed < old.BestTime)) ? timeUsed : old.BestTime;

      await pool.request()
        .input('id', old.Id)
        .input('stars', newStars)
        .input('bestTime', newBestTime)
        .input('score', score || 0)
        .input('hintsUsed', hintsUsed || 0)
        .input('attempts', (old.Attempts || 0) + 1)
        .query(`UPDATE PlayerProgress SET Stars = @stars, BestTime = @bestTime, Score = @score,
                HintsUsed = @hintsUsed, Attempts = @attempts, UpdatedAt = GETDATE() WHERE Id = @id`);

      // Update user totals only on first completion (Attempts was 0 before this update)
      if (old.Attempts === 0) {
        await pool.request()
          .input('username', username)
          .input('score', score || 0)
          .input('stars', stars || 0)
          .input('timeUsed', timeUsed || 0)
          .query(`UPDATE Users SET TotalScore = TotalScore + @score, LevelsPlayed = LevelsPlayed + 1,
                  TotalStars = TotalStars + @stars, TotalTime = TotalTime + @timeUsed,
                  UpdatedAt = GETDATE() WHERE Username = @username`);
      } else if (timeUsed !== undefined && timeUsed < (old.BestTime || Infinity)) {
        // Faster time on replay: adjust totalTime
        const diff = (old.BestTime || 0) - timeUsed;
        await pool.request()
          .input('username', username)
          .input('diff', diff)
          .query('UPDATE Users SET TotalTime = TotalTime - @diff, UpdatedAt = GETDATE() WHERE Username = @username');
      }
    } else {
      // First completion — auto-ensure level exists in DB (levels may be hardcoded in frontend)
      await pool.request()
        .input('levelId', levelId)
        .query(`IF NOT EXISTS (SELECT 1 FROM Levels WHERE Id = @levelId)
                INSERT INTO Levels (Id, Title, Description, LevelType, Difficulty, HtmlStructure, TimeLimit, SortOrder)
                VALUES (@levelId, @levelId, '', 'dasar', 'Mudah', '', 60, 0)`);

      await pool.request()
        .input('username', username)
        .input('levelId', levelId)
        .input('stars', stars || 0)
        .input('bestTime', timeUsed ?? null)
        .input('score', score || 0)
        .input('hintsUsed', hintsUsed || 0)
        .query(`INSERT INTO PlayerProgress (Username, LevelId, Stars, IsUnlocked, BestTime, Score, HintsUsed, Attempts, CompletedAt)
                VALUES (@username, @levelId, @stars, 1, @bestTime, @score, @hintsUsed, 1, GETDATE())`);

      // Update user totals
      await pool.request()
        .input('username', username)
        .input('score', score || 0)
        .input('stars', stars || 0)
        .input('timeUsed', timeUsed || 0)
        .query(`UPDATE Users SET TotalScore = TotalScore + @score, LevelsPlayed = LevelsPlayed + 1,
                TotalStars = TotalStars + @stars, TotalTime = TotalTime + @timeUsed,
                UpdatedAt = GETDATE() WHERE Username = @username`);
    }

    // Unlock next level if provided
    if (unlockNextLevelId) {
      // Auto-ensure next level exists in DB too
      await pool.request()
        .input('levelId', unlockNextLevelId)
        .query(`IF NOT EXISTS (SELECT 1 FROM Levels WHERE Id = @levelId)
                INSERT INTO Levels (Id, Title, Description, LevelType, Difficulty, HtmlStructure, TimeLimit, SortOrder)
                VALUES (@levelId, @levelId, '', 'dasar', 'Mudah', '', 60, 0)`);

      await pool.request()
        .input('username', username)
        .input('levelId', unlockNextLevelId)
        .query(`IF NOT EXISTS (SELECT 1 FROM PlayerProgress WHERE Username = @username AND LevelId = @levelId)
                INSERT INTO PlayerProgress (Username, LevelId, IsUnlocked) VALUES (@username, @levelId, 1)
                ELSE UPDATE PlayerProgress SET IsUnlocked = 1 WHERE Username = @username AND LevelId = @levelId`);
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
    await pool.request()
      .input('username', req.params.username)
      .input('lives', Math.max(0, Math.min(3, lives)))
      .query('UPDATE Users SET Lives = @lives, UpdatedAt = GETDATE() WHERE Username = @username');
    res.json({ message: 'Lives updated' });
  } catch (err: any) {
    console.error('[PROGRESS] Lives error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
