# Syawal TempMail — Vercel Setup Guide

Panduan menghubungkan frontend Syawal TempMail ke Vercel dengan custom domain `syawaltzy.my.id`.

---

## 1. Import Repository ke Vercel
1. Login ke [Vercel Dashboard](https://vercel.com).
2. Klik **Add New...** -> **Project**.
3. Import repository GitHub proyek Syawal TempMail.
4. Pada **Root Directory**, pilih: `apps/web`.
5. Framework Preset: **Vite**.
6. Build Command: `npm run build`
7. Output Directory: `dist`

---

## 2. Environment Variables di Vercel
Tambahkan environment variable pada pengaturan proyek Vercel:
- `VITE_API_BASE_URL`: URL publik Cloudflare Worker API Anda
  - Contoh: `https://syawal-tempmail-api.<account-subdomain>.workers.dev` atau `https://api.syawaltzy.my.id` (jika menggunakan custom subdomain worker).
- `VITE_DEFAULT_EXPIRATION_MINUTES`: `10`
- `VITE_APP_NAME`: `Syawal TempMail`
- `VITE_EMAIL_DOMAIN`: `syawaltzy.my.id`

---

## 3. Konfigurasi Custom Domain di Vercel & DNS Cloudflare
1. Di project Vercel, buka **Settings** -> **Domains**.
2. Masukkan domain: `syawaltzy.my.id` (atau `www.syawaltzy.my.id`).
3. Vercel akan memberikan record DNS yang dibutuhkan:
   - **Apex domain (`syawaltzy.my.id`)**:
     - Tipe: `A`
     - Name: `@`
     - Value: `76.76.21.21`
   - **Subdomain `www`**:
     - Tipe: `CNAME`
     - Name: `www`
     - Value: `cname.vercel-dns.com`
4. Di Dashboard Cloudflare -> DNS records `syawaltzy.my.id`:
   - Tambahkan record `A` ke `76.76.21.21`.
   - **PENTING**: Set Proxy status ke **DNS Only (Grey Cloud)** terlebih dahulu saat proses verifikasi Vercel SSL. Setelah SSL issued, Anda dapat mengaktifkan Proxy Cloudflare (Orange Cloud) bila diinginkan (dengan SSL mode Cloudflare diset ke "Full" atau "Full (Strict)").
   - **PERINGATAN**: JANGAN menghapus record `MX` Cloudflare Email Routing yang sudah ada saat menambahkan record `A` ini! Website dan Email Routing dapat hidup berdampingan di domain yang sama.
