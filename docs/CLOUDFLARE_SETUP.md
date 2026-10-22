# Syawal TempMail — Cloudflare Setup Guide

Panduan konfigurasi Cloudflare untuk domain `syawaltzy.my.id`.
> [!IMPORTANT]
> Jangan mengubah atau mengganggu konfigurasi `syawaltzy.biz.id` (domain utama pemilik).

---

## 1. Cloudflare D1 Database Setup
Buat database D1 melalui Cloudflare Dashboard atau CLI:
```bash
# Login Wrangler (jika belum)
npx wrangler login

# Buat database D1 bernama 'syawal-tempmail-db'
npx wrangler d1 create syawal-tempmail-db
```
Catat `database_name` dan `database_id` yang dihasilkan, lalu masukkan ke [wrangler.toml](file:///c:/TempMailWAL/workers/api/wrangler.toml):
```toml
[[d1_databases]]
binding = "DB"
database_name = "syawal-tempmail-db"
database_id = "<DATABASE_ID_DARI_CLOUDFLARE>"
```

Terapkan skema migrasi database:
```bash
# Untuk testing lokal:
npx wrangler d1 execute syawal-tempmail-db --local --file=./migrations/0001_initial_schema.sql

# Untuk deployment production:
npx wrangler d1 execute syawal-tempmail-db --remote --file=./migrations/0001_initial_schema.sql
```

---

## 2. Cloudflare Email Routing Configuration
Email masuk akan diteruskan dari Cloudflare Email Routing ke Cloudflare Worker.

1. Buka dashboard Cloudflare -> Pilih domain `syawaltzy.my.id`.
2. Masuk ke menu **Email** -> **Email Routing**.
3. Pastikan status Email Routing **Configured** / **Active**.
   - Cloudflare akan otomatis menambahkan record DNS berikut (jangan dihapus):
     - `MX` records mengarah ke `mx1.mail.cloudflare.net`, `mx2...`, `mx3...`.
     - `TXT` record untuk SPF: `v=spf1 include:_spf.mx.cloudflare.net ~all`.
4. Buka tab **Routing Rules**:
   - Klik **Create rule**.
   - Rule Type: **Catch-all address** (atau sesuaikan bila menggunakan custom action).
   - Match: Semua email masuk ke `@syawaltzy.my.id`.
   - Action: **Send to a Worker**.
   - Destination Worker: Pilih nama Worker API Anda (misal `syawal-tempmail-api`).
   - Simpan rule.

---

## 3. Worker Bindings & Environment Variables
Pastikan environment variables berikut dikonfigurasi di dashboard Cloudflare Workers:
- `ALLOWED_ORIGIN`: URL Vercel frontend (contoh: `https://syawaltzy.my.id` atau `https://syawal-tempmail.vercel.app`)
- `DEFAULT_EXPIRATION_MINUTES`: `10`
- `MAX_EXPIRATION_MINUTES`: `60`
- `MAX_EMAIL_SIZE_BYTES`: `5242880` (5 MB)

Deploy Worker:
```bash
cd workers/api
npm run deploy
```
Worker akan otomatis melayani request HTTP (`fetch`) dan email masuk (`email`).
