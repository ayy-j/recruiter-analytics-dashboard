import {
  FunnelVisual,
  OfferOutcomesChart,
  OrgSplitChart,
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
  withdrawalRate,
  getOrgStats,
  getPCNPersistence,
} from '../utils/metrics'

export default function OfferFunnel() {
  const orgStats = getOrgStats()
  const persistence = getPCNPersistence()

  const funnelStages = [
    { label: 'Offers Extended', count: totalOffers, color: '#6366f1' },
    {
      label: 'Concluded',
      count: concludedOffers.length,
      rate: `${((concludedOffers.length / totalOffers) * 100).toFixed(0)}%`,
      color: '#818cf8',
    },
    {
      label: 'Initial Acceptances',
      count: initialAcceptances.length,
      rate: `${initialAcceptanceRate.toFixed(1)}%`,
      color: '#22c55e',
    },
    {
      label: 'Acceptances Retained',
      count: retainedHires.length,
      rate: `${acceptanceRetentionRate.toFixed(1)}%`,
      color: '#16a34a',
    },
    {
      label: 'Started',
      count: startedHires.length,
      rate: `${((startedHires.length / Math.max(1, retainedHires.length)) * 100).toFixed(0)}%`,
      color: '#06b6d4',
    },
  ]

  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Offer Funnel & Outcome Analysis</h1>
        <span className="topbar-badge">{hireConversionRate.toFixed(1)}% Conversion</span>
      </div>

      {/* Funnel */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recruiting Funnel</h2>
        </div>
        <FunnelVisual stages={funnelStages} />
      </div>

      {/* Stage Breakdown Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Stage Breakdown</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Stage</th>
                <th>Definition</th>
                <th>Count</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-mono">Offers Extended</td>
                <td>All offer events in the review period</td>
                <td className="text-mono">{totalOffers}</td>
                <td className="text-mono">—</td>
              </tr>
              <tr>
                <td className="text-mono">Offers Concluded</td>
                <td>Excluding outstanding / Pending Decision</td>
                <td className="text-mono">{concludedOffers.length}</td>
                <td className="text-mono">
                  {((concludedOffers.length / totalOffers) * 100).toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="text-mono">Initial Acceptances</td>
                <td>Candidate accepted (including later withdrawals)</td>
                <td className="text-mono">{initialAcceptances.length}</td>
                <td className="text-mono" style={{ color: '#22c55e' }}>
                  {initialAcceptanceRate.toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="text-mono">Acceptances Retained</td>
                <td>Accepted and did not later withdraw</td>
                <td className="text-mono">{retainedHires.length}</td>
                <td className="text-mono" style={{ color: '#22c55e' }}>
                  {acceptanceRetentionRate.toFixed(1)}%
                </td>
              </tr>
              <tr>
                <td className="text-mono">Started</td>
                <td>Recorded start date confirmed</td>
                <td className="text-mono">{startedHires.length}</td>
                <td className="text-mono">
                  {((startedHires.length / Math.max(1, retainedHires.length)) * 100).toFixed(1)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Outcomes Doughnut + Accept Rate by Org */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Offer Outcomes</h2>
          </div>
          <OfferOutcomesChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Accept Rate by Organization</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Org</th>
                  <th>Accepted</th>
                  <th>Declined</th>
                  <th>Withdrew</th>
                  <th>Pending</th>
                  <th>Accept Rate</th>
                </tr>
              </thead>
              <tbody>
                {orgStats.map((org) => {
                  const concluded = org.accepted + org.declined + org.withdrew
                  const rate = concluded > 0 ? ((org.accepted + org.withdrew) / concluded) * 100 : 0
                  return (
                    <tr key={org.org}>
                      <td>
                        <span className={`badge ${org.org === 'Cloud + AI' ? 'badge-cloud' : 'badge-mdq'}`}>
                          {org.org}
                        </span>
                      </td>
                      <td className="text-mono">{org.accepted}</td>
                      <td className="text-mono">{org.declined}</td>
                      <td className="text-mono">{org.withdrew}</td>
                      <td className="text-mono">{org.pending}</td>
                      <td className="text-mono" style={{ color: '#22c55e' }}>
                        {rate.toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Requisition Fill Persistence */}
      {persistence.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Requisition Fill Persistence</h2>
          </div>
          <div className="card-body">
            <p style={{ marginBottom: '1rem' }}>
              The following requisitions required multiple candidates before resolution.
              Each attempt is shown in chronological order.
            </p>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>PCN</th>
                    <th>Org</th>
                    <th>Attempts</th>
                    <th>Outcome Sequence</th>
                    <th>Final</th>
                  </tr>
                </thead>
                <tbody>
                  {persistence.map((p) => (
                    <tr key={p.pcn}>
                      <td className="text-mono">{p.pcn}</td>
                      <td>
                        <span className={`badge ${p.org === 'Cloud + AI' ? 'badge-cloud' : 'badge-mdq'}`}>
                          {p.org}
                        </span>
                      </td>
                      <td className="text-mono">{p.attempts}</td>
                      <td>
                        {p.outcomes.map((o, i) => (
                          <span key={i}>
                            <span
                              className={`badge ${
                                o === 'Accepted'
                                  ? 'badge-accepted'
                                  : o === 'Declined'
                                  ? 'badge-declined'
                                  : 'badge-withdrew'
                              }`}
                            >
                              {o}
                            </span>
                            {i < p.outcomes.length - 1 && (
                              <span style={{ margin: '0 0.3rem', color: '#5c6670' }}>→</span>
                            )}
                          </span>
                        ))}
                      </td>
                      <td>
                        <span
                          className={`badge ${p.resolved ? 'badge-accepted' : 'badge-declined'}`}
                        >
                          {p.resolved ? 'Filled ✓' : 'Unresolved'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
