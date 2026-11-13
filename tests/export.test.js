import { describe, expect, it } from 'vitest'
import canonicalData from '../data/processed/semarang-2023.json'
import { buildDistrictsCsv } from '../src/utils/export.js'

describe('CSV export', () => {
  it('exports all numeric records with a UTF-8 BOM and stable columns', () => {
    const csv = buildDistrictsCsv(canonicalData.districts)
    const rows = csv.slice(1).split('\r\n')

    expect(csv.startsWith('\uFEFF')).toBe(true)
    expect(rows).toHaveLength(17)
    expect(rows[0]).toBe('"district_name","population_thousand_2023","population_share_pct_2023","growth_rate_pct_per_year_2020_2023","density_people_per_km2_2023","sex_ratio_males_per_100_females_2023","analytical_quadrant"')
    expect(rows[1]).toContain('"Mijen"')
    expect(rows[1]).toContain('"3.93"')
  })

  it('exports only the supplied filtered subset', () => {
    const groupA = canonicalData.districts.filter(({ quadrant }) => quadrant === 'A')
    const rows = buildDistrictsCsv(groupA).slice(1).split('\r\n')

    expect(rows).toHaveLength(3)
    expect(rows.join('\n')).toContain('"Tembalang"')
    expect(rows.join('\n')).toContain('"Genuk"')
  })
})
