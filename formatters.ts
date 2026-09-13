export function formatCurrency(value: number): string {
  if (isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function parsePtBRNumber(value: string | number): number {
  if (typeof value === 'number') return value;
  if (!value) return NaN;
  const cleanStr = String(value).replace(/\./g, '').replace(',', '.');
  return parseFloat(cleanStr);
}

export function formatPercent(value: number): string {
  if (isNaN(value)) return '0%';
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
