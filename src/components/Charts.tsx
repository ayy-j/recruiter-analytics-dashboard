import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
  ScatterChart, Scatter, ZAxis
} from 'recharts'
import {
  getPhaseMetrics,
  getCumulativeData,
  getOrgStats,
  getLevelDistribution,
  getMonthlySeniorShare,
  getDaysToAcceptBuckets,
  getMonthlyOffers,
  retainedHires,
  offerToAcceptDays,
  isSenior,
} from '../utils/metrics'
import { offers, getOutcome } from '../data/offers'
import { formatDateShort } from '../utils/dates'

// ── Funnel ───────────────────────────────────────────────────

export function FunnelVisual({ stages }: {
  stages: { label: string; count: number; rate?: string; color: string }[]
}) {
  const max = Math.max(...stages.map((s) => s.count), 1)
  return (
    <div className="funnel-visual">
      {stages.map((s) => (
        <div className="funnel-step" key={s.label}>
          <span className="funnel-count">{s.count}</span>
          <div className="funnel-bar-wrap">
            <div
              className="funnel-bar"
              style={{
                width: `${(s.count / max) * 100}%`,
                backgroundColor: s.color,
              }}
            >
              <span>{s.label}</span>
              {s.rate && <span className="funnel-rate">{s.rate}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Offer Outcomes Doughnut ─────────────────────────────────

export function OfferOutcomesChart() {
  const counts: Record<string, number> = { Accepted: 0, Declined: 0, Withdrew: 0, Pending: 0 }
  for (const r of offers) counts[getOutcome(r)]++
  const data = Object.entries(counts).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }))
  const colorMap: Record<string, string> = { Accepted: '#22c55e', Declined: '#ef4444', Withdrew: '#f59e0b', Pending: '#06b6d4' }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((e) => <Cell key={e.name} fill={colorMap[e.name] || '#6366f1'} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ── Cumulative Throughput ───────────────────────────────────

export function CumulativeThroughputChart() {
  const data = getCumulativeData()
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="date" tickFormatter={(d: string) => formatDateShort(d)} stroke="#5c6670" fontSize={11} />
        <YAxis stroke="#5c6670" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} labelFormatter={(d: string) => formatDateShort(d)} />
        <Area type="monotone" dataKey="offers" stroke="#6366f1" fill="rgba(99,102,241,0.15)" strokeWidth={2} name="Offers Extended" />
        <Area type="monotone" dataKey="acceptances" stroke="#f59e0b" fill="rgba(245,158,11,0.1)" strokeWidth={2} name="Acceptances" />
        <Area type="monotone" dataKey="retained" stroke="#22c55e" fill="rgba(34,197,94,0.1)" strokeWidth={2} name="Retained Hires" />
        <Area type="monotone" dataKey="started" stroke="#06b6d4" fill="rgba(6,182,212,0.08)" strokeWidth={2} name="Started" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const tooltipStyle = { background: '#21293c', border: '1px solid #313a50', borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: 12 }

// ── Velocity by Phase ───────────────────────────────────────

export function VelocityByPhaseChart() {
  const data = getPhaseMetrics()
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis type="number" stroke="#5c6670" fontSize={11} />
        <YAxis type="category" dataKey="phase.name" stroke="#5c6670" fontSize={11} width={150}
          tickFormatter={(v: string) => v.length > 22 ? v.slice(0, 22) + '…' : v} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="offerCount" fill="#6366f1" name="Offers" radius={[0, 4, 4, 0]} />
        <Bar dataKey="acceptanceCount" fill="#22c55e" name="Accepted" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Run Rate Comparison Bars ────────────────────────────────

export function RunRateBars() {
  const data = getPhaseMetrics().map((p) => ({
    name: p.phase.name.length > 28 ? p.phase.name.slice(0, 28) + '…' : p.phase.name,
    rate: p.offersPerWeek,
    offers: p.offerCount,
    color: p.phase.color,
  }))
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis type="number" stroke="#5c6670" fontSize={11} />
        <YAxis type="category" dataKey="name" stroke="#5c6670" fontSize={11} width={160} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v.toFixed(1)} offers/wk`, 'Rate']} />
        <Bar dataKey="rate" name="Offers/Week" radius={[0, 4, 4, 0]}>
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Phase Throughput Table (keep one — it's actually useful context) ──

export function PhaseThroughputTable() {
  const data = getPhaseMetrics()
  return (
    <div className="table-container">
      <table>
        <thead><tr><th>Phase</th><th>Offers</th><th>Accepted</th><th>Started</th><th>Offers / Week</th></tr></thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.phase.id}>
              <td><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 3, backgroundColor: p.phase.color, marginRight: 8 }} />{p.phase.name}</td>
              <td className="text-mono">{p.offerCount}</td>
              <td className="text-mono">{p.acceptanceCount}</td>
              <td className="text-mono">{p.startCount}</td>
              <td className="text-mono">{p.offersPerWeek.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Org Split Donut ─────────────────────────────────────────

export function OrgSplitChart() {
  const data = getOrgStats().map((d) => ({ name: d.org, value: d.totalOffers }))
  const colors: Record<string, string> = { 'Cloud + AI': '#3b82f6', MDQ: '#a855f7' }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={100} paddingAngle={4} dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((e) => <Cell key={e.name} fill={colors[e.name] || '#6366f1'} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ── Accept Rate by Org — Grouped Bar ────────────────────────

export function AcceptRateByOrgChart() {
  const data = getOrgStats().map((o) => ({
    org: o.org,
    Accepted: o.accepted,
    Declined: o.declined,
    Withdrew: o.withdrew,
    Pending: o.pending,
  }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="org" stroke="#5c6670" fontSize={12} />
        <YAxis stroke="#5c6670" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Bar dataKey="Accepted" fill="#22c55e" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Declined" fill="#ef4444" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Withdrew" fill="#f59e0b" radius={[0, 0, 0, 0]} />
        <Bar dataKey="Pending" fill="#06b6d4" radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Org Offer vs PCN Comparison ─────────────────────────────

export function OrgOfferComparisonChart() {
  const data = getOrgStats().map((o) => ({
    org: o.org,
    'Total Offers': o.totalOffers,
    'Unique PCNs': o.uniquePCNs,
  }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="org" stroke="#5c6670" fontSize={12} />
        <YAxis stroke="#5c6670" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Bar dataKey="Total Offers" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Unique PCNs" fill="#a855f7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Level Distribution ──────────────────────────────────────

export function LevelDistributionChart() {
  const data = getLevelDistribution()
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="label" stroke="#5c6670" fontSize={12} />
        <YAxis stroke="#5c6670" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="count" name="Hires" radius={[4, 4, 0, 0]}>
          {data.map((e) => <Cell key={e.label} fill={e.level >= 64 ? '#a855f7' : '#6366f1'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Career Stage Donut ──────────────────────────────────────

export function CareerStageDonutChart() {
  const stages = new Map<string, number>()
  for (const r of retainedHires) stages.set(r.careerStage, (stages.get(r.careerStage) || 0) + 1)
  const order = ['IC2', 'IC3', 'IC4', 'IC5', 'IC6', 'M6']
  const data = order.filter((s) => stages.has(s)).map((s) => ({ name: s, value: stages.get(s)! }))
  const colors = ['#06b6d4', '#6366f1', '#22c55e', '#f59e0b', '#a855f7', '#ef4444']

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={95} paddingAngle={2} dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}>
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ── Senior by Domain — Stacked Bar ──────────────────────────

export function SeniorByDomainChart() {
  const data = getOrgStats().map((o) => ({
    org: o.org,
    'IC4+': o.seniorCount,
    'IC2-IC3': o.accepted - o.seniorCount,
  }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="org" stroke="#5c6670" fontSize={12} />
        <YAxis stroke="#5c6670" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Legend />
        <Bar dataKey="IC4+" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
        <Bar dataKey="IC2-IC3" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Senior Share Over Time ──────────────────────────────────

export function SeniorShareChart() {
  const rawData = getMonthlySeniorShare()
  const data = rawData.map((d) => ({ ...d, junior: d.total - d.senior }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="month" stroke="#5c6670" fontSize={11}
          tickFormatter={(m: string) => {
            const [y, mo] = m.split('-')
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            return `${months[parseInt(mo) - 1]} '${y.slice(2)}`
          }} />
        <YAxis stroke="#5c6670" fontSize={11} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="junior" stackId="a" name="IC2-IC3" fill="#6366f1" radius={[0, 0, 0, 0]} />
        <Bar dataKey="senior" stackId="a" name="IC4+" fill="#a855f7" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Days to Accept Distribution ─────────────────────────────

export function DaysToAcceptChart() {
  const data = getDaysToAcceptBuckets()
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="range" stroke="#5c6670" fontSize={11} />
        <YAxis stroke="#5c6670" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]} fill="#6366f1" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Offer → Accept Scatter Plot ─────────────────────────────

export function OfferToAcceptScatterChart() {
  const accepted = retainedHires.filter((r) => r.offerAcceptedDate)
  const data = accepted.map((r) => ({
    date: r.offerExtendedDate,
    days: offerToAcceptDays(r) || 0,
    stage: r.careerStage,
    org: r.org,
    candidateId: r.candidateId,
  }))
  const stageColors: Record<string, string> = {
    IC2: '#06b6d4', IC3: '#6366f1', IC4: '#22c55e', IC5: '#f59e0b', IC6: '#a855f7', M6: '#ef4444',
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <ScatterChart>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="date" stroke="#5c6670" fontSize={11}
          tickFormatter={(d: string) => formatDateShort(d)} name="Offer Date" />
        <YAxis dataKey="days" stroke="#5c6670" fontSize={11} name="Days to Accept" />
        <ZAxis range={[60, 60]} />
        <Tooltip contentStyle={tooltipStyle}
          formatter={(value: number, name: string) => name === 'days' ? [`${value} days`, 'Offer → Accept'] : [value, name]}
          labelFormatter={(d: string) => formatDateShort(d)} />
        <Legend />
        {['IC2', 'IC3', 'IC4', 'IC5', 'IC6', 'M6'].map((stage) => {
          const stageData = data.filter((d) => d.stage === stage)
          if (stageData.length === 0) return null
          return <Scatter key={stage} name={stage} data={stageData} fill={stageColors[stage]} />
        })}
      </ScatterChart>
    </ResponsiveContainer>
  )
}

// ── Monthly Offers ───────────────────────────────────────────

export function MonthlyOffersChart() {
  const data = getMonthlyOffers()
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis dataKey="month" stroke="#5c6670" fontSize={11}
          tickFormatter={(m: string) => {
            const [y, mo] = m.split('-')
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            return `${months[parseInt(mo) - 1]} '${y.slice(2)}`
          }} />
        <YAxis stroke="#5c6670" fontSize={11} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="accepted" stackId="a" name="Accepted" fill="#22c55e" radius={[0, 0, 0, 0]} />
        <Bar dataKey="declined" stackId="a" name="Declined" fill="#ef4444" radius={[0, 0, 0, 0]} />
        <Bar dataKey="withdrew" stackId="a" name="Withdrew" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Portfolio Expansion Timeline ────────────────────────────

export function PortfolioExpansionTimeline() {
  const milestones = [
    { date: '2025-07-14', label: 'Azure Core & AI', phase: 'Day 1', color: '#3b82f6', desc: 'Compute, Networking, Storage, Security, AI Infrastructure' },
    { date: '2025-11-01', label: 'Quantum Computing', phase: 'Month 4', color: '#a855f7', desc: 'Quantum HW/SW, HPC, ASIC/FPGA, Quantum Chemistry' },
    { date: '2026-01-01', label: 'AI for Science', phase: 'Month 6', color: '#06b6d4', desc: 'Scientific Reasoning, Knowledge Graphs, Multi-Agent AI' },
    { date: '2026-02-01', label: 'Robotics', phase: 'Month 7', color: '#f59e0b', desc: 'Autonomous Systems, Embodied AI, ROS, Fleet Orchestration' },
  ]
  return (
    <div style={{ position: 'relative', padding: '1rem 0' }}>
      <div style={{
        position: 'absolute', left: 24, top: 0, bottom: 0, width: 3,
        background: 'linear-gradient(to bottom, #3b82f6, #a855f7, #06b6d4, #f59e0b)', borderRadius: 2
      }} />
      {milestones.map((m, i) => (
        <div key={m.label} style={{
          position: 'relative', marginLeft: 48, marginBottom: '1.5rem', padding: '1rem',
          background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
          borderLeft: `3px solid ${m.color}`
        }}>
          <div style={{
            position: 'absolute', left: -36, top: 18, width: 14, height: 14,
            borderRadius: '50%', backgroundColor: m.color, border: '3px solid var(--bg-primary)'
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: m.color }}>{m.label}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{m.phase}</span>
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{m.desc}</div>
        </div>
      ))}
    </div>
  )
}
