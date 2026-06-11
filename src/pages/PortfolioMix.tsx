import {
  OrgSplitChart,
  LevelDistributionChart,
  SeniorShareChart,
  CareerStageDonutChart,
  SeniorByDomainChart,
} from '../components/Charts'
import { retainedHires, seniorHires } from '../utils/metrics'

export default function PortfolioMix() {
  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Portfolio Mix & Complexity</h1>
        <span className="topbar-badge">
          {((seniorHires.length / Math.max(1, retainedHires.length)) * 100).toFixed(0)}% Senior
        </span>
      </div>

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

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Career Stage Mix</h2>
          </div>
          <CareerStageDonutChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Senior vs Junior by Organization</h2>
          </div>
          <SeniorByDomainChart />
        </div>
      </div>

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
