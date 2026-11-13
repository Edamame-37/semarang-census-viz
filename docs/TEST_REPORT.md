# Test Report

Tanggal eksekusi: 13 November 2026 (Asia/Jakarta).

## Environment

- Windows / PowerShell
- Node.js `v24.16.0`
- npm `11.13.0`
- React `19.3.1`
- Vite `8.3.8`
- Chromium `158.0.8127.18` via Playwright

## Commands dan hasil

| Command | Hasil |
|---|---|
| `npm run data:audit` | PASS — 1 CSV, UTF-8 BOM, 17 baris, 62 discrepancy tercatat. |
| `npm run data:prepare` | PASS — 16 kecamatan + benchmark + provenance dihasilkan. |
| `npm run data:validate` | PASS — benchmark, extrema, ties, totals, dan A/B/C/D sesuai oracle. |
| `npm run lint` | PASS — 0 error, 0 warning. |
| `npm run test` | PASS — 23/23 tests pada 3 file. |
| `npm run build` | PASS — output `dist/` berhasil dibuat. |
| `npm run test:e2e` | PASS — 12/12 Chromium tests. |

Build menghasilkan JavaScript sekitar 832 kB minified / 274 kB gzip dan peringatan Vite untuk chunk di atas 500 kB. Peringatan berasal terutama dari ECharts; build tetap sukses dan interaksi browser teruji. Tidak ada network API runtime.

## Browser dan viewport

| Project | Viewport | Interaksi | Overflow | axe WCAG A/AA |
|---|---:|---|---|---|
| desktop-chromium | 1440×900 | PASS | PASS | 0 violations |
| laptop-chromium | 1366×768 | PASS | PASS | 0 violations |
| tablet-chromium | 768×1024 | PASS | PASS | 0 violations |
| mobile-chromium | 390×844 | PASS | PASS | 0 violations |

Playwright menjalankan production preview melalui `npm run preview -- --host 127.0.0.1`. Pemeriksaan mencakup selection Mijen, nilai detail, filter A, empty state D, scorecard invariant, reset, search Semarang Timur, console errors, dan overflow halaman. Tabel mobile sengaja dapat horizontal-scroll dan memiliki instruksi visual.

Screenshot aktual:

- `docs/dashboard-desktop.png`
- `docs/dashboard-mobile.png`

## Acceptance CBQ

- CBQ-1: comparison bar menunjukkan Tembalang 11,73% dan Pedurungan 11,60% melewati 10%.
- CBQ-2: growth mode menunjukkan Mijen 3,93% tertinggi serta Gajah Mungkur, Candisari, dan Gayamsari 0,08% sebagai ties minimum.
- CBQ-3: density bar menunjukkan Semarang Timur 12.261,64 tertinggi, Tugu 1.201,59 terendah, dan 12 kecamatan di atas benchmark.
- CBQ-4: diverging bar mengurutkan Semarang Tengah sebagai deviasi absolut terbesar (`−8,12`).
- CBQ-5: scatter/chips menunjukkan A=2, B=10, C=4, D=0; A berisi Tembalang dan Genuk.

## Status pengujian lain

- Review visual screenshot desktop dan mobile: dilakukan.
- Source link BPS: diverifikasi menuju halaman publikasi resmi *Kota Semarang Dalam Angka 2024*.
- Firefox/Edge/Safari: belum dijalankan.
- Browser zoom 200% manual: belum dijalankan; layout fluid, table fallback, dan empat breakpoint telah diuji otomatis.
- User acceptance testing dengan responden eksternal: belum dilakukan. Lima tugas dan metrik pengamatan tersedia pada `DASHBOARD_PLAN.md` §9.3.
- Deployment publik: belum dilakukan; hanya production build dan preview lokal yang dijalankan.
