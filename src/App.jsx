import './App.css'
import { useDashboardState } from './app/useDashboardState.js'
import ComparisonBarChart from './components/ComparisonBarChart.jsx'
import DashboardFilters from './components/DashboardFilters.jsx'
import DensityBarChart from './components/DensityBarChart.jsx'
import DensityGrowthQuadrantChart from './components/DensityGrowthQuadrantChart.jsx'
import DistrictDetailPanel from './components/DistrictDetailPanel.jsx'
import DistrictTable from './components/DistrictTable.jsx'
import ExecutiveScorecards from './components/ExecutiveScorecards.jsx'
import Header from './components/Header.jsx'
import MethodologyPanel from './components/MethodologyPanel.jsx'
import SexRatioDivergingChart from './components/SexRatioDivergingChart.jsx'
import { dashboardData } from './data/loader.js'
import { exportDistrictsCsv } from './utils/export.js'

function DataError({ errors }) {
  return (
    <main className="data-error" role="alert">
      <p className="eyebrow">Validasi gagal</p>
      <h1>Data tidak dapat ditampilkan</h1>
      <p>Dataset tidak memenuhi kontrak dashboard. Tidak ada grafik yang dirender agar nilai invalid tidak terlihat sebagai nol.</p>
      <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
    </main>
  )
}

function App() {
  const dashboard = useDashboardState(dashboardData.districts)
  if (dashboardData.status === 'error') return <DataError errors={dashboardData.errors} />

  const { districts, cityBenchmark, provenance } = dashboardData
  const highlightDistrictId = dashboard.searchMatch?.districtId ?? null

  return (
    <div className="app-shell" id="top">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
      <Header onExport={() => exportDistrictsCsv(dashboard.filteredDistricts)} />
      <main id="main-content">
        <ExecutiveScorecards benchmark={cityBenchmark} districts={districts} />
        <DashboardFilters state={dashboard.state} visibleCount={dashboard.tableRows.length} searchMatch={dashboard.searchMatch} onChange={dashboard.update} onReset={dashboard.reset} />

        <section className="dashboard-zone" aria-labelledby="zone-two-title">
          <div className="section-heading">
            <div><p className="section-index">02 / Analisis inti</p><h2 id="zone-two-title">Pola kepadatan dan pertumbuhan</h2></div>
            <p className="section-heading__note">Klik elemen data untuk menghubungkan sorotan antargrafik.</p>
          </div>
          <div className="analysis-grid analysis-grid--main">
            <DensityBarChart districts={dashboard.filteredDistricts} selectedDistrictId={dashboard.state.selectedDistrictId} highlightDistrictId={highlightDistrictId} onSelect={dashboard.selectDistrict} />
            <DensityGrowthQuadrantChart districts={dashboard.filteredDistricts} allDistricts={districts} selectedDistrictId={dashboard.state.selectedDistrictId} highlightDistrictId={highlightDistrictId} selectedQuadrant={dashboard.state.selectedQuadrant} onSelect={dashboard.selectDistrict} onQuadrantChange={(selectedQuadrant) => dashboard.update({ selectedQuadrant })} />
          </div>
        </section>

        <section className="dashboard-zone" aria-labelledby="zone-three-title">
          <div className="section-heading">
            <div><p className="section-index">03 / Perbandingan rinci</p><h2 id="zone-three-title">Bandingkan seluruh indikator</h2></div>
            <p className="section-heading__note">Panjang dan posisi adalah encoding utama; warna hanya memperkuat kategori.</p>
          </div>
          <DistrictDetailPanel district={dashboard.selectedDistrict} benchmark={cityBenchmark} onClose={() => dashboard.selectDistrict(dashboard.state.selectedDistrictId)} />
          <div className="analysis-grid analysis-grid--split">
            <ComparisonBarChart districts={dashboard.filteredDistricts} metric={dashboard.state.metric} selectedDistrictId={dashboard.state.selectedDistrictId} highlightDistrictId={highlightDistrictId} onMetricChange={(metric) => dashboard.update({ metric })} onSelect={dashboard.selectDistrict} />
            <SexRatioDivergingChart districts={dashboard.filteredDistricts} selectedDistrictId={dashboard.state.selectedDistrictId} highlightDistrictId={highlightDistrictId} onSelect={dashboard.selectDistrict} />
          </div>
          <DistrictTable rows={dashboard.tableRows} selectedDistrictId={dashboard.state.selectedDistrictId} tableSort={dashboard.state.tableSort} onSort={(tableSort) => dashboard.update({ tableSort })} onSelect={dashboard.selectDistrict} onReset={dashboard.reset} />
        </section>

        <MethodologyPanel provenance={provenance} />
      </main>
      <footer className="site-footer">
        <p><strong>Data:</strong> 2023 <span>•</span> <strong>Pertumbuhan:</strong> 2020–2023 <span>•</span> <strong>Sumber:</strong> BPS Kota Semarang, Kota Semarang Dalam Angka 2024, Tabel 3.1.1.</p>
        <p>Disusun untuk analisis dan pendidikan; bukan produk resmi BPS atau Pemerintah Kota Semarang.</p>
      </footer>
    </div>
  )
}

export default App
