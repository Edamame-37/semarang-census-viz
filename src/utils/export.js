const CSV_HEADERS = [
  ['district_name', 'districtName'],
  ['population_thousand_2023', 'populationThousand'],
  ['population_share_pct_2023', 'populationSharePct'],
  ['growth_rate_pct_per_year_2020_2023', 'growthRatePct'],
  ['density_people_per_km2_2023', 'densityPerKm2'],
  ['sex_ratio_males_per_100_females_2023', 'sexRatioPer100Females'],
  ['analytical_quadrant', 'quadrant'],
]

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function buildDistrictsCsv(records) {
  const escapeCell = (value) => `"${String(value).replaceAll('"', '""')}"`
  const rows = [CSV_HEADERS.map(([header]) => header), ...records.map((record) => CSV_HEADERS.map(([, field]) => record[field]))]
  return `\uFEFF${rows.map((row) => row.map(escapeCell).join(',')).join('\r\n')}`
}

function downloadDistrictsCsv(records, filename) {
  downloadBlob(new Blob([buildDistrictsCsv(records)], { type: 'text/csv;charset=utf-8' }), filename)
}

export function exportCompleteDataset(records) {
  downloadDistrictsCsv(records, 'semarang_demografi_2023_all_16.csv')
}

export function exportFilteredDistricts(records) {
  downloadDistrictsCsv(records, `semarang_demografi_2023_filtered_${records.length}.csv`)
}
