import { motion } from 'motion/react';
import React, { useState } from 'react';
import { calculateInitialValue, calculatePeriod, calculateRate, InterestType, TimeUnit } from '../../utils/calculations';
import { formatCurrency, formatPercent, parsePtBRNumber } from '../../utils/formatters';
import { Select, CurrencyInput, NumberInput } from '../ui/Input';

export function ValorInicialForm({ onSaveHistory }: { onSaveHistory: (data: any) => void }) {
  const [finalValue, setFinalValue] = useState('');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState<TimeUnit>('MONTHS');
  const [period, setPeriod] = useState('');
  const [periodUnit, setPeriodUnit] = useState<TimeUnit>('MONTHS');
  const [interestType, setInterestType] = useState<InterestType>('COMPOUND');

  const parsedFinal = parsePtBRNumber(finalValue);
  const parsedRate = parsePtBRNumber(rate);
  const parsedPeriod = parsePtBRNumber(period);

  const isValid = !isNaN(parsedFinal) && !isNaN(parsedRate) && !isNaN(parsedPeriod) && parsedPeriod > 0;
  
  const result = isValid ? calculateInitialValue(parsedFinal, parsedRate, rateUnit, parsedPeriod, periodUnit, interestType) : null;

  const handleSave = () => {
    if (!isValid || result === null) return;
    onSaveHistory({
      type: 'Valor Inicial',
      date: new Date().toISOString(),
      details: `Montante: ${formatCurrency(parsedFinal)} | Taxa: ${parsedRate}% ${rateUnit === 'MONTHS' ? 'a.m.' : 'a.a.'} | Tempo: ${parsedPeriod}`,
      result: formatCurrency(result),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CurrencyInput label="Valor Final / Montante (R$)" placeholder="0,00" value={finalValue} onChange={setFinalValue} />
        <div className="flex gap-2">
          <NumberInput label="Taxa de Juros (%)" placeholder="0,00" className="flex-1" value={rate} onChange={setRate} />
          <Select label="Período da Taxa" className="w-32" value={rateUnit} onChange={(v) => setRateUnit(v as TimeUnit)} options={[{ label: 'a.m.', value: 'MONTHS' }, { label: 'a.a.', value: 'YEARS' }]} />
        </div>
        <div className="flex gap-2">
          <NumberInput label="Tempo / Período" placeholder="0" className="flex-1" value={period} onChange={setPeriod} />
          <Select label="Medida de Tempo" className="w-32" value={periodUnit} onChange={(v) => setPeriodUnit(v as TimeUnit)} options={[{ label: 'Meses', value: 'MONTHS' }, { label: 'Anos', value: 'YEARS' }]} />
        </div>
        <Select label="Tipo de Juros" value={interestType} onChange={(v) => setInterestType(v as InterestType)} options={[{ label: 'Compostos (Recomendado)', value: 'COMPOUND' }, { label: 'Simples', value: 'SIMPLE' }]} />
      </div>

      {isValid && result !== null && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Valor Inicial Descoberto</p>
          <h2 className="text-4xl font-black text-white mb-4">{formatCurrency(result)}</h2>
          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} className="flex-1 bg-slate-900/40 hover:bg-slate-900/60 border border-white/20 text-white font-bold py-4 rounded-2xl transition-all">Salvar no Histórico</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function TaxaForm({ onSaveHistory }: { onSaveHistory: (data: any) => void }) {
  const [initial, setInitial] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [period, setPeriod] = useState('');
  const [periodUnit, setPeriodUnit] = useState<TimeUnit>('MONTHS');
  const [interestType, setInterestType] = useState<InterestType>('COMPOUND');

  const parsedInitial = parsePtBRNumber(initial);
  const parsedFinal = parsePtBRNumber(finalValue);
  const parsedPeriod = parsePtBRNumber(period);

  const isValid = !isNaN(parsedInitial) && !isNaN(parsedFinal) && !isNaN(parsedPeriod) && parsedPeriod > 0;
  
  const result = isValid ? calculateRate(parsedInitial, parsedFinal, parsedPeriod, interestType) : null;

  const handleSave = () => {
    if (!isValid || result === null) return;
    onSaveHistory({
      type: 'Taxa de Juros',
      date: new Date().toISOString(),
      details: `Capital: ${formatCurrency(parsedInitial)} | Montante: ${formatCurrency(parsedFinal)} | Tempo: ${parsedPeriod} ${periodUnit === 'MONTHS' ? 'meses' : 'anos'}`,
      result: `${formatPercent(result)} ${periodUnit === 'MONTHS' ? 'a.m.' : 'a.a.'}`,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CurrencyInput label="Valor Inicial (R$)" placeholder="0,00" value={initial} onChange={setInitial} />
        <CurrencyInput label="Valor Final / Montante (R$)" placeholder="0,00" value={finalValue} onChange={setFinalValue} />
        <div className="flex gap-2">
          <NumberInput label="Tempo / Período" placeholder="0" className="flex-1" value={period} onChange={setPeriod} />
          <Select label="Medida" className="w-32" value={periodUnit} onChange={(v) => setPeriodUnit(v as TimeUnit)} options={[{ label: 'Meses', value: 'MONTHS' }, { label: 'Anos', value: 'YEARS' }]} />
        </div>
        <Select label="Tipo de Juros" value={interestType} onChange={(v) => setInterestType(v as InterestType)} options={[{ label: 'Compostos (Recomendado)', value: 'COMPOUND' }, { label: 'Simples', value: 'SIMPLE' }]} />
      </div>

      {isValid && result !== null && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Taxa de Juros Descoberta</p>
          <p className="text-4xl font-black text-white mb-4">{result.toFixed(2)}% <span className="text-xl font-medium text-blue-200">{periodUnit === 'MONTHS' ? 'ao mês' : 'ao ano'}</span></p>
          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} className="flex-1 bg-slate-900/40 hover:bg-slate-900/60 border border-white/20 text-white font-bold py-4 rounded-2xl transition-all">Salvar no Histórico</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function PeriodoForm({ onSaveHistory }: { onSaveHistory: (data: any) => void }) {
  const [initial, setInitial] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState<TimeUnit>('MONTHS');
  const [interestType, setInterestType] = useState<InterestType>('COMPOUND');

  const parsedInitial = parsePtBRNumber(initial);
  const parsedFinal = parsePtBRNumber(finalValue);
  const parsedRate = parsePtBRNumber(rate);

  const isValid = !isNaN(parsedInitial) && !isNaN(parsedFinal) && !isNaN(parsedRate) && parsedRate > 0;
  
  const result = isValid ? calculatePeriod(parsedInitial, parsedFinal, parsedRate, interestType) : null;

  const handleSave = () => {
    if (!isValid || result === null) return;
    onSaveHistory({
      type: 'Período',
      date: new Date().toISOString(),
      details: `Capital: ${formatCurrency(parsedInitial)} | Montante: ${formatCurrency(parsedFinal)} | Taxa: ${parsedRate}% ${rateUnit === 'MONTHS' ? 'a.m.' : 'a.a.'}`,
      result: `${result.toFixed(2)} ${rateUnit === 'MONTHS' ? 'meses' : 'anos'}`,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CurrencyInput label="Valor Inicial (R$)" placeholder="0,00" value={initial} onChange={setInitial} />
        <CurrencyInput label="Valor Final / Montante (R$)" placeholder="0,00" value={finalValue} onChange={setFinalValue} />
        <div className="flex gap-2">
          <NumberInput label="Taxa de Juros (%)" placeholder="0,00" className="flex-1" value={rate} onChange={setRate} />
          <Select label="Período da Taxa" className="w-32" value={rateUnit} onChange={(v) => setRateUnit(v as TimeUnit)} options={[{ label: 'a.m.', value: 'MONTHS' }, { label: 'a.a.', value: 'YEARS' }]} />
        </div>
        <Select label="Tipo de Juros" value={interestType} onChange={(v) => setInterestType(v as InterestType)} options={[{ label: 'Compostos (Recomendado)', value: 'COMPOUND' }, { label: 'Simples', value: 'SIMPLE' }]} />
      </div>

      {isValid && result !== null && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Tempo Necessário</p>
          <p className="text-4xl font-black text-white mb-4">{result.toFixed(1)} <span className="text-xl font-medium text-blue-200">{rateUnit === 'MONTHS' ? 'meses' : 'anos'}</span></p>
          <div className="mt-6 flex gap-3">
            <button onClick={handleSave} className="flex-1 bg-slate-900/40 hover:bg-slate-900/60 border border-white/20 text-white font-bold py-4 rounded-2xl transition-all">Salvar no Histórico</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
