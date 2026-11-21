# TROPICS Official Online Store

Toko online resmi TROPICS (@tropics.dept) — Tropical Rage, New Archive © 2026.
Checkout via WhatsApp admin (6281617078076).

Live: https://tropics-store.vercel.app
Repo: https://github.com/0xeligible/tropics-store

## File

- `index.html` — toko statis (katalog, keranjang, checkout WA, admin sesi)
- `og.jpg` — preview link 1200x630 (<300KB)
- `favicon.png` / `favicon.ico` — favicon toko
- `api/admin-auth.js` — login admin server-side (Vercel Serverless Function)
- `ADMIN_SETUP.md` — cara mengatur kata sandi admin (`ADMIN_PASSWORD_SHA256`)

## Tambah produk permanen

Edit array `products` di `index.html`, push ke `main` — Vercel deploy ulang
otomatis. Perubahan lewat dashboard Admin di situs publik hanya berlaku di
sesi browser itu saja.
