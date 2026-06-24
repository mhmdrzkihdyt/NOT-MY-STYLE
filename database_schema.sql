-- ═══════════════════════════════════════════════════════════════════════════════
-- NOT MY STYLE - Database Schema (PostgreSQL / Supabase Version)
-- Game Edukasi CSS Berbasis Visual Interaktif
-- Mata Kuliah: Interaksi Manusia dan Komputer (IMK)
-- Universitas Kuningan — 2026
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── Bersihkan Tabel Jika Sudah Ada (Opsional untuk Reset) ───────────────────
DROP VIEW IF EXISTS Leaderboard;
DROP TABLE IF EXISTS PlayerProgress CASCADE;
DROP TABLE IF EXISTS LevelPropertyConfigs CASCADE;
DROP TABLE IF EXISTS Levels CASCADE;
DROP TABLE IF EXISTS CssPropertyValues CASCADE;
DROP TABLE IF EXISTS CssProperties CASCADE;
DROP TABLE IF EXISTS Users CASCADE;

-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. TABEL Users
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE Users (
    Id              SERIAL PRIMARY KEY,
    Name            VARCHAR(100) NOT NULL,                                  -- Nama lengkap
    Username        VARCHAR(50)  NOT NULL UNIQUE,                           -- Username untuk login
    Email           VARCHAR(100) NOT NULL UNIQUE,                           -- Alamat email
    Password        VARCHAR(255) NOT NULL,                                  -- Password (hashed)
    Role            VARCHAR(20)  NOT NULL DEFAULT 'player'
                        CHECK (Role IN ('player', 'developer')),            -- Role akun
    Lives           INT           NOT NULL DEFAULT 3
                        CHECK (Lives >= 0 AND Lives <= 3),                  -- Nyawa (0-3)
    TotalScore      INT           NOT NULL DEFAULT 0,                        -- Akumulasi skor
    LevelsPlayed    INT           NOT NULL DEFAULT 0,                        -- Jumlah level diselesaikan
    TotalStars      INT           NOT NULL DEFAULT 0,                        -- Total bintang dikumpulkan
    TotalTime       INT           NOT NULL DEFAULT 0,                        -- Total waktu penyelesaian (detik)
    LastReviveDate  DATE,                                                    -- Tanggal terakhir revive
    CreatedAt       DATE          NOT NULL DEFAULT CURRENT_DATE,
    UpdatedAt       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. TABEL CssProperties
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE CssProperties (
    Id              SERIAL PRIMARY KEY,
    PropertyName    VARCHAR(50)  NOT NULL UNIQUE,     -- Nama properti CSS: 'background-color'
    Label           VARCHAR(100) NOT NULL,             -- Label tampilan: 'Background Color'
    Category        VARCHAR(20)  NOT NULL
                        CHECK (Category IN ('Visual', 'Typography', 'Spacing', 'Layout')),
    Description     TEXT NOT NULL,                     -- Deskripsi singkat
    Pengertian      TEXT,                              -- Pengertian (sumber: MDN)
    Fungsi          TEXT                               -- Fungsi (sumber: MDN)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. TABEL CssPropertyValues
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE CssPropertyValues (
    Id              SERIAL PRIMARY KEY,
    PropertyId      INT           NOT NULL
                        REFERENCES CssProperties(Id) ON DELETE CASCADE,
    Value           VARCHAR(100) NOT NULL,              -- Nilai CSS: '16px', 'center', '#ffffff'
    DisplayValue    VARCHAR(100),                       -- Label tampilan: 'Center', 'White'
    SortOrder       INT           NOT NULL DEFAULT 0     -- Urutan tampilan
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. TABEL Levels
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE Levels (
    Id              VARCHAR(50)  PRIMARY KEY,             -- ID: 'd-v1', 't-1', 'user-1234567890'
    Title           VARCHAR(100) NOT NULL,               -- Judul level
    Description     TEXT NOT NULL,                       -- Narasi instruksi
    LevelType       VARCHAR(20)  NOT NULL
                        CHECK (LevelType IN ('dasar', 'tantangan', 'custom')),
    Difficulty      VARCHAR(10)  NOT NULL
                        CHECK (Difficulty IN ('Mudah', 'Sedang', 'Sulit')),
    Category        VARCHAR(20)
                        CHECK (Category IN ('Visual', 'Typography', 'Spacing', 'Layout')),
    Concept         VARCHAR(100),                        -- Konsep IMK yang dipelajari
    HtmlStructure   TEXT NOT NULL,                       -- Struktur HTML target
    TimeLimit       INT           NOT NULL,               -- Batas waktu (detik)
    IsLocked        BOOLEAN       NOT NULL DEFAULT FALSE, -- Status terkunci
    IsUserCreated   BOOLEAN       NOT NULL DEFAULT FALSE, -- Buatan user
    CreatedBy       VARCHAR(50)
                        REFERENCES Users(Username) ON DELETE SET NULL,
    SortOrder       INT           NOT NULL DEFAULT 0,     -- Urutan dalam kategori
    CreatedAt       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. TABEL LevelPropertyConfigs
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE LevelPropertyConfigs (
    Id              SERIAL PRIMARY KEY,
    LevelId         VARCHAR(50)  NOT NULL
                        REFERENCES Levels(Id) ON DELETE CASCADE,
    PropertyName    VARCHAR(50)  NOT NULL
                        REFERENCES CssProperties(PropertyName),
    InitialValue    VARCHAR(100) NOT NULL,               -- Nilai awal yang dilihat pemain
    TargetValue     VARCHAR(100) NOT NULL,               -- Nilai target yang harus dicapai
    SortOrder       INT           NOT NULL DEFAULT 0      -- Urutan properti dalam level
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. TABEL PlayerProgress
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE PlayerProgress (
    Id              SERIAL PRIMARY KEY,
    Username        VARCHAR(50)  NOT NULL
                        REFERENCES Users(Username) ON DELETE CASCADE,
    LevelId         VARCHAR(50)  NOT NULL
                        REFERENCES Levels(Id) ON DELETE CASCADE,
    Stars           INT           CHECK (Stars >= 0 AND Stars <= 3),
    IsUnlocked      BOOLEAN       NOT NULL DEFAULT FALSE,
    BestTime        INT,                                   -- Waktu tercepat (detik)
    Score           INT,                                   -- Skor (0-100)
    HintsUsed       INT           NOT NULL DEFAULT 0,     -- Jumlah hint dipakai
    Attempts        INT           NOT NULL DEFAULT 0,     -- Jumlah percobaan
    CompletedAt     TIMESTAMP,
    CreatedAt       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT UQ_PlayerProgress_Username_Level UNIQUE (Username, LevelId)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. VIEW Leaderboard
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE VIEW Leaderboard AS
SELECT 
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

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE INDEX IX_Users_Username ON Users(Username);
CREATE INDEX IX_Users_Role ON Users(Role);
CREATE INDEX IX_Levels_LevelType ON Levels(LevelType);
CREATE INDEX IX_Levels_Difficulty ON Levels(Difficulty);
CREATE INDEX IX_Levels_Category ON Levels(Category);
CREATE INDEX IX_Levels_CreatedBy ON Levels(CreatedBy);
CREATE INDEX IX_LvConfig_LevelId ON LevelPropertyConfigs(LevelId);
CREATE INDEX IX_LvConfig_PropertyName ON LevelPropertyConfigs(PropertyName);
CREATE INDEX IX_Progress_Username ON PlayerProgress(Username);
CREATE INDEX IX_Progress_LevelId ON PlayerProgress(LevelId);
CREATE INDEX IX_Progress_Stars ON PlayerProgress(Stars);
CREATE INDEX IX_PropValues_PropertyId ON CssPropertyValues(PropertyId);


-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA: CSS Properties (16 properti, 4 kategori)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Visual
INSERT INTO CssProperties (PropertyName, Label, Category, Description, Pengertian, Fungsi) VALUES 
('background-color', 'Background Color', 'Visual', 'Warna latar belakang elemen', 'Properti CSS untuk mengatur warna latar belakang suatu elemen HTML.', 'Memberikan warna dasar pada elemen agar konten lebih menonjol, menarik, dan mudah dibaca.'),
('color', 'Text Color', 'Visual', 'Warna teks elemen', 'Properti CSS untuk mengatur warna teks (huruf) di dalam elemen.', 'Mengatur warna tulisan agar kontras dengan latar belakang dan nyaman dibaca oleh pengguna.'),
('border-radius', 'Border Radius', 'Visual', 'Sudut melengkung', 'Properti CSS untuk mengatur tingkat kelengkungan sudut pada elemen.', 'Membuat sudut elemen menjadi membulat sehingga tampilan terlihat lebih lembut dan modern.'),
('opacity', 'Opacity', 'Visual', 'Tingkat transparansi', 'Properti CSS untuk mengatur tingkat transparansi elemen, dari 0 (tidak terlihat) hingga 1 (penuh).', 'Mengatur seberapa transparan elemen ditampilkan, berguna untuk efek visual dan hierarki konten.'),

-- Typography
('font-size', 'Font Size', 'Typography', 'Ukuran teks', 'Properti CSS untuk mengatur ukuran huruf atau teks pada elemen.', 'Menentukan besar kecilnya teks agar sesuai dengan hierarki informasi dan mudah dibaca.'),
('font-weight', 'Font Weight', 'Typography', 'Ketebalan teks', 'Properti CSS untuk mengatur ketebalan huruf, dari tipis (400) hingga tebal (800).', 'Memberikan penekanan visual pada teks tertentu, misalnya judul yang harus lebih tebal dari paragraf.'),
('text-align', 'Text Align', 'Typography', 'Perataan teks horizontal', 'Properti CSS untuk mengatur perataan horizontal teks dalam elemen (kiri, tengah, atau kanan).', 'Mengatur posisi teks agar rata kiri, tengah, atau kanan sesuai kebutuhan desain.'),
('letter-spacing', 'Letter Spacing', 'Typography', 'Jarak antar huruf', 'Properti CSS untuk mengatur jarak antar huruf dalam teks.', 'Menambah atau magnifying spasi antar huruf untuk meningkatkan keterbacaan atau efek tipografi.'),

-- Spacing
('padding', 'Padding', 'Spacing', 'Jarak dalam elemen', 'Properti CSS untuk mengatur jarak antara konten dan border (batas) elemen.', 'Memberikan ruang di dalam elemen agar konten tidak terlalu rapat dengan tepi elemen.'),
('margin', 'Margin', 'Spacing', 'Jarak luar elemen', 'Properti CSS untuk mengatur jarak luar elemen terhadap elemen lain di sekitarnya.', 'Memberikan ruang di luar elemen agar tidak menempel dengan elemen tetangga.'),
('gap', 'Gap', 'Spacing', 'Jarak antar child elemen', 'Properti CSS untuk mengatur jarak antar child elemen di dalam container flex atau grid.', 'Mengatur jarak seragam antar item dalam layout flexbox atau grid tanpa perlu margin individual.'),

-- Layout
('display', 'Display', 'Layout', 'Tipe tampilan elemen', 'Properti CSS untuk mengatur bagaimana elemen ditampilkan (block, flex, grid, dll).', 'Menentukan jenis layout elemen, apakah blok penuh, fleksibel, atau inline.'),
('width', 'Width', 'Layout', 'Lebar elemen', 'Properti CSS untuk mengatur lebar suatu elemen.', 'Menentukan seberapa lebar elemen ditampilkan agar sesuai dengan desain halaman.'),
('height', 'Height', 'Layout', 'Tinggi elemen', 'Properti CSS untuk mengatur tinggi suatu elemen.', 'Menentukan seberapa tinggi elemen ditampilkan agar proporsional dengan konten di dalamnya.'),
('align-items', 'Align Items', 'Layout', 'Perataan vertikal child', 'Properti CSS untuk mengatur perataan vertikal child elemen dalam container flex.', 'Memposisikan item anak secara vertikal: di atas, tengah, bawah, atau meregang penuh.'),
('justify-content', 'Justify Content', 'Layout', 'Perataan horizontal child', 'Properti CSS untuk mengatur perataan horizontal child elemen dalam container flex.', 'Memposisikan item anak secara horizontal: di awal, tengah, akhir, atau tersebar merata.')
ON CONFLICT (PropertyName) DO NOTHING;


-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA: CSS Property Values
-- ═══════════════════════════════════════════════════════════════════════════════

-- Background Color
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('#ffffff', 'White', 1), ('#f3f4f6', 'Gray', 2), ('#fef3c7', 'Yellow', 3),
('#dbeafe', 'Blue', 4),  ('#fee2e2', 'Red', 5),  ('#d1fae5', 'Green', 6),
('#ede9fe', 'Purple', 7),('#1f2937', 'Dark', 8), ('#111827', 'Black', 9)
) AS v(val, disp, sort) WHERE PropertyName = 'background-color';

-- Text Color
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('#111827', 'Black', 1),      ('#374151', 'Gray', 2),
('#6b7280', 'Light Gray', 3), ('#ffffff', 'White', 4),
('#1d4ed8', 'Blue', 5),       ('#dc2626', 'Red', 6),
('#16a34a', 'Green', 7),      ('#9333ea', 'Purple', 8),
('#f59e0b', 'Amber', 9)
) AS v(val, disp, sort) WHERE PropertyName = 'color';

-- Border Radius
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('0px', '0px', 1),   ('4px', '4px', 2),   ('8px', '8px', 3),
('12px', '12px', 4), ('16px', '16px', 5), ('20px', '20px', 6),
('24px', '24px', 7), ('50%', '50%', 8)
) AS v(val, disp, sort) WHERE PropertyName = 'border-radius';

-- Opacity
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('0.5', '50%', 1), ('0.75', '75%', 2),
('0.9', '90%', 3), ('1', '100%', 4)
) AS v(val, disp, sort) WHERE PropertyName = 'opacity';

-- Font Size
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('14px', '14px', 1), ('16px', '16px', 2), ('18px', '18px', 3),
('20px', '20px', 4), ('24px', '24px', 5), ('28px', '28px', 6),
('32px', '32px', 7), ('40px', '40px', 8), ('48px', '48px', 9),
('56px', '56px', 10)
) AS v(val, disp, sort) WHERE PropertyName = 'font-size';

-- Font Weight
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('400', '400', 1), ('500', '500', 2), ('600', '600', 3),
('700', '700', 4), ('800', '800', 5)
) AS v(val, disp, sort) WHERE PropertyName = 'font-weight';

-- Text Align
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('left', 'left', 1), ('center', 'center', 2), ('right', 'right', 3)
) AS v(val, disp, sort) WHERE PropertyName = 'text-align';

-- Letter Spacing
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('-1px', '-1px', 1), ('0px', '0px', 2), ('1px', '1px', 3),
('2px', '2px', 4),   ('3px', '3px', 5)
) AS v(val, disp, sort) WHERE PropertyName = 'letter-spacing';

-- Padding
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('8px', '8px', 1),   ('12px', '12px', 2), ('16px', '16px', 3),
('20px', '20px', 4), ('24px', '24px', 5), ('32px', '32px', 6)
) AS v(val, disp, sort) WHERE PropertyName = 'padding';

-- Margin
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('0px', '0px', 1),   ('8px', '8px', 2),   ('12px', '12px', 3),
('16px', '16px', 4), ('24px', '24px', 5), ('32px', '32px', 6)
) AS v(val, disp, sort) WHERE PropertyName = 'margin';

-- Gap
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('4px', '4px', 1),   ('8px', '8px', 2),   ('12px', '12px', 3),
('16px', '16px', 4), ('24px', '24px', 5), ('32px', '32px', 6)
) AS v(val, disp, sort) WHERE PropertyName = 'gap';

-- Display
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('block', 'Block', 1),           ('flex', 'Flex', 2),
('inline-block', 'Inline Block', 3), ('inline-flex', 'Inline Flex', 4),
('grid', 'Grid', 5)
) AS v(val, disp, sort) WHERE PropertyName = 'display';

-- Width
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('150px', '150px', 1), ('200px', '200px', 2), ('250px', '250px', 3),
('300px', '300px', 4), ('350px', '350px', 5), ('400px', '400px', 6),
('100%', '100%', 7)
) AS v(val, disp, sort) WHERE PropertyName = 'width';

-- Height
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('80px', '80px', 1),   ('120px', '120px', 2), ('160px', '160px', 3),
('200px', '200px', 4), ('250px', '250px', 5), ('300px', '300px', 6),
('auto', 'auto', 7)
) AS v(val, disp, sort) WHERE PropertyName = 'height';

-- Align Items
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('flex-start', 'Top', 1), ('center', 'Center', 2),
('flex-end', 'Bottom', 3),('stretch', 'Stretch', 4)
) AS v(val, disp, sort) WHERE PropertyName = 'align-items';

-- Justify Content
INSERT INTO CssPropertyValues (PropertyId, Value, DisplayValue, SortOrder) 
SELECT Id, v.val, v.disp, v.sort FROM CssProperties, (VALUES 
('flex-start', 'Start', 1),          ('center', 'Center', 2),
('flex-end', 'End', 3),              ('space-between', 'Space Between', 4),
('space-around', 'Space Around', 5)
) AS v(val, disp, sort) WHERE PropertyName = 'justify-content';


-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA: Default Users
-- ═══════════════════════════════════════════════════════════════════════════════

INSERT INTO Users (Name, Username, Email, Password, Role, Lives, CreatedAt) VALUES 
('Muhamad Rizki Hidayat', 'developer1', 'developer@notmystyle.com', 'dev123', 'developer', 3, '2026-06-01'),
('Player Satu', 'player1', 'player1@email.com', 'player123', 'player', 3, '2026-06-01')
ON CONFLICT (Username) DO NOTHING;