import { useState, useMemo } from 'react'
import { offers, type OfferRecord, getOutcome, isRetained, isStarted } from '../data/offers'
import { getPhaseForDate } from '../data/context'
import { offerToAcceptDays, acceptToStartDays, offerToStartDays, isSenior } from '../utils/metrics'
import { formatDate, formatDateShort } from '../utils/dates'

function outcomeBadge(outcome: string) {
  const map: Record<string, string> = {
    Accepted: 'badge-accepted',
    Declined: 'badge-declined',
    Withdrew: 'badge-withdrew',
    Pending: 'badge-pending',
  }
  return map[outcome] || 'badge-pending'
}

export default function OfferLogTable() {
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [orgFilter, setOrgFilter] = useState<string>('All')
  const [seniorityFilter, setSeniorityFilter] = useState<string>('All')

  const uniqueOrgs = useMemo(() => [...new Set(offers.map((r) => r.org))], [])

  const filtered = useMemo(() => {
    return offers.filter((r) => {
      if (statusFilter !== 'All') {
        const o = getOutcome(r)
        if (statusFilter === 'Started' && !isStarted(r)) return false
        if (statusFilter === 'Not Started' && (!isRetained(r) || isStarted(r))) return false
        if (
          statusFilter !== 'Started' &&
          statusFilter !== 'Not Started' &&
          o !== statusFilter
        )
          return false
      }
      if (orgFilter !== 'All' && r.org !== orgFilter) return false
      if (seniorityFilter === 'Senior' && !isSenior(r)) return false
      if (seniorityFilter === 'Junior' && isSenior(r)) return false
      return true
    })
  }, [statusFilter, orgFilter, seniorityFilter])

  return (
    <div>
      <div className="filters-bar">
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Accepted">Accepted</option>
          <option value="Declined">Declined</option>
          <option value="Withdrew">Withdrew</option>
          <option value="Pending">Pending</option>
          <option value="Started">Started</option>
          <option value="Not Started">Not Started</option>
        </select>
        <select
          className="filter-select"
          value={orgFilter}
          onChange={(e) => setOrgFilter(e.target.value)}
        >
          <option value="All">All Orgs</option>
          {uniqueOrgs.map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={seniorityFilter}
          onChange={(e) => setSeniorityFilter(e.target.value)}
        >
          <option value="All">All Levels</option>
          <option value="Senior">Senior (IC4+)</option>
          <option value="Junior">Junior (IC2-IC3)</option>
        </select>
        {(statusFilter !== 'All' || orgFilter !== 'All' || seniorityFilter !== 'All') && (
          <button
            className="filter-clear"
            onClick={() => {
              setStatusFilter('All')
              setOrgFilter('All')
              setSeniorityFilter('All')
            }}
          >
            Clear Filters
          </button>
        )}
        <span className="filter-count">
          {filtered.length} of {offers.length} offers
        </span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>PCN</th>
              <th>Org</th>
              <th>Stage</th>
              <th>Level</th>
              <th>Status</th>
              <th>Offer Extended</th>
              <th>Accepted</th>
              <th>Start Date</th>
              <th>O→A (d)</th>
              <th>A→S (d)</th>
              <th>O→S (d)</th>
              <th>Phase</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const outcome = getOutcome(r)
              const o2a = offerToAcceptDays(r)
              const a2s = acceptToStartDays(r)
              const o2s = offerToStartDays(r)
              const phase = getPhaseForDate(r.offerExtendedDate)
              return (
                <tr key={r.candidateId}>
                  <td className="text-mono">{r.candidateId}</td>
                  <td className="text-mono">{r.pcn}</td>
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
                  <td className="text-mono">L{r.level}</td>
                  <td>
                    <span className={`badge ${outcomeBadge(outcome)}`}>{outcome}</span>
                  </td>
                  <td className="text-mono">{formatDateShort(r.offerExtendedDate)}</td>
                  <td className="text-mono">
                    {r.offerAcceptedDate ? formatDateShort(r.offerAcceptedDate) : '—'}
                  </td>
                  <td className="text-mono">
                    {r.startDate ? formatDateShort(r.startDate) : '—'}
                  </td>
                  <td className="text-mono">{o2a !== null ? o2a : '—'}</td>
                  <td className="text-mono">{a2s !== null ? a2s : '—'}</td>
                  <td className="text-mono">{o2s !== null ? o2s : '—'}</td>
                  <td className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {phase?.name || '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
