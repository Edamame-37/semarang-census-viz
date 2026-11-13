# Deployment

## Build lokal

Persyaratan yang diuji: Node.js 24.16.0 dan npm 11.13.0.

```bash
npm install
npm run data:prepare
npm run data:validate
npm run test
npm run lint
npm run build
npm run preview
```

Output produksi: `dist/`.

## Cloudflare Pages

- Root directory: root repository.
- Build command: `npm run build`.
- Build output directory: `dist`.
- Production branch: sesuaikan dengan branch utama repository.
- Tidak diperlukan environment variable atau secret.

Vite memakai `base: '/'`, sesuai domain root Cloudflare Pages/Netlify. Untuk GitHub Pages di subpath, ubah `base` pada `vite.config.js` ke nama repository lalu uji ulang seluruh aset.

## Security dan publication checklist

- Jangan menaruh token pada `VITE_*`; nilainya terlihat di bundle publik.
- Dataset sumber bersifat statistik publik, tetapi provenance dan atribusi harus dipertahankan.
- Publikasi tidak memakai logo resmi BPS/Pemkot dan menampilkan disclaimer non-resmi.
- Jika geometri ditambahkan kelak, audit lisensi, CRS, versi batas, dan join 16/16 sebelum build.
