import { useMemo } from 'react'
import { QUADRANT_LABELS } from '../data/selectors.js'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatPercent } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'
import ChartCard from './ChartCard.jsx'

const LABELED_DISTRICTS = new Set(['Mijen', 'Tembalang', 'Genuk', 'Pedurungan', 'Semarang Timur'])

export default function DensityGrowthQuadrantChart({ districts, allDistricts, selectedDistrictId, highlightDistrictId, selectedQuadrant, onSelect, onQuadrantChange }) {
  const option = useMemo(() => ({
    ...baseChartOptions,
    grid: { top: 36, right: 26, bottom: 58, left: 68 },
    xAxis: { type: 'value', min: 0, max: 13000, name: 'Kepadatan (jiwa/km²)', nameLocation: 'middle', nameGap: 38, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { formatter: (value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value) } },
    yAxis: { type: 'value', min: 0, max: 4.2, name: 'Pertumbuhan (%/tahun)', nameLocation: 'middle', nameGap: 48, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { formatter: (value) => `${String(value).replace('.', ',')}%` } },
    series: [{
      type: 'scatter',
      symbolSize: 15,
      data: districts.map((record) => ({
        value: [record.densityPerKm2, record.growthRatePct],
        districtId: record.districtId,
        districtName: record.districtName,
        quadrant: record.quadrant,
        itemStyle: { color: COLORS[record.quadrant], borderColor: record.districtId === selectedDistrictId || record.districtId === highlightDistrictId ? COLORS.text : '#fff', borderWidth: record.districtId === selectedDistrictId || record.districtId === highlightDistrictId ? 4 : 2 },
        label: { show: LABELED_DISTRICTS.has(record.districtName) || record.districtId === selectedDistrictId, formatter: record.districtName, position: 'top', color: COLORS.text, fontWeight: 600, fontSize: 11 },
      })),
      emphasis: { scale: 1.3 },
      markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 2 }, label: { color: COLORS.textMuted, position: 'insideEndTop' }, data: [{ xAxis: 4534.07, label: { formatter: 'Kepadatan kota', position: 'insideEndTop' } }, { yAxis: 0.9, label: { formatter: 'Pertumbuhan kota', position: 'insideEndTop' } }] },
    }],
    tooltip: { ...baseChartOptions.tooltip, formatter: ({ data }) => `${data.districtName}<br/>Kepadatan: <strong>${formatNumber(data.value[0])} jiwa/km²</strong><br/>Pertumbuhan: <strong>${formatPercent(data.value[1])} per tahun</strong><br/>Kelompok ${data.quadrant}: ${QUADRANT_LABELS[data.quadrant]}<br/>Data 2023 · pertumbuhan 2020–2023` },
  }), [districts, selectedDistrictId, highlightDistrictId])

  const counts = Object.fromEntries(['A', 'B', 'C', 'D'].map((quadrant) => [quadrant, allDistricts.filter((record) => record.quadrant === quadrant).length]))

  return (
    <ChartCard id="quadrant" eyebrow="CBQ 5 • Analisis multidimensi" title="Kepadatan × pertumbuhan" description="Dua garis acuan membagi kecamatan menjadi empat kelompok analitis—bukan peringkat risiko.">
      <div className="quadrant-chips" aria-label="Filter kelompok kepadatan dan pertumbuhan">
        {Object.entries(counts).map(([quadrant, count]) => <button key={quadrant} type="button" className={`quadrant-chip quadrant-chip--${quadrant} ${selectedQuadrant === quadrant ? 'is-active' : ''}`} aria-pressed={selectedQuadrant === quadrant} onClick={() => onQuadrantChange(selectedQuadrant === quadrant ? 'ALL' : quadrant)}><strong>{quadrant}</strong><span>{count} kecamatan</span></button>)}
      </div>
      {districts.length ? <AccessibleChart option={option} className="chart--scatter" onSelect={onSelect} ariaLabel="Scatterplot kepadatan pada sumbu X dan pertumbuhan pada sumbu Y untuk 16 kecamatan. Tembalang dan Genuk berada dalam kelompok A." /> : <p className="empty-state">Tidak ada kecamatan pada kelompok D menurut ambang 2023. Pilih kelompok lain atau reset filter.</p>}
      <div className="quadrant-legend">
        {Object.entries(QUADRANT_LABELS).map(([key, label]) => <span key={key}><i className={`legend-dot legend-dot--${key}`} /> <strong>{key}</strong> {label}</span>)}
      </div>
    </ChartCard>
  )
}
