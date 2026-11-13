export default function MethodologyPanel({ provenance }) {
  return (
    <section className="methodology" id="metodologi" aria-labelledby="methodology-title">
      <div className="section-heading"><div><p className="section-index">04 / Catatan pembacaan</p><h2 id="methodology-title">Metodologi &amp; keterbatasan</h2></div><p className="scope-note">Ambang analitis, bukan standar kebijakan resmi.</p></div>
      <div className="methodology-grid">
        <article><h3>Cara membaca indikator</h3><p>Jumlah penduduk memakai ribu jiwa, pangsa memakai poin persen, kepadatan memakai jiwa/km², dan rasio berarti laki-laki per 100 perempuan. Angka pertumbuhan adalah rata-rata tahunan 2020–2023, bukan empat observasi tahunan.</p></article>
        <article><h3>Kelompok A–D</h3><p>A: kepadatan dan pertumbuhan di atas acuan kota; B: hanya kepadatan; C: hanya pertumbuhan; D: tidak di atas keduanya. Perbandingan memakai tanda <code>&gt;</code>, bukan <code>≥</code>.</p></article>
        <article><h3>Batas interpretasi</h3><p>Dashboard ini bersifat cross-sectional dan eksploratif. Hubungan pada scatterplot tidak membuktikan sebab-akibat, bukan skor risiko, dan tidak otomatis menjadi rekomendasi kebijakan.</p></article>
        <article><h3>Status data spasial</h3><p>Tidak ada geometri kecamatan tervalidasi dalam dataset, sehingga dashboard memakai ranked density bar. Choropleth tidak dibuat untuk menghindari lokasi atau batas administratif yang menyesatkan.</p></article>
      </div>
      <div className="source-callout">
        <div><strong>Sumber statistik</strong><p>{provenance.publisher}, <em>{provenance.title}</em>, {provenance.table}; observasi {provenance.observationYear}.</p></div>
        <a href={provenance.sourceUrl} target="_blank" rel="noopener noreferrer">Buka publikasi sumber ↗</a>
      </div>
    </section>
  )
}
