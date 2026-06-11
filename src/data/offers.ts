export interface OfferRecord {
  candidateId: number;
  pcn: string;
  org: string;
  careerStage: string;
  level: number;
  offerStatus: string;
  offerExtendedDate: string;
  offerAcceptedDate: string | null;
  offerDeclinedDate: string | null;
  startDate: string | null;
}

export type OfferOutcome = 'Accepted' | 'Declined' | 'Withdrew' | 'Pending';

function toISODate(mmddYYYY: string): string {
  const [m, d, y] = mmddYYYY.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

export function getOutcome(record: OfferRecord): OfferOutcome {
  const s = record.offerStatus;
  if (s === 'Accepted - Withdrew') return 'Withdrew';
  if (s === 'Pending Decision') return 'Pending';
  if (s === 'Declined') return 'Declined';
  return 'Accepted';
}

export function isConcluded(record: OfferRecord): boolean {
  return getOutcome(record) !== 'Pending';
}

export function isRetained(record: OfferRecord): boolean {
  return record.offerStatus === 'Accepted';
}

export function isStarted(record: OfferRecord): boolean {
  return record.startDate !== null && record.startDate !== '';
}

const raw: (Omit<OfferRecord, 'offerExtendedDate' | 'offerAcceptedDate' | 'offerDeclinedDate' | 'startDate'> & {
  offerExtendedDateRaw: string;
  offerAcceptedDateRaw: string;
  offerDeclinedDateRaw: string;
  startDateRaw: string;
})[] = [
  { candidateId: 57301, pcn: '73181178', org: 'Cloud + AI', careerStage: 'IC3', level: 61, offerStatus: 'Accepted', offerExtendedDateRaw: '10/29/2025', offerAcceptedDateRaw: '11/07/2025', offerDeclinedDateRaw: '', startDateRaw: '01/05/2026' },
  { candidateId: 45945, pcn: '73181184', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Declined', offerExtendedDateRaw: '08/29/2025', offerAcceptedDateRaw: '', offerDeclinedDateRaw: '09/08/2025', startDateRaw: '' },
  { candidateId: 35519, pcn: '73181184', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '09/19/2025', offerAcceptedDateRaw: '09/25/2025', offerDeclinedDateRaw: '', startDateRaw: '10/13/2025' },
  { candidateId: 51228, pcn: '73178917', org: 'Cloud + AI', careerStage: 'IC3', level: 61, offerStatus: 'Accepted', offerExtendedDateRaw: '10/02/2025', offerAcceptedDateRaw: '10/06/2025', offerDeclinedDateRaw: '', startDateRaw: '11/24/2025' },
  { candidateId: 30765, pcn: '73181204', org: 'Cloud + AI', careerStage: 'IC3', level: 61, offerStatus: 'Declined', offerExtendedDateRaw: '10/22/2025', offerAcceptedDateRaw: '', offerDeclinedDateRaw: '10/28/2025', startDateRaw: '' },
  { candidateId: 35699, pcn: '73181204', org: 'Cloud + AI', careerStage: 'IC3', level: 62, offerStatus: 'Declined', offerExtendedDateRaw: '10/30/2025', offerAcceptedDateRaw: '', offerDeclinedDateRaw: '11/17/2025', startDateRaw: '' },
  { candidateId: 33610, pcn: '73181204', org: 'Cloud + AI', careerStage: 'IC3', level: 62, offerStatus: 'Accepted - Withdrew', offerExtendedDateRaw: '11/18/2025', offerAcceptedDateRaw: '12/02/2025', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 44942, pcn: '73222990', org: 'Cloud + AI', careerStage: 'IC2', level: 60, offerStatus: 'Accepted', offerExtendedDateRaw: '10/13/2025', offerAcceptedDateRaw: '10/14/2025', offerDeclinedDateRaw: '', startDateRaw: '11/10/2025' },
  { candidateId: 32971, pcn: '73181180', org: 'Cloud + AI', careerStage: 'IC3', level: 62, offerStatus: 'Accepted', offerExtendedDateRaw: '10/29/2025', offerAcceptedDateRaw: '11/04/2025', offerDeclinedDateRaw: '', startDateRaw: '12/15/2025' },
  { candidateId: 25625, pcn: '73181179', org: 'Cloud + AI', careerStage: 'IC4', level: 63, offerStatus: 'Accepted', offerExtendedDateRaw: '12/24/2025', offerAcceptedDateRaw: '01/05/2026', offerDeclinedDateRaw: '', startDateRaw: '01/26/2026' },
  { candidateId: 52784, pcn: '73112479', org: 'Cloud + AI', careerStage: 'IC3', level: 61, offerStatus: 'Accepted', offerExtendedDateRaw: '01/06/2026', offerAcceptedDateRaw: '01/08/2026', offerDeclinedDateRaw: '', startDateRaw: '02/09/2026' },
  { candidateId: 55900, pcn: '73200719', org: 'Cloud + AI', careerStage: 'IC3', level: 62, offerStatus: 'Accepted', offerExtendedDateRaw: '12/15/2025', offerAcceptedDateRaw: '12/18/2025', offerDeclinedDateRaw: '', startDateRaw: '01/26/2026' },
  { candidateId: 41625, pcn: '73199420', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '01/09/2026', offerAcceptedDateRaw: '01/13/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 63880, pcn: '73245559', org: 'MDQ', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '01/12/2026', offerAcceptedDateRaw: '01/22/2026', offerDeclinedDateRaw: '', startDateRaw: '02/10/2026' },
  { candidateId: 58440, pcn: '73244654', org: 'MDQ', careerStage: 'IC4', level: 64, offerStatus: 'Accepted - Withdrew', offerExtendedDateRaw: '02/24/2026', offerAcceptedDateRaw: '03/10/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 30564, pcn: '73244653', org: 'MDQ', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '02/28/2026', offerAcceptedDateRaw: '03/26/2026', offerDeclinedDateRaw: '', startDateRaw: '04/20/2026' },
  { candidateId: 53542, pcn: '73198782', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '12/26/2025', offerAcceptedDateRaw: '01/07/2026', offerDeclinedDateRaw: '', startDateRaw: '03/02/2026' },
  { candidateId: 31492, pcn: '73237179', org: 'Cloud + AI', careerStage: 'IC3', level: 62, offerStatus: 'Accepted', offerExtendedDateRaw: '12/15/2025', offerAcceptedDateRaw: '12/20/2025', offerDeclinedDateRaw: '', startDateRaw: '02/09/2026' },
  { candidateId: 54403, pcn: '73237186', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '02/20/2026', offerAcceptedDateRaw: '02/26/2026', offerDeclinedDateRaw: '', startDateRaw: '03/23/2026' },
  { candidateId: 38918, pcn: '73245562', org: 'MDQ', careerStage: 'IC5', level: 65, offerStatus: 'Accepted', offerExtendedDateRaw: '04/13/2026', offerAcceptedDateRaw: '04/20/2026', offerDeclinedDateRaw: '', startDateRaw: '06/22/2026' },
  { candidateId: 59721, pcn: '73181202', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '01/12/2026', offerAcceptedDateRaw: '01/13/2026', offerDeclinedDateRaw: '', startDateRaw: '03/02/2026' },
  { candidateId: 63009, pcn: '73178985', org: 'Cloud + AI', careerStage: 'IC3', level: 61, offerStatus: 'Accepted', offerExtendedDateRaw: '01/09/2026', offerAcceptedDateRaw: '01/09/2026', offerDeclinedDateRaw: '', startDateRaw: '02/09/2026' },
  { candidateId: 61352, pcn: '73178916', org: 'Cloud + AI', careerStage: 'IC3', level: 62, offerStatus: 'Accepted', offerExtendedDateRaw: '12/16/2025', offerAcceptedDateRaw: '12/18/2025', offerDeclinedDateRaw: '', startDateRaw: '02/02/2026' },
  { candidateId: 14022, pcn: '73237195', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Declined', offerExtendedDateRaw: '01/19/2026', offerAcceptedDateRaw: '', offerDeclinedDateRaw: '01/19/2026', startDateRaw: '' },
  { candidateId: 50211, pcn: '73237195', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '02/20/2026', offerAcceptedDateRaw: '03/02/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 51122, pcn: '73166875', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '12/08/2025', offerAcceptedDateRaw: '12/17/2025', offerDeclinedDateRaw: '', startDateRaw: '03/30/2026' },
  { candidateId: 52284, pcn: '73266332', org: 'MDQ', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '01/20/2026', offerAcceptedDateRaw: '01/26/2026', offerDeclinedDateRaw: '', startDateRaw: '03/23/2026' },
  { candidateId: 47799, pcn: '73238253', org: 'Cloud + AI', careerStage: 'IC6', level: 67, offerStatus: 'Accepted', offerExtendedDateRaw: '01/02/2026', offerAcceptedDateRaw: '01/05/2026', offerDeclinedDateRaw: '', startDateRaw: '01/16/2026' },
  { candidateId: 23038, pcn: '73200533', org: 'Cloud + AI', careerStage: 'IC5', level: 66, offerStatus: 'Accepted', offerExtendedDateRaw: '02/10/2026', offerAcceptedDateRaw: '02/24/2026', offerDeclinedDateRaw: '', startDateRaw: '05/26/2026' },
  { candidateId: 29252, pcn: '73237194', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '12/30/2025', offerAcceptedDateRaw: '01/06/2026', offerDeclinedDateRaw: '', startDateRaw: '03/16/2026' },
  { candidateId: 54181, pcn: '73237206', org: 'Cloud + AI', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '01/29/2026', offerAcceptedDateRaw: '01/29/2026', offerDeclinedDateRaw: '', startDateRaw: '03/02/2026' },
  { candidateId: 34493, pcn: '73181204', org: 'Cloud + AI', careerStage: 'IC3', level: 62, offerStatus: 'Accepted', offerExtendedDateRaw: '02/06/2026', offerAcceptedDateRaw: '02/12/2026', offerDeclinedDateRaw: '', startDateRaw: '03/16/2026' },
  { candidateId: 17382, pcn: '73274216', org: 'MDQ', careerStage: 'IC2', level: 60, offerStatus: 'Accepted', offerExtendedDateRaw: '02/03/2026', offerAcceptedDateRaw: '02/05/2026', offerDeclinedDateRaw: '', startDateRaw: '03/02/2026' },
  { candidateId: 18369, pcn: '73237205', org: 'Cloud + AI', careerStage: 'IC3', level: 61, offerStatus: 'Accepted', offerExtendedDateRaw: '02/24/2026', offerAcceptedDateRaw: '03/02/2026', offerDeclinedDateRaw: '', startDateRaw: '05/18/2026' },
  { candidateId: 53093, pcn: '73291766', org: 'MDQ', careerStage: 'IC5', level: 65, offerStatus: 'Accepted', offerExtendedDateRaw: '04/23/2026', offerAcceptedDateRaw: '04/24/2026', offerDeclinedDateRaw: '', startDateRaw: '05/11/2026' },
  { candidateId: 50887, pcn: '73293038', org: 'MDQ', careerStage: 'IC3', level: 62, offerStatus: 'Accepted', offerExtendedDateRaw: '02/04/2026', offerAcceptedDateRaw: '02/09/2026', offerDeclinedDateRaw: '', startDateRaw: '03/02/2026' },
  { candidateId: 28976, pcn: '73281259', org: 'MDQ', careerStage: 'IC4', level: 63, offerStatus: 'Accepted', offerExtendedDateRaw: '03/10/2026', offerAcceptedDateRaw: '03/20/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 33384, pcn: '73299394', org: 'MDQ', careerStage: 'IC5', level: 66, offerStatus: 'Accepted', offerExtendedDateRaw: '02/18/2026', offerAcceptedDateRaw: '02/20/2026', offerDeclinedDateRaw: '', startDateRaw: '03/02/2026' },
  { candidateId: 51661, pcn: '73300178', org: 'MDQ', careerStage: 'IC4', level: 63, offerStatus: 'Pending Decision', offerExtendedDateRaw: '04/30/2026', offerAcceptedDateRaw: '', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 17344, pcn: '73300179', org: 'MDQ', careerStage: 'IC3', level: 62, offerStatus: 'Accepted', offerExtendedDateRaw: '05/12/2026', offerAcceptedDateRaw: '05/13/2026', offerDeclinedDateRaw: '', startDateRaw: '06/15/2026' },
  { candidateId: 58018, pcn: '73300199', org: 'MDQ', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '03/30/2026', offerAcceptedDateRaw: '04/06/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 47795, pcn: '73291764', org: 'MDQ', careerStage: 'M6', level: 67, offerStatus: 'Accepted', offerExtendedDateRaw: '02/25/2026', offerAcceptedDateRaw: '03/18/2026', offerDeclinedDateRaw: '', startDateRaw: '04/13/2026' },
  { candidateId: 16598, pcn: '73300184', org: 'MDQ', careerStage: 'IC6', level: 67, offerStatus: 'Accepted', offerExtendedDateRaw: '03/04/2026', offerAcceptedDateRaw: '03/06/2026', offerDeclinedDateRaw: '', startDateRaw: '03/23/2026' },
  { candidateId: 25732, pcn: '73300182', org: 'MDQ', careerStage: 'IC5', level: 65, offerStatus: 'Accepted', offerExtendedDateRaw: '03/18/2026', offerAcceptedDateRaw: '03/30/2026', offerDeclinedDateRaw: '', startDateRaw: '05/06/2026' },
  { candidateId: 19518, pcn: '73310398', org: 'MDQ', careerStage: 'IC5', level: 65, offerStatus: 'Accepted', offerExtendedDateRaw: '03/31/2026', offerAcceptedDateRaw: '04/03/2026', offerDeclinedDateRaw: '', startDateRaw: '04/27/2026' },
  { candidateId: 40712, pcn: '73311352', org: 'MDQ', careerStage: 'IC6', level: 67, offerStatus: 'Accepted', offerExtendedDateRaw: '03/18/2026', offerAcceptedDateRaw: '03/18/2026', offerDeclinedDateRaw: '', startDateRaw: '04/06/2026' },
  { candidateId: 23824, pcn: '73300198', org: 'MDQ', careerStage: 'IC5', level: 65, offerStatus: 'Accepted', offerExtendedDateRaw: '04/13/2026', offerAcceptedDateRaw: '04/16/2026', offerDeclinedDateRaw: '', startDateRaw: '06/08/2026' },
  { candidateId: 18211, pcn: '73310423', org: 'MDQ', careerStage: 'IC5', level: 66, offerStatus: 'Accepted', offerExtendedDateRaw: '05/18/2026', offerAcceptedDateRaw: '05/19/2026', offerDeclinedDateRaw: '', startDateRaw: '06/08/2026' },
  { candidateId: 53761, pcn: '73310420', org: 'MDQ', careerStage: 'IC5', level: 65, offerStatus: 'Accepted', offerExtendedDateRaw: '05/18/2026', offerAcceptedDateRaw: '06/03/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 16414, pcn: '73312188', org: 'MDQ', careerStage: 'IC4', level: 63, offerStatus: 'Accepted', offerExtendedDateRaw: '05/28/2026', offerAcceptedDateRaw: '05/29/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 57741, pcn: '73319126', org: 'MDQ', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '04/14/2026', offerAcceptedDateRaw: '04/14/2026', offerDeclinedDateRaw: '', startDateRaw: '05/04/2026' },
  { candidateId: 55744, pcn: '73319127', org: 'MDQ', careerStage: 'IC6', level: 67, offerStatus: 'Accepted', offerExtendedDateRaw: '06/02/2026', offerAcceptedDateRaw: '06/08/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 42014, pcn: '73319135', org: 'MDQ', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '05/04/2026', offerAcceptedDateRaw: '05/07/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 56355, pcn: '73312190', org: 'MDQ', careerStage: 'IC4', level: 64, offerStatus: 'Accepted', offerExtendedDateRaw: '05/26/2026', offerAcceptedDateRaw: '06/09/2026', offerDeclinedDateRaw: '', startDateRaw: '' },
  { candidateId: 60169, pcn: '73319097', org: 'MDQ', careerStage: 'IC3', level: 62, offerStatus: 'Declined', offerExtendedDateRaw: '05/18/2026', offerAcceptedDateRaw: '', offerDeclinedDateRaw: '06/10/2026', startDateRaw: '' },
];

export const offers: OfferRecord[] = raw.map((r) => ({
  candidateId: r.candidateId,
  pcn: r.pcn,
  org: r.org,
  careerStage: r.careerStage,
  level: r.level,
  offerStatus: r.offerStatus,
  offerExtendedDate: toISODate(r.offerExtendedDateRaw),
  offerAcceptedDate: r.offerAcceptedDateRaw ? toISODate(r.offerAcceptedDateRaw) : null,
  offerDeclinedDate: r.offerDeclinedDateRaw ? toISODate(r.offerDeclinedDateRaw) : null,
  startDate: r.startDateRaw ? toISODate(r.startDateRaw) : null,
}));
