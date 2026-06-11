import KPIStrip from '../components/KPIStrip'
import {
  CumulativeThroughputChart,
  MonthlyOffersChart,
  OfferOutcomesChart,
  OrgOfferComparisonChart,
  RunRateBars,
} from '../components/Charts'
import {
  totalOffers,
  concludedOffers,
  initialAcceptances,
  retainedHires,
  initialAcceptanceRate,
  hireConversionRate,
  acceptanceRetentionRate,
  seniorHires,
  uniqueOrgs,
  medianOfferToAccept,
  avgOfferToAccept,
  getPhaseMetrics,
} from '../utils/metrics'
import { HIRE_DATE, FULL_PRODUCTIVITY_DATE, REPORT_AS_OF } from '../data/context'

export default function ExecutiveSummary() {
  const phaseMetrics = getPhaseMetrics()
  const peakPhase = [...phaseMetrics].sort((a, b) => b.offersPerWeek - a.offersPerWeek)[0]

  return (
    <div>
      <div className="topbar">
        <h1 className="topbar-title">Executive Summary</h1>
        <span className="topbar-badge">Report as of {REPORT_AS_OF}</span>
      </div>

      <KPIStrip />

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Performance Narrative</h2>
        </div>
        <div className="narrative">
          <p>
            Hired on <strong>{HIRE_DATE}</strong> with a{' '}
            <strong>60-day ramp</strong> to full productivity (target:{' '}
            {FULL_PRODUCTIVITY_DATE}), this review period spans nearly 11 months of
            recruiting execution across increasingly specialized technical domains. Over
            this period, <em>{totalOffers} offers</em> were extended, with{' '}
            <em>{concludedOffers.length} concluded</em> and{' '}
            <em>{retainedHires.length} confirmed hires</em> — representing a{' '}
            <em>{hireConversionRate.toFixed(1)}% hire conversion rate</em>.
          </p>
          <p>
            The <em>{initialAcceptanceRate.toFixed(1)}% initial acceptance rate</em> and{' '}
            <em>{acceptanceRetentionRate.toFixed(1)}% retention rate</em> demonstrate strong
            candidate engagement. Of the {initialAcceptances.length}{' '}
            initial acceptances, only 2 candidates later withdrew — an exceptionally low
            post-accept attrition rate for senior technical roles.
          </p>
          <p>
            The portfolio is notably senior-heavy: <em>{seniorHires.length} of{' '}
              {retainedHires.length} hires ({((seniorHires.length / retainedHires.length) * 100).toFixed(0)}%)</em> are
            IC4+, spanning L63–L67 across Cloud + AI and MDQ organizations. Median
            offer-to-accept time is <em>{medianOfferToAccept} days</em> (avg{' '}
            {avgOfferToAccept.toFixed(1)}d), reflecting efficient candidate decision
            management even for highly specialized roles.
          </p>
          <p>
            Performance must be contextualized against material operating constraints: a
            5-week ATS migration pause (Nov–Dec 2025), a 3-week Azure Core hiring slowdown
            (Mar 2026), and a progressively expanding portfolio that grew from Azure Core
            infrastructure into Quantum Computing, AI for Scientific Discovery, and Robotics.
            During post-recovery expansion, throughput reached the{' '}
            <em>{peakPhase?.phase.name}</em> peak at{' '}
            <em>{peakPhase?.offersPerWeek.toFixed(1)} offers/week</em> across{' '}
            <em>{uniqueOrgs.length} organizations</em>.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Cumulative Throughput</h2>
          </div>
          <CumulativeThroughputChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Offer Outcomes</h2>
          </div>
          <OfferOutcomesChart />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Monthly Offer Activity</h2>
          </div>
          <MonthlyOffersChart />
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Run Rate by Operating Phase</h2>
          </div>
          <RunRateBars />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Organization Comparison: Offers vs Unique Requisitions</h2>
        </div>
        <OrgOfferComparisonChart />
      </div>
    </div>
  )
}
