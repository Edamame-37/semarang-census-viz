import { useMemo } from 'react'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatPercent } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'

const LABEL_POSITIONS = Object.freeze({ Mijen: 'right', Tembalang: 'top', Genuk: 'right', 'Semarang Timur': 'top' })

export default function DensityGrowthQuadrantChart({ districts, allDistricts, benchmark, selectedDistrictId, highlightDistrictId, selectedQuadrant, onSelect, onQuadrantChange }) {
  const option = useMemo(() => {
    const maxDensity = Math.ceil(Math.max(...allDistricts.map(({ densityPerKm2 }) => densityPerKm2)) / 1000) * 1000
    const maxGrowth = Math.ceil((Math.max(...allDistricts.map(({ growthRatePct }) => growthRatePct)) + 0.2) * 10) / 10
    return {
      ...baseChartOptions,
      grid: { top: 20, right: 20, bottom: 50, left: 68 },
      xAxis: { type: 'value', min: 0, max: maxDensity, splitNumber: 5, name: 'Kepadatan (jiwa/km²)', nameLocation: 'middle', nameGap: 34, nameTextStyle: { fontSize: 11, color: COLORS.textMuted }, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { fontSize: 11, hideOverlap: true, formatter: (value) => new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value) } },
      yAxis: { type: 'value', min: 0, max: maxGrowth, splitNumber: 4, name: 'Pertumbuhan (%/thn)', nameLocation: 'middle', nameGap: 44, nameTextStyle: { fontSize: 11, color: COLORS.textMuted }, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { fontSize: 11, hideOverlap: true, formatter: (value) => `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(value)}%` } },
      series: [{
        type: 'scatter',
        data: districts.map((record) => {
          const isEmphasized = record.districtId === selectedDistrictId || record.districtId === highlightDistrictId
          const showLabel = Boolean(LABEL_POSITIONS[record.districtName]) || isEmphasized
          return {
            value: [record.densityPerKm2, record.growthRatePct],
            districtId: record.districtId,
            districtName: record.districtName,
            quadrant: record.quadrant,
            symbolSize: isEmphasized ? 20 : 15,
            itemStyle: { color: COLORS[record.quadrant], borderColor: isEmphasized ? COLORS.selected : '#fff', borderWidth: isEmphasized ? 3 : 2 },
            label: { show: showLabel, formatter: record.districtName, position: LABEL_POSITIONS[record.districtName] ?? 'top', distance: 6, color: COLORS.text, fontWeight: isEmphasized ? 700 : 500, fontSize: 11 },
          }
        }),
        labelLayout: { hideOverlap: true },
        emphasis: { scale: 1.3 },
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 2 }, label: { show: false }, data: [{ xAxis: benchmark.densityPerKm2 }, { yAxis: benchmark.growthRatePct }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data }) => `<strong>${data.districtName}</strong><br/>Kepadatan: ${formatNumber(data.value[0])} jiwa/km²<br/>Pertumbuhan: ${formatPercent(data.value[1])}%/thn<br/>Kelompok ${data.quadrant}` },
    }
  }, [districts, allDistricts, benchmark, selectedDistrictId, highlightDistrictId])

  const quadrants = ['A', 'B', 'C', 'D']

  return (
    <div className="pbi-tile pbi-tile--scatter">
      <div className="pbi-tile__head">
        <h2 className="pbi-tile__title">Kepadatan × Pertumbuhan</h2>
      </div>
      <div className="pbi-tile__body">
        <div className="pbi-quad-chips">
          {quadrants.map((quadrant) => (
            <button key={quadrant} type="button" className={`pbi-quad-chip ${selectedQuadrant === quadrant ? 'is-active' : ''}`} aria-pressed={selectedQuadrant === quadrant} onClick={() => onQuadrantChange(selectedQuadrant === quadrant ? 'ALL' : quadrant)}>
              <span className={`pbi-quad-chip__dot pbi-quad-chip__dot--${quadrant}`} />
              <strong>{quadrant}</strong>
            </button>
          ))}
        </div>
        {districts.length ? <AccessibleChart option={option} className="pbi-chart pbi-chart--scatter" onSelect={onSelect} ariaLabel={`Scatterplot kepadatan vs pertumbuhan ${districts.length} kecamatan`} /> : <div className="pbi-empty">Tidak ada data</div>}
      </div>
    </div>
  )
}
