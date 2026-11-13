import { useCallback, useMemo, useState } from 'react'
import { filterByQuadrant, findSearchMatch, searchTableRows } from '../data/selectors.js'

const INITIAL_STATE = Object.freeze({
  searchQuery: '',
  selectedDistrictId: null,
  selectedQuadrant: 'ALL',
  metric: 'populationSharePct',
  tableSort: { field: 'districtName', direction: 'asc' },
})

export function useDashboardState(districts) {
  const [state, setState] = useState(INITIAL_STATE)
  const filteredDistricts = useMemo(() => filterByQuadrant(districts, state.selectedQuadrant), [districts, state.selectedQuadrant])
  const searchMatch = useMemo(() => findSearchMatch(filteredDistricts, state.searchQuery), [filteredDistricts, state.searchQuery])
  const tableRows = useMemo(() => searchTableRows(filteredDistricts, state.searchQuery), [filteredDistricts, state.searchQuery])
  const selectedDistrict = useMemo(
    () => districts.find(({ districtId }) => districtId === state.selectedDistrictId) ?? null,
    [districts, state.selectedDistrictId],
  )

  const update = useCallback((patch) => setState((current) => {
    const nextState = { ...current, ...patch }
    if (patch.selectedQuadrant && current.selectedDistrictId) {
      const selected = districts.find(({ districtId }) => districtId === current.selectedDistrictId)
      if (patch.selectedQuadrant !== 'ALL' && selected?.quadrant !== patch.selectedQuadrant) nextState.selectedDistrictId = null
    }
    return nextState
  }), [districts])
  const selectDistrict = useCallback((districtId) => {
    setState((current) => ({ ...current, selectedDistrictId: current.selectedDistrictId === districtId ? null : districtId }))
  }, [])
  const reset = useCallback(() => setState(INITIAL_STATE), [])

  return { state, filteredDistricts, tableRows, searchMatch, selectedDistrict, update, selectDistrict, reset }
}
