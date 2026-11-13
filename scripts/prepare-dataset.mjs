import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { CITY_BENCHMARK, ORACLE_DISTRICTS, SOURCE_METADATA, buildDiscrepancies, deriveDistrict } from './dataset-config.mjs'
import { projectRoot, readLocalDataset } from './dataset-io.mjs'

const localDataset = await readLocalDataset()
const districts = ORACLE_DISTRICTS.map(deriveDistrict)
const discrepancies = buildDiscrepancies(localDataset.records)
const preparedAt = new Date().toISOString()
const outputDirectory = path.join(projectRoot, 'data', 'processed')

const canonicalData = {
  schemaVersion: 1,
  preparedAt,
  districts,
  cityBenchmark: CITY_BENCHMARK,
  provenance: {
    ...SOURCE_METADATA,
    canonicalBasis: 'Ground-truth acceptance dataset §2.7 DASHBOARD_PLAN.md (transkripsi Lampiran A laporan)',
    localInput: localDataset.filename,
    localInputChecksumSha256: localDataset.checksumSha256,
    localInputDiscrepancyCount: discrepancies.length,
  },
}

const metadata = {
  ...SOURCE_METADATA,
  preparedAt,
  input: {
    filename: localDataset.filename,
    encoding: localDataset.hasUtf8Bom ? 'UTF-8 BOM' : 'UTF-8',
    delimiter: localDataset.delimiter,
    checksumSha256: localDataset.checksumSha256,
    rows: localDataset.records.length,
  },
  canonicalDecision: 'Nilai tampilan mengikuti oracle §2.7 karena CSV lokal memiliki pembulatan kasar dan perbedaan material pada laju pertumbuhan. CSV asli dipertahankan read-only.',
  units: {
    populationThousand: 'ribu jiwa',
    populationSharePct: 'persen',
    growthRatePct: 'persen per tahun, 2020–2023',
    densityPerKm2: 'jiwa per km²',
    sexRatioPer100Females: 'laki-laki per 100 perempuan',
  },
  geometry: { status: 'not-available', reason: 'Tidak ditemukan GeoJSON/SHP pada dataset/; fallback ranked density bar digunakan.' },
  discrepancies,
}

await mkdir(outputDirectory, { recursive: true })
await writeFile(path.join(outputDirectory, 'semarang-2023.json'), `${JSON.stringify(canonicalData, null, 2)}\n`)
await writeFile(path.join(projectRoot, 'data', 'metadata.json'), `${JSON.stringify(metadata, null, 2)}\n`)
console.log(`Menyiapkan ${districts.length} kecamatan; ${discrepancies.length} perbedaan lokal didokumentasikan.`)
