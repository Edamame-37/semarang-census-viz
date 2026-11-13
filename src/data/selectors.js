import { formatMetricValue, formatNumber, formatPercent } from '../utils/numberFormat.js'

export const POPULATION_SHARE_THRESHOLD = 10
export const COMPARISON_METRICS = Object.freeze(['populationSharePct', 'growthRatePct', 'densityPerKm2'])

export const QUADRANT_LABELS = Object.freeze({
  A: 'Kepadatan dan pertumbuhan di atas acuan',
  B: 'Kepadatan di atas acuan; pertumbuhan tidak di atas acuan',
  C: 'Kepadatan tidak di atas acuan; pertumbuhan di atas acuan',
  D: 'Keduanya tidak di atas acuan',
})

export function createMetricConfig(cityBenchmark) {
  return {
    populationSharePct: {
      label: 'Pangsa penduduk',
      shortLabel: 'Pangsa penduduk',
      unit: '%',
      benchmark: POPULATION_SHARE_THRESHOLD,
      benchmarkLabel: 'Ambang eksploratif 10%',
    },
    growthRatePct: {
      label: 'Pertumbuhan penduduk',
      shortLabel: 'Pertumbuhan',
      unit: '% per tahun (2020–2023)',
      benchmark: cityBenchmark.growthRatePct,
      benchmarkLabel: `Acuan kota ${formatPercent(cityBenchmark.growthRatePct)}`,
    },
    densityPerKm2: {
      label: 'Kepadatan penduduk',
      shortLabel: 'Kepadatan',
      unit: 'jiwa/km²',
      benchmark: cityBenchmark.densityPerKm2,
      benchmarkLabel: `Acuan kota ${formatNumber(cityBenchmark.densityPerKm2)}`,
    },
  }
}

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

export function getSearchSuggestions(records, query) {
  const normalized = query.trim().toLocaleLowerCase('id-ID')
  if (!normalized) return records
  return records.filter(({ districtName }) => districtName.toLocaleLowerCase('id-ID').includes(normalized))
}

export function searchTableRows(records, query) {
  return getSearchSuggestions(records, query)
}

export function getGrowthExtrema(records) {
  const maximum = Math.max(...records.map(({ growthRatePct }) => growthRatePct))
  const minimum = Math.min(...records.map(({ growthRatePct }) => growthRatePct))
  return {
    highest: records.filter(({ growthRatePct }) => growthRatePct === maximum),
    lowest: records.filter(({ growthRatePct }) => growthRatePct === minimum),
  }
}

export function getDensitySummary(records) {
  const sorted = sortRecords(records, 'densityPerKm2')
  return {
    highest: sorted[0] ?? null,
    lowest: sorted.at(-1) ?? null,
    aboveCityCount: records.filter(({ densityAboveCity }) => densityAboveCity).length,
  }
}

export function getKeyFindings(records) {
  const growth = getGrowthExtrema(records)
  const groupA = records.filter(({ quadrant }) => quadrant === 'A')
  return [
    `${records.filter(({ populationShareAbove10 }) => populationShareAbove10).length} kecamatan memiliki pangsa penduduk di atas ${POPULATION_SHARE_THRESHOLD}%`,
    `${growth.highest[0]?.districtName} memiliki pertumbuhan tertinggi, ${formatPercent(growth.highest[0]?.growthRatePct ?? 0)}`,
    `${groupA.map(({ districtName }) => districtName).join(' dan ')} berada pada kelompok A`,
  ]
}

export function getMetricTooltip(record, metric, config) {
  const value = record[metric]
  const difference = value - config.benchmark
  const populationContext = metric === 'populationSharePct'
    ? `<br/>Jumlah penduduk: ${formatNumber(record.populationThousand)} ribu jiwa`
    : ''
  const differenceUnit = metric === 'growthRatePct' ? ' poin persentase' : metric === 'densityPerKm2' ? ' jiwa/km²' : ' poin persentase'
  return `${record.districtName}<br/>${config.label}: <strong>${formatMetricValue(metric, value)}</strong>${populationContext}<br/>Selisih acuan: ${difference > 0 ? '+' : ''}${formatNumber(difference)}${differenceUnit}`
}
