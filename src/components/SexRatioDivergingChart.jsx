import { useMemo } from 'react'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatSigned } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'
import ChartCard from './ChartCard.jsx'

const ALWAYS_LABELED = new Set(['Semarang Tengah', 'Genuk'])

export default function SexRatioDivergingChart({ districts, selectedDistrictId, highlightDistrictId, onSelect }) {
  const option = useMemo(() => {
    const sorted = [...districts].sort((left, right) => right.sexRatioAbsoluteDeviation - left.sexRatioAbsoluteDeviation || left.districtName.localeCompare(right.districtName, 'id'))
    return {
      ...baseChartOptions,
      grid: { top: 20, right: 42, bottom: 64, left: 152 },
      xAxis: { type: 'value', min: -9, max: 9, splitNumber: 6, name: 'Deviasi dari rasio 100', nameLocation: 'middle', nameGap: 40, nameTextStyle: { fontSize: 12, color: COLORS.textMuted }, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { fontSize: 12, hideOverlap: true, formatter: (value) => value > 0 ? `+${value}` : String(value) } },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisLabel: { fontSize: 12, color: COLORS.text }, axisTick: { show: false }, axisLine: { show: false } },
      series: [{
        type: 'bar',
        barMaxWidth: 20,
        data: sorted.map((record) => {
          const isEmphasized = record.districtId === selectedDistrictId || record.districtId === highlightDistrictId
          const showLabel = ALWAYS_LABELED.has(record.districtName) || isEmphasized
          const isSmall = record.sexRatioAbsoluteDeviation < 1.5
          return {
            value: record.sexRatioSignedDeviation,
            districtId: record.districtId,
            ratio: record.sexRatioPer100Females,
            itemStyle: { color: isEmphasized ? COLORS.selected : record.sexRatioSignedDeviation >= 0 ? COLORS.C : COLORS.B, borderColor: record.districtId === selectedDistrictId ? COLORS.text : 'transparent', borderWidth: 2 },
            label: { show: showLabel, position: isSmall ? (record.sexRatioSignedDeviation < 0 ? 'left' : 'right') : (record.sexRatioSignedDeviation < 0 ? 'insideLeft' : 'insideRight'), formatter: formatNumber(record.sexRatioPer100Females), color: isSmall ? COLORS.text : '#fff', fontSize: 10, fontWeight: 700 },
          }
        }),
        labelLayout: { hideOverlap: true },
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, width: 2 }, label: { show: false }, data: [{ xAxis: 0 }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data, name }) => `${name}<br/>Rasio: <strong>${formatNumber(data.ratio)} laki-laki per 100 perempuan</strong><br/>Deviasi: ${formatSigned(data.value, ' dari rasio 100')}<br/>Data 2023` },
    }
  }, [districts, selectedDistrictId, highlightDistrictId])

  return (
    <ChartCard id="sex-ratio" eyebrow="CBQ 4 · Arah dan besar deviasi" title="Deviasi rasio jenis kelamin" description="Batang menunjukkan rasio dikurangi 100; kiri dan kanan menunjukkan arah deviasi, bukan penilaian baik atau buruk.">
      <p className="chart-reference"><span aria-hidden="true" className="reference-line reference-line--solid" />Baseline 0 ekuivalen dengan rasio 100</p>
      {districts.length ? <AccessibleChart option={option} className="chart--tall" onSelect={onSelect} ariaLabel="Grafik divergen rasio jenis kelamin terhadap titik 100. Semarang Tengah memiliki deviasi absolut terbesar, yaitu minus 8,12." /> : <p className="empty-state">Tidak ada data untuk filter aktif.</p>}
      <p className="chart-footnote">Rasio menunjukkan jumlah laki-laki per 100 perempuan, bukan persentase laki-laki atau ukuran langsung ketimpangan sosial.</p>
    </ChartCard>
  )
}
