import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate, requireDeveloper } from '../middleware/auth.js';

const router = Router();

// GET /api/levels - Get all levels
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();

    // Menggunakan PostgreSQL parameter $1 untuk username
    const levelsResult = await pool.query(`
      SELECT l."Id", l."Title", l."Description", l."LevelType", l."Difficulty", l."Category",
             l."Concept", l."HtmlStructure", l."TimeLimit", l."IsLocked", l."IsUserCreated",
             l."CreatedBy", l."SortOrder"
      FROM "Levels" l
      WHERE l."IsUserCreated" = 0 OR l."CreatedBy" = $1
      ORDER BY l."SortOrder", l."Id"
    `, [req.user!.username]);

    const levelIds = levelsResult.rows.map((l: any) => l.Id);
    if (levelIds.length === 0) {
      res.json([]);
      return;
    }

    // Menggunakan fitur ANY($1) milik PostgreSQL untuk menggantikan klausa IN dinamis
    const configs = await pool.query(`
      SELECT "LevelId", "PropertyName", "InitialValue", "TargetValue", "SortOrder"
      FROM "LevelPropertyConfigs" 
      WHERE "LevelId" = ANY($1)
      ORDER BY "SortOrder"
    `, [levelIds]);

    // Group configs by level
    const configsByLevel: Record<string, any[]> = {};
    for (const c of configs.rows) {
      if (!configsByLevel[c.LevelId]) configsByLevel[c.LevelId] = [];
      configsByLevel[c.LevelId].push({
        name: c.PropertyName,
        initialValue: c.InitialValue,
        targetValue: c.TargetValue,
      });
    }

    // Build level objects
    const levels = levelsResult.rows.map((l: any) => ({
      id: l.Id,
      title: l.Title,
      description: l.Description,
      levelType: l.LevelType,
      difficulty: l.Difficulty,
      category: l.Category,
      concept: l.Concept,
      htmlStructure: l.HtmlStructure,
      timeLimit: l.TimeLimit,
      isLocked: !!l.IsLocked,
      isUserCreated: !!l.IsUserCreated,
      createdBy: l.CreatedBy,
      propertyConfigs: configsByLevel[l.Id] || [],
    }));

    res.json(levels);
  } catch (err: any) {
    console.error('[LEVELS] Get error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/levels - Create a new level
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id, title, description, levelType, difficulty, category, concept, htmlStructure, timeLimit, propertyConfigs } = req.body;

    if (!id || !title || !htmlStructure || !propertyConfigs?.length) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const pool = await getPool();

    // Check if level already exists
    const existing = await pool.query(
      'SELECT "Id" FROM "Levels" WHERE "Id" = $1', 
      [id]
    );
    if (existing.rows.length > 0) {
      res.status(409).json({ error: 'Level already exists' });
      return;
    }

    const isUserCreated = req.user!.role !== 'developer';
    const createdBy = isUserCreated ? req.user!.username : null;

    // PostgreSQL menggunakan integer 1/0 untuk bit/boolean jika tipe kolomnya integer, 
    // namun jika tipe kolom Anda di Postgres adalah BOOLEAN, ganti 1 menjadi true dan 0 menjadi false.
    await pool.query(`
      INSERT INTO "Levels" ("Id", "Title", "Description", "LevelType", "Difficulty", "Category", "Concept", "HtmlStructure", "TimeLimit", "IsUserCreated", "CreatedBy", "IsLocked")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0)
    `, [
      id, 
      title, 
      description || '', 
      levelType || (isUserCreated ? 'custom' : 'tantangan'), 
      difficulty || 'Sedang', 
      category || null, 
      concept || null, 
      htmlStructure, 
      timeLimit || 120, 
      isUserCreated ? 1 : 0, 
      createdBy
    ]);

    // Insert property configs
    for (let i = 0; i < propertyConfigs.length; i++) {
      const pc = propertyConfigs[i];
      await pool.query(`
        INSERT INTO "LevelPropertyConfigs" ("LevelId", "PropertyName", "InitialValue", "TargetValue", "SortOrder")
        VALUES ($1, $2, $3, $4, $5)
      `, [id, pc.name, pc.initialValue, pc.targetValue, i]);
    }

    res.status(201).json({ id, title, message: 'Level created' });
  } catch (err: any) {
    console.error('[LEVELS] Create error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/levels/:id - Delete a level (developer only)
router.delete('/:id', authenticate, requireDeveloper, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();
    await pool.query(
      'DELETE FROM "Levels" WHERE "Id" = $1', 
      [req.params.id]
    );
    res.json({ message: 'Level deleted' });
  } catch (err: any) {
    console.error('[LEVELS] Delete error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;