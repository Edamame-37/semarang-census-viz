import { useMemo } from 'react'
import { formatNumber, formatPercent } from '../utils/numberFormat.js'
import { exportFilteredDistricts } from '../utils/export.js'
import ChartCard from './ChartCard.jsx'

const COLUMNS = [
  ['districtName', 'Kecamatan'],
  ['populationThousand', 'Penduduk (ribu)'],
  ['populationSharePct', 'Pangsa (%)'],
  ['growthRatePct', 'Pertumbuhan (%/thn)'],
  ['densityPerKm2', 'Kepadatan (jiwa/km²)'],
  ['sexRatioPer100Females', 'Rasio JK (L/100 P)'],
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
    <ChartCard id="table" className="table-card" eyebrow="Nilai presisi & alternatif aksesibel" title="Tabel 16 kecamatan" description={`Menampilkan ${rows.length} dari 16 kecamatan.`} actions={<button className="button button--secondary" type="button" onClick={() => exportFilteredDistricts(rows)}>Ekspor hasil filter ({rows.length})</button>}>
      {rows.length ? (
        <>
          <p className="table-scroll-hint">Geser tabel ke samping untuk melihat seluruh indikator.</p>
          <div className="table-scroll" tabIndex="0" aria-label="Tabel dapat digulir horizontal pada layar kecil">
            <table>
              <thead><tr>{COLUMNS.map(([field, label]) => <th scope="col" aria-sort={getAriaSort(field)} key={field}><button type="button" onClick={() => toggleSort(field)}>{label}<span aria-hidden="true">{tableSort.field === field ? (tableSort.direction === 'asc' ? ' ↑' : ' ↓') : ' ↕'}</span></button></th>)}</tr></thead>
              <tbody>
                {sortedRows.map((record) => (
                  <tr key={record.districtId} className={record.districtId === selectedDistrictId ? 'is-selected' : ''}>
                    {COLUMNS.map(([field, label]) => <td key={field} data-label={label}>{field === 'districtName' ? <button type="button" className="table-row-button" onClick={() => onSelect(record.districtId)} aria-pressed={record.districtId === selectedDistrictId}>{record.districtName}</button> : field === 'quadrant' ? <span className={`group-badge group-badge--${record.quadrant}`} aria-label={`Kelompok ${record.quadrant}`}>{record.quadrant}</span> : formatCell(record, field)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : <div className="empty-state"><p>Tidak ada kecamatan yang cocok dengan filter atau pencarian.</p><button className="button button--secondary" type="button" onClick={onReset}>Reset filter</button></div>}
    </ChartCard>
  )
}
