import { useMemo } from 'react'
import { sortRecords } from '../data/selectors.js'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatSigned } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'
import ChartCard from './ChartCard.jsx'

export default function DensityBarChart({ districts, selectedDistrictId, highlightDistrictId, onSelect }) {
  const option = useMemo(() => {
    const sorted = sortRecords(districts, 'densityPerKm2')
    return {
      ...baseChartOptions,
      grid: { top: 16, right: 36, bottom: 44, left: 128 },
      xAxis: { type: 'value', min: 0, name: 'jiwa/km²', nameLocation: 'middle', nameGap: 30, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { formatter: (value) => new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value) } },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisTick: { show: false }, axisLine: { show: false } },
      series: [{
        type: 'bar',
        barMaxWidth: 20,
        data: sorted.map((record) => ({
          value: record.densityPerKm2,
          districtId: record.districtId,
          itemStyle: {
            color: record.districtId === selectedDistrictId || record.districtId === highlightDistrictId ? COLORS.selected : record.densityAboveCity ? COLORS.primary : COLORS.neutral,
            borderColor: record.districtId === selectedDistrictId ? COLORS.text : 'transparent',
            borderWidth: 2,
          },
        })),
        label: { show: districts.length <= 4, position: 'right', formatter: ({ value }) => formatNumber(value) },
        markLine: { symbol: 'none', lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 2 }, label: { formatter: 'Acuan kota 4.534,07', position: 'insideEndTop', color: COLORS.textMuted }, data: [{ xAxis: 4534.07 }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data, name }) => `${name}<br/>Kepadatan: <strong>${formatNumber(data.value)} jiwa/km²</strong><br/>Selisih acuan: ${formatSigned(data.value - 4534.07, ' jiwa/km²')}<br/>Data 2023` },
    }
  }, [districts, selectedDistrictId, highlightDistrictId])

  return (
    <ChartCard id="density" eyebrow="CBQ 3 • Perbandingan spasial tanpa peta" title="Kepadatan penduduk per kecamatan" description="Panjang batang menunjukkan kepadatan. Garis putus-putus adalah agregat kota, bukan rerata sederhana kecamatan.">
      {districts.length ? <AccessibleChart option={option} className="chart--tall" onSelect={onSelect} ariaLabel={`Grafik batang kepadatan ${districts.length} kecamatan. Semarang Timur tertinggi; garis acuan kota 4.534,07 jiwa per kilometer persegi.`} /> : <p className="empty-state">Tidak ada kecamatan pada kelompok ini menurut ambang 2023.</p>}
      <p className="chart-footnote">Peta tidak ditampilkan karena dataset tidak menyediakan geometri kecamatan tervalidasi.</p>
    </ChartCard>
  )
}
