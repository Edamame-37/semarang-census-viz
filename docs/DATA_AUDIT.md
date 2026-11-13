# Audit Data

Tanggal audit: 13 November 2026 (Asia/Jakarta).

## Berkas yang ditemukan

- Lokasi: `dataset/Penduduk, Laju Pertumbuhan Penduduk, Distribusi Persentase Penduduk Kepadatan Penduduk, Rasio Jenis Kelamin Penduduk Menurut Kecamatan di Kota Semarang, 2023 (1).csv`
- Ukuran: 790 byte.
- Encoding: UTF-8 dengan BOM.
- Delimiter: koma.
- SHA-256: `C4D0990293176FE13F8C07E8A72E617C3667F9C20B62D71969941A7524153A50`.
- Baris: 16 kecamatan + 1 agregat `Semarang`.
- Geometri: tidak ada GeoJSON, SHP, atau format geospasial lain.

Kolom terbaca: kecamatan, jumlah penduduk (ribu), laju pertumbuhan per tahun, persentase penduduk, kepadatan per km², dan rasio jenis kelamin. Semua sel numerik dapat diparse dan tidak ditemukan null.

## Pemetaan

| CSV | Field kanonik | Unit |
|---|---|---|
| Kecamatan | `districtName` | nama BPS |
| Jumlah Penduduk (Ribu) | `populationThousand` | ribu jiwa |
| Laju Pertumbuhan Penduduk per Tahun | `growthRatePct` | %/tahun, 2020–2023 |
| Persentase Penduduk | `populationSharePct` | poin persen |
| Kepadatan Penduduk per km persegi (Km2) | `densityPerKm2` | jiwa/km² |
| Rasio Jenis Kelamin Penduduk | `sexRatioPer100Females` | laki-laki per 100 perempuan |

Alias `Gunung Pati` dinormalisasi untuk pencocokan menjadi `Gunungpati`; label tampilan mengikuti oracle laporan. Baris `Semarang` dipisahkan dari 16 kecamatan dan dipetakan ke benchmark kota.

## Hasil pencocokan ground truth

Audit menemukan 62 sel berbeda dari ground truth §2.7 `DASHBOARD_PLAN.md`. Mayoritas merupakan presisi CSV satu/zero desimal dibanding oracle dua desimal, tetapi kolom pertumbuhan juga berbeda material. Contoh:

| Wilayah | Field | CSV lokal | Oracle §2.7 |
|---|---|---:|---:|
| Mijen | Pertumbuhan | 3,63 | 3,93 |
| Tembalang | Pertumbuhan | 1,62 | 1,73 |
| Genuk | Pertumbuhan | 2,45 | 2,64 |
| Gayamsari | Pertumbuhan | 0,11 | 0,08 |
| Kota Semarang | Pertumbuhan | 0,87 | 0,90 |
| Kota Semarang | Penduduk (ribu) | 1.694,7 | 1.694,74 |

Daftar lengkap perbedaan tersimpan secara machine-readable di `data/metadata.json` dan dapat direproduksi dengan `npm run data:audit`.

## Keputusan sumber runtime

Dashboard memakai ground truth §2.7 sebagai data kanonik karena spesifikasi menetapkannya sebagai acceptance oracle dari Lampiran A laporan dan membutuhkan hasil CBQ yang tepat. CSV pengguna tidak diubah. Pipeline hanya membacanya, menghitung checksum, dan mendokumentasikan perbedaan. Output runtime berada di `data/processed/semarang-2023.json`.

Sumber statistik yang ditampilkan: BPS Kota Semarang, *Kota Semarang Dalam Angka 2024*, Tabel 3.1.1, observasi 2023; laju pertumbuhan rata-rata tahunan 2020–2023.

## Status GIS

`MVP mode = no GIS`. Gate 16/16 tidak dapat dijalankan karena tidak ada geometri lokal. Ranked density bar dipakai sebagai visual pengganti yang jujur; tidak ada fetch geoservice atau peta fiktif.
