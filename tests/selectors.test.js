import { describe, expect, it } from 'vitest'
import canonicalData from '../data/processed/semarang-2023.json'
import { filterByQuadrant, findSearchMatch, searchTableRows, sortRecords } from '../src/data/selectors.js'

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
  })
})
