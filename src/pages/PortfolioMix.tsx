import {
  OrgSplitChart,
  LevelDistributionChart,
  SeniorShareChart,
} from '../components/Charts'
import {
  getOrgStats,
  getLevelDistribution,
  getMonthlySeniorShare,
  retainedHires,
  seniorHires,
  juniorHires,
  isSenior,
} from '../utils/metrics'
import { offers, getOutcome } from '../data/offers'

export default function PortfolioMix() {
  const orgStats = getOrgStats()
  const levelDist = getLevelDistribution()
  const monthlySenior = getMonthlySeniorShare()

  // Senior hires by org
  const seniorByOrg = orgStats.map((org) => ({
    org: org.org,
    senior: org.seniorCount,
    junior: org.accepted - org.seniorCount,
    total: org.accepted,
  }))

  // Career stage breakdown
  const stageCounts = new Map<string, number>()
  for (const r of retainedHires) {
    stageCounts.set(r.careerStage, (stageCounts.get(r.careerStage) || 0) + 1)
  }
  const stageData = Array.from(stageCounts.entries()).sort(([a], [b]) => {
    const order = ['IC2', 'IC3', 'IC4', 'IC5', 'IC6', 'M6']
    return order.indexOf(a) - order.indexOf(b)
  })

  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Portfolio Mix & Complexity</h1>
        <span className="topbar-badge">
          {((seniorHires.length / Math.max(1, retainedHires.length)) * 100).toFixed(0)}% Senior
        </span>
      </div>

      {/* Org Split + Level Distribution */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Organization Split</h2>
          </div>
          <OrgSplitChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Level Distribution (Confirmed Hires)</h2>
          </div>
          <LevelDistributionChart />
        </div>
      </div>

      {/* Org Detail: Offers vs PCNs */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Offers by Organization: Events vs. Unique PCNs</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Org</th>
                <th>Total Offers</th>
                <th>Unique PCNs</th>
                <th>Offer/PCN Ratio</th>
                <th>Accepted</th>
                <th>Declined</th>
                <th>Withdrew</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {orgStats.map((org) => (
                <tr key={org.org}>
                  <td>
                    <span
                      className={`badge ${org.org === 'Cloud + AI' ? 'badge-cloud' : 'badge-mdq'}`}
                    >
                      {org.org}
                    </span>
                  </td>
                  <td className="text-mono">{org.totalOffers}</td>
                  <td className="text-mono">{org.uniquePCNs}</td>
                  <td className="text-mono">
                    {(org.totalOffers / Math.max(1, org.uniquePCNs)).toFixed(2)}x
                  </td>
                  <td className="text-mono">{org.accepted}</td>
                  <td className="text-mono">{org.declined}</td>
                  <td className="text-mono">{org.withdrew}</td>
                  <td className="text-mono">{org.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Career Stage Mix */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Career Stage Mix</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Hires</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {stageData.map(([stage, count]) => (
                  <tr key={stage}>
                    <td>
                      <span
                        className={`badge ${
                          ['IC4', 'IC5', 'IC6', 'M6'].includes(stage)
                            ? 'badge-senior'
                            : 'badge-junior'
                        }`}
                      >
                        {stage}
                      </span>
                    </td>
                    <td className="text-mono">{count}</td>
                    <td className="text-mono">
                      {((count / retainedHires.length) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Senior Hires by Domain</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Org</th>
                  <th>IC4+</th>
                  <th>IC2-3</th>
                  <th>Senior %</th>
                </tr>
              </thead>
              <tbody>
                {seniorByOrg.map((org) => (
                  <tr key={org.org}>
                    <td>
                      <span
                        className={`badge ${org.org === 'Cloud + AI' ? 'badge-cloud' : 'badge-mdq'}`}
                      >
                        {org.org}
                      </span>
                    </td>
                    <td className="text-mono">{org.senior}</td>
                    <td className="text-mono">{org.junior}</td>
                    <td className="text-mono">
                      {((org.senior / Math.max(1, org.total)) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Senior Share Over Time */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Senior Share Over Time</h2>
        </div>
        <SeniorShareChart />
        <p className="text-muted mt-2" style={{ fontSize: '0.8rem' }}>
          The IC4+ share of the portfolio grew significantly as MDQ domains (Quantum,
          Discovery, Robotics) entered the portfolio — these areas are inherently
          senior-heavy due to the specialized expertise required.
        </p>
      </div>
    </div>
  )
}
