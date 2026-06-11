import { DaysToAcceptChart, OfferToAcceptScatterChart } from '../components/Charts'
import {
  medianOfferToAccept,
  avgOfferToAccept,
  minOfferToAccept,
  maxOfferToAccept,
  medianAcceptToStart,
  avgAcceptToStart,
  medianOfferToStart,
  avgOfferToStart,
  medianSeniorO2A,
  medianJuniorO2A,
  avgSeniorO2A,
  avgJuniorO2A,
} from '../utils/metrics'

export default function CycleTime() {
  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Cycle Time & Decision Speed</h1>
        <span className="topbar-badge">Median O→A: {medianOfferToAccept}d</span>
      </div>

      <div className="kpi-strip">
        <div className="kpi-card">
          <span className="kpi-label">Med Offer → Accept</span>
          <span className="kpi-value kpi-accent">{medianOfferToAccept}d</span>
          <span className="kpi-sub">Avg {avgOfferToAccept.toFixed(1)}d · Range {minOfferToAccept}–{maxOfferToAccept}d</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Med Accept → Start</span>
          <span className="kpi-value">{medianAcceptToStart}d</span>
          <span className="kpi-sub">Avg {avgAcceptToStart.toFixed(1)}d</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Med Offer → Start</span>
          <span className="kpi-value">{medianOfferToStart}d</span>
          <span className="kpi-sub">Avg {avgOfferToStart.toFixed(1)}d</span>
        </div>
        <div className="kpi-card">
          <span className="kpi-label">Senior O→A (Med)</span>
          <span className="kpi-value kpi-accent">{medianSeniorO2A}d</span>
          <span className="kpi-sub">Junior: {medianJuniorO2A}d median</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Days to Accept Distribution</h2>
          </div>
          <DaysToAcceptChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Speed by Seniority</h2>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>Senior (IC4+) Median</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7', fontFamily: 'var(--font-mono)' }}>{medianSeniorO2A}d</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg {avgSeniorO2A.toFixed(1)}d</div>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '0.85rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>Junior (IC2-3) Median</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1', fontFamily: 'var(--font-mono)' }}>{medianJuniorO2A}d</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Avg {avgJuniorO2A.toFixed(1)}d</div>
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>
              Senior candidates (IC4+) had a median offer-to-accept time of{' '}
              <strong>{medianSeniorO2A} days</strong> vs.{' '}
              <strong>{medianJuniorO2A} days</strong> for junior candidates — indicating
              that even at higher complexity levels, candidate decision velocity remained
              strong.
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Individual Offer → Accept Times by Career Stage</h2>
        </div>
        <OfferToAcceptScatterChart />
        <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
          Each point represents one confirmed hire. Hover for candidate details. Senior
          roles (IC4+) span a wider decision range while maintaining strong median velocity.
        </p>
      </div>
    </div>
  )
}
