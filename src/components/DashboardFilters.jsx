export default function DashboardFilters({ state, districts, visibleCount, searchMatch, onChange, onClearSearch, onReset }) {
  const hasQuery = Boolean(state.searchQuery.trim())
  return (
    <section className="filter-bar" aria-label="Kontrol eksplorasi dashboard">
      <div className="field field--search">
        <span>Cari &amp; sorot kecamatan</span>
        <div className="search-control">
          <input
            type="search"
            value={state.searchQuery}
            list="district-suggestions"
            aria-label="Cari & sorot kecamatan"
            placeholder="Contoh: Semarang Timur"
            onChange={(event) => onChange({ searchQuery: event.target.value })}
          />
          {hasQuery && <button className="search-clear" type="button" onClick={onClearSearch}>Hapus pencarian</button>}
        </div>
        <datalist id="district-suggestions">
          {districts.map(({ districtId, districtName }) => <option key={districtId} value={districtName} />)}
        </datalist>
        <small>Pencarian menyorot hasil; kecamatan lain tetap terlihat pada grafik.</small>
      </div>
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
