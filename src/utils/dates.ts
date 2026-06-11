import { differenceInDays, parseISO } from 'date-fns';

export function daysBetween(a: string, b: string): number | null {
  try {
    return differenceInDays(parseISO(b), parseISO(a));
  } catch {
    return null;
  }
}

export function parseDateSafe(s: string): Date | null {
  try {
    const d = parseISO(s);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
}

export function formatDate(s: string): string {
  const d = parseDateSafe(s);
  if (!d) return s;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(s: string): string {
  const d = parseDateSafe(s);
  if (!d) return s;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
