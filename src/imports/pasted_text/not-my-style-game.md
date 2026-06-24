Kamu adalah Senior UI/UX Engineer, Game Developer, sekaligus Dosen Praktisi mata kuliah Interaksi Manusia dan Komputer (IMK).

Buatlah aplikasi web interaktif bernama **"Not My Style"** sebagai game edukasi premium berbasis visual-first yang menantang kemampuan pemain dalam menyelaraskan tata letak, tipografi, dan gaya visual halaman web. Aplikasi ini ditujukan untuk mahasiswa dan developer pemula agar mereka dapat melatih intuisi desain frontend secara hands-on sesuai prinsip IMK melalui umpan balik visual yang instan.

## DESAIN VISUAL

Gunakan Tailwind CSS dengan gaya desain **Simple Modern Light** yang bersih, estetik, cerah, dan profesional.

Gunakan skema warna berikut:

* Background utama: `bg-slate-50`
* Surface utama: `bg-white`
* Panel editor: `bg-slate-100 border border-slate-200`
* Warna aksen utama: `#1591DC`
* Tombol aktif: `#1591DC`
* Tombol hint: ungu modern
* Tombol creator: oranye-merah cerah
* Tombol player: hijau segar

Ikuti struktur visual, warna, spacing, hierarchy, ukuran kartu, dan layout dari gambar referensi yang akan diberikan pengguna semirip mungkin. Jangan mengganti susunan UI utama kecuali diperlukan untuk fungsi game. Fokus pada pixel-perfect recreation dengan tetap mempertahankan seluruh fitur gameplay yang telah dijelaskan.

Tambahkan animasi halus menggunakan Tailwind CSS:

* fade-in
* scale-up
* hover transition
* modal transition
* shake animation ketika jawaban salah

## SPLASH SCREEN

Tampilkan splash screen minimalis modern yang berisi:

### Judul

NOT MY STYLE

### Subjudul

"Belajar UI/UX dan CSS melalui tantangan visual interaktif"

### Dua kartu menu besar

#### PLAYER

* Ikon gamepad
* Background hijau
* Deskripsi:
  "Selesaikan tantangan CSS"

#### CREATOR

* Ikon perkakas
* Background oranye-merah
* Deskripsi:
  "Buat level dan tantangan"

Kedua kartu harus interaktif dengan efek hover premium.

---

# MODE PLAYER

## LEVEL GALLERY

Tampilkan galeri horizontal level bawaan.

Minimal 3 level.

Gunakan kartu level modern.

Informasi:

* Nama Level
* Tingkat Kesulitan
* Konsep IMK yang dipelajari
* Status terkunci / terbuka
* Bintang yang diperoleh

Sistem progres:

* Level 2 terkunci hingga Level 1 selesai.
* Level 3 terkunci hingga Level 2 selesai.

## KONSEP PEMBELAJARAN IMK

Setiap level wajib memiliki fokus pembelajaran:

### Level 1

Alignment & Layout

### Level 2

Typography Hierarchy

### Level 3

Visual Consistency & Decoration

Tampilkan badge konsep IMK pada kartu level.

---

## LEVEL PEMAIN

Di bagian bawah galeri tampilkan area:

"LEVEL PEMAIN"

Berisi seluruh level yang dibuat melalui Creator Mode.

Data harus berasal dari state array dan otomatis muncul setelah level dibuat.

---

# AREA BERMAIN

Gunakan layout split-pane 2 kolom yang seimbang.

## KOLOM KIRI

### HASIL NILAIMU

Berisi:

* Live Preview
* Render real-time
* Update otomatis ketika input berubah

Di bawah preview:

Tombol:

"Sorot Perbedaan"

Warna ungu.

Ketika diklik:

* highlight elemen yang berbeda
* tampilkan border merah pada elemen yang belum sesuai

---

## KOLOM KANAN

### TARGET

Menampilkan desain target.

Target tidak dapat diubah pemain.

Berfungsi sebagai referensi visual.

Contoh komponen:

* Hero Landing Page
* Product Card
* Profile Card
* Feature Section
* Testimonial Card

---

# STATUS BAR GAME

Tampilkan di atas editor.

Komponen:

### Nyawa

3 ikon hati

❤️ ❤️ ❤️

Jika salah atau waktu habis:

kurangi satu hati.

---

### Countdown Timer

Hitung mundur sesuai level.

Contoh:

01:30

Jika waktu habis:

* nyawa berkurang
* timer reset

---

### Match Percentage

Hitung kecocokan visual.

Contoh:

Visual Match

87%

Progress Bar

Nilai dihitung dari jumlah properti yang sesuai dibanding total properti target.

---

### Score

Tampilkan skor level.

Rentang:

0-100

Rumus:

* Ketepatan jawaban
* Sisa waktu
* Nyawa tersisa

---

### Grade

Tampilkan otomatis:

* S (95-100)
* A (85-94)
* B (70-84)
* C (50-69)
* D (<50)

---

### Hint Button

Ketika diklik:

Simulasikan fitur menonton iklan.

Munculkan modal.

Pengguna harus menyelesaikan soal matematika acak.

Contoh:

5² = ?

7 × 8 = ?

9 + 15 = ?

Jika benar:

bocorkan sebagian nilai satu properti target.

Contoh:

font-size: 2_ px

atau

border-radius: 1_ px

---

### Kunci Jawaban

Ketika diklik:

Semua input otomatis terisi dengan jawaban benar.

Preview langsung identik dengan target.

---

# PANEL EDITOR CSS TERPANDU

Buat editor berbasis form.

Tampilan rapi.

Gunakan grid responsif.

Setiap properti memiliki:

* label
* deskripsi singkat
* input
* unit

---

## TATA LETAK

Properti:

* display
* flex-direction
* justify-content
* align-items
* gap

Gunakan dropdown.

---

## TIPOGRAFI

Properti:

* font-size
* font-weight
* line-height
* letter-spacing
* text-align

Gunakan number input atau select.

---

## VISUAL & DEKORASI

Properti:

* border-radius
* box-shadow
* opacity

---

# SISTEM DETEKSI KEMENANGAN

Ketika seluruh properti identik dengan target:

* tampilkan modal kemenangan
* animasi scale-up
* confetti sederhana berbasis CSS
* tampilkan skor
* tampilkan grade
* tampilkan jumlah bintang

Bintang:

⭐⭐⭐ = tanpa kehilangan nyawa

⭐⭐ = kehilangan 1 nyawa

⭐ = kehilangan 2 nyawa

---

# GAME OVER

Jika nyawa mencapai 0:

Tampilkan modal Game Over.

Isi:

* skor terakhir
* tombol coba lagi
* tombol kembali ke menu

---

# DATA LEVEL

Gunakan data dummy hardcoded minimal 3 level.

Setiap level berisi:

* id
* title
* difficulty
* concept
* description
* htmlStructure
* initialPlayerValues
* targetValues
* timeLimit

Komponen level harus berbeda-beda:

### Level 1

Profile Card

### Level 2

Landing Page Hero

### Level 3

Product Gallery

---

# MODE CREATOR

Buat halaman Creator dengan layout 3 kolom.

---

## KOLOM KIRI

DAFTAR PROPERTI

Fitur:

* tambah properti
* hapus properti
* pilih jenis input

Jenis:

* text
* number
* select

---

## KOLOM TENGAH

KANVAS TARGET

Preview langsung.

Semua perubahan harus langsung terlihat secara real-time.

---

## KOLOM KANAN

PROPERTI SOAL

Field:

* Judul Level
* Tingkat Kesulitan
* Konsep IMK
* Narasi Instruksi
* Komponen Teks
* Warna Background
* Nilai Awal Pemain
* Nilai Target

Gunakan color picker untuk warna.

---

# FITUR TEST LEVEL

Tambahkan tombol:

TEST LEVEL

Agar creator dapat memainkan level yang sedang dibuat sebelum menyimpan.

---

# EXPORT & IMPORT

Tambahkan fitur:

EXPORT JSON

Mengunduh level sebagai file JSON.

IMPORT JSON

Mengunggah file JSON lalu otomatis masuk ke daftar level pemain.

---

# PENYIMPANAN LEVEL

Gunakan state array.

Level yang disimpan harus otomatis muncul di:

LEVEL PEMAIN

tanpa refresh halaman.

---

# LOGIKA INTERAKSI

* Semua input harus mengubah preview secara instan.
* Gunakan React Hooks.
* Gunakan useState.
* Gunakan useEffect untuk timer.
* Jangan gunakan API eksternal.
* Jangan gunakan backend.
* Jangan gunakan library pihak ketiga yang rumit.
* Jangan gunakan database.
* Semua data berada dalam satu file React.

---

# OUTPUT

Berikan KODE LENGKAP yang sepenuhnya fungsional dalam SATU FILE React saja.

Gunakan Tailwind CSS langsung pada className.

Jangan berikan penjelasan.

Jangan membagi file.

Jangan menggunakan placeholder.

Tampilkan seluruh kode React secara lengkap dan siap dijalankan.
