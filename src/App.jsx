import './App.css'
import { useDashboardState } from './app/useDashboardState.js'
import ComparisonBarChart from './components/ComparisonBarChart.jsx'
import DashboardFilters from './components/DashboardFilters.jsx'
import DensityBarChart from './components/DensityBarChart.jsx'
import DensityGrowthQuadrantChart from './components/DensityGrowthQuadrantChart.jsx'
import DistrictTable from './components/DistrictTable.jsx'
import ExecutiveScorecards from './components/ExecutiveScorecards.jsx'
import SexRatioDivergingChart from './components/SexRatioDivergingChart.jsx'
import { dashboardData } from './data/loader.js'
import { exportCompleteDataset } from './utils/export.js'

function DataError({ errors }) {
  return (
    <main className="data-error" role="alert">
      <h1>Data tidak dapat ditampilkan</h1>
      <ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul>
    </main>
  )
}

function App() {
  const dashboard = useDashboardState(dashboardData.districts)
  if (dashboardData.status === 'error') return <DataError errors={dashboardData.errors} />

  const { districts, cityBenchmark } = dashboardData
  const highlightDistrictId = dashboard.searchMatch?.districtId ?? null

  return (
    <div className="pbi-shell">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>

      {/* Power BI Header */}
      <header className="pbi-header">
        <div className="pbi-header__logo">
          <svg viewBox="0 0 20 20" fill="none"><rect x="2" y="8" width="4" height="10" rx="1" fill="#F2C811"/><rect x="8" y="4" width="4" height="14" rx="1" fill="#F2C811"/><rect x="14" y="1" width="4" height="17" rx="1" fill="#F2C811"/></svg>
          Dashboard
        </div>
        <div className="pbi-header__sep" />
        <h1 className="pbi-header__title">Demografi Kota Semarang 2023</h1>
        <div className="pbi-header__actions">
          <button className="pbi-header__btn" type="button" onClick={() => exportCompleteDataset(districts)}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 10.5L3.5 6H6V1h4v5h2.5L8 10.5zM2 13v2h12v-2H2z"/></svg>
            Export Dataset
          </button>
        </div>
      </header>

      {/* Canvas */}
      <main className="pbi-canvas" id="main-content">
        <div className="pbi-canvas__inner">

          {/* KPI Cards */}
          <ExecutiveScorecards benchmark={cityBenchmark} />

          {/* Filter Slicer */}
          <DashboardFilters
            state={dashboard.state}
            districts={districts}
            onChange={dashboard.update}
            onClearSearch={dashboard.clearSearch}
            onReset={dashboard.reset}
          />

          {/* Visualizations 2x2 Grid */}
          <DensityGrowthQuadrantChart
            districts={dashboard.filteredDistricts}
            allDistricts={districts}
            benchmark={cityBenchmark}
            selectedDistrictId={dashboard.state.selectedDistrictId}
            highlightDistrictId={highlightDistrictId}
            selectedQuadrant={dashboard.state.selectedQuadrant}
            onSelect={dashboard.selectDistrict}
            onQuadrantChange={(selectedQuadrant) => dashboard.update({ selectedQuadrant })}
          />

          <DensityBarChart
            districts={dashboard.filteredDistricts}
            allDistricts={districts}
            benchmark={cityBenchmark}
            selectedDistrictId={dashboard.state.selectedDistrictId}
            highlightDistrictId={highlightDistrictId}
            onSelect={dashboard.selectDistrict}
          />

          <ComparisonBarChart
            districts={dashboard.filteredDistricts}
            benchmark={cityBenchmark}
            metric={dashboard.state.metric}
            sortDirection={dashboard.state.chartSortDirection}
            selectedDistrictId={dashboard.state.selectedDistrictId}
            highlightDistrictId={highlightDistrictId}
            onMetricChange={(metric) => dashboard.update({ metric })}
            onSortChange={(chartSortDirection) => dashboard.update({ chartSortDirection })}
            onSelect={dashboard.selectDistrict}
          />

          <SexRatioDivergingChart
            districts={dashboard.filteredDistricts}
            selectedDistrictId={dashboard.state.selectedDistrictId}
            highlightDistrictId={highlightDistrictId}
            onSelect={dashboard.selectDistrict}
          />

          {/* Table Visual 16 Kecamatan */}
          <DistrictTable
            rows={dashboard.tableRows}
            selectedDistrictId={dashboard.state.selectedDistrictId}
            tableSort={dashboard.state.tableSort}
            onSort={(tableSort) => dashboard.update({ tableSort })}
            onSelect={dashboard.selectDistrict}
            onReset={dashboard.reset}
          />

        </div>
      </main>

      {/* Bottom Tab Bar */}
      <div className="pbi-tabbar">
        <button className="pbi-tab pbi-tab--active" type="button">Overview</button>
      </div>
    </div>
  )
}

export default App
