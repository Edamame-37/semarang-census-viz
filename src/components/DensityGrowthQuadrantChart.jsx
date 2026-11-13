import { useMemo } from 'react'
import { QUADRANT_LABELS } from '../data/selectors.js'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatPercent } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'
import ChartCard from './ChartCard.jsx'

const LABEL_POSITIONS = Object.freeze({ Mijen: 'right', Tembalang: 'top', Genuk: 'right', 'Semarang Timur': 'top' })

export default function DensityGrowthQuadrantChart({ districts, allDistricts, benchmark, selectedDistrictId, highlightDistrictId, selectedQuadrant, onSelect, onQuadrantChange }) {
  const option = useMemo(() => {
    const maxDensity = Math.ceil(Math.max(...allDistricts.map(({ densityPerKm2 }) => densityPerKm2)) / 1000) * 1000
    const maxGrowth = Math.ceil((Math.max(...allDistricts.map(({ growthRatePct }) => growthRatePct)) + 0.2) * 10) / 10
    return {
      ...baseChartOptions,
      grid: { top: 24, right: 26, bottom: 62, left: 76 },
      xAxis: { type: 'value', min: 0, max: maxDensity, splitNumber: 5, name: 'Kepadatan (jiwa/km²)', nameLocation: 'middle', nameGap: 42, nameTextStyle: { fontSize: 12, color: COLORS.textMuted }, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { fontSize: 12, hideOverlap: true, formatter: (value) => new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value) } },
      yAxis: { type: 'value', min: 0, max: maxGrowth, splitNumber: 4, name: 'Pertumbuhan (%/tahun)', nameLocation: 'middle', nameGap: 54, nameTextStyle: { fontSize: 12, color: COLORS.textMuted }, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { fontSize: 12, hideOverlap: true, formatter: (value) => `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(value)}%` } },
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
            symbolSize: isEmphasized ? 21 : 17,
            itemStyle: { color: COLORS[record.quadrant], borderColor: isEmphasized ? COLORS.text : '#fff', borderWidth: isEmphasized ? 4 : 2 },
            label: { show: showLabel, formatter: record.districtName, position: LABEL_POSITIONS[record.districtName] ?? 'top', distance: 7, color: COLORS.text, fontWeight: isEmphasized ? 700 : 600, fontSize: 12 },
          }
        }),
        labelLayout: { hideOverlap: true },
        emphasis: { scale: 1.25 },
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 2 }, label: { show: false }, data: [{ xAxis: benchmark.densityPerKm2 }, { yAxis: benchmark.growthRatePct }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data }) => `${data.districtName}<br/>Kepadatan: <strong>${formatNumber(data.value[0])} jiwa/km²</strong><br/>Pertumbuhan: <strong>${formatPercent(data.value[1])} per tahun</strong><br/>Kelompok ${data.quadrant}: ${QUADRANT_LABELS[data.quadrant]}<br/>Data 2023 · pertumbuhan 2020–2023` },
    }
  }, [districts, allDistricts, benchmark, selectedDistrictId, highlightDistrictId])

  const counts = Object.fromEntries(['A', 'B', 'C', 'D'].map((quadrant) => [quadrant, allDistricts.filter((record) => record.quadrant === quadrant).length]))

  return (
    <ChartCard id="quadrant" className="quadrant-card" eyebrow="CBQ 5 · Analisis multidimensi" title="Kepadatan × pertumbuhan" description="Posisi menyimpan dua nilai kontinu; warna hanya membedakan kelompok deskriptif.">
      <div className="quadrant-chips" aria-label="Filter kelompok kepadatan dan pertumbuhan">
        {Object.entries(counts).map(([quadrant, count]) => <button key={quadrant} type="button" className={`quadrant-chip quadrant-chip--${quadrant} ${selectedQuadrant === quadrant ? 'is-active' : ''}`} aria-pressed={selectedQuadrant === quadrant} onClick={() => onQuadrantChange(selectedQuadrant === quadrant ? 'ALL' : quadrant)}><strong>{quadrant}</strong><span>{count} kecamatan</span></button>)}
      </div>
      <p className="chart-reference chart-reference--split"><span><i className="reference-line" />Kepadatan kota {formatNumber(benchmark.densityPerKm2)}</span><span><i className="reference-line" />Pertumbuhan kota {formatPercent(benchmark.growthRatePct)}</span></p>
      {districts.length ? <AccessibleChart option={option} className="chart--scatter" onSelect={onSelect} ariaLabel={`Scatterplot kepadatan pada sumbu X dan pertumbuhan pada sumbu Y untuk ${districts.length} kecamatan. Tembalang dan Genuk berada dalam kelompok A.`} /> : <p className="empty-state">Tidak ada kecamatan pada kelompok D menurut ambang 2023. Pilih kelompok lain atau reset filter.</p>}
      <div className="quadrant-legend">
        {Object.entries(QUADRANT_LABELS).map(([key, label]) => <span key={key}><i className={`legend-dot legend-dot--${key}`} /> <strong>{key}</strong> {label}</span>)}
      </div>
    </ChartCard>
  )
}
