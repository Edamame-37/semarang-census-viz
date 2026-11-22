import { formatNumber, formatPercent } from '../utils/numberFormat.js'

export default function ExecutiveScorecards({ benchmark }) {
  const cards = [
    { label: 'Total Penduduk', value: formatNumber(benchmark.populationThousand), unit: 'ribu jiwa', color: '#0078D4' },
    { label: 'Kepadatan Kota', value: formatNumber(benchmark.densityPerKm2), unit: 'jiwa/km²', color: '#1F4E79' },
    { label: 'Pertumbuhan', value: formatPercent(benchmark.growthRatePct), unit: 'per tahun', color: '#D97706' },
    { label: 'Rasio Jenis Kelamin', value: formatNumber(benchmark.sexRatioPer100Females), unit: 'L / 100 P', color: '#7C3AED' },
  ]

  return (
    <>
      {cards.map((card) => (
        <div className="pbi-tile pbi-tile--kpi" key={card.label}>
          <div className="pbi-tile__head">
            <h2 className="pbi-tile__title">{card.label}</h2>
          </div>
          <div className="pbi-tile__body">
            <div className="pbi-kpi">
              <p className="pbi-kpi__value" style={{ color: card.color }}>{card.value}</p>
              <p className="pbi-kpi__unit">{card.unit}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
