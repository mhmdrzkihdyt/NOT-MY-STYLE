-- ═══════════════════════════════════════════════════════════════════════════════
-- NOT MY STYLE - Database Schema
-- Game Edukasi CSS Berbasis Visual Interaktif
-- Mata Kuliah: Interaksi Manusia dan Komputer (IMK)
-- Universitas Kuningan — 2026
--
-- Database  : NotMyStyle
-- Server    : LAPTOP-V0TM149D
-- Engine    : Microsoft SQL Server (SSMS 18+)
-- Login     : NOTMYSTYLE (SQL Server Authentication)
-- Password  : Database16
-- Pembuat   : Muhamad Rizki Hidayat
-- ═══════════════════════════════════════════════════════════════════════════════

USE master;
GO

-- ─── Buat Database ──────────────────────────────────────────────────────────

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'NotMyStyle')
    CREATE DATABASE NotMyStyle;
GO

-- ─── Buat Login NOTMYSTYLE ──────────────────────────────────────────────────
-- Login ini digunakan oleh backend (server/.env) untuk koneksi ke SQL Server.
-- Pastikan password di sini sama dengan DB_PASSWORD di file server/.env

IF NOT EXISTS (SELECT name FROM sys.server_principals WHERE name = 'NOTMYSTYLE')
    CREATE LOGIN [NOTMYSTYLE] WITH PASSWORD = N'Database16', DEFAULT_DATABASE = [NotMyStyle];
GO

USE NotMyStyle;
GO

-- ─── Buat Database User untuk Login NOTMYSTYLE ──────────────────────────────
-- User ini dipetakan ke login server dan memiliki akses penuh ke database.

IF NOT EXISTS (SELECT name FROM sys.database_principals WHERE name = 'NOTMYSTYLE')
    CREATE USER [NOTMYSTYLE] FOR LOGIN [NOTMYSTYLE] WITH DEFAULT_SCHEMA = dbo;
GO

-- Berikan role db_owner agar backend bisa CRUD seluruh tabel
ALTER ROLE db_owner ADD MEMBER [NOTMYSTYLE];
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. TABEL Users
-- ═══════════════════════════════════════════════════════════════════════════════
-- Menyimpan seluruh akun yang terdaftar di sistem.
-- Role 'developer' = admin yang mengelola level dan pemain.
-- Role 'player'    = pemain yang memainkan level dan membuat level custom.

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
CREATE TABLE Users (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Name            NVARCHAR(100) NOT NULL,                          -- Nama lengkap
    Username        NVARCHAR(50)  NOT NULL UNIQUE,                   -- Username untuk login
    Email           NVARCHAR(100) NOT NULL UNIQUE,                   -- Alamat email
    Password        NVARCHAR(255) NOT NULL,                          -- Password (hashed)
    Role            NVARCHAR(20)  NOT NULL DEFAULT 'player'
                        CHECK (Role IN ('player', 'developer')),    -- Role akun
    Lives           INT           NOT NULL DEFAULT 3
                        CHECK (Lives >= 0 AND Lives <= 3),          -- Nyawa (0-3)
    TotalScore      INT           NOT NULL DEFAULT 0,                -- Akumulasi skor
    LevelsPlayed    INT           NOT NULL DEFAULT 0,                -- Jumlah level diselesaikan
    TotalStars      INT           NOT NULL DEFAULT 0,                -- Total bintang dikumpulkan
    TotalTime       INT           NOT NULL DEFAULT 0,                -- Total waktu penyelesaian (detik)
    LastReviveDate  DATE,                                            -- Tanggal terakhir revive
    CreatedAt       DATE          NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    UpdatedAt       DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. TABEL CssProperties
-- ═══════════════════════════════════════════════════════════════════════════════
-- Master data properti CSS yang dapat digunakan dalam level.
-- Terdiri dari 4 kategori: Visual, Typography, Spacing, Layout.
-- Materi pengertian dan fungsi bersumber dari MDN Web Docs (Bahasa Indonesia).

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CssProperties')
CREATE TABLE CssProperties (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    PropertyName    NVARCHAR(50)  NOT NULL UNIQUE,     -- Nama properti CSS: 'background-color'
    Label           NVARCHAR(100) NOT NULL,             -- Label tampilan: 'Background Color'
    Category        NVARCHAR(20)  NOT NULL
                        CHECK (Category IN ('Visual', 'Typography', 'Spacing', 'Layout')),
    Description     NVARCHAR(MAX) NOT NULL,             -- Deskripsi singkat
    Pengertian      NVARCHAR(MAX),                      -- Pengertian (sumber: MDN)
    Fungsi          NVARCHAR(MAX)                       -- Fungsi (sumber: MDN)
);
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. TABEL CssPropertyValues
-- ═══════════════════════════════════════════════════════════════════════════════
-- Menyimpan daftar nilai valid yang dapat dipilih untuk setiap properti CSS.
-- Contoh: font-size memiliki nilai '14px', '16px', ..., '56px'.

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'CssPropertyValues')
CREATE TABLE CssPropertyValues (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    PropertyId      INT           NOT NULL
                        REFERENCES CssProperties(Id) ON DELETE CASCADE,
    Value           NVARCHAR(100) NOT NULL,              -- Nilai CSS: '16px', 'center', '#ffffff'
    DisplayValue    NVARCHAR(100),                       -- Label tampilan: 'Center', 'White'
    SortOrder       INT           NOT NULL DEFAULT 0     -- Urutan tampilan
);
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. TABEL Levels
-- ═══════════════════════════════════════════════════════════════════════════════
-- Menyimpan definisi seluruh level dalam game.
-- Tipe level:
--   'dasar'     -- Level pembelajaran (48 level, 3 tingkat kesulitan)
--   'tantangan' -- Level evaluasi (5 level, terbuka setelah semua dasar selesai)
--   'custom'    -- Level buatan pemain (sandbox, selalu terbuka)
--
-- Tingkat kesulitan (khusus level dasar):
--   'Mudah'  -- 1 properti CSS per level (60 detik)
--   'Sedang' -- 2 properti CSS per level (90 detik)
--   'Sulit'  -- 3 properti CSS per level (120 detik)

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Levels')
CREATE TABLE Levels (
    Id              NVARCHAR(50)  PRIMARY KEY,            -- ID: 'd-v1', 't-1', 'user-1234567890'
    Title           NVARCHAR(100) NOT NULL,               -- Judul level
    Description     NVARCHAR(MAX) NOT NULL,               -- Narasi instruksi
    LevelType       NVARCHAR(20)  NOT NULL
                        CHECK (LevelType IN ('dasar', 'tantangan', 'custom')),
    Difficulty      NVARCHAR(10)  NOT NULL
                        CHECK (Difficulty IN ('Mudah', 'Sedang', 'Sulit')),
    Category        NVARCHAR(20)
                        CHECK (Category IN ('Visual', 'Typography', 'Spacing', 'Layout')),
    Concept         NVARCHAR(100),                        -- Konsep IMK yang dipelajari
    HtmlStructure   NVARCHAR(MAX) NOT NULL,               -- Struktur HTML target
    TimeLimit       INT           NOT NULL,               -- Batas waktu (detik)
    IsLocked        BIT           NOT NULL DEFAULT 0,     -- Status terkunci (0=false, 1=true)
    IsUserCreated   BIT           NOT NULL DEFAULT 0,     -- Buatan user (0=false, 1=true)
    CreatedBy       NVARCHAR(50)
                        REFERENCES Users(Username) ON DELETE SET NULL,
    SortOrder       INT           NOT NULL DEFAULT 0,     -- Urutan dalam kategori
    CreatedAt       DATETIME      NOT NULL DEFAULT GETDATE()
);
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. TABEL LevelPropertyConfigs
-- ═══════════════════════════════════════════════════════════════════════════════
-- Menyimpan konfigurasi properti CSS untuk setiap level.
-- Setiap level memiliki 1-16 properti dengan nilai awal (initial) dan target.
-- Pemain harus mengubah nilai awal menjadi nilai target agar level selesai.

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LevelPropertyConfigs')
CREATE TABLE LevelPropertyConfigs (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    LevelId         NVARCHAR(50)  NOT NULL
                        REFERENCES Levels(Id) ON DELETE CASCADE,
    PropertyName    NVARCHAR(50)  NOT NULL
                        REFERENCES CssProperties(PropertyName),
    InitialValue    NVARCHAR(100) NOT NULL,               -- Nilai awal yang dilihat pemain
    TargetValue     NVARCHAR(100) NOT NULL,               -- Nilai target yang harus dicapai
    SortOrder       INT           NOT NULL DEFAULT 0      -- Urutan properti dalam level
);
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. TABEL PlayerProgress
-- ═══════════════════════════════════════════════════════════════════════════════
-- Menyimpan progres setiap pemain per level.
-- Setiap pasangan (Username, LevelId) bersifat unik.

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'PlayerProgress')
CREATE TABLE PlayerProgress (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    Username        NVARCHAR(50)  NOT NULL
                        REFERENCES Users(Username) ON DELETE CASCADE,
    LevelId         NVARCHAR(50)  NOT NULL
                        REFERENCES Levels(Id) ON DELETE CASCADE,
    Stars           INT           CHECK (Stars >= 0 AND Stars <= 3),
    IsUnlocked      BIT           NOT NULL DEFAULT 0,     -- 0=false, 1=true
    BestTime        INT,                                   -- Waktu tercepat (detik)
    Score           INT,                                   -- Skor (0-100)
    HintsUsed       INT           NOT NULL DEFAULT 0,     -- Jumlah hint dipakai
    Attempts        INT           NOT NULL DEFAULT 0,     -- Jumlah percobaan
    CompletedAt     DATETIME,
    CreatedAt       DATETIME      NOT NULL DEFAULT GETDATE(),
    UpdatedAt       DATETIME      NOT NULL DEFAULT GETDATE(),

    CONSTRAINT UQ_PlayerProgress_Username_Level UNIQUE (Username, LevelId)
);
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. VIEW Leaderboard
-- ═══════════════════════════════════════════════════════════════════════════════
-- Peringkat pemain berdasarkan:
--   1. Semua Level Dasar selesai (prioritas tertinggi)
--   2. Total skor tertinggi
--   3. Total waktu tercepat (tie-breaker)
--
-- Catatan: Score dihitung dari formula:
--   base_score * time_factor - hint_penalty
--   time_factor = 0.5 + (timeLeft / timeLimit) * 0.5
--   hint_penalty = hintsUsed * 15

IF EXISTS (SELECT * FROM sys.views WHERE name = 'Leaderboard')
    DROP VIEW Leaderboard;
GO

CREATE VIEW Leaderboard AS
SELECT TOP 100 PERCENT
    u.Username,
    u.Name,
    u.TotalScore,
    u.LevelsPlayed,
    u.TotalStars,
    u.TotalTime,
    RANK() OVER (
        ORDER BY
            CASE WHEN u.LevelsPlayed >= (SELECT COUNT(*) FROM Levels WHERE LevelType = 'dasar')
                 THEN 0 ELSE 1 END ASC,
            u.TotalScore DESC,
            u.TotalTime ASC
    ) AS Rank
FROM Users u
WHERE u.Role = 'player'
ORDER BY Rank;
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════════

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Username')
    CREATE INDEX IX_Users_Username ON Users(Username);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Users_Role')
    CREATE INDEX IX_Users_Role ON Users(Role);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Levels_LevelType')
    CREATE INDEX IX_Levels_LevelType ON Levels(LevelType);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Levels_Difficulty')
    CREATE INDEX IX_Levels_Difficulty ON Levels(Difficulty);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Levels_Category')
    CREATE INDEX IX_Levels_Category ON Levels(Category);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Levels_CreatedBy')
    CREATE INDEX IX_Levels_CreatedBy ON Levels(CreatedBy);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_LvConfig_LevelId')
    CREATE INDEX IX_LvConfig_LevelId ON LevelPropertyConfigs(LevelId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_LvConfig_PropertyName')
    CREATE INDEX IX_LvConfig_PropertyName ON LevelPropertyConfigs(PropertyName);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Progress_Username')
    CREATE INDEX IX_Progress_Username ON PlayerProgress(Username);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Progress_LevelId')
    CREATE INDEX IX_Progress_LevelId ON PlayerProgress(LevelId);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Progress_Stars')
    CREATE INDEX IX_Progress_Stars ON PlayerProgress(Stars);
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_PropValues_PropertyId')
    CREATE INDEX IX_PropValues_PropertyId ON CssPropertyValues(PropertyId);
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA: CSS Properties (16 properti, 4 kategori)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Visual
IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'background-color')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('background-color', 'Background Color', 'Visual', N'Warna latar belakang elemen',
            N'Properti CSS untuk mengatur warna latar belakang suatu elemen HTML.',
            N'Memberikan warna dasar pada elemen agar konten lebih menonjol, menarik, dan mudah dibaca.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'color')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('color', 'Text Color', 'Visual', N'Warna teks elemen',
            N'Properti CSS untuk mengatur warna teks (huruf) di dalam elemen.',
            N'Mengatur warna tulisan agar kontras dengan latar belakang dan nyaman dibaca oleh pengguna.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'border-radius')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('border-radius', 'Border Radius', 'Visual', N'Sudut melengkung',
            N'Properti CSS untuk mengatur tingkat kelengkungan sudut pada elemen.',
            N'Membuat sudut elemen menjadi membulat sehingga tampilan terlihat lebih lembut dan modern.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'opacity')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('opacity', 'Opacity', 'Visual', N'Tingkat transparansi',
            N'Properti CSS untuk mengatur tingkat transparansi elemen, dari 0 (tidak terlihat) hingga 1 (penuh).',
            N'Mengatur seberapa transparan elemen ditampilkan, berguna untuk efek visual dan hierarki konten.');

-- Typography
IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'font-size')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('font-size', 'Font Size', 'Typography', N'Ukuran teks',
            N'Properti CSS untuk mengatur ukuran huruf atau teks pada elemen.',
            N'Menentukan besar kecilnya teks agar sesuai dengan hierarki informasi dan mudah dibaca.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'font-weight')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('font-weight', 'Font Weight', 'Typography', N'Ketebalan teks',
            N'Properti CSS untuk mengatur ketebalan huruf, dari tipis (400) hingga tebal (800).',
            N'Memberikan penekanan visual pada teks tertentu, misalnya judul yang harus lebih tebal dari paragraf.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'text-align')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('text-align', 'Text Align', 'Typography', N'Perataan teks horizontal',
            N'Properti CSS untuk mengatur perataan horizontal teks dalam elemen (kiri, tengah, atau kanan).',
            N'Mengatur posisi teks agar rata kiri, tengah, atau kanan sesuai kebutuhan desain.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'letter-spacing')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('letter-spacing', 'Letter Spacing', 'Typography', N'Jarak antar huruf',
            N'Properti CSS untuk mengatur jarak antar huruf dalam teks.',
            N'Menambah atau mengurangi spasi antar huruf untuk meningkatkan keterbacaan atau efek tipografi.');

-- Spacing
IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'padding')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('padding', 'Padding', 'Spacing', N'Jarak dalam elemen',
            N'Properti CSS untuk mengatur jarak antara konten dan border (batas) elemen.',
            N'Memberikan ruang di dalam elemen agar konten tidak terlalu rapat dengan tepi elemen.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'margin')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('margin', 'Margin', 'Spacing', N'Jarak luar elemen',
            N'Properti CSS untuk mengatur jarak luar elemen terhadap elemen lain di sekitarnya.',
            N'Memberikan ruang di luar elemen agar tidak menempel dengan elemen tetangga.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'gap')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('gap', 'Gap', 'Spacing', N'Jarak antar child elemen',
            N'Properti CSS untuk mengatur jarak antar child elemen di dalam container flex atau grid.',
            N'Mengatur jarak seragam antar item dalam layout flexbox atau grid tanpa perlu margin individual.');

-- Layout
IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'display')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('display', 'Display', 'Layout', N'Tipe tampilan elemen',
            N'Properti CSS untuk mengatur bagaimana elemen ditampilkan (block, flex, grid, dll).',
            N'Menentukan jenis layout elemen, apakah blok penuh, fleksibel, atau inline.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'width')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('width', 'Width', 'Layout', N'Lebar elemen',
            N'Properti CSS untuk mengatur lebar suatu elemen.',
            N'Menentukan seberapa lebar elemen ditampilkan agar sesuai dengan desain halaman.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'height')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('height', 'Height', 'Layout', N'Tinggi elemen',
            N'Properti CSS untuk mengatur tinggi suatu elemen.',
            N'Menentukan seberapa tinggi elemen ditampilkan agar proporsional dengan konten di dalamnya.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'align-items')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('align-items', 'Align Items', 'Layout', N'Perataan vertikal child',
            N'Properti CSS untuk mengatur perataan vertikal child elemen dalam container flex.',
            N'Memposisikan item anak secara vertikal: di atas, tengah, bawah, atau meregang penuh.');

IF NOT EXISTS (SELECT 1 FROM CssProperties WHERE PropertyName = 'justify-content')
    INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi)
    VALUES ('justify-content', 'Justify Content', 'Layout', N'Perataan horizontal child',
            N'Properti CSS untuk mengatur perataan horizontal child elemen dalam container flex.',
            N'Memposisikan item anak secara horizontal: di awal, tengah, akhir, atau tersebar merata.');
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA: CSS Property Values
-- ═══════════════════════════════════════════════════════════════════════════════

DECLARE @PropId INT;

-- Background Color
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'background-color');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '#ffffff', 'White', 1), (@PropId, '#f3f4f6', 'Gray', 2), (@PropId, '#fef3c7', 'Yellow', 3),
    (@PropId, '#dbeafe', 'Blue', 4),  (@PropId, '#fee2e2', 'Red', 5),  (@PropId, '#d1fae5', 'Green', 6),
    (@PropId, '#ede9fe', 'Purple', 7),(@PropId, '#1f2937', 'Dark', 8), (@PropId, '#111827', 'Black', 9);
END

-- Text Color
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'color');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '#111827', 'Black', 1),      (@PropId, '#374151', 'Gray', 2),
    (@PropId, '#6b7280', 'Light Gray', 3),  (@PropId, '#ffffff', 'White', 4),
    (@PropId, '#1d4ed8', 'Blue', 5),        (@PropId, '#dc2626', 'Red', 6),
    (@PropId, '#16a34a', 'Green', 7),       (@PropId, '#9333ea', 'Purple', 8),
    (@PropId, '#f59e0b', 'Amber', 9);
END

-- Border Radius
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'border-radius');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '0px', '0px', 1),   (@PropId, '4px', '4px', 2),   (@PropId, '8px', '8px', 3),
    (@PropId, '12px', '12px', 4), (@PropId, '16px', '16px', 5), (@PropId, '20px', '20px', 6),
    (@PropId, '24px', '24px', 7), (@PropId, '50%', '50%', 8);
END

-- Opacity
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'opacity');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '0.5', '50%', 1), (@PropId, '0.75', '75%', 2),
    (@PropId, '0.9', '90%', 3), (@PropId, '1', '100%', 4);
END

-- Font Size
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'font-size');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '14px', '14px', 1), (@PropId, '16px', '16px', 2), (@PropId, '18px', '18px', 3),
    (@PropId, '20px', '20px', 4), (@PropId, '24px', '24px', 5), (@PropId, '28px', '28px', 6),
    (@PropId, '32px', '32px', 7), (@PropId, '40px', '40px', 8), (@PropId, '48px', '48px', 9),
    (@PropId, '56px', '56px', 10);
END

-- Font Weight
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'font-weight');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '400', '400', 1), (@PropId, '500', '500', 2), (@PropId, '600', '600', 3),
    (@PropId, '700', '700', 4), (@PropId, '800', '800', 5);
END

-- Text Align
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'text-align');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, 'left', 'left', 1), (@PropId, 'center', 'center', 2), (@PropId, 'right', 'right', 3);
END

-- Letter Spacing
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'letter-spacing');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '-1px', '-1px', 1), (@PropId, '0px', '0px', 2), (@PropId, '1px', '1px', 3),
    (@PropId, '2px', '2px', 4),   (@PropId, '3px', '3px', 5);
END

-- Padding
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'padding');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '8px', '8px', 1),   (@PropId, '12px', '12px', 2), (@PropId, '16px', '16px', 3),
    (@PropId, '20px', '20px', 4), (@PropId, '24px', '24px', 5), (@PropId, '32px', '32px', 6);
END

-- Margin
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'margin');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '0px', '0px', 1),   (@PropId, '8px', '8px', 2),   (@PropId, '12px', '12px', 3),
    (@PropId, '16px', '16px', 4), (@PropId, '24px', '24px', 5), (@PropId, '32px', '32px', 6);
END

-- Gap
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'gap');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '4px', '4px', 1),   (@PropId, '8px', '8px', 2),   (@PropId, '12px', '12px', 3),
    (@PropId, '16px', '16px', 4), (@PropId, '24px', '24px', 5), (@PropId, '32px', '32px', 6);
END

-- Display
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'display');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, 'block', 'Block', 1),           (@PropId, 'flex', 'Flex', 2),
    (@PropId, 'inline-block', 'Inline Block', 3), (@PropId, 'inline-flex', 'Inline Flex', 4),
    (@PropId, 'grid', 'Grid', 5);
END

-- Width
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'width');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '150px', '150px', 1), (@PropId, '200px', '200px', 2), (@PropId, '250px', '250px', 3),
    (@PropId, '300px', '300px', 4), (@PropId, '350px', '350px', 5), (@PropId, '400px', '400px', 6),
    (@PropId, '100%', '100%', 7);
END

-- Height
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'height');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, '80px', '80px', 1),   (@PropId, '120px', '120px', 2), (@PropId, '160px', '160px', 3),
    (@PropId, '200px', '200px', 4), (@PropId, '250px', '250px', 5), (@PropId, '300px', '300px', 6),
    (@PropId, 'auto', 'auto', 7);
END

-- Align Items
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'align-items');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, 'flex-start', 'Top', 1), (@PropId, 'center', 'Center', 2),
    (@PropId, 'flex-end', 'Bottom', 3),(@PropId, 'stretch', 'Stretch', 4);
END

-- Justify Content
SET @PropId = (SELECT Id FROM CssProperties WHERE PropertyName = 'justify-content');
IF NOT EXISTS (SELECT 1 FROM CssPropertyValues WHERE PropertyId = @PropId)
BEGIN
    INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) VALUES
    (@PropId, 'flex-start', 'Start', 1),         (@PropId, 'center', 'Center', 2),
    (@PropId, 'flex-end', 'End', 3),             (@PropId, 'space-between', 'Space Between', 4),
    (@PropId, 'space-around', 'Space Around', 5);
END
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA: Default Users
-- ═══════════════════════════════════════════════════════════════════════════════

IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'developer1')
    INSERT INTO Users (Name, Username, Email, Password, Role, Lives, CreatedAt)
    VALUES (N'Muhamad Rizki Hidayat', 'developer1', 'developer@notmystyle.com', 'dev123', 'developer', 3, '2026-06-01');

IF NOT EXISTS (SELECT 1 FROM Users WHERE Username = 'player1')
    INSERT INTO Users (Name, Username, Email, Password, Role, Lives, CreatedAt)
    VALUES (N'Player Satu', 'player1', 'player1@email.com', 'player123', 'player', 3, '2026-06-01');
GO

-- ═══════════════════════════════════════════════════════════════════════════════
-- DOKUMENTASI: RELASI ANTAR TABEL
-- ═══════════════════════════════════════════════════════════════════════════════
--
--  Users (1) ───────── (*) PlayerProgress
--    └─ Satu user memiliki banyak progres level
--
--  Users (1) ───────── (*) Levels (custom)
--    └─ Satu user dapat membuat banyak level custom
--
--  Levels (1) ──────── (*) LevelPropertyConfigs
--    └─ Satu level memiliki 1-16 konfigurasi properti CSS
--
--  Levels (1) ──────── (*) PlayerProgress
--    └─ Satu level dapat dimainkan oleh banyak pemain
--
--  CssProperties (1) ─ (*) CssPropertyValues
--    └─ Satu properti memiliki banyak nilai valid
--
--  CssProperties (1) ─ (*) LevelPropertyConfigs
--    └─ Satu properti dapat digunakan di banyak level
--
-- ═══════════════════════════════════════════════════════════════════════════════
-- DOKUMENTASI: ATURAN UNLOCK LEVEL
-- ═══════════════════════════════════════════════════════════════════════════════
--
--  Level Dasar - Mudah:    Selalu terbuka untuk semua pemain
--  Level Dasar - Sedang:   Membutuhkan minimal 32 dari 48 bintang di tingkat Mudah
--  Level Dasar - Sulit:    Membutuhkan minimal 32 dari 48 bintang di tingkat Sedang
--  Level Tantangan:        Terbuka setelah seluruh 48 Level Dasar diselesaikan
--  Level Custom:           Selalu terbuka (dibuat dan dimainkan oleh pemain sendiri)
--
-- ═══════════════════════════════════════════════════════════════════════════════
-- DOKUMENTASI: SISTEM BINTANG
-- ═══════════════════════════════════════════════════════════════════════════════
--
--  3 bintang:  Tanpa hint DAN sisa waktu > 50% dari TimeLimit
--  2 bintang:  Sisa waktu <= 50% ATAU menggunakan tepat 1 hint
--  1 bintang:  Menggunakan lebih dari 1 hint
--  0 bintang:  Gagal menyelesaikan level (nyawa habis / waktu habis)
--
-- ═══════════════════════════════════════════════════════════════════════════════
-- DOKUMENTASI: SISTEM SKOR
-- ═══════════════════════════════════════════════════════════════════════════════
--
--  Skor awal:         100 poin
--  Setiap hint:       -10 poin
--  Skor minimum:      0 poin
--  Skor disimpan ke:  PlayerProgress.Score dan Users.TotalScore
--
-- ═══════════════════════════════════════════════════════════════════════════════
-- DOKUMENTASI: SISTEM NYAWA
-- ═══════════════════════════════════════════════════════════════════════════════
--
--  Nyawa awal:        3 per akun
--  Jawaban salah:     -1 nyawa (level diulang dari awal)
--  Waktu habis:       -1 nyawa (level diulang dari awal)
--  Nyawa = 0:         Auto-exit ke gallery, popup pemulihan nyawa muncul
--  Pemulihan nyawa:   Menjawab pertanyaan (1x sehari), lalu countdown 5 menit/nyawa
--  Nyawa disimpan ke: Users.Lives
--
-- ═══════════════════════════════════════════════════════════════════════════════
-- © 2026 Not My Style | Muhamad Rizki Hidayat
-- ═══════════════════════════════════════════════════════════════════════════════

PRINT N'Database schema dan seed data berhasil dibuat.';
GO
