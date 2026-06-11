import {
  totalOffers,
  concludedOffers,
  initialAcceptances,
  retainedHires,
  startedHires,
  initialAcceptanceRate,
  hireConversionRate,
  acceptanceRetentionRate,
  withdrawalRate,
  startedRate,
  seniorHires,
  uniqueOrgs,
  medianOfferToAccept,
  avgOfferToAccept,
} from '../utils/metrics'

interface KPI {
  label: string
  value: string
  sub?: string
  cls?: string
}

export default function KPIStrip() {
  const kpis: KPI[] = [
    {
      label: 'Total Offers',
      value: String(totalOffers),
      sub: `${concludedOffers.length} concluded`,
    },
    {
      label: 'Acceptance Rate',
      value: `${initialAcceptanceRate.toFixed(1)}%`,
      sub: `${initialAcceptances.length} of ${concludedOffers.length}`,
      cls: 'kpi-success',
    },
    {
      label: 'Confirmed Hires',
      value: String(retainedHires.length),
      sub: `${hireConversionRate.toFixed(1)}% conversion`,
      cls: 'kpi-accent',
    },
    {
      label: 'Retention Rate',
      value: `${acceptanceRetentionRate.toFixed(1)}%`,
      sub: `${withdrawalRate.toFixed(1)}% withdrew`,
      cls: 'kpi-success',
    },
    {
      label: 'Started',
      value: `${startedHires.length}`,
      sub: `${startedRate.toFixed(0)}% of hires`,
    },
    {
      label: 'Senior Hires',
      value: String(seniorHires.length),
      sub: `IC4+ | ${((seniorHires.length / Math.max(1, retainedHires.length)) * 100).toFixed(0)}% of hires`,
      cls: 'kpi-accent',
    },
    {
      label: 'Portfolio Diversity',
      value: String(uniqueOrgs.length),
      sub: uniqueOrgs.join(' · '),
    },
    {
      label: 'Med. Days to Accept',
      value: `${medianOfferToAccept}d`,
      sub: `Avg ${avgOfferToAccept.toFixed(1)}d`,
    },
  ]

  return (
    <div className="kpi-strip">
      {kpis.map((kpi) => (
        <div className="kpi-card" key={kpi.label}>
          <span className="kpi-label">{kpi.label}</span>
          <span className={`kpi-value ${kpi.cls || ''}`}>{kpi.value}</span>
          {kpi.sub && <span className="kpi-sub">{kpi.sub}</span>}
        </div>
      ))}
    </div>
  )
}
