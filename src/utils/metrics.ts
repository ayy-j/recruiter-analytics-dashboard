import { type OfferRecord, offers, getOutcome, isConcluded, isRetained, isStarted } from '../data/offers';
import { daysBetween } from './dates';
import { phases, getPhaseForDate, HIRE_DATE, REPORT_AS_OF, type OperatingPhase } from '../data/context';

// ── Core Counts ──────────────────────────────────────────────

export const totalOffers = offers.length;
export const concludedOffers = offers.filter(isConcluded);
export const acceptedOffers = offers.filter((r) => getOutcome(r) === 'Accepted');
export const withdrawnOffers = offers.filter((r) => getOutcome(r) === 'Withdrew');
export const declinedOffers = offers.filter((r) => getOutcome(r) === 'Declined');
export const pendingOffers = offers.filter((r) => getOutcome(r) === 'Pending');

export const initialAcceptances = offers.filter(
  (r) => getOutcome(r) === 'Accepted' || getOutcome(r) === 'Withdrew'
);
export const retainedHires = acceptedOffers;
export const startedHires = acceptedOffers.filter(isStarted);

// ── Rates ────────────────────────────────────────────────────

export const initialAcceptanceRate =
  concludedOffers.length > 0 ? (initialAcceptances.length / concludedOffers.length) * 100 : 0;

export const hireConversionRate =
  concludedOffers.length > 0 ? (retainedHires.length / concludedOffers.length) * 100 : 0;

export const acceptanceRetentionRate =
  initialAcceptances.length > 0 ? (retainedHires.length / initialAcceptances.length) * 100 : 0;

export const withdrawalRate =
  initialAcceptances.length > 0 ? (withdrawnOffers.length / initialAcceptances.length) * 100 : 0;

export const startedRate =
  retainedHires.length > 0 ? (startedHires.length / retainedHires.length) * 100 : 0;

// ── Seniority ────────────────────────────────────────────────

export function isSenior(r: OfferRecord): boolean {
  return ['IC4', 'IC5', 'IC6', 'M6'].includes(r.careerStage);
}

export const seniorHires = retainedHires.filter(isSenior);
export const juniorHires = retainedHires.filter((r) => !isSenior(r));

// ── Portfolio Diversity ──────────────────────────────────────

export const uniqueOrgs = [...new Set(offers.map((r) => r.org))];

// ── Cycle Time ───────────────────────────────────────────────

export function offerToAcceptDays(r: OfferRecord): number | null {
  if (!r.offerAcceptedDate) return null;
  return daysBetween(r.offerExtendedDate, r.offerAcceptedDate);
}

export function acceptToStartDays(r: OfferRecord): number | null {
  if (!r.offerAcceptedDate || !r.startDate) return null;
  return daysBetween(r.offerAcceptedDate, r.startDate);
}

export function offerToStartDays(r: OfferRecord): number | null {
  if (!r.startDate) return null;
  return daysBetween(r.offerExtendedDate, r.startDate);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

const o2aDays = acceptedOffers.map(offerToAcceptDays).filter((d): d is number => d !== null);
export const medianOfferToAccept = median(o2aDays);
export const avgOfferToAccept = average(o2aDays);
export const minOfferToAccept = o2aDays.length > 0 ? Math.min(...o2aDays) : 0;
export const maxOfferToAccept = o2aDays.length > 0 ? Math.max(...o2aDays) : 0;

const a2sDays = acceptedOffers.map(acceptToStartDays).filter((d): d is number => d !== null);
export const medianAcceptToStart = median(a2sDays);
export const avgAcceptToStart = average(a2sDays);

const o2sDays = acceptedOffers.map(offerToStartDays).filter((d): d is number => d !== null);
export const medianOfferToStart = median(o2sDays);
export const avgOfferToStart = average(o2sDays);

// Senior vs junior cycle time
export const seniorO2ADays = seniorHires
  .map(offerToAcceptDays)
  .filter((d): d is number => d !== null);
export const juniorO2ADays = juniorHires
  .map(offerToAcceptDays)
  .filter((d): d is number => d !== null);

export const medianSeniorO2A = median(seniorO2ADays);
export const medianJuniorO2A = median(juniorO2ADays);
export const avgSeniorO2A = average(seniorO2ADays);
export const avgJuniorO2A = average(juniorO2ADays);

// ── Velocity by Phase ────────────────────────────────────────

export interface PhaseMetrics {
  phase: OperatingPhase;
  offerCount: number;
  acceptanceCount: number;
  startCount: number;
  offersPerWeek: number;
}

export function getPhaseMetrics(): PhaseMetrics[] {
  return phases.map((phase) => {
    const phaseOffers = offers.filter((r) => {
      const p = getPhaseForDate(r.offerExtendedDate);
      return p?.id === phase.id;
    });
    const phaseAcceptances = phaseOffers.filter(
      (r) => getOutcome(r) === 'Accepted' || getOutcome(r) === 'Withdrew'
    );
    const phaseStarts = phaseOffers.filter((r) => isRetained(r) && isStarted(r));

    const startD = new Date(phase.startDate);
    const endD = new Date(phase.endDate);
    const weeks = Math.max(1, (endD.getTime() - startD.getTime()) / (7 * 24 * 3600 * 1000));

    return {
      phase,
      offerCount: phaseOffers.length,
      acceptanceCount: phaseAcceptances.length,
      startCount: phaseStarts.length,
      offersPerWeek: phaseOffers.length / weeks,
    };
  });
}

// ── Cumulative Over Time ─────────────────────────────────────

export interface CumulativePoint {
  date: string;
  offers: number;
  acceptances: number;
  retained: number;
  started: number;
}

export function getCumulativeData(): CumulativePoint[] {
  const sorted = [...offers].sort((a, b) => a.offerExtendedDate.localeCompare(b.offerExtendedDate));
  let cOffers = 0;
  let cAccept = 0;
  let cRetain = 0;
  let cStart = 0;

  const points: CumulativePoint[] = [];
  const seen = new Set<string>();

  for (const r of sorted) {
    cOffers++;
    const outcome = getOutcome(r);
    if (outcome === 'Accepted') {
      cAccept++;
      cRetain++;
    } else if (outcome === 'Withdrew') {
      cAccept++;
    }
    if (isRetained(r) && isStarted(r)) {
      cStart++;
    }
    if (!seen.has(r.offerExtendedDate)) {
      seen.add(r.offerExtendedDate);
    }
    points.push({
      date: r.offerExtendedDate,
      offers: cOffers,
      acceptances: cAccept,
      retained: cRetain,
      started: cStart,
    });
  }
  return points;
}

// ── Org Split ────────────────────────────────────────────────

export interface OrgStats {
  org: string;
  totalOffers: number;
  accepted: number;
  declined: number;
  withdrew: number;
  pending: number;
  uniquePCNs: number;
  seniorCount: number;
}

export function getOrgStats(): OrgStats[] {
  const orgs = uniqueOrgs;
  return orgs.map((org) => {
    const orgOffers = offers.filter((r) => r.org === org);
    const pcns = new Set(orgOffers.map((r) => r.pcn));
    return {
      org,
      totalOffers: orgOffers.length,
      accepted: orgOffers.filter((r) => getOutcome(r) === 'Accepted').length,
      declined: orgOffers.filter((r) => getOutcome(r) === 'Declined').length,
      withdrew: orgOffers.filter((r) => getOutcome(r) === 'Withdrew').length,
      pending: orgOffers.filter((r) => getOutcome(r) === 'Pending').length,
      uniquePCNs: pcns.size,
      seniorCount: orgOffers.filter((r) => isRetained(r) && isSenior(r)).length,
    };
  });
}

// ── Level Distribution ───────────────────────────────────────

export interface LevelBucket {
  level: number;
  label: string;
  count: number;
}

export function getLevelDistribution(): LevelBucket[] {
  const buckets = new Map<number, number>();
  for (const r of retainedHires) {
    buckets.set(r.level, (buckets.get(r.level) || 0) + 1);
  }
  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([level, count]) => ({ level, label: `L${level}`, count }));
}

// ── Senior Share Over Time (monthly) ─────────────────────────

export interface MonthlySeniorShare {
  month: string;
  total: number;
  senior: number;
  pct: number;
}

export function getMonthlySeniorShare(): MonthlySeniorShare[] {
  const byMonth = new Map<string, OfferRecord[]>();
  for (const r of retainedHires) {
    const m = r.offerExtendedDate.slice(0, 7);
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(r);
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, recs]) => {
      const sen = recs.filter(isSenior).length;
      return {
        month,
        total: recs.length,
        senior: sen,
        pct: recs.length > 0 ? (sen / recs.length) * 100 : 0,
      };
    });
}

// ── Requisition Fill Persistence ─────────────────────────────

export interface PCNPersistence {
  pcn: string;
  org: string;
  attempts: number;
  outcomes: string[];
  finalOutcome: string;
  resolved: boolean;
}

export function getPCNPersistence(): PCNPersistence[] {
  const byPCN = new Map<string, OfferRecord[]>();
  for (const r of offers) {
    if (!byPCN.has(r.pcn)) byPCN.set(r.pcn, []);
    byPCN.get(r.pcn)!.push(r);
  }
  return Array.from(byPCN.entries())
    .filter(([, recs]) => recs.length > 1)
    .map(([pcn, recs]) => {
      const sorted = recs.sort((a, b) => a.offerExtendedDate.localeCompare(b.offerExtendedDate));
      const outcomes = sorted.map((r) => getOutcome(r));
      const final = outcomes[outcomes.length - 1];
      return {
        pcn,
        org: sorted[0].org,
        attempts: sorted.length,
        outcomes,
        finalOutcome: final,
        resolved: final === 'Accepted',
      };
    });
}

// ── Days to Accept Distribution ──────────────────────────────

export interface DaysBucket {
  range: string;
  min: number;
  max: number;
  count: number;
}

export function getDaysToAcceptBuckets(): DaysBucket[] {
  const days = o2aDays;
  const buckets: DaysBucket[] = [
    { range: 'Same day', min: 0, max: 0, count: 0 },
    { range: '1–3 days', min: 1, max: 3, count: 0 },
    { range: '4–7 days', min: 4, max: 7, count: 0 },
    { range: '8–14 days', min: 8, max: 14, count: 0 },
    { range: '15–21 days', min: 15, max: 21, count: 0 },
    { range: '22+ days', min: 22, max: Infinity, count: 0 },
  ];
  for (const d of days) {
    for (const b of buckets) {
      if (d >= b.min && d <= b.max) {
        b.count++;
        break;
      }
    }
  }
  return buckets.filter((b) => b.count > 0 || b.range === 'Same day');
}

// ── Offers by Month ──────────────────────────────────────────

export interface MonthlyOffers {
  month: string;
  total: number;
  accepted: number;
  declined: number;
  withdrew: number;
}

export function getMonthlyOffers(): MonthlyOffers[] {
  const byMonth = new Map<string, OfferRecord[]>();
  for (const r of offers) {
    const m = r.offerExtendedDate.slice(0, 7);
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(r);
  }
  return Array.from(byMonth.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, recs]) => ({
      month,
      total: recs.length,
      accepted: recs.filter((r) => getOutcome(r) === 'Accepted').length,
      declined: recs.filter((r) => getOutcome(r) === 'Declined').length,
      withdrew: recs.filter((r) => getOutcome(r) === 'Withdrew').length,
    }));
}
