# Sukabumi Drive

Sukabumi Drive adalah storefront rental mobil harian di Sukabumi. Pengunjung bisa melihat armada, memilih layanan lepas kunci atau dengan driver, menghitung estimasi total, lalu mengirim detail pemesanan ke WhatsApp admin. Admin dapat mengelola armada, kategori, dan informasi toko melalui dashboard.

## Fitur

- Katalog mobil dengan filter kategori dan pencarian.
- Detail unit: transmisi, jumlah kursi, bahan bakar, tahun, tarif harian, tarif driver, dan minimum sewa.
- Mode sewa lepas kunci atau dengan driver.
- Estimasi total berdasarkan tarif, mode, dan durasi.
- Pengiriman detail sewa ke WhatsApp.
- Dashboard admin untuk CRUD mobil dan kategori.
- Upload foto mobil (JPEG, PNG, WEBP, GIF, maks. 5 MB) atau URL foto.
- Pengaturan toko: nama, tagline, alamat, telepon, jam operasional, Instagram, catatan rental, slug, dan mata uang.
- Status unit: `Tersedia` atau `Disewa`.

## Teknologi

- Backend: Node.js, Express 5, ESM, SQLite (`node:sqlite`), multer, JWT, bcryptjs.
- Frontend: React 19, Vite 8, Tailwind CSS v4, oxlint.
- Database: SQLite lokal (`src/db/katalogwa.sqlite`), seeded dari `src/db/data.json` saat tabel kosong.

## Struktur

```text
.
├── src/                    # Backend aktif (Express + SQLite)
│   ├── db/
│   ├── middleware/
│   ├── routes/
│   └── index.js
├── client/                 # Frontend Vite + React
│   ├── src/
│   └── vite.config.js
├── .gitignore
├── AGENTS.md
├── package.json
└── README.md
```

## Prasyarat

- Node.js >= 22.5 (direkomendasikan Node 24).
- npm.

## Setup

Install dependensi backend:

```bash
npm install
```

Install dependensi frontend:

```bash
cd client
npm install
```

## Environment

Buat file `.env` di root repo bila ingin mengganti konfigurasi:

```env
PORT=5000
JWT_SECRET=ganti-dengan-secret-yang-kuat
```

Jika `.env` tidak ada, backend tetap berjalan dengan nilai fallback bawaan. `.env` tidak di-commit.

## Menjalankan

Backend (port 5000):

```bash
npm run dev
# atau
npm start
```

Frontend (port 3000, proxy `/api` dan `/uploads` ke backend):

```bash
cd client
npm run dev
```

Buka `http://localhost:3000`.

Endpoint kesehatan backend:

```bash
curl http://localhost:5000/api/health
```

## Akun Admin Bawaan

- Email: `admin@sukabumidrive.id`
- Password: `password123`

Akun ini dibuat otomatis saat database pertama kali di-seed. Ganti password untuk penggunaan nyata.

## Database

Database SQLite ada di `src/db/katalogwa.sqlite`. Data awal dari `src/db/data.json` hanya dimasukkan saat tabel kosong saat boot. Mengubah `data.json` tidak otomatis mengubah database yang sudah ada; hapus file `.sqlite` untuk reseed (destruktif).

## Build Frontend

```bash
cd client
npm run lint
npm run build
```

Hasil build ada di `client/dist/` dan diabaikan Git.

## Endpoint API Utama

- `GET /api/health`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/stores`
- `PUT /api/stores`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `PATCH /api/products/:id`
- `DELETE /api/products/:id`

`GET /api/products` mendukung `categoryId`, `categryId` (legacy), `search`, dan `stockStatus`.

## Catatan

- Tidak ada test suite; verifikasi dilakukan dengan `curl` dan browser.
- `POST /api/auth/register` masih placeholder: tidak menyimpan admin dan tidak mengembalikan respons.
- `mysql2` adalah dependensi lama yang tidak dipakai; penyimpanan data menggunakan SQLite.
- Upload ditulis ke `src/uploads/` dan dilayani di `/uploads`.
- File upload runtime, `node_modules/`, build output, dan file sementara diabaikan lewat `.gitignore`.