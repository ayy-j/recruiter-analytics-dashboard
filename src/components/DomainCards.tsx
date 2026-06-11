import { domains, type DomainInfo } from '../data/context'

export default function DomainCards() {
  return (
    <div className="domain-grid">
      {domains.map((domain) => (
        <div
          key={domain.id}
          className="domain-card"
          style={{ '--domain-color': domain.color } as React.CSSProperties}
        >
          <div className="domain-card-name" style={{ color: domain.color }}>
            {domain.name}
          </div>
          <div className="domain-card-desc">{domain.description}</div>
          <div className="domain-tags">
            {domain.areas.map((area) => (
              <span key={area} className="domain-tag">
                {area}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
