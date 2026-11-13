import { useMemo } from 'react'
import { getDensitySummary, sortRecords } from '../data/selectors.js'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatSigned } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'
import ChartCard from './ChartCard.jsx'

export default function DensityBarChart({ districts, allDistricts, benchmark, selectedDistrictId, highlightDistrictId, onSelect }) {
  const summary = useMemo(() => getDensitySummary(allDistricts), [allDistricts])
  const option = useMemo(() => {
    const sorted = sortRecords(districts, 'densityPerKm2')
    return {
      ...baseChartOptions,
      grid: { top: 18, right: 30, bottom: 50, left: 146 },
      xAxis: { type: 'value', min: 0, splitNumber: 4, name: 'jiwa/km²', nameLocation: 'middle', nameGap: 34, nameTextStyle: { fontSize: 12, color: COLORS.textMuted }, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { fontSize: 12, hideOverlap: true, formatter: (value) => new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value) } },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisLabel: { fontSize: 12, color: COLORS.text }, axisTick: { show: false }, axisLine: { show: false } },
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
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 2 }, label: { show: false }, data: [{ xAxis: benchmark.densityPerKm2 }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data, name }) => `${name}<br/>Kepadatan: <strong>${formatNumber(data.value)} jiwa/km²</strong><br/>Selisih acuan: ${formatSigned(data.value - benchmark.densityPerKm2, ' jiwa/km²')}<br/>Data 2023` },
    }
  }, [districts, benchmark, selectedDistrictId, highlightDistrictId])

  return (
    <ChartCard id="density" eyebrow="CBQ 3 · Perbandingan spasial tanpa peta" title="Kepadatan penduduk per kecamatan" description="Panjang batang menunjukkan kepadatan; posisi yang sama memudahkan perbandingan presisi.">
      <p className="chart-reference"><span aria-hidden="true" className="reference-line" />Acuan kota {formatNumber(benchmark.densityPerKm2)} jiwa/km²</p>
      <div className="chart-facts" aria-label="Ringkasan kepadatan seluruh kota">
        <span><strong>Tertinggi</strong> {summary.highest?.districtName} · {formatNumber(summary.highest?.densityPerKm2)}</span>
        <span><strong>Terendah</strong> {summary.lowest?.districtName} · {formatNumber(summary.lowest?.densityPerKm2)}</span>
        <span><strong>{summary.aboveCityCount}</strong> kecamatan di atas acuan</span>
      </div>
      {districts.length ? <AccessibleChart option={option} className="chart--tall" onSelect={onSelect} ariaLabel={`Grafik batang kepadatan ${districts.length} kecamatan. Semarang Timur tertinggi dan Tugu terendah. Acuan kota ${formatNumber(benchmark.densityPerKm2)} jiwa per kilometer persegi.`} /> : <p className="empty-state">Tidak ada kecamatan pada kelompok ini menurut ambang 2023.</p>}
      <p className="chart-footnote">Peta tidak ditampilkan karena dataset tidak menyediakan geometri kecamatan tervalidasi.</p>
    </ChartCard>
  )
}
