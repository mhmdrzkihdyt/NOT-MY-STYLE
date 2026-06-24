// Contoh pengisian di db.js menggunakan Pool pg
import pg from 'pg';
const { Pool } = pg;

export const getPool = async () => {
  // Pastikan membaca 'DB_URL' sesuai yang ada di .env Anda
  const pool = new Pool({
    connectionString: process.env.DB_URL, 
    ssl: {
      rejectUnauthorized: false // Wajib diaktifkan untuk penyedia cloud seperti Supabase/Render
    }
  });
  return pool;
};