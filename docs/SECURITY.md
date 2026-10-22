# Syawal TempMail — Security Specification

## 1. Zero Trust Inbox Ownership (Anti-IDOR)
- **Token Akses Unik**: Saat inbox dibuat, server menghasilkan token kriptografis acak 32-byte (Base64url).
- **One-Way Hash**: Token disimpan di D1 hanya dalam bentuk hash SHA-256 (`token_hash`).
- **Verifikasi**: Setiap request ke `/api/v1/inboxes/me` atau `/api/v1/inboxes/me/messages/*` wajib menyertakan header `Authorization: Bearer <TOKEN>`.
- Token di-hash di runtime Worker sebelum mencocokkan ke database. Mengetahui alamat email saja (`k8x2p9m4@syawaltzy.my.id`) **TIDAK BISA** digunakan untuk membaca pesan.

## 2. Email Intake & Envelope Verification
- **Verifikasi Envelope Asli**: Worker membaca alamat penerima dari `message.to` (envelope SMTP riil), bukan dari header `To:` yang mudah dipalsukan (spoofing).
- **Validasi Keberadaan Inbox**: Jika alamat penerima tidak terdaftar di tabel `inboxes` atau sudah kedaluwarsa (`expires_at < sekarang`), Worker langsung membuang email (`message.setReject()` atau drop).
- **Batas Ukuran**: Email dengan ukuran melebihi 5MB otomatis ditolak untuk mencegah DoS/Resource Exhaustion.

## 3. Pencegahan XSS & Sanitasi Konten
- **Text-First Presentation**: UI secara default memprioritaskan `text_content`.
- **Sanitasi HTML**: Tag `<script>`, `<iframe>`, `<object>`, `<embed>`, inline event handlers (`onclick`, `onload`), dan external auto-loaded trackers dibersihkan sebelum disimpan atau dirender.
- **Content-Security-Policy (CSP)** ketat diterapkan pada frontend.

## 4. Rate Limiting & Abuse Prevention
- Rate limit pada endpoint pembuatan inbox per IP (menggunakan CF IP header / In-Memory KV rate limit).
- Tidak ada fitur SMTP Relay atau pengiriman email keluar untuk mencegah abuse spamming.

## 5. Retensi Data & Cleanup
- Masa aktif default inbox: 10 menit (dapat disesuaikan secara dinamis oleh backend hingga batas maksimal 60 menit).
- Scheduled Cron Trigger pada Worker secara berkala menghapus inbox dan pesan yang telah kedaluwarsa.
