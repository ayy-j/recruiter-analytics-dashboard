import DomainCards from '../components/DomainCards'
import { PortfolioExpansionTimeline } from '../components/Charts'
import { domains } from '../data/context'

export default function DomainScope() {
  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Recruiting Scope & Domain Narrative</h1>
        <span className="topbar-badge">{domains.length} Domains</span>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Complexity Narrative</h2>
        </div>
        <div className="narrative">
          <p>
            Since joining in July 2025, the recruiting portfolio has expanded from a
            focused set of <strong>Azure Core & AI Infrastructure</strong> roles into three
            additional highly specialized domains: <strong>Microsoft Quantum</strong>,{' '}
            <strong>Microsoft Discovery (AI for Science)</strong>, and{' '}
            <strong>Microsoft Robotics</strong>. This expansion represents a significant
            increase in the breadth, depth, and technical complexity of the roles supported.
          </p>
          <p>
            Recruiting for these domains requires deep sourcing expertise in areas with
            <em> extremely limited candidate pools</em> — quantum physicists, ASIC/FPGA
            engineers, AI research scientists, roboticists, and autonomous systems
            architects. Each domain carries its own technical lexicon, stakeholder
            ecosystem, and competitive landscape.
          </p>
          <p>
            The increasing specialization meant that <strong>each new requisition required
            deeper upfront investment</strong> in stakeholder education, market mapping,
            and sourcing strategy development. Portfolio expansion also multiplied the{' '}
            <strong>stakeholder surface area</strong>: each new domain brought new hiring
            managers, new technical bar calibrations, and new compensation benchmarks.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Domain Overview</h2>
        </div>
        <DomainCards />
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Portfolio Expansion Timeline</h2>
        </div>
        <PortfolioExpansionTimeline />
      </div>
    </div>
  )
}
