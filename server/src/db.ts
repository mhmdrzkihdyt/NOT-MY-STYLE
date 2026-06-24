import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

// Supports both DATABASE_URL (Vercel env var name) and DB_URL (local .env name)
const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

if (!connectionString) {
  console.error('[DB] No database URL found. Set DATABASE_URL or DB_URL in .env');
}

let pool: pkg.Pool | null = null;

export async function getPool(): Promise<pkg.Pool> {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: process.env.DB_SSL === 'false'
        ? false
        : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    // Validate connection
    await pool.query('SELECT 1');
    console.log('[DB] Connected to PostgreSQL');
  }
  return pool;
}

export default { getPool };
