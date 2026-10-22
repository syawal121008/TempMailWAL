# Syawal TempMail

> Layanan Temporary / Disposable Email Modern, Aman, dan Cepat pada domain `syawaltzy.my.id`.

Syawal TempMail dibangun dengan arsitektur modern berbasis edge computing menggunakan **Cloudflare Workers**, **Cloudflare D1**, dan frontend **React + Vite** yang di-deploy di **Vercel**.

---

## 🌟 Fitur Utama
- **Zero Configuration Inbox**: Buat alamat acak `@syawaltzy.my.id` instan dengan masa aktif 10-60 menit.
- **Penerimaan Email Asli**: Terhubung langsung ke Cloudflare Email Routing & Email Worker.
- **Deteksi OTP Otomatis**: Algoritma regex cerdas mendeteksi kode verifikasi/OTP dengan satu tombol salin.
- **Keamanan Anti-IDOR**: Autentikasi inbox berbasis secret bearer token dengan one-way hashing SHA-256.
- **Sanitasi HTML & Anti-XSS**: Memblokir script, iframe jahat, dan tracker eksternal.
- **Retensi Otomatis**: Scheduled cron worker menghapus data inbox dan pesan yang telah kedaluwarsa.
- **Strict Inbound**: Layanan ini hanya menerima pesan masuk (tidak ada SMTP relay publik untuk mencegah spam).

---

## 📁 Struktur Monorepo
```text
syawal-tempmail/
├── apps/
│   └── web/                   # Frontend React + Vite + Tailwind CSS
│       ├── src/
│       │   ├── components/    # Header, AddressCard, InboxList, MessageModal, dll.
│       │   ├── hooks/         # useInbox, useCountdown
│       │   ├── services/      # API Client
│       │   └── types.ts
│       └── package.json
├── workers/
│   └── api/                   # Cloudflare Worker (HTTP API & Email Handler)
│       ├── src/
│       │   ├── email/         # PostalMime parser & envelope handler
│       │   ├── routes/        # REST API Router (/api/v1/inboxes, dll.)
│       │   ├── services/      # Inbox, Message, OTP Extractor
│       │   ├── security/      # Web Crypto, Token Hash, CORS, Sanitizer
│       │   └── index.ts       # Dual fetch & email exports
│       ├── migrations/        # SQL schema migration untuk Cloudflare D1
│       ├── tests/             # Unit tests (OTP, Sanitizer, Crypto)
│       └── wrangler.toml      # Konfigurasi Cloudflare Workers
├── docs/                      # Dokumentasi teknis & deployment
│   ├── ARCHITECTURE.md
│   ├── CLOUDFLARE_SETUP.md
│   ├── VERCEL_SETUP.md
│   ├── SECURITY.md
│   └── TESTING.md
├── .gitignore
├── README.md
└── package.json
```

---

## 🚀 Panduan Memulai Cepat (Local Development)

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Jalankan Pengujian
```bash
npm test
```

### 3. Jalankan Frontend
```bash
npm run dev:web
```
Akses frontend di `http://localhost:5173`.

### 4. Jalankan Worker API Lokal
```bash
npm run dev:api
```

---

## 🛠️ Langkah Deployment Production

Ikuti panduan lengkap di folder `docs/`:
1. **Cloudflare D1 & Email Routing**: Baca [docs/CLOUDFLARE_SETUP.md](file:///c:/TempMailWAL/docs/CLOUDFLARE_SETUP.md)
2. **Vercel Frontend & Domain**: Baca [docs/VERCEL_SETUP.md](file:///c:/TempMailWAL/docs/VERCEL_SETUP.md)
3. **Standar Keamanan**: Baca [docs/SECURITY.md](file:///c:/TempMailWAL/docs/SECURITY.md)
4. **Validasi & Testing**: Baca [docs/TESTING.md](file:///c:/TempMailWAL/docs/TESTING.md)

---

## ⚠️ Kebijakan Domain
- Domain layanan Temp Mail adalah **`syawaltzy.my.id`**.
- Domain utama pemilik **`syawaltzy.biz.id`** harus tetap terpisah dan tidak boleh terganggu.
- Record MX Cloudflare Email Routing tidak boleh dihapus saat mengonfigurasi website Vercel.
