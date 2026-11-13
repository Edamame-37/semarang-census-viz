export default function ChartCard({ title, eyebrow, description, actions, children, className = '', id }) {
  return (
    <section className={`chart-card ${className}`} aria-labelledby={`${id}-title`}>
      <header className="chart-card__header">
        <div>
          {eyebrow && <p className="chart-index">{eyebrow}</p>}
          <h2 id={`${id}-title`}>{title}</h2>
          {description && <p className="chart-card__description">{description}</p>}
        </div>
        {actions && <div className="chart-card__actions">{actions}</div>}
      </header>
      {children}
    </section>
  )
}
