import { useMemo } from 'react'
import { COMPARISON_METRICS, createMetricConfig, getMetricTooltip, sortRecords } from '../data/selectors.js'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatMetricValue } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'
import ChartCard from './ChartCard.jsx'

export default function ComparisonBarChart({ districts, benchmark, metric, sortDirection, selectedDistrictId, highlightDistrictId, onMetricChange, onSortChange, onSelect }) {
  const metricConfig = useMemo(() => createMetricConfig(benchmark), [benchmark])
  const config = metricConfig[metric]
  const option = useMemo(() => {
    const sorted = sortRecords(districts, metric, sortDirection)
    return {
      ...baseChartOptions,
      grid: { top: 20, right: 28, bottom: 52, left: 142, containLabel: false },
      xAxis: {
        type: 'value',
        min: 0,
        name: config.unit,
        nameLocation: 'middle',
        nameGap: 36,
        nameTextStyle: { fontSize: 12, color: COLORS.textMuted },
        splitNumber: 4,
        splitLine: { lineStyle: { color: COLORS.grid } },
        axisLabel: {
          fontSize: 12,
          hideOverlap: true,
          formatter: (value) => metric === 'densityPerKm2'
            ? new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
            : `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(value)}%`,
        },
      },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisLabel: { fontSize: 12, color: COLORS.text }, axisTick: { show: false }, axisLine: { show: false } },
      series: [{
        type: 'bar',
        barMaxWidth: 20,
        data: sorted.map((record) => ({
          value: record[metric],
          districtId: record.districtId,
          record,
          itemStyle: {
            color: record.districtId === selectedDistrictId || record.districtId === highlightDistrictId ? COLORS.selected : record[metric] > config.benchmark ? COLORS.primary : COLORS.neutral,
            borderColor: record.districtId === selectedDistrictId ? COLORS.text : 'transparent',
            borderWidth: 2,
          },
        })),
        label: { show: districts.length <= 4, position: 'right', formatter: ({ value }) => formatMetricValue(metric, value) },
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 2 }, label: { show: false }, data: [{ xAxis: config.benchmark }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data }) => `${getMetricTooltip(data.record, metric, config)}<br/>Data 2023${metric === 'growthRatePct' ? ' · periode 2020–2023' : ''}` },
    }
  }, [districts, metric, sortDirection, config, selectedDistrictId, highlightDistrictId])

  const sortControl = (
    <div className="sort-control" aria-label="Urutan grafik">
      <button type="button" aria-pressed={sortDirection === 'desc'} onClick={() => onSortChange('desc')}>Tertinggi</button>
      <button type="button" aria-pressed={sortDirection === 'asc'} onClick={() => onSortChange('asc')}>Terendah</button>
    </div>
  )

  return (
    <ChartCard id="comparison" eyebrow="CBQ 1–3 · Perbandingan presisi" title={config.label} description={`Ranking ${districts.length} kecamatan menurut ${config.label.toLowerCase()}.`} actions={sortControl}>
      <div className="metric-tabs" role="group" aria-label="Pilih metrik perbandingan">
        {COMPARISON_METRICS.map((metricKey) => <button key={metricKey} type="button" aria-pressed={metric === metricKey} onClick={() => onMetricChange(metricKey)}>{metricConfig[metricKey].shortLabel}</button>)}
      </div>
      <p className="chart-reference"><span aria-hidden="true" className="reference-line" />{config.benchmarkLabel}</p>
      {districts.length ? <AccessibleChart option={option} className="chart--tall" onSelect={onSelect} ariaLabel={`Grafik batang ${config.label.toLowerCase()} untuk ${districts.length} kecamatan, diurutkan dari nilai ${sortDirection === 'desc' ? 'tertinggi' : 'terendah'}. ${config.benchmarkLabel}.`} /> : <p className="empty-state">Tidak ada data untuk filter aktif.</p>}
    </ChartCard>
  )
}
