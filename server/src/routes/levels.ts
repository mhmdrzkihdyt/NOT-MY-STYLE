import { Router, Response } from 'express';
import { getPool } from '../db.js';
import { AuthRequest, authenticate, requireDeveloper } from '../middleware/auth.js';

const router = Router();

// GET /api/levels - Get all levels
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pool = await getPool();

    // FIX: Added missing .input('username') so the WHERE clause works correctly
    const levelsResult = await pool.request()
      .input('username', req.user!.username)
      .query(`
        SELECT l.Id, l.Title, l.Description, l.LevelType, l.Difficulty, l.Category,
               l.Concept, l.HtmlStructure, l.TimeLimit, l.IsLocked, l.IsUserCreated,
               l.CreatedBy, l.SortOrder
        FROM Levels l
        WHERE l.IsUserCreated = 0 OR l.CreatedBy = @username
        ORDER BY l.SortOrder, l.Id
      `);

    const levelIds = levelsResult.recordset.map((l: any) => l.Id);
    if (levelIds.length === 0) {
      res.json([]);
      return;
    }

    // FIX: Removed duplicate/unused configsResult query; only one parameterized query is used
    const configsRequest = pool.request();
    levelIds.forEach((id: string, i: number) => configsRequest.input(`id${i}`, id));
    const configs = await configsRequest.query(
      `SELECT LevelId, PropertyName, InitialValue, TargetValue, SortOrder
       FROM LevelPropertyConfigs WHERE LevelId IN (${levelIds.map((_: any, i: number) => `@id${i}`).join(',')})
       ORDER BY SortOrder`
    );

    // Group configs by level
    const configsByLevel: Record<string, any[]> = {};
    for (const c of configs.recordset) {
      if (!configsByLevel[c.LevelId]) configsByLevel[c.LevelId] = [];
      configsByLevel[c.LevelId].push({
        name: c.PropertyName,
        initialValue: c.InitialValue,
        targetValue: c.TargetValue,
      });
    }

    // Build level objects
    const levels = levelsResult.recordset.map((l: any) => ({
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
    const existing = await pool.request().input('id', id).query('SELECT Id FROM Levels WHERE Id = @id');
    if (existing.recordset.length > 0) {
      res.status(409).json({ error: 'Level already exists' });
      return;
    }

    const isUserCreated = req.user!.role !== 'developer';
    const createdBy = isUserCreated ? req.user!.username : null;

    await pool.request()
      .input('id', id)
      .input('title', title)
      .input('description', description || '')
      .input('levelType', levelType || (isUserCreated ? 'custom' : 'tantangan'))
      .input('difficulty', difficulty || 'Sedang')
      .input('category', category || null)
      .input('concept', concept || null)
      .input('htmlStructure', htmlStructure)
      .input('timeLimit', timeLimit || 120)
      .input('isUserCreated', isUserCreated ? 1 : 0)
      .input('createdBy', createdBy)
      .query(`INSERT INTO Levels (Id, Title, Description, LevelType, Difficulty, Category, Concept, HtmlStructure, TimeLimit, IsUserCreated, CreatedBy, IsLocked)
              VALUES (@id, @title, @description, @levelType, @difficulty, @category, @concept, @htmlStructure, @timeLimit, @isUserCreated, @createdBy, 0)`);

    // Insert property configs
    for (let i = 0; i < propertyConfigs.length; i++) {
      const pc = propertyConfigs[i];
      await pool.request()
        .input('levelId', id)
        .input('propName', pc.name)
        .input('initVal', pc.initialValue)
        .input('targetVal', pc.targetValue)
        .input('sortOrder', i)
        .query(`INSERT INTO LevelPropertyConfigs (LevelId, PropertyName, InitialValue, TargetValue, SortOrder)
                VALUES (@levelId, @propName, @initVal, @targetVal, @sortOrder)`);
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
    await pool.request()
      .input('id', req.params.id)
      .query('DELETE FROM Levels WHERE Id = @id');
    res.json({ message: 'Level deleted' });
  } catch (err: any) {
    console.error('[LEVELS] Delete error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
