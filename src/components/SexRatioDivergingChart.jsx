import { useMemo } from 'react'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatNumber, formatSigned } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'

const ALWAYS_LABELED = new Set(['Semarang Tengah', 'Genuk'])

export default function SexRatioDivergingChart({ districts, selectedDistrictId, highlightDistrictId, onSelect }) {
  const option = useMemo(() => {
    const sorted = [...districts].sort((left, right) => right.sexRatioAbsoluteDeviation - left.sexRatioAbsoluteDeviation || left.districtName.localeCompare(right.districtName, 'id'))
    return {
      ...baseChartOptions,
      grid: { top: 12, right: 36, bottom: 56, left: 136 },
      xAxis: { type: 'value', min: -9, max: 9, splitNumber: 6, name: 'Deviasi dari rasio 100', nameLocation: 'middle', nameGap: 36, nameTextStyle: { fontSize: 11, color: COLORS.textMuted }, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { fontSize: 11, hideOverlap: true, formatter: (value) => value > 0 ? `+${value}` : String(value) } },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisLabel: { fontSize: 11, color: COLORS.text }, axisTick: { show: false }, axisLine: { show: false } },
      series: [{
        type: 'bar',
        barMaxWidth: 18,
        data: sorted.map((record) => {
          const isEmphasized = record.districtId === selectedDistrictId || record.districtId === highlightDistrictId
          const showLabel = ALWAYS_LABELED.has(record.districtName) || isEmphasized
          const isSmall = record.sexRatioAbsoluteDeviation < 1.5
          return {
            value: record.sexRatioSignedDeviation,
            districtId: record.districtId,
            ratio: record.sexRatioPer100Females,
            itemStyle: {
              color: isEmphasized
                ? COLORS.selected
                : record.sexRatioSignedDeviation >= 0
                  ? COLORS.male
                  : COLORS.female,
              borderColor: record.districtId === selectedDistrictId ? COLORS.text : 'transparent',
              borderWidth: 1,
            },
            label: { show: showLabel, position: isSmall ? (record.sexRatioSignedDeviation < 0 ? 'left' : 'right') : (record.sexRatioSignedDeviation < 0 ? 'insideLeft' : 'insideRight'), formatter: formatNumber(record.sexRatioPer100Females), color: isSmall ? COLORS.text : '#fff', fontSize: 10, fontWeight: 700 },
          }
        }),
        labelLayout: { hideOverlap: true },
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.text, width: 1.5 }, label: { show: false }, data: [{ xAxis: 0 }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data, name }) => `<strong>${name}</strong><br/>Rasio: ${formatNumber(data.ratio)} L/100 P<br/>Deviasi: ${formatSigned(data.value)}` },
    }
  }, [districts, selectedDistrictId, highlightDistrictId])

  return (
    <div className="pbi-tile pbi-tile--sex-ratio">
      <div className="pbi-tile__head">
        <h2 className="pbi-tile__title">Deviasi Rasio Jenis Kelamin (Baseline 100)</h2>
      </div>
      <div className="pbi-tile__body">
        {districts.length ? <AccessibleChart option={option} className="pbi-chart pbi-chart--tall" onSelect={onSelect} ariaLabel="Grafik divergen rasio jenis kelamin" /> : <div className="pbi-empty">Tidak ada data</div>}
      </div>
    </div>
  )
}
