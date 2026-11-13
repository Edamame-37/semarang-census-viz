import { describe, expect, it } from 'vitest'
import canonicalData from '../data/processed/semarang-2023.json'
import { createMetricConfig, filterByQuadrant, findSearchMatch, getDensitySummary, getGrowthExtrema, getKeyFindings, searchTableRows, sortRecords } from '../src/data/selectors.js'

const districts = canonicalData.districts

describe('dashboard selectors', () => {
  it('filters group A without mutating the source records', () => {
    expect(filterByQuadrant(districts, 'A').map(({ districtName }) => districtName).sort()).toEqual(['Genuk', 'Tembalang'])
    expect(districts).toHaveLength(16)
  })

  it('returns an informative empty result for group D', () => {
    expect(filterByQuadrant(districts, 'D')).toEqual([])
  })

  it('locates a district case-insensitively', () => {
    expect(findSearchMatch(districts, 'semarang timur')?.districtName).toBe('Semarang Timur')
    expect(findSearchMatch(districts, 'tidak ada')).toBeNull()
  })

  it('filters table search independently from chart records', () => {
    expect(searchTableRows(districts, 'Semarang')).toHaveLength(5)
  })

  it('sorts tied values deterministically by district name', () => {
    expect(sortRecords(districts, 'growthRatePct').slice(-3).map(({ districtName }) => districtName)).toEqual(['Candisari', 'Gajah Mungkur', 'Gayamsari'])
    expect(sortRecords(districts, 'densityPerKm2', 'asc')[0].districtName).toBe('Tugu')
  })

  it('derives metric benchmarks from the official city aggregate', () => {
    const config = createMetricConfig(canonicalData.cityBenchmark)
    expect(config.growthRatePct.benchmark).toBe(0.9)
    expect(config.densityPerKm2.benchmark).toBe(4534.07)
  })

  it('derives findings and extrema from records', () => {
    expect(getGrowthExtrema(districts).highest[0]).toMatchObject({ districtName: 'Mijen', growthRatePct: 3.93 })
    expect(getDensitySummary(districts)).toMatchObject({ highest: { districtName: 'Semarang Timur' }, lowest: { districtName: 'Tugu' }, aboveCityCount: 12 })
    expect(getKeyFindings(districts)).toContain('Tembalang dan Genuk berada pada kelompok A')
  })
})
