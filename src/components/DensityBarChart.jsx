import { useMemo } from 'react'
import { sortRecords } from '../data/selectors.js'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatSigned } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'

export default function DensityBarChart({ districts, allDistricts, benchmark, selectedDistrictId, highlightDistrictId, onSelect }) {
  const option = useMemo(() => {
    const sorted = sortRecords(districts, 'densityPerKm2')
    return {
      ...baseChartOptions,
      grid: { top: 12, right: 24, bottom: 44, left: 130 },
      xAxis: { type: 'value', min: 0, splitNumber: 4, name: 'jiwa/km²', nameLocation: 'middle', nameGap: 30, nameTextStyle: { fontSize: 11, color: COLORS.textMuted }, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { fontSize: 11, hideOverlap: true, formatter: (value) => new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value) } },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisLabel: { fontSize: 11, color: COLORS.text }, axisTick: { show: false }, axisLine: { show: false } },
      series: [{
        type: 'bar',
        barMaxWidth: 18,
        data: sorted.map((record) => ({
          value: record.densityPerKm2,
          districtId: record.districtId,
          itemStyle: {
            color: record.districtId === selectedDistrictId || record.districtId === highlightDistrictId ? COLORS.selected : record.densityAboveCity ? COLORS.primary : COLORS.neutral,
            borderColor: record.districtId === selectedDistrictId ? COLORS.text : 'transparent',
            borderWidth: 1,
          },
        })),
        label: { show: districts.length <= 4, position: 'right', formatter: ({ value }) => formatNumber(value), fontSize: 10 },
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 1.5 }, label: { show: false }, data: [{ xAxis: benchmark.densityPerKm2 }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data, name }) => `<strong>${name}</strong><br/>Kepadatan: ${formatNumber(data.value)} jiwa/km²<br/>Selisih: ${formatSigned(data.value - benchmark.densityPerKm2)}` },
    }
  }, [districts, benchmark, selectedDistrictId, highlightDistrictId])

  return (
    <div className="pbi-tile pbi-tile--density">
      <div className="pbi-tile__head">
        <h2 className="pbi-tile__title">Kepadatan per Kecamatan</h2>
      </div>
      <div className="pbi-tile__body">
        {districts.length ? <AccessibleChart option={option} className="pbi-chart pbi-chart--tall" onSelect={onSelect} ariaLabel={`Grafik batang kepadatan ${districts.length} kecamatan`} /> : <div className="pbi-empty">Tidak ada data</div>}
      </div>
    </div>
  )
}
