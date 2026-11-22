export default function DashboardFilters({ state, districts, onChange, onClearSearch, onReset }) {
  const hasQuery = Boolean(state.searchQuery.trim())
  return (
    <div className="pbi-tile pbi-tile--filter">
      <div className="pbi-tile__body">
        <div className="pbi-filters">
          <div className="pbi-slicer">
            <span className="pbi-slicer__label">Cari</span>
            <input
              type="search"
              value={state.searchQuery}
              list="district-suggestions"
              aria-label="Cari kecamatan"
              placeholder="Kecamatan..."
              onChange={(event) => onChange({ searchQuery: event.target.value })}
            />
            <datalist id="district-suggestions">
              {districts.map(({ districtId, districtName }) => <option key={districtId} value={districtName} />)}
            </datalist>
            {hasQuery && <button className="pbi-reset-btn" type="button" onClick={onClearSearch}>✕</button>}
          </div>
          <div className="pbi-slicer">
            <span className="pbi-slicer__label">Kelompok</span>
            <select value={state.selectedQuadrant} onChange={(event) => onChange({ selectedQuadrant: event.target.value })}>
              <option value="ALL">Semua</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <button className="pbi-reset-btn" type="button" onClick={onReset} style={{ marginLeft: 'auto' }}>Reset</button>
        </div>
      </div>
    </div>
  )
}
