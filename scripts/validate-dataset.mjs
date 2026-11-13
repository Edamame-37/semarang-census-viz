import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { projectRoot } from './dataset-io.mjs'

export function validateCanonicalData(data) {
  const errors = []
  const { districts, cityBenchmark } = data ?? {}
  if (!Array.isArray(districts) || districts.length !== 16) errors.push('Dataset harus memuat tepat 16 kecamatan.')
  if (!cityBenchmark) errors.push('Benchmark Kota Semarang tidak tersedia.')
  if (errors.length) return errors

  const ids = new Set(districts.map(({ districtId }) => districtId))
  if (ids.size !== 16) errors.push('districtId harus unik.')
  const numericFields = ['populationThousand', 'populationSharePct', 'growthRatePct', 'densityPerKm2', 'sexRatioPer100Females']
  districts.forEach((record) => {
    numericFields.forEach((field) => {
      if (!Number.isFinite(record[field])) errors.push(`${record.districtName}.${field} bukan angka finite.`)
    })
    if (record.populationThousand <= 0 || record.densityPerKm2 <= 0 || record.sexRatioPer100Females <= 0) errors.push(`${record.districtName} memiliki nilai non-positif.`)
    if (record.populationSharePct < 0 || record.populationSharePct > 100) errors.push(`${record.districtName} memiliki pangsa di luar 0–100.`)
  })

  const names = (records) => records.map(({ districtName }) => districtName).sort((a, b) => a.localeCompare(b, 'id'))
  const exactNames = (actual, expected, label) => {
    if (JSON.stringify(names(actual)) !== JSON.stringify([...expected].sort((a, b) => a.localeCompare(b, 'id')))) errors.push(`${label} tidak cocok.`)
  }

  if (cityBenchmark.populationThousand !== 1694.74 || cityBenchmark.growthRatePct !== 0.9 || cityBenchmark.densityPerKm2 !== 4534.07 || cityBenchmark.sexRatioPer100Females !== 97.91) errors.push('Benchmark kota tidak cocok dengan oracle.')
  exactNames(districts.filter((record) => record.populationShareAbove10), ['Tembalang', 'Pedurungan'], 'Pangsa >10%')
  exactNames(districts.filter((record) => record.growthRatePct === Math.min(...districts.map(({ growthRatePct }) => growthRatePct))), ['Gajah Mungkur', 'Candisari', 'Gayamsari'], 'Ties pertumbuhan minimum')
  exactNames(districts.filter((record) => record.quadrant === 'A'), ['Tembalang', 'Genuk'], 'Grup A')
  const quadrantCounts = Object.fromEntries(['A', 'B', 'C', 'D'].map((quadrant) => [quadrant, districts.filter((record) => record.quadrant === quadrant).length]))
  if (JSON.stringify(quadrantCounts) !== JSON.stringify({ A: 2, B: 10, C: 4, D: 0 })) errors.push('Komposisi kuadran bukan A=2, B=10, C=4, D=0.')
  if (districts.filter((record) => record.densityAboveCity).length !== 12) errors.push('Jumlah kecamatan di atas kepadatan kota harus 12.')
  if (districts.reduce((sum, record) => sum + record.populationThousand, 0).toFixed(2) !== '1694.75') errors.push('Jumlah penduduk district rounded harus 1694.75.')
  if (districts.reduce((sum, record) => sum + record.populationSharePct, 0).toFixed(2) !== '99.99') errors.push('Jumlah pangsa district rounded harus 99.99.')
  return errors
}

const inputPath = path.join(projectRoot, 'data', 'processed', 'semarang-2023.json')
const data = JSON.parse(await readFile(inputPath, 'utf8'))
const errors = validateCanonicalData(data)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log('Validasi data lulus: 16 kecamatan, benchmark resmi, extrema, ties, dan kuadran sesuai oracle.')
}
