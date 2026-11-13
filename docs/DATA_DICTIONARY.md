# Data Dictionary

## Record kecamatan

| Field | Tipe | Definisi |
|---|---|---|
| `districtId` | string | Slug unik dan stabil untuk selection/key. |
| `districtName` | string | Nama kecamatan untuk tampilan. |
| `populationThousand` | number | Penduduk 2023 dalam ribu jiwa. |
| `populationSharePct` | number | Pangsa resmi BPS dalam poin persen. |
| `growthRatePct` | number | Laju pertumbuhan rata-rata per tahun periode 2020–2023. |
| `densityPerKm2` | number | Penduduk per km² pada 2023. |
| `sexRatioPer100Females` | number | Laki-laki per 100 perempuan pada 2023. |
| `populationShareAbove10` | boolean | `populationSharePct > 10`. |
| `growthAboveCity` | boolean | `growthRatePct > 0.90`. |
| `densityAboveCity` | boolean | `densityPerKm2 > 4534.07`. |
| `sexRatioSignedDeviation` | number | Rasio dikurangi 100. |
| `sexRatioAbsoluteDeviation` | number | Nilai absolut deviasi dari 100. |
| `quadrant` | A/B/C/D | Kategori nominal kepadatan × pertumbuhan. |

## Benchmark kota

Benchmark resmi tidak dihitung ulang dari 16 kecamatan: penduduk `1.694,74` ribu, pangsa `100,00%`, pertumbuhan `0,90%`, kepadatan `4.534,07 jiwa/km²`, dan rasio `97,91`.

Kategori memakai perbandingan ketat `>`:

- A: kepadatan dan pertumbuhan di atas kota.
- B: kepadatan di atas kota; pertumbuhan tidak di atas kota.
- C: pertumbuhan di atas kota; kepadatan tidak di atas kota.
- D: keduanya tidak di atas kota.

Kategori adalah alat eksplorasi, bukan ranking, standar pemerintah, atau skor risiko.
