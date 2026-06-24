# Requirements Document

## Introduction

Dokumen ini mendefinisikan requirement untuk pengembangan fitur-fitur baru pada game edukasi CSS berbasis web **"NOT MY STYLE"**. Game ini dibangun dengan React (frontend) dan Node.js/Express (backend) menggunakan database Microsoft SQL Server.

Fitur yang dicakup dalam dokumen ini:
1. **Sistem Score** — kalkulasi dan penampilan skor ketika player menyelesaikan level.
2. **Leaderboard Berbasis Score** — perbaikan dan peningkatan fungsi leaderboard berdasarkan skor total dan waktu.
3. **Pemulihan Nyawa** — implementasi sistem recovery nyawa otomatis setiap 5 menit per nyawa.
4. **Tombol Logout di Navbar** — penambahan tombol logout yang mudah diakses di navbar.
5. **Persistensi Data ke Database** — penyimpanan progress level, nyawa, dan data leaderboard ke database saat player logout atau menutup/refresh browser.

---

## Glossary

- **Game**: Aplikasi web "NOT MY STYLE", game edukasi CSS interaktif.
- **Score_Calculator**: Modul frontend yang menghitung skor akhir setelah level diselesaikan.
- **Score_Display**: Komponen UI yang menampilkan skor di layar kemenangan dan leaderboard.
- **Leaderboard**: Halaman/modal yang menampilkan peringkat pemain berdasarkan skor total.
- **Leaderboard_Service**: Backend route `/api/leaderboard` yang menyediakan data peringkat pemain.
- **Life_Recovery_System**: Mekanisme yang memulihkan nyawa player secara otomatis setelah waktu tertentu.
- **Navbar**: Komponen navigasi utama yang tampil di layar `player-gallery`, `gameplay`, dan `creator`.
- **Logout_Handler**: Fungsi frontend yang menangani proses logout, termasuk penyimpanan state sebelum keluar.
- **Persistence_Service**: Mekanisme yang menyinkronkan state game (progress, nyawa) ke database.
- **Player**: Pengguna dengan role `player` yang memainkan level dalam game.
- **Lives**: Jumlah nyawa player saat ini (nilai antara 0 dan 3 inklusif).
- **TotalScore**: Akumulasi skor dari semua level yang telah diselesaikan player, tersimpan di tabel `Users`.
- **BestTime**: Waktu tercepat (dalam detik) untuk menyelesaikan suatu level, tersimpan di tabel `PlayerProgress`.
- **HintsUsed**: Jumlah hint yang digunakan dalam satu sesi permainan level.
- **TimeLimit**: Batas waktu (dalam detik) yang tersedia untuk menyelesaikan level, sesuai kolom `TimeLimit` di tabel `Levels`.
- **TimeUsed**: Waktu yang dihabiskan player untuk menyelesaikan level, dihitung sebagai `TimeLimit - timeLeft`.
- **Stars**: Bintang (0–3) yang diperoleh saat menyelesaikan level.
- **LevelProgress**: Record pasangan `(Username, LevelId)` yang menyimpan progres player per level di tabel `PlayerProgress`.
- **beforeunload**: Event browser yang terpicu saat halaman ditutup, di-refresh, atau tab ditutup.
- **ReviveCountdown**: Timer mundur yang menghitung sisa waktu sebelum satu nyawa dipulihkan.
- **LastReviveDate**: Kolom di tabel `Users` yang menyimpan tanggal terakhir pemulihan nyawa dilakukan.

---

## Requirements

### Requirement 1: Kalkulasi Skor Level

**User Story:** Sebagai player, saya ingin mendapatkan skor setiap kali menyelesaikan level, sehingga saya bisa mengukur performa saya dan termotivasi untuk bermain lebih baik.

#### Acceptance Criteria

1. WHEN player menyelesaikan sebuah level dengan semua properti CSS tepat 100% sesuai target, THE Score_Calculator SHALL menghitung skor akhir menggunakan formula: `skor = max(0, baseScore - (hintsUsed × 10) - floor(timeUsed / timeLimit × 40))`, di mana `baseScore = 100`.
2. WHEN player menggunakan 0 hint dan menyelesaikan level dengan `timeUsed ≤ 50%` dari `TimeLimit`, THE Score_Calculator SHALL menghasilkan skor antara 60 dan 100 inklusif.
3. WHEN player menggunakan hint, THE Score_Calculator SHALL mengurangi skor sebesar 10 poin per hint yang digunakan.
4. WHEN skor akhir yang dihitung kurang dari 0, THE Score_Calculator SHALL menetapkan skor akhir menjadi 0.
5. WHEN level diselesaikan, THE Score_Display SHALL menampilkan skor akhir di modal kemenangan (win modal) sebelum player menutup modal tersebut.
6. WHEN player menyelesaikan level untuk pertama kalinya, THE Game SHALL menambahkan skor akhir ke `TotalScore` player di database.
7. WHEN player mengulang level yang sudah pernah diselesaikan (replay), THE Game SHALL memperbarui `TotalScore` dengan selisih skor jika skor baru lebih tinggi dari skor sebelumnya untuk level tersebut.

---

### Requirement 2: Leaderboard Berbasis Score dan Waktu

**User Story:** Sebagai player, saya ingin melihat peringkat berdasarkan skor total dan waktu, sehingga saya tahu posisi saya dibanding player lain secara adil dan akurat.

#### Acceptance Criteria

1. THE Leaderboard_Service SHALL mengembalikan daftar player dengan kolom: `rank`, `username`, `name`, `totalScore`, `levelsPlayed`, `stars`, `totalTime`.
2. THE Leaderboard_Service SHALL mengurutkan player pertama berdasarkan `TotalScore` dari tertinggi ke terendah.
3. WHEN dua atau lebih player memiliki nilai `TotalScore` yang sama, THE Leaderboard_Service SHALL menggunakan `TotalTime` dari terendah ke tertinggi sebagai tie-breaker.
4. WHEN dua atau lebih player memiliki `TotalScore` dan `TotalTime` yang sama, THE Leaderboard_Service SHALL menggunakan `TotalStars` dari tertinggi ke terendah sebagai tie-breaker kedua.
5. THE Leaderboard_Service SHALL hanya menyertakan user dengan `Role = 'player'` dalam daftar leaderboard.
6. THE Leaderboard_Service SHALL mengembalikan maksimal 100 player teratas.
7. WHEN player membuka leaderboard modal, THE Score_Display SHALL memuat dan menampilkan data leaderboard terbaru dari `/api/leaderboard`.
8. WHEN permintaan ke `/api/leaderboard` gagal, THE Score_Display SHALL menampilkan pesan error "Gagal memuat leaderboard" kepada player.
9. THE Leaderboard_Service SHALL menghitung `rank` secara berurutan dimulai dari 1 untuk player dengan peringkat tertinggi.

---

### Requirement 3: Pemulihan Nyawa Otomatis

**User Story:** Sebagai player, saya ingin nyawa saya pulih kembali secara otomatis setelah beberapa waktu, sehingga saya bisa melanjutkan bermain tanpa harus menunggu selamanya atau membayar.

#### Acceptance Criteria

1. WHEN nyawa player berkurang dari nilai maksimum 3, THE Life_Recovery_System SHALL memulai countdown pemulihan 300 detik (5 menit) per nyawa yang hilang.
2. WHEN countdown pemulihan mencapai 0, THE Life_Recovery_System SHALL menambahkan 1 nyawa ke `Lives` player dan menyimpan nilai terbaru ke database.
3. WHEN player memiliki lebih dari 1 nyawa yang hilang, THE Life_Recovery_System SHALL memulai countdown baru 300 detik untuk nyawa berikutnya setelah nyawa pertama dipulihkan.
4. WHILE countdown pemulihan berjalan, THE Life_Recovery_System SHALL menampilkan sisa waktu countdown kepada player dalam format `MM:SS` di UI nyawa.
5. WHEN Lives player sudah mencapai nilai maksimum 3, THE Life_Recovery_System SHALL menghentikan countdown dan tidak menambahkan nyawa lebih lanjut.
6. WHEN player login kembali setelah sesi sebelumnya di mana nyawa berkurang, THE Life_Recovery_System SHALL memeriksa waktu yang telah berlalu sejak sesi terakhir dan memulihkan nyawa yang semestinya sudah pulih.
7. WHEN Lives player dipulihkan, THE Life_Recovery_System SHALL memperbarui nilai `Lives` di tabel `Users` melalui endpoint `PUT /api/progress/:username/lives`.

---

### Requirement 4: Tombol Logout di Navbar

**User Story:** Sebagai player, saya ingin ada tombol logout yang jelas dan mudah dijangkau di navbar, sehingga saya bisa keluar dari akun dengan cepat tanpa harus mencari menu tersembunyi.

#### Acceptance Criteria

1. THE Navbar SHALL menampilkan tombol "Logout" di sisi kanan navbar pada layar `player-gallery`, `gameplay`, dan `creator` selama player sedang login.
2. WHEN player mengklik tombol "Logout", THE Logout_Handler SHALL menyimpan progress level terkini dan nilai `Lives` terkini ke database sebelum melakukan proses logout.
3. WHEN penyimpanan data berhasil, THE Logout_Handler SHALL menghapus token autentikasi dari `localStorage`, mengatur ulang state aplikasi, dan mengarahkan player ke layar `login`.
4. WHEN penyimpanan data ke database gagal saat logout, THE Logout_Handler SHALL tetap melanjutkan proses logout dan mengarahkan player ke layar `login`, sehingga player tidak terjebak di layar yang sama.
5. THE Navbar SHALL menampilkan nama atau username player yang sedang login di sebelah tombol "Logout".

---

### Requirement 5: Persistensi Data ke Database

**User Story:** Sebagai player, saya ingin progress dan data game saya tersimpan otomatis ke database saat saya refresh atau menutup browser, sehingga saya tidak kehilangan progress yang sudah dicapai.

#### Acceptance Criteria

1. WHEN event `beforeunload` terpicu pada browser player, THE Persistence_Service SHALL mengirimkan data progress level terkini (`LevelProgress`) dan nilai `Lives` terkini ke database menggunakan `navigator.sendBeacon`.
2. THE Persistence_Service SHALL menyimpan setiap entri `LevelProgress` yang memiliki nilai `stars` terdefinisi (bukan `undefined`) ke tabel `PlayerProgress` melalui endpoint `PUT /api/progress/:username`.
3. THE Persistence_Service SHALL menyimpan nilai `Lives` terkini ke tabel `Users` melalui endpoint `PUT /api/progress/:username/lives`.
4. WHEN player login, THE Game SHALL memuat progress level dan nilai `Lives` terkini dari database melalui endpoint `GET /auth/me` dan menerapkannya ke state aplikasi.
5. WHEN player login setelah nyawa berkurang di sesi sebelumnya dan belum sempat tersinkronisasi ke database, THE Persistence_Service SHALL memastikan nilai `Lives` yang tersimpan di database mencerminkan nilai `Lives` pada saat `beforeunload` terakhir terpicu.
6. IF endpoint `PUT /api/progress/:username` mengembalikan status error (4xx atau 5xx) saat `beforeunload`, THEN THE Persistence_Service SHALL mencatat error ke `console.error` dan tidak memblokir penutupan browser.
7. THE Persistence_Service SHALL hanya menyimpan data ke database jika player sedang dalam status login (token autentikasi tersedia di `localStorage`).
