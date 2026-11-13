import { createHash } from 'node:crypto'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FIELD_NAMES, normalizeDistrictName } from './dataset-config.mjs'

export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export function parseIndonesianNumber(value) {
  if (typeof value === 'number') return value
  const raw = String(value).trim()
  if (!raw || ['-', '...', 'NA'].includes(raw.toUpperCase())) return Number.NaN
  const normalized = raw.includes('.') && raw.includes(',')
    ? raw.replaceAll('.', '').replace(',', '.')
    : raw.includes(',')
      ? raw.replace(',', '.')
      : raw
  return Number(normalized)
}

export async function findDatasetCsv() {
  const datasetDirectory = path.join(projectRoot, 'dataset')
  const files = (await readdir(datasetDirectory)).filter((file) => file.toLowerCase().endsWith('.csv'))
  if (files.length !== 1) throw new Error(`Diharapkan tepat satu CSV di dataset/, ditemukan ${files.length}.`)
  return path.join(datasetDirectory, files[0])
}

export async function readLocalDataset() {
  const filePath = await findDatasetCsv()
  const buffer = await readFile(filePath)
  const hasUtf8Bom = buffer.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))
  const text = buffer.toString('utf8').replace(/^\uFEFF/, '').trim()
  const lines = text.split(/\r?\n/)
  const headers = lines[0].split(',').map((value) => value.trim())
  const records = lines.slice(1).filter(Boolean).map((line, index) => {
    const cells = line.split(',')
    if (cells.length !== 6) throw new Error(`Baris ${index + 2} memiliki ${cells.length} kolom; seharusnya 6.`)
    const [districtName, ...numericValues] = cells
    const numbers = numericValues.map(parseIndonesianNumber)
    return {
      districtName: districtName.trim(),
      normalizedDistrictName: normalizeDistrictName(districtName),
      ...Object.fromEntries(FIELD_NAMES.map((fieldName, fieldIndex) => [fieldName, numbers[fieldIndex]])),
    }
  })

  return {
    filePath,
    filename: path.basename(filePath),
    byteLength: buffer.byteLength,
    checksumSha256: createHash('sha256').update(buffer).digest('hex').toUpperCase(),
    hasUtf8Bom,
    delimiter: ',',
    headers,
    records,
  }
}
