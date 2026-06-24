import pkg from 'pg';
const { Pool } = pkg;

let pool: pkg.Pool | null = null;

export async function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false // Wajib diaktifkan agar aman terkoneksi ke Supabase
      }
    });
  }
  return pool;
}