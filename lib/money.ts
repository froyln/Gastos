export function roundAmount(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function parseAmount(input: string): number {
  const value = Number(input.replace(",", "."));
  return Number.isFinite(value) ? roundAmount(value) : 0;
}

export function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
}
