export default function Header({ onExport }) {
  return (
    <header className="site-header">
      <div className="site-header__content">
        <p className="site-header__kicker">Statistik wilayah · Kota Semarang</p>
        <h1>Dashboard Demografi &amp; Rasio Jenis Kelamin</h1>
        <p className="site-header__summary">Perbandingan 16 kecamatan berdasarkan penduduk, pertumbuhan, kepadatan, dan rasio jenis kelamin.</p>
        <p className="site-header__meta"><strong>Observasi 2023</strong><span aria-hidden="true">/</span>Pertumbuhan rata-rata tahunan 2020–2023<span aria-hidden="true">/</span>BPS Kota Semarang 2024</p>
      </div>
      <nav className="site-header__actions" aria-label="Aksi dashboard">
        <a className="text-action" href="#metodologi">Lihat metodologi</a>
        <button className="button button--primary" type="button" onClick={onExport}>Unduh data CSV</button>
      </nav>
    </header>
  )
}
