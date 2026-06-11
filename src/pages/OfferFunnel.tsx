import {
  FunnelVisual,
  OfferOutcomesChart,
  AcceptRateByOrgChart,
} from '../components/Charts'
import {
  totalOffers,
  concludedOffers,
  initialAcceptances,
  retainedHires,
  startedHires,
  initialAcceptanceRate,
  hireConversionRate,
  acceptanceRetentionRate,
  getPCNPersistence,
} from '../utils/metrics'

export default function OfferFunnel() {
  const persistence = getPCNPersistence()

  const funnelStages = [
    { label: 'Offers Extended', count: totalOffers, color: '#6366f1' },
    { label: 'Concluded', count: concludedOffers.length, rate: `${((concludedOffers.length / totalOffers) * 100).toFixed(0)}%`, color: '#818cf8' },
    { label: 'Initial Acceptances', count: initialAcceptances.length, rate: `${initialAcceptanceRate.toFixed(1)}%`, color: '#22c55e' },
    { label: 'Acceptances Retained', count: retainedHires.length, rate: `${acceptanceRetentionRate.toFixed(1)}%`, color: '#16a34a' },
    { label: 'Started', count: startedHires.length, rate: `${((startedHires.length / Math.max(1, retainedHires.length)) * 100).toFixed(0)}%`, color: '#06b6d4' },
  ]

  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Offer Funnel & Outcome Analysis</h1>
        <span className="topbar-badge">{hireConversionRate.toFixed(1)}% Conversion</span>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recruiting Funnel</h2>
        </div>
        <FunnelVisual stages={funnelStages} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Offer Outcomes</h2>
          </div>
          <OfferOutcomesChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Outcomes by Organization</h2>
          </div>
          <AcceptRateByOrgChart />
        </div>
      </div>

      {persistence.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Requisition Fill Persistence</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {persistence.map((p) => (
              <div key={p.pcn} style={{
                background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
                padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <span className="text-mono" style={{ fontWeight: 700, fontSize: '0.9rem', minWidth: 90 }}>{p.pcn}</span>
                <span className={`badge ${p.org === 'Cloud + AI' ? 'badge-cloud' : 'badge-mdq'}`}>{p.org}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{p.attempts} attempts</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {p.outcomes.map((o, i) => (
                    <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span className={`badge ${o === 'Accepted' ? 'badge-accepted' : o === 'Declined' ? 'badge-declined' : 'badge-withdrew'}`}>{o}</span>
                      {i < p.outcomes.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
                    </span>
                  ))}
                </span>
                <span className={`badge ${p.resolved ? 'badge-accepted' : 'badge-declined'}`} style={{ marginLeft: 'auto' }}>
                  {p.resolved ? 'Filled ✓' : 'Unresolved'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
