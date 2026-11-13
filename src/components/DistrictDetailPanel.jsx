import { QUADRANT_LABELS } from '../data/selectors.js'
import { formatNumber, formatPercent, formatSigned } from '../utils/numberFormat.js'

export default function DistrictDetailPanel({ district, benchmark, onClose }) {
  if (!district) {
    return (
      <aside className="detail-panel detail-panel--empty" aria-label="Detail kecamatan">
        <div className="detail-panel__prompt"><span aria-hidden="true">↗</span><div><h3>Pilih satu kecamatan</h3><p>Klik titik, batang, atau baris tabel untuk melihat kelima indikator dan perbandingannya dengan kota.</p></div></div>
      </aside>
    )
  }
  const metrics = [
    ['Penduduk', formatNumber(district.populationThousand), 'ribu jiwa'],
    ['Pangsa', formatPercent(district.populationSharePct), district.populationShareAbove10 ? 'di atas 10%' : 'tidak di atas 10%'],
    ['Pertumbuhan', formatPercent(district.growthRatePct), `${formatSigned(district.growthRatePct - benchmark.growthRatePct, ' pp')} dari kota`],
    ['Kepadatan', formatNumber(district.densityPerKm2), `${formatSigned(district.densityPerKm2 - benchmark.densityPerKm2)} jiwa/km²`],
    ['Rasio jenis kelamin', formatNumber(district.sexRatioPer100Females), `${formatSigned(district.sexRatioSignedDeviation)} dari 100`],
  ]
  return (
    <aside className="detail-panel" aria-labelledby="detail-title">
      <div className="detail-panel__header">
        <div><p className="detail-panel__label">Kecamatan terpilih</p><h3 id="detail-title">{district.districtName}</h3></div>
        <button className="icon-button" type="button" aria-label="Tutup detail kecamatan" onClick={onClose}>×</button>
      </div>
      <div className="detail-grid">
        {metrics.map(([label, value, note]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></div>)}
      </div>
      <div className="detail-classification"><span className={`classification-mark classification-mark--${district.quadrant}`}>{district.quadrant}</span><strong>Kelompok {district.quadrant}</strong><span>{QUADRANT_LABELS[district.quadrant]}</span></div>
      <p className="detail-source">BPS Kota Semarang, data 2023; laju pertumbuhan rata-rata tahunan 2020–2023.</p>
    </aside>
  )
}
