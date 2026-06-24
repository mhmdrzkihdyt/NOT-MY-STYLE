import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'NotMyStyle',
  
  // 🔽 Ubah menjadi seperti ini (Hapus kata 'sa' dan '' default) 🔽
  user: process.env.DB_USER,          // Akan dipaksa mengambil 'NOTMYSTYLE' dari .env
  password: process.env.DB_PASSWORD,  // Akan dipaksa mengambil 'Database16' dari .env
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 1433, // Kunci jalur ke port 1433
  
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    console.log('[DB] Connected to SQL Server');
  }
  return pool;
}

export default { getPool };