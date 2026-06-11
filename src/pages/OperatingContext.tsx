import Timeline from '../components/Timeline'
import { PhaseThroughputTable } from '../components/Charts'
import { HIRE_DATE, FULL_PRODUCTIVITY_DATE, REPORT_AS_OF, phases } from '../data/context'
import { daysBetween } from '../utils/dates'

export default function OperatingContext() {
  const tenureDays = daysBetween(HIRE_DATE, REPORT_AS_OF) || 0
  const rampDays = daysBetween(HIRE_DATE, FULL_PRODUCTIVITY_DATE) || 60

  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Operating Context & Timeline</h1>
        <span className="topbar-badge">{tenureDays} days in role</span>
      </div>

      {/* Key Dates */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Tenure & Key Milestones</h2>
        </div>
        <div className="narrative">
          <p>
            Tenure of <strong>{tenureDays} days</strong> (Jul 14, 2025 – Jun 11, 2026),
            with a planned <strong>{rampDays}-day ramp</strong> to full productivity.
            The review period spans <strong>{phases.length} distinct operating phases</strong>,
            each with materially different constraints on recruiting capacity, available
            requisitions, and portfolio composition.
          </p>
          <p>
            Three key environmental factors shaped throughput during this period:{' '}
            <strong>(1)</strong> the iCIMS-to-TA Hub migration and global recruiting pause{' '}
            (Nov 3 – Dec 8, 2025), <strong>(2)</strong> the Azure Core hiring slowdown{' '}
            (Mar 3–24, 2026), and <strong>(3)</strong> progressive portfolio expansion from
            Cloud + AI infrastructure into Quantum Computing, AI for Scientific Discovery,
            and Robotics — each requiring deeper specialization and broader stakeholder
            alignment.
          </p>
          <p>
            Beginning January 1, 2026, responsibility expanded to include{' '}
            <strong>internal candidate recruitment</strong> in addition to external —
            effectively doubling the candidate pipeline management surface.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Operating Phase Timeline</h2>
        </div>
        <Timeline />
      </div>

      {/* Throughput by Phase */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Throughput by Operating Phase</h2>
        </div>
        <PhaseThroughputTable />
      </div>

      {/* Constraint Windows Narrative */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Constraint Windows & Portfolio Expansion</h2>
        </div>
        <div className="narrative">
          <p>
            <strong>iCIMS → TA Hub Migration (Nov 3 – Dec 8, 2025):</strong> Near-complete
            global recruiting activity pause. Pipeline progression, offer generation, and
            candidate communication were materially constrained. The {(() => {
              const m = phases.find((p) => p.id === 'migration')
              return m ? Math.round((daysBetween(m.startDate, m.endDate) || 0) / 7) : 0
            })()}-week
            window effectively removed one quarter of available operating time during the
            review period.
          </p>
          <p>
            <strong>Recovery Period (Dec 9 – Jan 1):</strong> Gradual restoration of
            capacity as TA Hub proficiency was built and pipelines were reactivated. The
            holiday calendar further compressed available working days during this window.
          </p>
          <p>
            <strong>Azure Core Slowdown (Mar 3–24, 2026):</strong> Hiring reduction in
            the primary portfolio domain required rapid stakeholder realignment toward MDQ
            teams. This transition period involved onboarding new hiring manager
            relationships across Quantum, Discovery, and Robotics.
          </p>
          <p>
            <strong>Portfolio Complexity Expansion:</strong> Beginning November 2025,
            requisitions in Quantum Computing & Engineering, Silicon Design & Fabrication,
            Scientific Discovery, and Robotics entered the portfolio. The technical depth
            required for these roles — spanning quantum physics, ASIC design, AI/ML research,
            and autonomous systems — represented a significant increase in sourcing
            difficulty and stakeholder coordination complexity.
          </p>
        </div>
      </div>
    </div>
  )
}
