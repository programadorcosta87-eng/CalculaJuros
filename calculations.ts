export type CalcType = 'FINAL' | 'INITIAL' | 'RATE' | 'PERIOD';
export type InterestType = 'SIMPLE' | 'COMPOUND';
export type TimeUnit = 'MONTHS' | 'YEARS';

export interface FinalResult {
  finalValue: number;
  interestTotal: number;
  fineTotal: number;
  totalWithFine: number;
  installmentValue: number;
}

export function calculateFinalValue(
  initial: number,
  rate: number, // percentage
  rateUnit: TimeUnit,
  period: number,
  periodUnit: TimeUnit,
  interestType: InterestType,
  fineRate: number = 0, // percentage
  installments: number = 0
): FinalResult {
  const i = rate / 100;
  // Normalize time to rate unit
  let t = period;
  if (rateUnit === 'MONTHS' && periodUnit === 'YEARS') {
    t = period * 12;
  } else if (rateUnit === 'YEARS' && periodUnit === 'MONTHS') {
    t = period / 12;
  }

  let finalValue = 0;
  if (interestType === 'SIMPLE') {
    finalValue = initial * (1 + i * t);
  } else {
    finalValue = initial * Math.pow(1 + i, t);
  }

  const interestTotal = finalValue - initial;
  const fineTotal = initial * (fineRate / 100);
  const totalWithFine = finalValue + fineTotal;
  const installmentValue = installments > 0 ? totalWithFine / installments : 0;

  return {
    finalValue,
    interestTotal,
    fineTotal,
    totalWithFine,
    installmentValue
  };
}

export function calculateInitialValue(
  finalValue: number,
  rate: number,
  rateUnit: TimeUnit,
  period: number,
  periodUnit: TimeUnit,
  interestType: InterestType
): number {
  const i = rate / 100;
  let t = period;
  if (rateUnit === 'MONTHS' && periodUnit === 'YEARS') {
    t = period * 12;
  } else if (rateUnit === 'YEARS' && periodUnit === 'MONTHS') {
    t = period / 12;
  }

  if (interestType === 'SIMPLE') {
    return finalValue / (1 + i * t);
  } else {
    return finalValue / Math.pow(1 + i, t);
  }
}

export function calculateRate(
  initial: number,
  finalValue: number,
  period: number,
  interestType: InterestType
): number {
  // Rate will be returned in the unit of the period.
  // Example: if period is in months, rate will be % a.m.
  let i = 0;
  if (interestType === 'SIMPLE') {
    i = (finalValue / initial - 1) / period;
  } else {
    i = Math.pow(finalValue / initial, 1 / period) - 1;
  }
  return i * 100;
}

export function calculatePeriod(
  initial: number,
  finalValue: number,
  rate: number,
  interestType: InterestType
): number {
  // Period will be returned in the unit of the rate.
  const i = rate / 100;
  if (interestType === 'SIMPLE') {
    return (finalValue / initial - 1) / i;
  } else {
    return Math.log(finalValue / initial) / Math.log(1 + i);
  }
}
