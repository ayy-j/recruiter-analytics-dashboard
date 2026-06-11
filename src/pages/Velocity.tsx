import {
  CumulativeThroughputChart,
  VelocityByPhaseChart,
  RunRateBars,
} from '../components/Charts'
import { getPhaseMetrics } from '../utils/metrics'

export default function Velocity() {
  const phaseMetrics = getPhaseMetrics()
  const peakPhase = [...phaseMetrics].sort((a, b) => b.offersPerWeek - a.offersPerWeek)[0]

  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Velocity & Throughput</h1>
        <span className="topbar-badge">Peak: {peakPhase?.offersPerWeek.toFixed(1)}/wk</span>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Cumulative Throughput Over Time</h2>
        </div>
        <CumulativeThroughputChart />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Offers & Acceptances by Phase</h2>
          </div>
          <VelocityByPhaseChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Run Rate by Phase (Offers/Week)</h2>
          </div>
          <RunRateBars />
        </div>
      </div>

      <div className="kpi-strip">
        <div className="kpi-card">
          <span className="kpi-label">Peak Phase</span>
          <span className="kpi-value kpi-accent">{peakPhase?.offersPerWeek.toFixed(1)}/wk</span>
          <span className="kpi-sub">{peakPhase?.phase.name}</span>
        </div>
        {phaseMetrics.filter((p) => ['full-capacity', 'expansion'].includes(p.phase.id)).map((p) => (
          <div className="kpi-card" key={p.phase.id}>
            <span className="kpi-label">{p.phase.name.length > 24 ? p.phase.name.slice(0, 24) + '…' : p.phase.name}</span>
            <span className="kpi-value">{p.offersPerWeek.toFixed(1)}/wk</span>
            <span className="kpi-sub">{p.offerCount} offers</span>
          </div>
        ))}
        {(() => {
          const m = phaseMetrics.find((p) => p.phase.id === 'migration')
          if (!m) return null
          return (
            <div className="kpi-card" key="migration">
              <span className="kpi-label">Migration Period</span>
              <span className="kpi-value kpi-warning">{m.offerCount}</span>
              <span className="kpi-sub">offers during 5wk pause</span>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
