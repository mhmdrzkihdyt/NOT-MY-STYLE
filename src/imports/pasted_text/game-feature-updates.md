# PERUBAHAN DAN PENYEMPURNAAN FITUR GAME

## CREATOR MODE

Hapus seluruh fitur berikut:

* Import JSON
* Export JSON

Jangan tampilkan tombol maupun logika terkait Import/Export.

---

## Struktur Creator Mode

Gunakan layout 3 kolom:

### Kolom Kiri — CSS SOURCE & DAFTAR PROPERTI

Tambahkan area bernama **CSS SOURCE** berupa textarea/code editor sederhana.

Contoh:

```css
display: flex;
justify-content: center;
align-items: center;
font-size: 48px;
font-weight: 700;
border-radius: 16px;
```

Fungsi:

* Creator dapat menuliskan CSS mentah.
* Sistem otomatis membaca properti CSS yang ditulis.
* Properti yang ditemukan otomatis masuk ke daftar properti level.
* Properti tersebut nantinya dapat dikonfigurasi sebagai soal.

Di bawah CSS SOURCE tampilkan:

### DAFTAR PROPERTI

Contoh:

```text
✓ display
✓ justify-content
✓ align-items
✓ font-size
✓ font-weight
✓ border-radius
```

Creator dapat:

* Menambah properti manual
* Menghapus properti
* Menentukan tipe input

Jenis input:

* text
* number
* select

---

### Kolom Tengah — KANVAS TARGET

Berfungsi sebagai preview visual target.

Seluruh perubahan CSS harus langsung terlihat secara real-time.

Contoh:

Jika creator mengubah:

```css
font-size: 24px;
```

menjadi:

```css
font-size: 48px;
```

maka preview target langsung berubah tanpa perlu menekan tombol apa pun.

Hal ini berlaku untuk seluruh properti CSS yang digunakan.

---

### Kolom Kanan — PROPERTI SOAL

Untuk setiap properti tampilkan:

* Nama Properti
* Nilai Awal Pemain
* Nilai Target
* Deskripsi Properti
* Tipe Input

Contoh:

```text
Properti: font-size
Nilai Awal: 24
Nilai Target: 48
Deskripsi: Atur ukuran judul agar sesuai target.
Tipe Input: number
```

---

## Mekanisme Pembuatan Level

Creator cukup:

1. Membuat tampilan target.
2. Menuliskan CSS yang ingin dijadikan soal.
3. Menentukan nilai awal pemain.
4. Menentukan nilai target.

Saat level dimainkan:

* Preview Pemain menggunakan Nilai Awal.
* Preview Target menggunakan Nilai Target.
* Pemain harus menyesuaikan seluruh properti hingga identik.

---

## Penyimpanan Level

Gunakan state array React.

Ketika tombol Simpan Level ditekan:

* Level otomatis masuk ke bagian "Level Pemain".
* Tidak menggunakan database.
* Tidak menggunakan backend.
* Tidak menggunakan file JSON.

Semua data berada di state React.

---

# PLAYER MODE

## LIVE PREVIEW REAL-TIME

Pada panel:

### HASIL NILAIMU

Live Preview wajib berubah secara langsung ketika pemain mengubah nilai pada editor.

Contoh:

```css
font-size: 24px;
```

menjadi:

```css
font-size: 48px;
```

maka ukuran teks langsung berubah.

Hal ini berlaku untuk seluruh properti:

* font-size
* font-weight
* line-height
* letter-spacing
* display
* justify-content
* align-items
* gap
* border-radius
* box-shadow
* opacity
* seluruh properti yang dibuat di Creator Mode

Preview harus selalu mencerminkan kondisi nilai pemain saat ini.

---

# HINT SYSTEM BERTINGKAT

Setiap level dapat menggunakan Hint lebih dari satu kali.

Setiap Hint berikutnya harus memiliki tingkat kesulitan soal yang lebih tinggi.

## Hint 1

Contoh soal:

```text
5 × 4 = ?
```

Jika benar:

Bocorkan sebagian nilai.

Contoh:

```text
font-size = 4_
```

---

## Hint 2

Contoh soal:

```text
12 × 13 = ?
```

atau

```text
7² = ?
```

Jika benar:

Bocorkan informasi lebih spesifik.

Contoh:

```text
font-size = 48px
```

atau

```text
Nilai berada antara 40 dan 50
```

---

## Hint 3

Contoh soal:

```text
15² = ?
```

atau

```text
144 ÷ 12 = ?
```

Jika benar:

Bocorkan satu properti secara penuh.

Contoh:

```text
justify-content = center
```

---

## Aturan Hint

* Tidak mengurangi nyawa.
* Mengurangi skor akhir.
* Mengurangi grade akhir.

---

# STATUS SIAP DIPERIKSA

Ketika seluruh nilai pemain sudah sama dengan target:

Jangan langsung menampilkan kemenangan.

Tampilkan status:

```text
✓ Jawaban Siap Diperiksa
```

atau

```text
✓ Semua Properti Sudah Sesuai
```

Status ditampilkan pada Status Bar.

---

# TOMBOL PERIKSA JAWABAN

Gunakan nama tombol:

```text
Periksa Jawaban
```

Bukan:

```text
Kunci Jawaban
```

---

## Jika Jawaban Masih Salah

Tampilkan modal:

### JAWABAN MASIH BELUM SESUAI

Isi:

```text
Masih terdapat beberapa properti yang belum sama dengan target.
Periksa kembali editor CSS kamu.
```

Tombol:

* Tutup
* Lanjutkan Bermain

Jangan membocorkan jawaban.

---

## Jika Jawaban Sudah Benar

Tampilkan modal:

### LEVEL BERHASIL DISELESAIKAN

Isi:

* Skor
* Grade
* Bintang
* Waktu Tersisa
* Jumlah Hint Digunakan

Tombol:

### Lanjutkan Level

Memuat level berikutnya.

### Kembali

Kembali ke daftar level.

---

# SISTEM NYAWA GLOBAL

Nyawa berlaku untuk seluruh permainan.

Jumlah maksimal:

❤️ ❤️ ❤️

Total:

3 nyawa

Status nyawa harus terlihat pada:

* Halaman Pemilihan Level
* Halaman Bermain
* Status Bar

---

# PANEL INFORMASI PADA HALAMAN LEVEL

Di bagian atas halaman level tampilkan:

```text
❤️ Nyawa: 3/3
⭐ Total Skor
🏆 Level Selesai
```

---

# PENGURANGAN NYAWA

Nyawa hanya berkurang jika:

### 1. Timer Habis

Contoh:

Timer level:

```text
02:00
```

Ketika mencapai:

```text
00:00
```

maka:

* Nyawa berkurang 1.
* Timer kembali ke waktu awal level.

Contoh:

```text
❤️❤️❤️ → ❤️❤️
```

Timer reset ke:

```text
02:00
```

Jika nyawa habis:

Game Over.

---

### 2. Keluar dari Level

Jika pemain menekan:

* Kembali
* Keluar
* Back ke Daftar Level

sebelum level selesai:

Tampilkan konfirmasi.

Judul:

```text
KELUAR DARI LEVEL?
```

Isi:

```text
Keluar dari level akan mengurangi 1 nyawa.
Apakah kamu yakin?
```

Tombol:

* Tetap Bermain
* Keluar Level

Jika memilih Keluar Level:

```text
❤️❤️❤️ → ❤️❤️
```

Lalu kembali ke daftar level.

---

# GAME OVER

Jika nyawa mencapai:

```text
0/3
```

munculkan modal:

### GAME OVER

Isi:

```text
Kamu kehabisan nyawa.
Coba lagi untuk menyelesaikan level ini.
```

Tampilkan:

* Skor
* Jumlah Hint

Tombol:

* Coba Lagi
* Kembali ke Menu

---

# PEMULIHAN NYAWA

Jika nyawa habis:

* Seluruh level terkunci.
* Pemain tidak dapat memainkan level apa pun.

Tampilkan modal:

### NYAWA HABIS

Isi:

```text
Kamu kehabisan nyawa.
Jawab pertanyaan berikut untuk memulihkan seluruh nyawa.
```

Pertanyaan:

```text
Siapakah nama laki-laki yang baik hati, tidak sombong,
sayang pada kedua orang tua,
tampan dan mempesona?
```

Tampilkan input jawaban.

Jawaban yang benar:

```text
Muhamad Rizki Hidayat
```

Pengecekan:

* Tidak membedakan huruf besar/kecil.
* Mengabaikan spasi di awal/akhir.

---

## Jika Jawaban Benar

Tampilkan modal:

### NYAWA BERHASIL DIPULIHKAN

Isi:

```text
Selamat, seluruh nyawa telah dipulihkan.
```

Nyawa kembali:

```text
❤️❤️❤️
```

Pemain dapat bermain kembali.

---

## Jika Jawaban Salah

Tampilkan pesan:

```text
Jawaban belum benar.
Silakan coba lagi.
```

Nyawa tetap:

```text
0/3
```

Level tetap terkunci.

---

# STATUS BAR SAAT BERMAIN

Wajib menampilkan:

* ❤️ Nyawa
* ⏱ Countdown Timer
* 🎯 Persentase Kecocokan
* ⭐ Skor
* 🏆 Grade
* 💡 Jumlah Hint Digunakan
* ✓ Status Siap Diperiksa

---

# TUJUAN GAMEPLAY

Game harus terasa seperti puzzle visual CSS.

Alur:

1. Pilih level.
2. Edit properti CSS.
3. Lihat perubahan pada Live Preview secara real-time.
4. Gunakan Hint jika diperlukan.
5. Cocokkan tampilan dengan Target.
6. Status berubah menjadi "Siap Diperiksa".
7. Tekan "Periksa Jawaban".
8. Jika salah → lanjut bermain.
9. Jika benar → tampil modal kemenangan.
10. Pilih lanjut ke level berikutnya atau kembali ke daftar level.
