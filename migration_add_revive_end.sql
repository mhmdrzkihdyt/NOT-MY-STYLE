-- Migration: Tambah kolom ReviveEndAt ke tabel Users
-- Jalankan di Supabase SQL Editor jika tabel sudah ada

ALTER TABLE "Users"
ADD COLUMN IF NOT EXISTS "ReviveEndAt" BIGINT DEFAULT NULL;
