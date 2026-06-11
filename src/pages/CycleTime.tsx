import { DaysToAcceptChart } from '../components/Charts'
import { offers, getOutcome, isRetained } from '../data/offers'
import {
  offerToAcceptDays,
  acceptToStartDays,
  offerToStartDays,
  isSenior,
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
import { formatDateShort } from '../utils/dates'

export default function CycleTime() {
  const accepted = offers.filter(
    (r) => getOutcome(r) === 'Accepted' || getOutcome(r) === 'Withdrew'
  )

  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Cycle Time & Decision Speed</h1>
        <span className="topbar-badge">Median O→A: {medianOfferToAccept}d</span>
      </div>

      {/* Speed Summary Cards */}
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

      {/* Days to Accept Distribution + Speed by Seniority */}
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
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Senior (IC4+)</th>
                  <th>Junior (IC2-3)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Median O→A</td>
                  <td className="text-mono">{medianSeniorO2A} days</td>
                  <td className="text-mono">{medianJuniorO2A} days</td>
                </tr>
                <tr>
                  <td>Average O→A</td>
                  <td className="text-mono">{avgSeniorO2A.toFixed(1)} days</td>
                  <td className="text-mono">{avgJuniorO2A.toFixed(1)} days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
            Senior candidates (IC4+) had a median offer-to-accept time of{' '}
            <strong>{medianSeniorO2A} days</strong> vs.{' '}
            <strong>{medianJuniorO2A} days</strong> for junior candidates — indicating
            that even at higher complexity levels, candidate decision velocity remained
            strong.
          </p>
        </div>
      </div>

      {/* Detail table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Offer → Accept Detail</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Org</th>
                <th>Stage</th>
                <th>Offer Extended</th>
                <th>Accepted</th>
                <th>O→A (d)</th>
                <th>Start</th>
                <th>A→S (d)</th>
                <th>O→S (d)</th>
              </tr>
            </thead>
            <tbody>
              {accepted
                .sort((a, b) => a.offerExtendedDate.localeCompare(b.offerExtendedDate))
                .map((r) => {
                  const o2a = offerToAcceptDays(r)
                  const a2s = acceptToStartDays(r)
                  const o2s = offerToStartDays(r)
                  return (
                    <tr key={r.candidateId}>
                      <td className="text-mono">{r.candidateId}</td>
                      <td>
                        <span className={`badge ${r.org === 'Cloud + AI' ? 'badge-cloud' : 'badge-mdq'}`}>
                          {r.org}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${isSenior(r) ? 'badge-senior' : 'badge-junior'}`}>
                          {r.careerStage}
                        </span>
                      </td>
                      <td className="text-mono">{formatDateShort(r.offerExtendedDate)}</td>
                      <td className="text-mono">
                        {r.offerAcceptedDate ? formatDateShort(r.offerAcceptedDate) : '—'}
                      </td>
                      <td className="text-mono">{o2a !== null ? o2a : '—'}</td>
                      <td className="text-mono">
                        {r.startDate ? formatDateShort(r.startDate) : '—'}
                      </td>
                      <td className="text-mono">{a2s !== null ? a2s : '—'}</td>
                      <td className="text-mono">{o2s !== null ? o2s : '—'}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
