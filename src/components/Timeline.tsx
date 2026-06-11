import { phases, HIRE_DATE, REPORT_AS_OF } from '../data/context'
import { daysBetween } from '../utils/dates'

function pctThrough(start: string, end: string, totalStart: string, totalEnd: string): number {
  const total = daysBetween(totalStart, totalEnd) || 1
  const s = daysBetween(totalStart, start) || 0
  return (s / total) * 100
}

function pctWidth(start: string, end: string, totalStart: string, totalEnd: string): number {
  const total = daysBetween(totalStart, totalEnd) || 1
  const w = daysBetween(start, end) || 0
  return (w / total) * 100
}

export default function Timeline() {
  const totalStart = HIRE_DATE
  const totalEnd = REPORT_AS_OF

  return (
    <div>
      <div className="timeline-container">
        <div className="timeline-track">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="timeline-phase"
              style={{
                left: `${pctThrough(phase.startDate, phase.endDate, totalStart, totalEnd)}%`,
                width: `${Math.max(1, pctWidth(phase.startDate, phase.endDate, totalStart, totalEnd))}%`,
                backgroundColor: phase.color,
              }}
              title={phase.name}
            />
          ))}
        </div>
        <div className="timeline-labels">
          <span>Jul '25</span>
          <span>Oct '25</span>
          <span>Jan '26</span>
          <span>Apr '26</span>
          <span>Jun '26</span>
        </div>
      </div>

      <div className="timeline-phase-detail">
        {phases.map((phase) => {
          const weeks = Math.round(
            (daysBetween(phase.startDate, phase.endDate) || 0) / 7
          )
          return (
            <div
              key={phase.id}
              className="phase-card"
              style={{ '--phase-color': phase.color } as React.CSSProperties}
            >
              <div className="phase-card-name">{phase.name}</div>
              <div className="phase-card-dates">
                {phase.startDate} → {phase.endDate} · {weeks}w
              </div>
              <div className="phase-card-desc">{phase.description}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
