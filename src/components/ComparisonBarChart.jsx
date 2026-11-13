import { useMemo } from 'react'
import { getMetricTooltip, METRIC_CONFIG, sortRecords } from '../data/selectors.js'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatMetricValue } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'
import ChartCard from './ChartCard.jsx'

export default function ComparisonBarChart({ districts, metric, selectedDistrictId, highlightDistrictId, onMetricChange, onSelect }) {
  const config = METRIC_CONFIG[metric]
  const option = useMemo(() => {
    const sorted = sortRecords(districts, metric)
    const markLine = config.benchmark == null ? undefined : {
      symbol: 'none',
      lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 2 },
      label: { formatter: config.benchmarkLabel, position: 'insideEndTop', color: COLORS.textMuted },
      data: [{ xAxis: config.benchmark }],
    }
    return {
      ...baseChartOptions,
      grid: { top: 16, right: 38, bottom: 48, left: 130 },
      xAxis: { type: 'value', min: 0, name: config.unit, nameLocation: 'middle', nameGap: 34, splitLine: { lineStyle: { color: COLORS.grid } }, axisLabel: { formatter: (value) => metric === 'densityPerKm2' || metric === 'populationThousand' ? new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(value) : `${String(value).replace('.', ',')}%` } },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisTick: { show: false }, axisLine: { show: false } },
      series: [{
        type: 'bar',
        barMaxWidth: 19,
        data: sorted.map((record) => ({
          value: record[metric],
          districtId: record.districtId,
          record,
          itemStyle: { color: record.districtId === selectedDistrictId || record.districtId === highlightDistrictId ? COLORS.selected : config.benchmark != null && record[metric] > config.benchmark ? COLORS.primary : COLORS.neutral, borderColor: record.districtId === selectedDistrictId ? COLORS.text : 'transparent', borderWidth: 2 },
        })),
        label: { show: districts.length <= 4, position: 'right', formatter: ({ value }) => formatMetricValue(metric, value) },
        markLine,
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data }) => `${getMetricTooltip(data.record, metric)}<br/>Data 2023${metric === 'growthRatePct' ? ' · periode 2020–2023' : ''}` },
    }
  }, [districts, metric, config, selectedDistrictId, highlightDistrictId])

  const metricSelect = (
    <label className="compact-field">
      <span className="sr-only">Pilih metrik perbandingan</span>
      <select value={metric} onChange={(event) => onMetricChange(event.target.value)}>
        {Object.entries(METRIC_CONFIG).map(([key, value]) => <option key={key} value={key}>{value.shortLabel}</option>)}
      </select>
    </label>
  )

  return (
    <ChartCard id="comparison" eyebrow="CBQ 1–3 • Perbandingan presisi" title={config.label} description={`Ranking ${districts.length} kecamatan menurut ${config.label.toLowerCase()}.`} actions={metricSelect}>
      {districts.length ? <AccessibleChart option={option} className="chart--tall" onSelect={onSelect} ariaLabel={`Grafik batang ${config.label.toLowerCase()} untuk ${districts.length} kecamatan, diurutkan dari nilai tertinggi.`} /> : <p className="empty-state">Tidak ada data untuk filter aktif.</p>}
    </ChartCard>
  )
}
