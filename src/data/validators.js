const NUMERIC_FIELDS = [
  'populationThousand',
  'populationSharePct',
  'growthRatePct',
  'densityPerKm2',
  'sexRatioPer100Females',
]

export function validateDashboardData(data) {
  const errors = []
  if (!data || !Array.isArray(data.districts)) return ['Format dataset tidak dikenali.']
  if (data.districts.length !== 16) errors.push('Dataset harus memuat tepat 16 kecamatan.')
  if (!data.cityBenchmark) errors.push('Benchmark Kota Semarang tidak tersedia.')

  const ids = new Set()
  data.districts.forEach((record, index) => {
    if (!record.districtId || ids.has(record.districtId)) errors.push(`ID kecamatan tidak valid pada baris ${index + 1}.`)
    ids.add(record.districtId)
    if (!record.districtName) errors.push(`Nama kecamatan kosong pada baris ${index + 1}.`)
    NUMERIC_FIELDS.forEach((field) => {
      if (!Number.isFinite(record[field])) errors.push(`${record.districtName || `Baris ${index + 1}`}: ${field} bukan angka valid.`)
    })
  })
  return errors
}
