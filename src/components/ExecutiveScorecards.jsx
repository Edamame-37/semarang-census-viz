import { formatNumber, formatPercent } from '../utils/numberFormat.js'
import { getKeyFindings } from '../data/selectors.js'

export default function ExecutiveScorecards({ benchmark, districts }) {
  const insights = getKeyFindings(districts)
  const cards = [
    { label: 'Penduduk kota', value: formatNumber(benchmark.populationThousand), unit: 'ribu jiwa', note: 'Agregat resmi BPS 2023' },
    { label: 'Kepadatan kota', value: formatNumber(benchmark.densityPerKm2), unit: 'jiwa/km²', note: 'Acuan 16 kecamatan' },
    { label: 'Pertumbuhan', value: formatPercent(benchmark.growthRatePct), unit: 'per tahun', note: 'Rata-rata 2020–2023' },
    { label: 'Rasio jenis kelamin', value: formatNumber(benchmark.sexRatioPer100Females), unit: 'L / 100 P', note: 'Agregat kota 2023' },
  ]

  return (
    <section className="overview" aria-labelledby="overview-title">
      <div className="section-heading">
        <div><p className="section-index">01 / Ikhtisar kota</p><h2 id="overview-title">Semarang dalam empat angka</h2></div>
        <p className="scope-note">Benchmark resmi Kota Semarang—tetap saat data disaring.</p>
      </div>
      <div className="stat-strip">
        {cards.map((card) => (
          <article className="stat-item" key={card.label}>
            <p className="stat-item__label">{card.label}</p>
            <p className="stat-item__measure"><strong>{card.value}</strong><span>{card.unit}</span></p>
            <p className="stat-item__note">{card.note}</p>
          </article>
        ))}
      </div>
      <div className="insight-summary" aria-label="Temuan terverifikasi seluruh kota">
        <span>Temuan utama</span>
        {insights.map((insight, index) => <p key={insight}><strong>{index + 1}.</strong> {insight}</p>)}
      </div>
    </section>
  )
}
