# NOT MY STYLE — Game Edukasi CSS Berbasis Visual Interaktif

> Aplikasi web interaktif untuk belajar UI/UX dan CSS melalui tantangan visual yang seru, dirancang sebagai proyek mata kuliah Interaksi Manusia dan Komputer (IMK).

---

## Daftar Isi

1. [Pendahuluan](#1-pendahuluan)
2. [Analisis Pengguna](#2-analisis-pengguna)
3. [Aktor dan Hak Akses](#3-aktor-dan-hak-akses)
4. [Deskripsi Aplikasi](#4-deskripsi-aplikasi)
5. [Perancangan Sistem](#5-perancangan-sistem)
6. [Implementasi Aplikasi](#6-implementasi-aplikasi)
7. [Penerapan Konsep IMK](#7-penerapan-konsep-imk)
8. [Kesimpulan dan Saran](#8-kesimpulan-dan-saran)

---

## 1. Pendahuluan

### 1.1 Latar Belakang

Dalam dunia pengembangan web modern, kemampuan memahami dan menerapkan CSS (Cascading Style Sheets) merupakan keterampilan fundamental yang harus dikuasai oleh setiap developer maupun desainer UI/UX. Namun, pembelajaran CSS seringkali bersifat teoritis dan kurang memberikan umpan balik visual secara langsung, sehingga banyak mahasiswa dan developer pemula kesulitan membangun intuisi desain yang baik.

Mata kuliah **Interaksi Manusia dan Komputer (IMK)** menekankan pentingnya desain antarmuka yang efektif, alignment, tipografi, konsistensi visual, dan prinsip-prinsip usability. Oleh karena itu, diperlukan sebuah media pembelajaran interaktif yang mampu menggabungkan konsep-konsep IMK dengan praktik CSS secara langsung.

**"Not My Style"** hadir sebagai solusi — sebuah game edukasi berbasis web yang menantang pemain untuk mereplikasi desain target menggunakan properti CSS secara visual-first, memberikan umpan balik instan, dan melatih intuisi desain frontend secara hands-on.

### 1.2 Tujuan

1. Membuat media pembelajaran interaktif untuk memahami konsep CSS dan prinsip IMK secara visual.
2. Melatih kemampuan pemain dalam menyelaraskan tata letak, tipografi, dan gaya visual halaman web.
3. Memberikan pengalaman belajar yang menyenangkan melalui mekanika game (skor, bintang, nyawa, timer).
4. Menyediakan platform bagi pemain dan developer untuk membuat level tantangan custom.

### 1.3 Manfaat

- **Bagi Mahasiswa**: Mempermudah pemahaman properti CSS melalui praktik langsung dengan feedback visual instan.
- **Bagi Developer Pemula**: Melatih ketelitian dalam mereplikasi desain (pixel-perfect) dan memahami hubungan antar properti CSS.
- **Bagi Pengajar**: Sebagai alat bantu pembelajaran IMK yang interaktif dan dapat diukur hasilnya melalui skor dan leaderboard.
- **Bagi Komunitas**: Platform berbagi level custom yang mendorong kolaborasi dan kreativitas.

---

## 2. Analisis Pengguna

### 2.1 Target Pengguna

| Segmentasi | Deskripsi |
|---|---|
| Mahasiswa IT/Desain | Semester awal yang sedang mempelajari HTML, CSS, dan prinsip IMK |
| Developer Pemula | Yang ingin meningkatkan kemampuan CSS dan ketelitian visual |
| Pengajar/Dosen | Yang membutuhkan alat bantu evaluasi pemahaman desain mahasiswa |
| Developer/Builder | Yang ingin membuat dan mengelola level tantangan untuk komunitas |

### 2.2 Kebutuhan Pengguna

| Kebutuhan | Deskripsi |
|---|---|
| Belajar CSS Interaktif | Memahami properti CSS dengan melihat perubahan visual secara langsung |
| Tantangan Bertahap | Level dari mudah ke sulit dengan konsep IMK yang berbeda setiap level |
| Feedback Instan | mengetahui kesalahan secara langsung dan bisa memperbaikinya |
| Sistem Penilaian | Skor, bintang, dan leaderboard sebagai motivasi belajar |
| Pembuatan Level | Kemampuan membuat tantangan custom untuk diri sendiri atau orang lain |
| Pengelolaan Akun | Registrasi, login, dan pengelolaan data pemain |

### 2.3 User Persona

**Persona 1 — Andi (Mahasiswa)**
- Usia: 19 tahun, Semester 3 Teknik Informatika
- Goal: Memahami CSS untuk proyek mata kuliah IMK
- Pain Point: Bingung menghubungkan teori CSS dengan hasil visual
- Scenario: Bermain di waktu luang untuk melatih skill CSS sebelum ujian

**Persona 2 — Bu Sari (Dosen)**
- Usia: 35 tahun, Dosen IMK
- Goal: Menilai pemahaman desain mahasiswa secara objektif
- Pain Point: Sulit mengukur kemampuan visual mahasiswa secara kuantitatif
- Scenario: Menggunakan leaderboard untuk melihat progress mahasiswa

**Persona 3 — Rizki (Developer/Builder)**
- Usia: 22 tahun, Junior Frontend Developer
- Goal: Membuat level tantangan untuk komunitas belajar
- Pain Point: Tidak ada platform untuk membuat dan membagikan soal CSS
- Scenario: Membuat level baru dan mengelolanya melalui dashboard developer

---

## 3. Aktor dan Hak Akses

### 3.1 Aktor Sistem

Sistem memiliki **2 aktor utama**:

| Aktor | Deskripsi |
|---|---|
| **Player** | Pemain biasa yang memainkan level dan membuat level custom untuk diri sendiri |
| **Developer (Builder)** | Administrator yang mengelola seluruh sistem, pemain, dan level |

### 3.2 Hak Akses Developer (Builder)

| Fitur | Akses |
|---|---|
| Melihat semua player | ✅ |
| Melihat skor & statistik player | ✅ |
| Menghapus akun player | ✅ |
| Melihat jumlah level yang dimainkan | ✅ |
| Mengelola level custom player | ✅ |
| Membuat level utama (untuk semua player) | ✅ |
| Promote level custom ke level utama | ✅ |
| Menghapus level | ✅ |
| Testing level sebelum publish | ✅ |
| Melihat leaderboard & waktu player | ✅ |

### 3.3 Hak Akses Player

| Fitur | Akses |
|---|---|
| Memainkan level utama | ✅ |
| Memainkan level custom sendiri | ✅ |
| Membuat level custom (pribadi) | ✅ |
| Melihat skor & bintang sendiri | ✅ |
| Melihat leaderboard | ✅ |
| Registrasi akun baru | ✅ |
| Mengakses hint dengan soal matematika | ✅ |
| Memulihkan nyawa | ✅ |
| Mengakses level player lain | ❌ |
| Mengelola akun player lain | ❌ |

**Kredensial Default:**

| Aktor | Username | Password |
|---|---|---|
| Developer | `developer1` | `dev123` |
| Player | `player1` | `player123` |

---

## 4. Deskripsi Aplikasi

### 4.1 Gambaran Umum

**Not My Style** adalah game edukasi CSS berbasis web di mana pemain ditantang untuk mereplikasi desain target menggunakan properti CSS melalui editor visual. Pemain melihat dua panel secara berdampingan — hasil editannya dan desain target — lalu mencocokkan keduanya hingga identik.

Setiap level memiliki fokus konsep IMK yang berbeda (Alignment, Typography, Spacing, Readability, Multi-Property), memberikan pembelajaran yang terstruktur dan bertahap.

### 4.2 Fitur Utama

**Fitur Pemain:**
- 🎮 **5 Level Built-in** dengan tingkat kesulitan bertahap (Mudah → Sulit)
- ⭐ **Sistem Bintang** (1-3 bintang berdasarkan skor: 0-60, 61-80, 81-100)
- ❤️ **Sistem Nyawa** (3 nyawa, berkurang saat jawaban salah)
- ⏱️ **Countdown Timer** per level
- 💡 **Sistem Hint** (menjawab soal matematika untuk mendapat petunjuk)
- 🏆 **Leaderboard** dengan skor dan waktu penyelesaian
- 📝 **Registrasi & Login** dengan validasi
- 🔄 **Pemulihan Nyawa** (pertanyaan 1x sehari, lalu countdown 5 menit per nyawa)
- 🛠️ **Create Level** — pemain bisa membuat level custom untuk diri sendiri

**Fitur Developer:**
- 📊 **Dashboard** dengan statistik lengkap (total player, level dimainkan, skor, level custom)
- 👥 **Manajemen Player** — lihat detail, ranking, dan hapus akun
- 🎮 **Manajemen Level** — buat level utama, promote level custom, hapus level
- 🧪 **Test Level** — uji coba level sebelum dipublikasikan
- 📈 **Ranking System** — pemain diurutkan berdasarkan: semua level selesai → skor tertinggi → waktu tercepat

### 4.3 Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Framework | React 18.3 |
| Build Tool | Vite 6.4 |
| Styling | Tailwind CSS 4.1 |
| UI Components | Radix UI, shadcn/ui |
| Icons | Lucide React |
| Animasi | Motion (Framer Motion) |
| Charts | Recharts |
| Language | TypeScript |

---

## 5. Perancangan Sistem

### 5.1 Struktur Menu

```
NOT MY STYLE
│
├── Beranda (Splash Screen)
│   └── [PLAY GAME]
│
├── Login
│   ├── Tab: Player (default)
│   ├── Tab: Developer
│   └── [Daftar Sekarang] → Register
│
├── Register (Player only)
│   └── Form: Username, Email, Password, Konfirmasi Password
│
├── Player Mode
│   ├── Header: Username | Nyawa | Leaderboard | Buat Level | Menu
│   ├── LEVEL PLAYER (level utama)
│   ├── LEVEL CUSTOM (level buatan sendiri)
│   └── Gameplay Screen
│       ├── NILAIMU (panel kiri — editable)
│       ├── NILAI TARGET (panel kanan — referensi)
│       ├── Status Bar: Nyawa, Timer, Skor, Hint
│       └── Editor CSS Terpandu
│
├── Developer Mode
│   ├── Dashboard: Overview | Players | Levels
│   └── Create Level
│       ├── PROPERTI HTML (template selector)
│       ├── PROPERTI CSS (property selector)
│       ├── PREVIEW LEVEL (dual preview)
│       └── KONFIGURASI LEVEL
```

### 5.2 Desain UI Gambaran Awal

**Skema Warna:**
- Background utama: `#0B0B16` (Dark Navy)
- Surface/Panel: `#1E1E2E` (Dark Gray)
- Aksen utama: `#FFD93D` (Gold/Yellow)
- Sukses: `#4ADE80` (Green)
- Error/Bahaya: `#FF6B6B` (Red)
- Info: `#6C5CE7` (Purple)
- Link/Action: `#1591DC` (Blue)

**Tipografi:**
- Display: Bebas Neue (heading, title)
- Body: Space Grotesk (text, labels, inputs)
- Code: Monospace (CSS properties, timer)

### 5.3 Desain Antarmuka

| Halaman | Elemen Utama |
|---|---|
| Splash Screen | Judul besar "NOT MY STYLE", animasi bintang, tombol PLAY GAME |
| Login | Tab Player/Developer, input username & password, auto-clear on error |
| Register | Form 4 field, validasi real-time, auto-redirect ke login |
| Player Gallery | Stat bar (nyawa, selesai, bintang, leaderboard), grid level cards |
| Gameplay | Split-view (NILAIMU vs NILAI TARGET), status bar, CSS editor |
| Developer Dashboard | Stat cards, ranking table, player list, level management |
| Create Level | 3-kolom: HTML templates + CSS properties, dual preview, config |

---

## 6. Implementasi Aplikasi

### 6.1 Halaman Beranda (Splash Screen)

Halaman pertama yang tampil saat aplikasi dibuka. Menampilkan:
- Judul game "NOT MY STYLE" dengan efek glow kuning
- Tagline: "Belajar UI/UX dan CSS melalui tantangan visual interaktif yang seru"
- Animasi bintang floating di background
- Tombol **PLAY GAME** yang mengarahkan ke halaman login
- Footer: "© 2026 Not My Style | Muhamad Rizki Hidayat"

### 6.2 Mode Developer

**Dashboard Overview:**
- 4 stat cards: Total Player, Level Dimainkan, Total Skor, Level Custom
- Tabel ranking player dengan kolom: #Rank, Username, Skor, Level, Bintang, Waktu, Bergabung
- Ranking: 🥇🥈🥉 berdasarkan semua level selesai → skor tertinggi → waktu tercepat

**Tab Players:**
- Daftar semua player dengan detail: username, email, skor, level, bintang, waktu, tanggal bergabung (DD-MM-YYYY)
- Tombol hapus untuk setiap player dengan pop-up konfirmasi

**Tab Levels:**
- Level Utama (built-in) dan Level Custom
- Tombol "Buat Level Baru" → masuk ke halaman Create Level
- Promote level custom ke level utama
- Hapus level

**Create Level:**
- Kolom kiri: PROPERTI HTML (10 template: Profile Card, Hero Section, Product Card, dll) + PROPERTI CSS (13 properti: text-align, padding, font-size, dll)
- Kolom tengah: PREVIEW LEVEL (dual panel — NILAI PEMAIN dan NILAI TARGET, update real-time)
- Kolom kanan: KONFIGURASI LEVEL (judul, kesulitan, narasi, kode HTML, batas waktu, nilai awal & target)
- Tombol TEST LEVEL untuk uji coba sebelum simpan

### 6.3 Mode Player

**Login & Register:**
- Tab Player terpilih secara default
- Register: validasi format email, password minimal 5 karakter, konfirmasi password cocok
- Auto-clear username/password saat login gagal

**Player Gallery:**
- Stat bar kompak: ❤️ Nyawa (klik untuk revive), 🏆 Level Selesai, ⭐ Bintang, 📊 Leaderboard (popup)
- Tombol "Buat Level" untuk membuat level custom
- Grid kartu level dengan info: judul, kesulitan, konsep IMK, status terkunci/terbuka, bintang
- Level custom hanya menampilkan level buatan sendiri

**Gameplay:**
- Split-view: NILAIMU (kiri, editable) vs NILAI TARGET (kanan, referensi)
- Status bar: nyawa (3 hati), countdown timer, skor (default 100), hint counter
- Editor CSS terpandu: setiap properti memiliki label, deskripsi, dan dropdown/input
- Tombol "Periksa Jawaban" — benar = menang, salah = -1 nyawa
- Skor: 100 - (jumlah hint × 10)
- Bintang: ⭐ (0-60), ⭐⭐ (61-80), ⭐⭐⭐ (81-100)

**Sistem Nyawa & Revive:**
- 3 nyawa, berkurang 1 saat jawaban salah
- Nyawa habis → auto-exit ke gallery → muncul popup pemulihan
- Pertanyaan revive hanya muncul 1x sehari (jawaban: nama dari footer game)
- Setelah berhasil: countdown 5 menit per nyawa yang dipulihkan
- Widget countdown floating di pojok kanan bawah

### 6.4 Level Select

5 level built-in yang tersedia:

| # | Judul | Kesulitan | Konsep IMK | Properti | Waktu |
|---|---|---|---|---|---|
| 1 | Perataan Teks | Mudah | Alignment | text-align | 60s |
| 2 | Hierarki Tipografi | Sedang | Typography | font-size, font-weight | 90s |
| 3 | Ruang & Sudut | Sedang | Spacing & Visual | padding, border-radius | 100s |
| 4 | Ritme Tipografi | Sedang | Readability | line-height, letter-spacing | 100s |
| 5 | Pixel Perfect Challenge | Sulit | Multi-Property | font-size, padding, border-radius, box-shadow | 120s |

Level selanjutnya terkunci hingga level sebelumnya diselesaikan.

### 6.5 Handbook/Panduan

**Cara Bermain:**
1. Buka aplikasi → klik PLAY GAME → login sebagai Player
2. Pilih level yang tersedia (mulai dari Level 1)
3. Perhatikan panel NILAI TARGET sebagai referensi desain
4. Atur properti CSS di panel editor hingga hasil di panel NILAIMU identik dengan target
5. Gunakan hint jika kesulitan (perlu menjawab soal matematika)
6. Klik "Periksa Jawaban" — jika benar, level selesai dan mendapat skor + bintang
7. Jika salah, nyawa berkurang 1

**Membuat Level Custom (Player):**
1. Di Player Gallery, klik tombol "Buat Level"
2. Pilih template HTML di kolom PROPERTI HTML
3. Tambahkan properti CSS di kolom PROPERTI CSS
4. Atur nilai awal dan target untuk setiap properti
5. Isi judul, deskripsi, dan batas waktu
6. Klik SIMPAN LEVEL → level muncul di LEVEL CUSTOM

**Developer Dashboard:**
1. Login sebagai Developer (username: `developer1`, password: `dev123`)
2. Dashboard menampilkan ranking player, statistik, dan manajemen level
3. Buat level utama melalui "Buat Level Baru" → level masuk ke semua player
4. Kelola player: lihat detail atau hapus akun

---

## 7. Penerapan Konsep IMK

| Konsep IMK | Penerapan dalam Aplikasi |
|---|---|
| **Visibility of System Status** | Status bar menampilkan nyawa, timer, dan skor secara real-time. Countdown revive menunjukkan progress pemulihan. |
| **Match Between System and Real World** | Label menggunakan bahasa Indonesia. Ikon universal (❤️, ⭐, 🏆). Nama properti CSS ditampilkan dalam format yang familiar. |
| **User Control and Freedom** | Tombol kembali di setiap halaman. Konfirmasi sebelum keluar level. Undo melalui edit ulang properti CSS. |
| **Consistency and Standards** | Skema warna konsisten (kuning = aksen, merah = bahaya, hijau = sukses). Layout panel yang sama di semua level. |
| **Error Prevention** | Auto-clear input login saat salah. Validasi form registrasi. Konfirmasi hapus akun. Template HTML mengurangi error pembuatan level. |
| **Recognition Rather than Recall** | Dropdown untuk pilihan nilai properti. Template HTML yang bisa diklik langsung. Preview real-time tanpa perlu mengingat nilai. |
| **Flexibility and Efficiency** | Hint system untuk pemain yang kesulitan. Template untuk mempercepat pembuatan level. Leaderboard untuk motivasi kompetitif. |
| **Aesthetic and Minimalist Design** | Dark theme modern. Animasi halus (hover, scale, bounce). Informasi yang relevan ditampilkan, yang tidak perlu disembunyikan. |
| **Help and Documentation** | Deskripsi singkat setiap properti di editor. Narasi instruksi di setiap level. Label konsep IMK pada kartu level. |
| **Feedback** | Live preview saat mengubah properti. Shake animation saat jawaban salah. Confetti saat level selesai. Skor dan bintang langsung terlihat. |

**Konsep IMK per Level:**

| Level | Konsep | Penjelasan |
|---|---|---|
| 1 — Perataan Teks | **Alignment** | Keseimbangan visual melalui perataan elemen |
| 2 — Hierarki Tipografi | **Typography** | Hierarki informasi melalui ukuran dan ketebalan teks |
| 3 — Ruang & Sudut | **Spacing & Visual** | White space dan bentuk melalui padding dan border-radius |
| 4 — Ritme Tipografi | **Readability** | Keterbacaan melalui jarak baris dan spasi huruf |
| 5 — Pixel Perfect | **Multi-Property** | Kombinasi semua konsep untuk replikasi desain menyeluruh |

---

## 8. Kesimpulan dan Saran

### 8.1 Kesimpulan

Aplikasi **Not My Style** berhasil diimplementasikan sebagai game edukasi CSS berbasis visual interaktif yang menerapkan prinsip-prinsip Interaksi Manusia dan Komputer secara komprehensif. Beberapa pencapaian utama:

1. **Sistem pembelajaran terstruktur** — 5 level built-in dengan konsep IMK yang berbeda dan tingkat kesulitan bertahap.
2. **Feedback visual instan** — Live preview real-time memungkinkan pemain langsung melihat dampak perubahan CSS.
3. **Sistem gamifikasi lengkap** — Skor, bintang, nyawa, timer, hint, leaderboard, dan revive system menciptakan pengalaman belajar yang adiktif.
4. **Multi-aktor dengan hak akses terpisah** — Player dan Developer memiliki fitur dan akses yang berbeda sesuai kebutuhan.
5. **Platform pembuatan level** — Baik player maupun developer dapat membuat level custom, mendorong kreativitas dan kolaborasi.
6. **Penerapan 10 prinsip Nielsen** — Semua prinsip usability Nielsen diterapkan dalam desain antarmuka dan interaksi.

### 8.2 Saran Pengembangan

1. **Backend & Database** — Implementasi server-side storage agar data pemain dan level tersimpan permanen serta bisa diakses antar perangkat.
2. **Multiplayer/Real-time** — Mode kompetisi real-time antar pemain untuk menyelesaikan level tercepat.
3. **Export/Import Level** — Fitur berbagi level dalam format JSON agar bisa diimpor pemain lain.
4. **Mobile Responsive** — Optimasi layout untuk perangkat mobile dan tablet.
5. **Lebih Banyak Level** — Penambahan level dengan konsep IMK lanjutan (Color Theory, Grid System, Animation).
6. **Achievement System** — Badge dan achievement untuk milestone tertentu (contoh: "Perfect Score", "Speed Runner").
7. **Tutorial Interaktif** — Onboarding tutorial untuk pemain baru yang menjelaskan cara bermain step-by-step.
8. **Dark/Light Mode Toggle** — Pilihan tema tampilan sesuai preferensi pengguna.
9. **Accessibility (a11y)** — Dukungan screen reader, keyboard navigation, dan high contrast mode.
10. **Analytics Dashboard** — Visualisasi data performa pemain untuk pengajar menggunakan charts dan grafik.

---

<p align="center">
  <strong>© 2026 Not My Style | Muhamad Rizki Hidayat</strong><br>
  <em>Game Edukasi CSS — Universitas Kuningan</em>
</p>
