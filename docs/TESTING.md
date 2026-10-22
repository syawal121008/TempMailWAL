# Syawal TempMail — Testing & Verification Guide

## 1. Local Testing Matrix
Pengujian mencakup:
1. **Inbox Lifecycle**:
   - Pembuatan inbox baru acak (`POST /api/v1/inboxes`).
   - Verifikasi token autentikasi rahasia.
   - Pengecekan status kedaluwarsa.
2. **Access Security & Anti-IDOR**:
   - Request tanpa Bearer token ditolak (401 Unauthorized).
   - Token milik User A tidak bisa membaca pesan User B (403 Forbidden / 404 Not Found).
3. **MIME Parsing & OTP Extraction**:
   - Parsing email text-only dan multipart (HTML + Text).
   - Regex matching pola OTP (4 - 8 digit angka, keyword "verification", "OTP", "code", "kode").
4. **Data Sanitization**:
   - Payload `<script>` di email HTML dinetralkan.
   - External tracking pixel diabaikan.

## 2. Running Local Tests

### Frontend (Apps/Web)
```bash
cd apps/web
npm run lint
npm run test
npm run build
```

### Backend & Worker (Workers/Api)
```bash
cd workers/api
npm run type-check
npm run test
npm run build
```

## 3. End-to-End Real Email Test (Production)
1. Buka frontend `https://syawaltzy.my.id`.
2. Klik **Generate New Email** -> Dapatkan alamat `xxxx@syawaltzy.my.id`.
3. Dari akun email lain (misal Gmail atau Yahoo), kirim email ke alamat tersebut.
4. Perhatikan polling di UI: email baru akan muncul dalam hitungan detik.
5. Klik pesan untuk membaca isi teks dan pastikan OTP terdeteksi otomatis (jika ada).
6. Uji tombol **Copy OTP** dan **Delete Inbox**.
