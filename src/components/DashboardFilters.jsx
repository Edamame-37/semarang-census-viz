export default function DashboardFilters({ state, visibleCount, searchMatch, onChange, onReset }) {
  const hasQuery = Boolean(state.searchQuery.trim())
  return (
    <section className="filter-bar" aria-label="Kontrol eksplorasi dashboard">
      <label className="field field--search">
        <span>Cari &amp; sorot kecamatan</span>
        <input
          type="search"
          value={state.searchQuery}
          placeholder="Contoh: Semarang Timur"
          onChange={(event) => onChange({ searchQuery: event.target.value })}
        />
      </label>
      <label className="field">
        <span>Filter kelompok</span>
        <select value={state.selectedQuadrant} onChange={(event) => onChange({ selectedQuadrant: event.target.value })}>
          <option value="ALL">Semua kelompok</option>
          <option value="A">A · Padat + tumbuh di atas acuan</option>
          <option value="B">B · Padat di atas acuan</option>
          <option value="C">C · Tumbuh di atas acuan</option>
          <option value="D">D · Tidak di atas kedua acuan</option>
        </select>
      </label>
      <div className="filter-bar__status" aria-live="polite" aria-atomic="true">
        <strong>{visibleCount} dari 16</strong>
        <span>{hasQuery ? (searchMatch ? `${searchMatch.districtName} ditemukan` : 'Tidak ada kecamatan yang cocok') : 'kecamatan ditampilkan'}</span>
      </div>
      <button className="text-button" type="button" aria-label="Reset" onClick={onReset}>Reset tampilan</button>
    </section>
  )
}
