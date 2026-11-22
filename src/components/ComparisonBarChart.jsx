import { useMemo } from 'react'
import { COMPARISON_METRICS, createMetricConfig, getMetricTooltip, sortRecords } from '../data/selectors.js'
import { baseChartOptions, COLORS } from '../utils/chartTheme.js'
import { formatMetricValue } from '../utils/numberFormat.js'
import AccessibleChart from './AccessibleChart.jsx'

export default function ComparisonBarChart({ districts, benchmark, metric, sortDirection, selectedDistrictId, highlightDistrictId, onMetricChange, onSortChange, onSelect }) {
  const metricConfig = useMemo(() => createMetricConfig(benchmark), [benchmark])
  const config = metricConfig[metric]
  const option = useMemo(() => {
    const sorted = sortRecords(districts, metric, sortDirection)
    return {
      ...baseChartOptions,
      grid: { top: 12, right: 24, bottom: 44, left: 130, containLabel: false },
      xAxis: {
        type: 'value',
        min: 0,
        name: config.unit,
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { fontSize: 11, color: COLORS.textMuted },
        splitNumber: 4,
        splitLine: { lineStyle: { color: COLORS.grid } },
        axisLabel: {
          fontSize: 11,
          hideOverlap: true,
          formatter: (value) => metric === 'densityPerKm2'
            ? new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
            : `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(value)}%`,
        },
      },
      yAxis: { type: 'category', inverse: true, data: sorted.map(({ districtName }) => districtName), axisLabel: { fontSize: 11, color: COLORS.text }, axisTick: { show: false }, axisLine: { show: false } },
      series: [{
        type: 'bar',
        barMaxWidth: 18,
        data: sorted.map((record) => ({
          value: record[metric],
          districtId: record.districtId,
          record,
          itemStyle: {
            color: record.districtId === selectedDistrictId || record.districtId === highlightDistrictId ? COLORS.selected : record[metric] > config.benchmark ? COLORS.primary : COLORS.neutral,
            borderColor: record.districtId === selectedDistrictId ? COLORS.text : 'transparent',
            borderWidth: 1,
          },
        })),
        label: { show: districts.length <= 4, position: 'right', formatter: ({ value }) => formatMetricValue(metric, value), fontSize: 10 },
        markLine: { symbol: 'none', silent: true, lineStyle: { color: COLORS.benchmark, type: 'dashed', width: 1.5 }, label: { show: false }, data: [{ xAxis: config.benchmark }] },
      }],
      tooltip: { ...baseChartOptions.tooltip, formatter: ({ data }) => getMetricTooltip(data.record, metric, config) },
    }
  }, [districts, metric, sortDirection, config, selectedDistrictId, highlightDistrictId])

  const sortControl = (
    <div className="pbi-sort">
      <button type="button" aria-pressed={sortDirection === 'desc'} onClick={() => onSortChange('desc')}>↓</button>
      <button type="button" aria-pressed={sortDirection === 'asc'} onClick={() => onSortChange('asc')}>↑</button>
    </div>
  )

  return (
    <div className="pbi-tile pbi-tile--comparison">
      <div className="pbi-tile__head">
        <h2 className="pbi-tile__title">{config.label}</h2>
        <div className="pbi-tile__actions">{sortControl}</div>
      </div>
      <div className="pbi-tile__body">
        <div className="pbi-metric-tabs" role="group" aria-label="Pilih metrik">
          {COMPARISON_METRICS.map((metricKey) => <button key={metricKey} type="button" aria-pressed={metric === metricKey} onClick={() => onMetricChange(metricKey)}>{metricConfig[metricKey].shortLabel}</button>)}
        </div>
        {districts.length ? <AccessibleChart option={option} className="pbi-chart pbi-chart--tall" onSelect={onSelect} ariaLabel={`Grafik batang ${config.label.toLowerCase()} ${districts.length} kecamatan`} /> : <div className="pbi-empty">Tidak ada data</div>}
      </div>
    </div>
  )
}
