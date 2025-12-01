# SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar
## Tugas Praktik 3 - Pemrograman Berbasis Web
### Universitas Terbuka

---

## 📋 Deskripsi

SITTA adalah aplikasi web untuk mengelola pemesanan dan distribusi bahan ajar di Universitas Terbuka. Aplikasi ini dibangun menggunakan **Vue.js 2** dengan arsitektur komponen dan template terpisah.

## 🚀 Fitur Utama

### 1. Stok Bahan Ajar
- ✅ Tabel daftar stok dengan semua data field
- ✅ Filter berdasarkan UPBJJ dan Kategori (dependent options)
- ✅ Filter stok menipis dan kosong
- ✅ Sort berdasarkan judul, stok, dan harga
- ✅ Status badge dengan warna (Aman/Menipis/Kosong)
- ✅ Tooltip untuk catatan HTML
- ✅ CRUD: Tambah, Edit, Hapus bahan ajar
- ✅ Validasi form
- ✅ Keyboard shortcut (Enter/Esc)

### 2. Tracking Delivery Order
- ✅ Pencarian berdasarkan Nomor DO atau NIM
- ✅ Keyboard shortcut (Enter untuk search, Esc untuk reset)
- ✅ Detail tracking dengan timeline perjalanan
- ✅ Tambah DO baru dengan nomor auto-generate
- ✅ Tambah progress perjalanan
- ✅ Update status DO

### 3. Pemesanan Bahan Ajar
- ✅ Form pemesanan lengkap
- ✅ Validasi real-time
- ✅ Pilih paket dengan detail isi
- ✅ Total harga otomatis
- ✅ Konfirmasi sukses

## 🛠️ Teknologi

- **Vue.js 2.7.14** - JavaScript Framework
- **Tailwind CSS** (CDN) - Utility-first CSS
- **Fetch API** - Data fetching

## 📁 Struktur Proyek

```
tugas3-vue/
├── index.html              # Root: mount #app
├── README.md               # Dokumentasi
├── NARASI_VIDEO.md         # Script untuk video
├── assets/
│   └── css/
│       └── style.css       # Style global
├── data/
│   └── dataBahanAjar.json  # Data JSON
├── js/
│   ├── app.js              # Vue root instance
│   ├── components/
│   │   ├── stock-table.js  # <ba-stock-table>
│   │   ├── do-tracking.js  # <do-tracking>
│   │   ├── order-form.js   # <order-form>
│   │   ├── status-badge.js # <status-badge>
│   │   └── app-modal.js    # <app-modal>
│   └── services/
│       └── api.js          # Data service
└── templates/
    ├── stock-table.html
    ├── do-tracking.html
    ├── order-form.html
    ├── status-badge.html
    └── app-modal.html
```

## 🎯 Indikator Capaian

### 1.1 Arsitektur Vue.js (20 Poin)
- Struktur folder terorganisir
- Komponen terpisah dengan template
- Naming convention kebab-case

### 1.2 Data Binding & Directive (10 Poin)
- Mustache `{{ }}` untuk interpolasi
- `v-text` untuk teks
- `v-html` untuk HTML (catatan)
- `v-bind` untuk attribute
- `v-model` untuk form
- `v-for` untuk list rendering

### 1.3 Conditional Rendering (7 Poin)
- `v-if/v-else` untuk toggle view
- `v-show` untuk filter options

### 1.4 Computed & Methods (10 Poin)
- Computed: `filteredAndSortedItems`, `availableKategori`
- Methods: `formatCurrency`, `formatQty`, `getStockStatus`

### 1.5 Watchers (10 Poin)
- Reset kategori saat UPBJJ berubah
- Mutual exclusion filter
- Validasi real-time
- Update total harga

### 1.6 Form & Event Handling (20 Poin)
- Mouse events: click, hover
- Keyboard events: Enter, Escape
- Form validation
- Submit handling

### 1.7 Kreativitas UI (8 Poin)
- Design modern dengan Tailwind
- Responsive layout
- Toast notification
- Modal confirmation

### 1.8 Video Penjelasan (15 Poin)
- Lihat file `NARASI_VIDEO.md`

## 🚀 Cara Menjalankan

1. Buka folder project di VS Code
2. Install extension **Live Server**
3. Klik kanan pada `index.html` → **Open with Live Server**
4. Aplikasi akan terbuka di browser

## 📝 Catatan

- Aplikasi ini menggunakan data dummy dari file JSON
- Tidak ada backend/database (simulasi saja)
- Perubahan data tidak tersimpan permanen

## 👤 Pembuat

- **Nama:** [NAMA ANDA]
- **NIM:** [NIM ANDA]
- **Program Studi:** [PRODI ANDA]
- **Universitas Terbuka**

---

© 2025 SITTA - Universitas Terbuka
