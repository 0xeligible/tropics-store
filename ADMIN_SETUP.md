# TROPICS — Setup Admin (Vercel)

Halaman admin (`tropics-store.vercel.app/#/admin`) dilindungi login yang dicek
di server lewat Serverless Function `api/admin-auth.js`. Kata sandi TIDAK ada
di kode frontend — jangan pernah menulis kata sandi di `index.html`.

## 1. Buat hash kata sandi

Di terminal (Mac/Linux):

```bash
echo -n 'KATA-SANDI-RAHASIA' | sha256sum
```

Salin hash 64 karakter hex yang dihasilkan. Jangan pakai `echo` tanpa `-n`
(itu menambah newline dan hash-nya jadi salah).

## 2. Atur environment variable di Vercel

1. Buka https://vercel.com/0xeligibles-projects/tropics-store
2. **Settings → Environment Variables**
3. Tambah:
   - Key: `ADMIN_PASSWORD_SHA256`
   - Value: hash dari langkah 1
   - Environment: centang **Production** (dan Preview bila mau)
4. Simpan, lalu **Deployments → ⋯ → Redeploy** deployment terbaru.

## 3. Login

Buka `https://tropics-store.vercel.app/#/admin`, masukkan kata sandi.
Sesi login berlaku 8 jam dan hanya tersimpan di tab browser itu
(`sessionStorage`).

## Ganti kata sandi

Ulangi langkah 1–2 dengan kata sandi baru, lalu redeploy.

## Batasan yang perlu diketahui

- Admin di situs statis ini **hanya mengubah data di sesi browser itu saja**
  (produk/pesanan/pengaturan tidak tersimpan permanen dan tidak terlihat
  pengunjung lain). Produk permanen ditambah lewat edit array `products`
  di `index.html`, push ke GitHub, lalu Vercel deploy ulang otomatis.
- Login server ini mencegah orang iseng membuka dashboard dari browser,
  tapi bukan pengganti backend/database bila nanti butuh data admin yang
  tersimpan terpusat.
