import { describe, expect, it } from 'vitest'
import canonicalData from '../data/processed/semarang-2023.json'
import { deriveDistrict, CITY_BENCHMARK } from '../scripts/dataset-config.mjs'
import { parseIndonesianNumber } from '../scripts/dataset-io.mjs'
import { validateCanonicalData } from '../scripts/validate-dataset.mjs'

const districts = canonicalData.districts
const byName = (name) => districts.find(({ districtName }) => districtName === name)

describe('canonical demographic dataset', () => {
  it('DATA-01/02/22: contains 16 unique districts and excludes city aggregate', () => {
    expect(districts).toHaveLength(16)
    expect(new Set(districts.map(({ districtId }) => districtId)).size).toBe(16)
    expect(districts.some(({ districtName }) => districtName === 'Kota Semarang')).toBe(false)
  })

  it('DATA-03..06: preserves official city benchmarks', () => {
    expect(canonicalData.cityBenchmark).toMatchObject({ populationThousand: 1694.74, growthRatePct: 0.9, densityPerKm2: 4534.07, sexRatioPer100Females: 97.91 })
  })

  it('DATA-07: identifies only Tembalang and Pedurungan above 10 percent', () => {
    expect(districts.filter(({ populationShareAbove10 }) => populationShareAbove10).map(({ districtName }) => districtName).sort()).toEqual(['Pedurungan', 'Tembalang'])
  })

  it('DATA-08/09/16: preserves growth extrema and deterministic ties', () => {
    expect(byName('Mijen').growthRatePct).toBe(3.93)
    expect(districts.filter(({ growthRatePct }) => growthRatePct === 0.08).map(({ districtName }) => districtName).sort()).toEqual(['Candisari', 'Gajah Mungkur', 'Gayamsari'])
  })

  it('DATA-10..12: validates density extrema and count above city', () => {
    expect(byName('Semarang Timur').densityPerKm2).toBe(12261.64)
    expect(byName('Tugu').densityPerKm2).toBe(1201.59)
    expect(districts.filter(({ densityAboveCity }) => densityAboveCity)).toHaveLength(12)
  })

  it('DATA-13: finds Semarang Tengah as maximum absolute sex-ratio deviation', () => {
    expect([...districts].sort((a, b) => b.sexRatioAbsoluteDeviation - a.sexRatioAbsoluteDeviation)[0]).toMatchObject({ districtName: 'Semarang Tengah', sexRatioAbsoluteDeviation: 8.12 })
  })

  it('DATA-14/15: classifies quadrants A=2, B=10, C=4, D=0', () => {
    expect(Object.fromEntries(['A', 'B', 'C', 'D'].map((key) => [key, districts.filter(({ quadrant }) => quadrant === key).length]))).toEqual({ A: 2, B: 10, C: 4, D: 0 })
    expect(districts.filter(({ quadrant }) => quadrant === 'A').map(({ districtName }) => districtName).sort()).toEqual(['Genuk', 'Tembalang'])
  })

  it('DATA-17: equality with benchmark is not classified as above', () => {
    const record = deriveDistrict(['Test', 1, CITY_BENCHMARK.growthRatePct, 1, CITY_BENCHMARK.densityPerKm2, 100])
    expect(record).toMatchObject({ growthAboveCity: false, densityAboveCity: false, quadrant: 'D' })
  })

  it('DATA-18/19: documents rounded district totals without replacing city benchmark', () => {
    expect(districts.reduce((sum, record) => sum + record.populationThousand, 0)).toBeCloseTo(1694.75, 2)
    expect(districts.reduce((sum, record) => sum + record.populationSharePct, 0)).toBeCloseTo(99.99, 2)
    expect(canonicalData.cityBenchmark.populationThousand).toBe(1694.74)
  })

  it('DATA-20: parses Indonesian-formatted numbers correctly', () => {
    expect(parseIndonesianNumber('1.591,35')).toBe(1591.35)
    expect(parseIndonesianNumber('1,00')).toBe(1)
  })

  it('DATA-21: rejects missing and non-numeric records with clear errors', () => {
    const invalid = structuredClone(canonicalData)
    invalid.districts[0].densityPerKm2 = null
    expect(validateCanonicalData(invalid).some((message) => message.includes('bukan angka finite'))).toBe(true)
  })

  it('passes the complete canonical validator', () => {
    expect(validateCanonicalData(canonicalData)).toEqual([])
  })
})
