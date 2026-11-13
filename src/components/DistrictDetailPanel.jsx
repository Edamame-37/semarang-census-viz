import { QUADRANT_LABELS } from '../data/selectors.js'
import { formatNumber, formatPercent, formatSigned } from '../utils/numberFormat.js'

export default function DistrictDetailPanel({ district, benchmark, onClose }) {
  if (!district) {
    return (
      <aside className="detail-panel detail-panel--empty" aria-label="Detail kecamatan">
        <div className="detail-panel__prompt"><span aria-hidden="true">↗</span><div><h3>Pilih satu kecamatan</h3><p>Klik titik, batang, atau nama kecamatan pada tabel untuk membandingkan nilainya dengan Kota Semarang.</p></div></div>
      </aside>
    )
  }

  const rows = [
    { label: 'Penduduk 2023', unit: 'ribu jiwa', district: formatNumber(district.populationThousand), city: formatNumber(benchmark.populationThousand), difference: null },
    { label: 'Pangsa penduduk 2023', unit: '%', district: formatPercent(district.populationSharePct), city: formatPercent(benchmark.populationSharePct), difference: null },
    { label: 'Pertumbuhan 2020–2023', unit: '% per tahun', district: formatPercent(district.growthRatePct), city: formatPercent(benchmark.growthRatePct), difference: `${formatSigned(district.growthRatePct - benchmark.growthRatePct)} pp` },
    { label: 'Kepadatan 2023', unit: 'jiwa/km²', district: formatNumber(district.densityPerKm2), city: formatNumber(benchmark.densityPerKm2), difference: formatSigned(district.densityPerKm2 - benchmark.densityPerKm2) },
    { label: 'Rasio jenis kelamin 2023', unit: 'L per 100 P', district: formatNumber(district.sexRatioPer100Females), city: formatNumber(benchmark.sexRatioPer100Females), difference: formatSigned(district.sexRatioPer100Females - benchmark.sexRatioPer100Females) },
  ]

  return (
    <aside className="detail-panel" aria-labelledby="detail-title">
      <div className="detail-panel__header">
        <div><p className="detail-panel__label">Kecamatan terpilih</p><h3 id="detail-title">{district.districtName}</h3></div>
        <button className="text-button" type="button" onClick={onClose}>Hapus pilihan</button>
      </div>
      <div className="detail-comparison-scroll">
        <table className="detail-comparison">
          <thead><tr><th scope="col">Indikator</th><th scope="col">{district.districtName}</th><th scope="col">Kota Semarang</th><th scope="col">Selisih relevan</th></tr></thead>
          <tbody>{rows.map((row) => <tr key={row.label}><th scope="row">{row.label}<small>{row.unit}</small></th><td><strong>{row.district}</strong></td><td>{row.city}</td><td>{row.difference ?? '—'}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="detail-classification"><span className={`classification-mark classification-mark--${district.quadrant}`}>{district.quadrant}</span><strong>Kelompok {district.quadrant}</strong><span>{QUADRANT_LABELS[district.quadrant]}</span></div>
      <p className="detail-source">Perbandingan memakai agregat resmi BPS; selisih pertumbuhan dinyatakan dalam poin persentase.</p>
    </aside>
  )
}
