export default function MethodologyPanel({ provenance }) {
  return (
    <section className="methodology" id="metodologi" aria-labelledby="methodology-title">
      <div className="section-heading"><div><p className="section-index">04 / Catatan pembacaan</p><h2 id="methodology-title">Metodologi &amp; keterbatasan</h2></div><p className="scope-note">Ambang analitis, bukan standar kebijakan resmi.</p></div>
      <div className="methodology-grid">
        <article><h3>Indikator dan benchmark</h3><p>Penduduk memakai ribu jiwa, pangsa memakai poin persen, dan kepadatan memakai jiwa/km². Benchmark kota adalah agregat resmi BPS, bukan rerata sederhana 16 kecamatan.</p></article>
        <article><h3>Rasio jenis kelamin</h3><p>Rasio menyatakan jumlah laki-laki per 100 perempuan. Titik 100 dipakai sebagai baseline deviasi; nilai ini bukan persentase laki-laki atau ukuran langsung ketimpangan sosial.</p></article>
        <article><h3>Kelompok A–D</h3><p>A: kedua indikator di atas acuan; B: hanya kepadatan; C: hanya pertumbuhan; D: keduanya tidak di atas acuan. Perbandingan memakai <code>&gt;</code>; kategori bersifat deskriptif, bukan prioritas kebijakan.</p></article>
        <article><h3>Periode dan batas interpretasi</h3><p>Data bersifat cross-sectional untuk 2023. Pertumbuhan adalah satu statistik rata-rata tahunan 2020–2023, bukan deret waktu. Scatterplot tidak membuktikan sebab-akibat atau membentuk skor risiko.</p></article>
        <article><h3>Ambang eksploratif</h3><p>Ambang pangsa 10% serta klasifikasi A–D membantu eksplorasi. Keduanya bukan standar pemerintah dan tidak otomatis menunjukkan masalah atau kebutuhan pembangunan.</p></article>
        <article><h3>Status data spasial</h3><p>Tidak ada geometri kecamatan tervalidasi, sehingga dashboard memakai ranked density bar. Choropleth tidak dibuat agar batas atau lokasi administratif tidak menyesatkan.</p></article>
      </div>
      <div className="source-callout">
        <div><strong>Sumber statistik</strong><p>{provenance.publisher}, <em>{provenance.title}</em>, {provenance.table}; observasi {provenance.observationYear}.</p></div>
        <a href={provenance.sourceUrl} target="_blank" rel="noopener noreferrer">Buka publikasi sumber ↗</a>
      </div>
    </section>
  )
}
