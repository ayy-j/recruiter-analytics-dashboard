import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
  ComposedChart, Scatter
} from 'recharts'
import {
  getPhaseMetrics,
  getCumulativeData,
  getOrgStats,
  getLevelDistribution,
  getMonthlySeniorShare,
  getDaysToAcceptBuckets,
  getMonthlyOffers,
  type PhaseMetrics,
} from '../utils/metrics'
import { phases } from '../data/context'
import { offers, type OfferRecord, getOutcome } from '../data/offers'
import { formatDateShort } from '../utils/dates'

const CHART_COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7', '#3b82f6']

// ── Funnel ───────────────────────────────────────────────────

export function FunnelVisual({ stages }: {
  stages: { label: string; count: number; rate?: string; color: string }[]
}) {
  const max = Math.max(...stages.map((s) => s.count), 1)
  return (
    <div className="funnel-visual">
      {stages.map((s, i) => (
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
  const counts: Record<string, number> = {
    Accepted: 0,
    Declined: 0,
    Withdrew: 0,
    Pending: 0,
  }
  for (const r of offers) {
    counts[getOutcome(r)]++
  }
  const data = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }))

  const colorMap: Record<string, string> = {
    Accepted: '#22c55e',
    Declined: '#ef4444',
    Withdrew: '#f59e0b',
    Pending: '#06b6d4',
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={colorMap[entry.name] || '#6366f1'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#21293c',
            border: '1px solid #313a50',
            borderRadius: 6,
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
          }}
        />
        <Legend />
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
        <XAxis
          dataKey="date"
          tickFormatter={(d: string) => formatDateShort(d)}
          stroke="#5c6670"
          fontSize={11}
        />
        <YAxis stroke="#5c6670" fontSize={11} />
        <Tooltip
          contentStyle={{
            background: '#21293c',
            border: '1px solid #313a50',
            borderRadius: 6,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
          }}
          labelFormatter={(d: string) => formatDateShort(d)}
        />
        <Area
          type="monotone"
          dataKey="offers"
          stroke="#6366f1"
          fill="rgba(99,102,241,0.15)"
          strokeWidth={2}
          name="Offers Extended"
        />
        <Area
          type="monotone"
          dataKey="acceptances"
          stroke="#f59e0b"
          fill="rgba(245,158,11,0.1)"
          strokeWidth={2}
          name="Acceptances"
        />
        <Area
          type="monotone"
          dataKey="retained"
          stroke="#22c55e"
          fill="rgba(34,197,94,0.1)"
          strokeWidth={2}
          name="Retained Hires"
        />
        <Area
          type="monotone"
          dataKey="started"
          stroke="#06b6d4"
          fill="rgba(6,182,212,0.08)"
          strokeWidth={2}
          name="Started"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// ── Velocity by Phase ───────────────────────────────────────

export function VelocityByPhaseChart() {
  const data = getPhaseMetrics()
  return (
    <ResponsiveContainer width="100%" height={340}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis type="number" stroke="#5c6670" fontSize={11} />
        <YAxis
          type="category"
          dataKey="phase.name"
          stroke="#5c6670"
          fontSize={11}
          width={140}
          tickFormatter={(v: string) => v.length > 20 ? v.slice(0, 20) + '…' : v}
        />
        <Tooltip
          contentStyle={{
            background: '#21293c',
            border: '1px solid #313a50',
            borderRadius: 6,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [
            name === 'offersPerWeek'
              ? `${value.toFixed(1)}/wk`
              : value,
            name === 'offersPerWeek' ? 'Offers / Week' : name,
          ]}
        />
        <Bar dataKey="offerCount" fill="#6366f1" name="Offers" radius={[0, 4, 4, 0]} />
        <Bar dataKey="acceptanceCount" fill="#22c55e" name="Accepted" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Phase Throughput Table ──────────────────────────────────

export function PhaseThroughputTable() {
  const data = getPhaseMetrics()
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Phase</th>
            <th>Offers</th>
            <th>Accepted</th>
            <th>Started</th>
            <th>Offers / Week</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p) => (
            <tr key={p.phase.id}>
              <td>
                <span
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: p.phase.color,
                    marginRight: 8,
                  }}
                />
                {p.phase.name}
              </td>
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

// ── Org Split ───────────────────────────────────────────────

export function OrgSplitChart() {
  const data = getOrgStats()
  const pieData = data.map((d) => ({ name: d.org, value: d.totalOffers }))
  const orgColors: Record<string, string> = {
    'Cloud + AI': '#3b82f6',
    MDQ: '#a855f7',
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {pieData.map((entry) => (
            <Cell key={entry.name} fill={orgColors[entry.name] || '#6366f1'} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: '#21293c',
            border: '1px solid #313a50',
            borderRadius: 6,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
          }}
        />
      </PieChart>
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
        <Tooltip
          contentStyle={{
            background: '#21293c',
            border: '1px solid #313a50',
            borderRadius: 6,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" name="Hires" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.label}
              fill={entry.level >= 64 ? '#a855f7' : '#6366f1'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ── Senior Share Over Time ──────────────────────────────────

export function SeniorShareChart() {
  const rawData = getMonthlySeniorShare()
  const data = rawData.map((d) => ({
    ...d,
    junior: d.total - d.senior,
  }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#252d3f" />
        <XAxis
          dataKey="month"
          stroke="#5c6670"
          fontSize={11}
          tickFormatter={(m: string) => {
            const [y, mo] = m.split('-')
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            return `${months[parseInt(mo) - 1]} '${y.slice(2)}`
          }}
        />
        <YAxis stroke="#5c6670" fontSize={11} />
        <Tooltip
          contentStyle={{
            background: '#21293c',
            border: '1px solid #313a50',
            borderRadius: 6,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => {
            if (name === 'pct') return [`${value.toFixed(0)}%`, 'Senior Share']
            return [value, name === 'junior' ? 'IC2-IC3' : name === 'senior' ? 'IC4+' : name]
          }}
        />
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
        <Tooltip
          contentStyle={{
            background: '#21293c',
            border: '1px solid #313a50',
            borderRadius: 6,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]} fill="#6366f1" />
      </BarChart>
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
        <XAxis
          dataKey="month"
          stroke="#5c6670"
          fontSize={11}
          tickFormatter={(m: string) => {
            const [y, mo] = m.split('-')
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            return `${months[parseInt(mo) - 1]} '${y.slice(2)}`
          }}
        />
        <YAxis stroke="#5c6670" fontSize={11} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            background: '#21293c',
            border: '1px solid #313a50',
            borderRadius: 6,
            fontFamily: 'Inter, sans-serif',
            fontSize: 12,
          }}
        />
        <Bar dataKey="accepted" stackId="a" name="Accepted" fill="#22c55e" radius={[0, 0, 0, 0]} />
        <Bar dataKey="declined" stackId="a" name="Declined" fill="#ef4444" radius={[0, 0, 0, 0]} />
        <Bar dataKey="withdrew" stackId="a" name="Withdrew" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
