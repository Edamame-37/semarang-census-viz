# Visualization Specification

| CBQ | Visual | Encoding utama | Acuan |
|---|---|---|---|
| Pangsa >10% | Ranked comparison bar | Panjang/posisi X | 10% |
| Pertumbuhan tertinggi/terendah | Ranked comparison bar | Panjang/posisi X | 0,90%/tahun |
| Kepadatan di atas kota | Ranked density bar | Panjang/posisi X | 4.534,07 jiwa/km² |
| Deviasi rasio terbesar | Diverging bar | Posisi bertanda dari nol | Nol = rasio 100 |
| Kepadatan × pertumbuhan | Scatterplot empat kuadran | X density, Y growth | X=4.534,07; Y=0,90 |

Semua bar magnitude dimulai dari nol. Diverging bar menggambar `rasio − 100`, bukan rasio asli dari nol. Hue A–D menyatakan identitas kategori, bukan kualitas. Nilai presisi selalu tersedia melalui tooltip dan tabel semantik.

Search adalah locate/highlight; filter A–D mengurangi record; selection menyorot record yang sama tanpa menyembunyikan record lain. Empat scorecard selalu memakai benchmark kota dan tidak mengikuti filter.

Tidak ada line chart karena dataset bukan time series. Tidak ada choropleth karena tidak ada geometri tervalidasi. Tidak ada 3D, indeks gabungan, atau causal claim.
