function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function periodKey(year: number, monthIndex: number): string {
  return `${year}-${pad(monthIndex + 1)}`;
}

export function periodOf(date: string, monthStartDay: number): string {
  const d = new Date(date);
  if (d.getDate() < monthStartDay) {
    const prev = new Date(d.getFullYear(), d.getMonth() - 1, 1);
    return periodKey(prev.getFullYear(), prev.getMonth());
  }
  return periodKey(d.getFullYear(), d.getMonth());
}

export function currentPeriod(monthStartDay: number = 1): string {
  return periodOf(new Date().toISOString(), monthStartDay);
}

export function isInPeriod(date: string, period: string, monthStartDay: number): boolean {
  return periodOf(date, monthStartDay) === period;
}

export function shiftPeriod(period: string, delta: number): string {
  const [year, month] = period.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return periodKey(date.getFullYear(), date.getMonth());
}

export function formatPeriod(period: string): string {
  const [year, month] = period.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function periodRange(period: string, monthStartDay: number): { start: Date; end: Date } {
  const [year, month] = period.split("-").map(Number);
  return {
    start: new Date(year, month - 1, monthStartDay),
    end: new Date(year, month, monthStartDay),
  };
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

export function daysUntilNextOccurrence(dayStart: number, dayEnd: number, from: Date = new Date()): number {
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const day = today.getDate();
  if (day >= dayStart && day <= dayEnd) return 0;

  const target =
    day < dayStart
      ? new Date(today.getFullYear(), today.getMonth(), dayStart)
      : new Date(today.getFullYear(), today.getMonth() + 1, dayStart);

  return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}
