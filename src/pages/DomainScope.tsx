import DomainCards from '../components/DomainCards'
import { domains } from '../data/context'

export default function DomainScope() {
  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Recruiting Scope & Domain Narrative</h1>
        <span className="topbar-badge">{domains.length} Domains</span>
      </div>

      {/* Complexity Narrative */}
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
            <em>extremely limited candidate pools</em> — quantum physicists, ASIC/FPGA
            engineers, AI research scientists, roboticists, and autonomous systems
            architects. Each domain carries its own technical lexicon, stakeholder
            ecosystem, and competitive landscape (competing against Google, Amazon,
            NVIDIA, top research universities, and well-funded startups).
          </p>
          <p>
            The increasing specialization meant that <strong>each new requisition required
            deeper upfront investment</strong> in stakeholder education, market mapping,
            and sourcing strategy development. The transition from generalist Cloud
            infrastructure roles to deeply specialized Quantum and Robotics roles
            occurred while maintaining existing pipeline momentum — a dual-track
            execution challenge.
          </p>
          <p>
            Portfolio expansion also multiplied the <strong>stakeholder surface area</strong>:
            each new domain brought new hiring managers, new technical bar calibrations,
            and new compensation benchmarks — all of which required dedicated ramp time
            within an already constrained operating environment.
          </p>
        </div>
      </div>

      {/* Domain Cards */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Domain Overview</h2>
        </div>
        <DomainCards />
      </div>

      {/* Portfolio Expansion Timeline */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Portfolio Expansion Map</h2>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Domain</th>
                <th>Entered Portfolio</th>
                <th>Specialization Level</th>
                <th>Candidate Pool</th>
                <th>Key Challenge</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="badge badge-cloud">Azure Core & AI</span>
                </td>
                <td>Jul 2025 (Day 1)</td>
                <td>High</td>
                <td>Moderate</td>
                <td>Competing with AWS/GCP for top cloud talent</td>
              </tr>
              <tr>
                <td>
                  <span className="badge badge-mdq">Quantum Computing</span>
                </td>
                <td>Nov 2025</td>
                <td>Extreme</td>
                <td>Very Small</td>
                <td>Global scarcity of qualified quantum researchers</td>
              </tr>
              <tr>
                <td>
                  <span className="badge badge-mdq">AI for Science</span>
                </td>
                <td>Jan 2026</td>
                <td>Extreme</td>
                <td>Very Small</td>
                <td>Intersection of AI/ML + domain science expertise</td>
              </tr>
              <tr>
                <td>
                  <span className="badge badge-mdq">Robotics</span>
                </td>
                <td>Feb 2026</td>
                <td>Extreme</td>
                <td>Small</td>
                <td>Multi-disciplinary: HW, SW, AI, embedded systems</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
