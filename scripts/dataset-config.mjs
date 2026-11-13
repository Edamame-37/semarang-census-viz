export const CITY_BENCHMARK = Object.freeze({
  districtId: 'kota-semarang',
  districtName: 'Kota Semarang',
  populationThousand: 1694.74,
  populationSharePct: 100,
  growthRatePct: 0.9,
  densityPerKm2: 4534.07,
  sexRatioPer100Females: 97.91,
})

export const ORACLE_DISTRICTS = Object.freeze([
  ['Mijen', 89.95, 3.93, 5.31, 1591.35, 99.57],
  ['Gunungpati', 100.75, 1, 5.94, 1729, 99.74],
  ['Banyumanik', 143.43, 0.35, 8.46, 4822.53, 97.14],
  ['Gajah Mungkur', 56.35, 0.08, 3.32, 6030.73, 96.01],
  ['Semarang Selatan', 62.18, 0.09, 3.67, 10456.73, 94.53],
  ['Candisari', 75.61, 0.08, 4.46, 11820.08, 97.36],
  ['Tembalang', 198.86, 1.73, 11.73, 5038.38, 98.8],
  ['Pedurungan', 196.53, 0.63, 11.6, 9309.77, 97.79],
  ['Genuk', 132.47, 2.64, 7.82, 5099.22, 102.17],
  ['Gayamsari', 70.41, 0.08, 4.15, 11319.94, 98.83],
  ['Semarang Timur', 66.48, 0.1, 3.92, 12261.64, 94.28],
  ['Semarang Utara', 117.89, 0.09, 6.96, 10347.6, 97.49],
  ['Semarang Tengah', 55.21, 0.1, 3.26, 10672.11, 91.88],
  ['Semarang Barat', 149.33, 0.11, 8.81, 6888.81, 96.44],
  ['Tugu', 33.8, 1.07, 1.99, 1201.59, 100.1],
  ['Ngaliyan', 145.5, 0.96, 8.59, 3384.58, 99.06],
])

export const FIELD_NAMES = [
  'populationThousand',
  'growthRatePct',
  'populationSharePct',
  'densityPerKm2',
  'sexRatioPer100Females',
]

export const SOURCE_METADATA = Object.freeze({
  title: 'Kota Semarang Dalam Angka 2024',
  table: 'Tabel 3.1.1',
  publisher: 'BPS Kota Semarang',
  observationYear: 2023,
  growthPeriod: '2020–2023',
  sourceUrl: 'https://semarangkota.bps.go.id/id/publication/2024/02/28/a1c4e17788918ee0a85fe480/k',
})

export function slugify(value) {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function normalizeDistrictName(value) {
  const cleaned = value.trim().replace(/\s+/g, ' ').toLowerCase()
  if (cleaned === 'gunung pati') return 'gunungpati'
  if (cleaned === 'semarang') return 'kota semarang'
  return cleaned
}

export function deriveDistrict([districtName, populationThousand, growthRatePct, populationSharePct, densityPerKm2, sexRatioPer100Females]) {
  const densityAboveCity = densityPerKm2 > CITY_BENCHMARK.densityPerKm2
  const growthAboveCity = growthRatePct > CITY_BENCHMARK.growthRatePct
  const sexRatioSignedDeviation = Number((sexRatioPer100Females - 100).toFixed(2))

  return {
    districtId: slugify(districtName),
    districtName,
    populationThousand,
    populationSharePct,
    growthRatePct,
    densityPerKm2,
    sexRatioPer100Females,
    populationShareAbove10: populationSharePct > 10,
    growthAboveCity,
    densityAboveCity,
    sexRatioSignedDeviation,
    sexRatioAbsoluteDeviation: Math.abs(sexRatioSignedDeviation),
    quadrant: densityAboveCity ? (growthAboveCity ? 'A' : 'B') : growthAboveCity ? 'C' : 'D',
  }
}

export function buildDiscrepancies(localRecords) {
  const oracleRecords = [...ORACLE_DISTRICTS, [
    CITY_BENCHMARK.districtName,
    CITY_BENCHMARK.populationThousand,
    CITY_BENCHMARK.growthRatePct,
    CITY_BENCHMARK.populationSharePct,
    CITY_BENCHMARK.densityPerKm2,
    CITY_BENCHMARK.sexRatioPer100Females,
  ]]

  return oracleRecords.flatMap(([districtName, ...values]) => {
    const local = localRecords.find((record) => record.normalizedDistrictName === normalizeDistrictName(districtName))
    if (!local) return [{ districtName, field: 'record', localValue: null, oracleValue: 'required' }]
    return FIELD_NAMES.flatMap((field, index) => local[field] === values[index]
      ? []
      : [{ districtName, field, localValue: local[field], oracleValue: values[index] }])
  })
}
