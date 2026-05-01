export const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);
export function lastNDays(days: number) { const end = new Date(); const start = new Date(); start.setDate(end.getDate() - days); return { start: toIsoDate(start), end: toIsoDate(end) }; }
