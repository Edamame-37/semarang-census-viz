import { useMemo } from 'react'
import { formatNumber, formatPercent } from '../utils/numberFormat.js'
import { exportFilteredDistricts } from '../utils/export.js'

const COLUMNS = [
  ['districtName', 'Kecamatan'],
  ['populationThousand', 'Penduduk (ribu)'],
  ['populationSharePct', 'Pangsa (%)'],
  ['growthRatePct', 'Pertumbuhan (%/thn)'],
  ['densityPerKm2', 'Kepadatan (jiwa/km²)'],
  ['sexRatioPer100Females', 'Rasio JK'],
  ['quadrant', 'Grup'],
]

export default function DistrictTable({ rows, selectedDistrictId, tableSort, onSort, onSelect, onReset }) {
  const sortedRows = useMemo(() => [...rows].sort((left, right) => {
    const leftValue = left[tableSort.field]
    const rightValue = right[tableSort.field]
    const comparison = typeof leftValue === 'number' ? leftValue - rightValue : String(leftValue).localeCompare(String(rightValue), 'id')
    return tableSort.direction === 'asc' ? comparison : -comparison
  }), [rows, tableSort])

  const toggleSort = (field) => onSort({ field, direction: tableSort.field === field && tableSort.direction === 'asc' ? 'desc' : 'asc' })
  const formatCell = (record, field) => {
    if (field === 'districtName' || field === 'quadrant') return record[field]
    if (field === 'populationSharePct' || field === 'growthRatePct') return formatPercent(record[field])
    return formatNumber(record[field])
  }

  const getAriaSort = (field) => tableSort.field === field ? (tableSort.direction === 'asc' ? 'ascending' : 'descending') : 'none'

  return (
    <div className="pbi-tile pbi-tile--table">
      <div className="pbi-tile__head">
        <h2 className="pbi-tile__title">Data 16 Kecamatan</h2>
        <div className="pbi-tile__actions">
          <button className="pbi-export-btn" type="button" onClick={() => exportFilteredDistricts(rows)}>Export ({rows.length})</button>
        </div>
      </div>
      <div className="pbi-tile__body">
        {rows.length ? (
          <div className="pbi-table-scroll" tabIndex="0">
            <table className="pbi-table">
              <thead><tr>{COLUMNS.map(([field, label]) => <th scope="col" aria-sort={getAriaSort(field)} key={field}><button type="button" onClick={() => toggleSort(field)}>{label}{tableSort.field === field ? (tableSort.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</button></th>)}</tr></thead>
              <tbody>
                {sortedRows.map((record) => (
                  <tr key={record.districtId} className={record.districtId === selectedDistrictId ? 'is-selected' : ''}>
                    {COLUMNS.map(([field, label]) => <td key={field} data-label={label}>{field === 'districtName' ? <button type="button" className="pbi-table-name-btn" onClick={() => onSelect(record.districtId)} aria-pressed={record.districtId === selectedDistrictId}>{record.districtName}</button> : field === 'quadrant' ? <span className={`pbi-group-badge pbi-group-badge--${record.quadrant}`}>{record.quadrant}</span> : formatCell(record, field)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <div className="pbi-empty"><button className="pbi-reset-btn" type="button" onClick={onReset}>Reset</button></div>}
      </div>
    </div>
  )
}
