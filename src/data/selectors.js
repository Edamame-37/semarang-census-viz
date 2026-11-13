import { formatMetricValue } from '../utils/numberFormat.js'

export const QUADRANT_LABELS = Object.freeze({
  A: 'Padat + tumbuh di atas acuan',
  B: 'Padat di atas, tumbuh tidak di atas acuan',
  C: 'Tumbuh di atas, kepadatan tidak di atas acuan',
  D: 'Kepadatan dan pertumbuhan tidak di atas acuan',
})

export const METRIC_CONFIG = Object.freeze({
  populationSharePct: {
    label: 'Pangsa penduduk',
    shortLabel: 'Pangsa (%)',
    unit: '%',
    benchmark: 10,
    benchmarkLabel: 'Ambang eksploratif 10%',
  },
  populationThousand: {
    label: 'Jumlah penduduk',
    shortLabel: 'Penduduk (ribu)',
    unit: 'ribu jiwa',
    benchmark: null,
    benchmarkLabel: null,
  },
  growthRatePct: {
    label: 'Pertumbuhan penduduk',
    shortLabel: 'Pertumbuhan',
    unit: '% per tahun (2020–2023)',
    benchmark: 0.9,
    benchmarkLabel: 'Acuan kota 0,90%',
  },
  densityPerKm2: {
    label: 'Kepadatan penduduk',
    shortLabel: 'Kepadatan',
    unit: 'jiwa/km²',
    benchmark: 4534.07,
    benchmarkLabel: 'Acuan kota 4.534,07',
  },
})

export function sortRecords(records, field, direction = 'desc') {
  const multiplier = direction === 'asc' ? 1 : -1
  return [...records].sort((left, right) => {
    const difference = left[field] - right[field]
    return difference === 0
      ? left.districtName.localeCompare(right.districtName, 'id')
      : difference * multiplier
  })
}

export function filterByQuadrant(records, selectedQuadrant) {
  return selectedQuadrant === 'ALL' ? records : records.filter(({ quadrant }) => quadrant === selectedQuadrant)
}

export function findSearchMatch(records, query) {
  const normalized = query.trim().toLocaleLowerCase('id-ID')
  if (!normalized) return null
  return records.find(({ districtName }) => districtName.toLocaleLowerCase('id-ID').includes(normalized)) ?? null
}

export function searchTableRows(records, query) {
  const normalized = query.trim().toLocaleLowerCase('id-ID')
  if (!normalized) return records
  return records.filter(({ districtName }) => districtName.toLocaleLowerCase('id-ID').includes(normalized))
}

export function getMetricTooltip(record, metric) {
  const config = METRIC_CONFIG[metric]
  const value = record[metric]
  if (config.benchmark == null) return `${record.districtName}<br/>${config.label}: <strong>${formatMetricValue(metric, value)}</strong> ${metric === 'populationThousand' ? 'ribu jiwa' : ''}`
  const difference = value - config.benchmark
  return `${record.districtName}<br/>${config.label}: <strong>${formatMetricValue(metric, value)}</strong><br/>Selisih acuan: ${difference > 0 ? '+' : ''}${formatMetricValue(metric, difference)}`
}
