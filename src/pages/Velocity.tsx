import {
  CumulativeThroughputChart,
  VelocityByPhaseChart,
  PhaseThroughputTable,
  MonthlyOffersChart,
} from '../components/Charts'
import {
  getPhaseMetrics,
  getMonthlyOffers,
} from '../utils/metrics'

export default function Velocity() {
  const phaseMetrics = getPhaseMetrics()
  const monthlyOffers = getMonthlyOffers()

  const peakPhase = [...phaseMetrics].sort((a, b) => b.offersPerWeek - a.offersPerWeek)[0]
  const migrationPhase = phaseMetrics.find((p) => p.phase.id === 'migration')
  const postRecovery = phaseMetrics.filter((p) =>
    ['full-capacity', 'expansion'].includes(p.phase.id)
  )

  const totalPostRecovery = postRecovery.reduce((s, p) => s + p.offerCount, 0)
  const postRecoveryWeeks = postRecovery.reduce((s, p) => {
    const start = new Date(p.phase.startDate)
    const end = new Date(p.phase.endDate)
    return s + Math.max(1, (end.getTime() - start.getTime()) / (7 * 24 * 3600 * 1000))
  }, 0)
  const postRecoveryRate = postRecoveryWeeks > 0 ? totalPostRecovery / postRecoveryWeeks : 0

  const fullCapacity = phaseMetrics.find((p) => p.phase.id === 'full-capacity')

  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Velocity & Throughput</h1>
        <span className="topbar-badge">
          Peak: {peakPhase?.offersPerWeek.toFixed(1)}/wk
        </span>
      </div>

      {/* Cumulative Throughput */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Cumulative Throughput Over Time</h2>
        </div>
        <CumulativeThroughputChart />
      </div>

      {/* Velocity by Phase + Run Rate comparison */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Velocity by Operating Phase</h2>
          </div>
          <VelocityByPhaseChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Run Rate Comparison</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Peak Velocity Phase</td>
                  <td className="text-mono">
                    {peakPhase?.phase.name} — {peakPhase?.offersPerWeek.toFixed(1)} offers/wk
                  </td>
                </tr>
                <tr>
                  <td>Post-Recovery Run Rate</td>
                  <td className="text-mono">{postRecoveryRate.toFixed(1)} offers/wk</td>
                </tr>
                <tr>
                  <td>Full Capacity Run Rate</td>
                  <td className="text-mono">
                    {fullCapacity?.offersPerWeek.toFixed(1)} offers/wk
                  </td>
                </tr>
                <tr>
                  <td>Migration Throughput</td>
                  <td className="text-mono">
                    {migrationPhase?.offerCount} offers during 5-week pause
                  </td>
                </tr>
                <tr>
                  <td>Avg Offers / Month</td>
                  <td className="text-mono">
                    {(monthlyOffers.reduce((s, m) => s + m.total, 0) / Math.max(1, monthlyOffers.length)).toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Phase throughput table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Throughput by Period</h2>
        </div>
        <PhaseThroughputTable />
      </div>

      {/* Monthly detail */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Monthly Offer Activity</h2>
        </div>
        <MonthlyOffersChart />
      </div>
    </div>
  )
}
