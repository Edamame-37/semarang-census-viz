const decimalFormatter = new Intl.NumberFormat('id-ID', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactFormatter = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatNumber = (value) => decimalFormatter.format(value)
export const formatCompact = (value) => compactFormatter.format(value)
export const formatPercent = (value) => `${formatNumber(value)}%`
export const formatSigned = (value, suffix = '') => `${value > 0 ? '+' : value < 0 ? '−' : ''}${formatNumber(Math.abs(value))}${suffix}`

export function formatMetricValue(metric, value) {
  if (metric === 'populationSharePct' || metric === 'growthRatePct') return formatPercent(value)
  return formatNumber(value)
}
