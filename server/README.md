# NOT MY STYLE - Server

Backend Express.js + TypeScript yang terhubung ke **Microsoft SQL Server**.

## Setup

### 1. Buat Database
Jalankan `database_schema.sql` di SSMS (SQL Server Management Studio).

### 2. Konfigurasi `.env`
Edit file `.env` sesuai dengan konfigurasi SQL Server kamu:

```env
DB_SERVER=NAMA_SERVER_KAMU   # contoh: localhost\SQLEXPRESS
DB_NAME=NotMyStyle
DB_USER=sa
DB_PASSWORD=password_kamu
```

> **Tips format DB_SERVER:**
> - SQL Server Express lokal: `localhost\SQLEXPRESS`
> - Named instance: `NAMA_KOMPUTER\NAMA_INSTANCE`
> - Default instance: `localhost` atau `127.0.0.1`
> - Port custom: `localhost,1433`

### 3. Install & Jalankan

```bash
cd server
npm install
npm run dev    # development dengan hot-reload
# atau
npm run build && npm start   # production
```

Server berjalan di `http://localhost:3001`

## Endpoints

| Method | URL | Auth | Deskripsi |
|--------|-----|------|-----------|
| POST | /api/auth/register | - | Daftar akun baru |
| POST | /api/auth/login | - | Login |
| GET | /api/auth/me | JWT | Info user saat ini |
| GET | /api/levels | JWT | Ambil semua level |
| POST | /api/levels | JWT | Buat level baru |
| DELETE | /api/levels/:id | JWT + Developer | Hapus level |
| GET | /api/progress/:username | JWT | Progress pemain |
| PUT | /api/progress/:username | JWT | Update progress |
| PUT | /api/progress/:username/lives | JWT | Update nyawa |
| GET | /api/leaderboard | JWT | Papan peringkat |
| GET | /api/players | JWT + Developer | Daftar semua pemain |
| GET | /api/players/:username | JWT + Developer | Detail pemain |
| DELETE | /api/players/:username | JWT + Developer | Hapus pemain |
| GET | /api/health | - | Cek status koneksi DB |
