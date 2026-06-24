import pg from 'pg';
const { Pool } = pg;

let pool: pg.Pool | null = null;

export const getPool = async () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false, // wajib untuk Supabase/Render
      },
      max: 5, // batasi koneksi per instance serverless
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
};