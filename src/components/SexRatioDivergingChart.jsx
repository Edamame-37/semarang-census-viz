import { useMemo } from 'react'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatSigned } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'
import ChartCard from './ChartCard.jsx'

export default function SexRatioDivergingChart({ districts, selectedDistrictId, highlightDistrictId, onSelect }) {
  const option = useMemo(() => {
    const sorted = [...districts].sort((left, right) => right.sexRatioAbsoluteDeviation - left.sexRatioAbsoluteDeviation || left.districtName.localeCompare(right.districtName, 'id'))
    return {
      ...baseChartOptions,
      grid: { top: 16, right: 55, bottom: 60, left: 158 },
      xAxis: { type: 'value', min: -9, max: 9, name: 'Deviasi dari rasio 100', nameLocation: 'middle', nameGap: 35, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { formatter: (value) => value > 0 ? `+${value}` : String(value) } },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisTick: { show: false }, axisLine: { show: false } },
      series: [{
        type: 'bar',
        barMaxWidth: 19,
        data: sorted.map((record) => ({
          value: record.sexRatioSignedDeviation,
          districtId: record.districtId,
          ratio: record.sexRatioPer100Females,
          itemStyle: { color: record.districtId === selectedDistrictId || record.districtId === highlightDistrictId ? COLORS.selected : record.sexRatioSignedDeviation >= 0 ? COLORS.C : COLORS.B, borderColor: record.districtId === selectedDistrictId ? COLORS.text : 'transparent', borderWidth: 2 },
          label: { show: true, position: record.sexRatioSignedDeviation < 0 ? 'left' : 'right', formatter: formatNumber(record.sexRatioPer100Females), color: COLORS.text, fontSize: 10 },
        })),
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, width: 2 }, label: { formatter: 'Rasio 100', position: 'insideEndTop', color: COLORS.textMuted }, data: [{ xAxis: 0 }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data, name }) => `${name}<br/>Rasio: <strong>${formatNumber(data.ratio)} laki-laki per 100 perempuan</strong><br/>Deviasi: ${formatSigned(data.value, ' dari keseimbangan')}<br/>Data 2023` },
    }
  }, [districts, selectedDistrictId, highlightDistrictId])

  return (
    <ChartCard id="sex-ratio" eyebrow="CBQ 4 • Arah dan besar deviasi" title="Deviasi rasio jenis kelamin" description="Batang menunjukkan rasio dikurangi 100. Arah kiri/kanan bukan penilaian baik atau buruk.">
      {districts.length ? <AccessibleChart option={option} className="chart--tall" onSelect={onSelect} ariaLabel="Grafik divergen rasio jenis kelamin terhadap titik 100. Semarang Tengah memiliki deviasi absolut terbesar, yaitu minus 8,12." /> : <p className="empty-state">Tidak ada data untuk filter aktif.</p>}
    </ChartCard>
  )
}
