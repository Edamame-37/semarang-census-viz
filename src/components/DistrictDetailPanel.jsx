import { formatNumber, formatPercent, formatSigned } from '../utils/numberFormat.js'

export default function DistrictDetailPanel({ district, benchmark, onClose }) {
  if (!district) return null

  const metrics = [
    { label: 'Penduduk', value: `${formatNumber(district.populationThousand)} ribu`, diff: null },
    { label: 'Pangsa', value: formatPercent(district.populationSharePct), diff: null },
    { label: 'Pertumbuhan', value: `${formatPercent(district.growthRatePct)}/thn`, diff: `${formatSigned(district.growthRatePct - benchmark.growthRatePct)} pp` },
    { label: 'Kepadatan', value: `${formatNumber(district.densityPerKm2)} jiwa/km²`, diff: formatSigned(district.densityPerKm2 - benchmark.densityPerKm2) },
    { label: 'Rasio JK', value: `${formatNumber(district.sexRatioPer100Females)} L/100P`, diff: formatSigned(district.sexRatioPer100Females - benchmark.sexRatioPer100Females) },
  ]

  return (
    <div className="pbi-detail">
      <div className="pbi-detail__header">
        <span className={`pbi-detail__badge pbi-detail__badge--${district.quadrant}`}>{district.quadrant}</span>
        <h3 className="pbi-detail__name">{district.districtName}</h3>
      </div>
      <div className="pbi-detail__metrics">
        {metrics.map((m) => (
          <div className="pbi-detail__metric" key={m.label}>
            <span className="pbi-detail__metric-label">{m.label}</span>
            <span className="pbi-detail__metric-value">{m.value}</span>
            {m.diff && <span className="pbi-detail__metric-diff">vs kota: {m.diff}</span>}
          </div>
        ))}
      </div>
      <button className="pbi-detail__close" type="button" onClick={onClose}>Tutup</button>
    </div>
  )
}
