import { buildDiscrepancies } from './dataset-config.mjs'
import { readLocalDataset } from './dataset-io.mjs'

const dataset = await readLocalDataset()
const discrepancies = buildDiscrepancies(dataset.records)
const districtRecords = dataset.records.filter((record) => record.normalizedDistrictName !== 'kota semarang')
const cityRecord = dataset.records.find((record) => record.normalizedDistrictName === 'kota semarang')

console.log(JSON.stringify({
  filename: dataset.filename,
  encoding: dataset.hasUtf8Bom ? 'UTF-8 BOM' : 'UTF-8 (tanpa BOM terdeteksi)',
  delimiter: dataset.delimiter,
  byteLength: dataset.byteLength,
  checksumSha256: dataset.checksumSha256,
  headers: dataset.headers,
  totalRows: dataset.records.length,
  districtRows: districtRecords.length,
  cityRows: cityRecord ? 1 : 0,
  discrepancyCount: discrepancies.length,
  discrepancies,
}, null, 2))
