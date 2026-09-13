import { motion } from 'motion/react';
import React, { useState } from 'react';
import { calculateFinalValue, InterestType, TimeUnit } from '../../utils/calculations';
import { formatCurrency, parsePtBRNumber } from '../../utils/formatters';
import { Input, Select, CurrencyInput, NumberInput } from '../ui/Input';

export function ValorFinalForm({ onSaveHistory }: { onSaveHistory: (data: any) => void }) {
  const [initial, setInitial] = useState('');
  const [rate, setRate] = useState('');
  const [rateUnit, setRateUnit] = useState<TimeUnit>('MONTHS');
  const [period, setPeriod] = useState('');
  const [periodUnit, setPeriodUnit] = useState<TimeUnit>('MONTHS');
  const [interestType, setInterestType] = useState<InterestType>('COMPOUND');
  const [fine, setFine] = useState('');
  const [installments, setInstallments] = useState('');
  const [includeFine, setIncludeFine] = useState(false);

  const parsedInitial = parsePtBRNumber(initial);
  const parsedRate = parsePtBRNumber(rate);
  const parsedPeriod = parsePtBRNumber(period);
  const parsedFine = parsePtBRNumber(fine) || 0;
  const parsedInstallments = parsePtBRNumber(installments) || 0;

  const isValid = !isNaN(parsedInitial) && !isNaN(parsedRate) && !isNaN(parsedPeriod) && parsedPeriod > 0;

  const result = isValid ? calculateFinalValue(parsedInitial, parsedRate, rateUnit, parsedPeriod, periodUnit, interestType, parsedFine, parsedInstallments) : null;

  const handleSave = () => {
    if (!isValid || !result) return;
    onSaveHistory({
      type: 'Valor Final',
      date: new Date().toISOString(),
      details: `Capital: ${formatCurrency(parsedInitial)} | Taxa: ${parsedRate}% ${rateUnit === 'MONTHS' ? 'a.m.' : 'a.a.'} | Tempo: ${parsedPeriod} ${periodUnit === 'MONTHS' ? 'meses' : 'anos'}`,
      result: formatCurrency(includeFine ? result.totalWithFine : result.finalValue),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CurrencyInput
          label="Valor Inicial (R$)"
          placeholder="0,00"
          value={initial}
          onChange={setInitial}
        />
        <div className="flex gap-2">
          <NumberInput
            label="Taxa de Juros (%)"
            placeholder="0,00"
            className="flex-1"
            value={rate}
            onChange={setRate}
          />
          <Select
            label="Período da Taxa"
            className="w-32"
            value={rateUnit}
            onChange={(v) => setRateUnit(v as TimeUnit)}
            options={[
              { label: 'a.m.', value: 'MONTHS' },
              { label: 'a.a.', value: 'YEARS' }
            ]}
          />
        </div>
        <div className="flex gap-2">
          <NumberInput
            label="Tempo / Período"
            placeholder="0"
            className="flex-1"
            value={period}
            onChange={setPeriod}
          />
          <Select
            label="Medida de Tempo"
            className="w-32"
            value={periodUnit}
            onChange={(v) => setPeriodUnit(v as TimeUnit)}
            options={[
              { label: 'Meses', value: 'MONTHS' },
              { label: 'Anos', value: 'YEARS' }
            ]}
          />
        </div>
        <Select
          label="Tipo de Juros"
          value={interestType}
          onChange={(v) => setInterestType(v as InterestType)}
          options={[
            { label: 'Compostos (Recomendado)', value: 'COMPOUND' },
            { label: 'Simples', value: 'SIMPLE' }
          ]}
        />
        <NumberInput
          label="Multa / Quebra (%)"
          placeholder="Opcional"
          value={fine}
          onChange={setFine}
        />
        <NumberInput
          label="Parcelas (Qtd.)"
          placeholder="Opcional"
          value={installments}
          onChange={setInstallments}
        />
      </div>

      <div className="flex items-center gap-2 px-1">
        <input
          type="checkbox"
          id="includeFine"
          checked={includeFine}
          onChange={(e) => setIncludeFine(e.target.checked)}
          className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
        />
        <label htmlFor="includeFine" className="text-sm text-slate-300">
          Somar multa ao valor total final
        </label>
      </div>

      {isValid && result && (
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <svg width="100" height="100" viewBox="0 0 24 24" fill="white"><path d="M3 17h18v2H3v-2m0-4h18v2H3v-2m0-4h18v2H3V9m0-4h18v2H3V5z"/></svg>
          </div>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">
            {interestType === 'COMPOUND' ? 'Juros Compostos' : 'Juros Simples'}
          </p>
          <h2 className="text-4xl font-black text-white mb-4">
            {formatCurrency(includeFine ? result.totalWithFine : result.finalValue)}
          </h2>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-[10px] text-blue-100 uppercase">Total em Juros</p>
              <p className="font-bold text-white">+{formatCurrency(result.interestTotal)}</p>
            </div>
            {parsedFine > 0 && (
              <div>
                <p className="text-[10px] text-blue-100 uppercase">Valor da Multa</p>
                <p className="font-bold text-red-300">+{formatCurrency(result.fineTotal)}</p>
              </div>
            )}
            {parsedInstallments > 0 && (
              <div className="col-span-2">
                <p className="text-[10px] text-blue-100 uppercase">{parsedInstallments}x Parcelas de</p>
                <p className="font-bold text-white text-lg">{formatCurrency((includeFine ? result.totalWithFine : result.finalValue) / parsedInstallments)}</p>
              </div>
            )}
          </div>
          <p className="mt-6 text-xs text-blue-200/60 font-mono">
            {interestType === 'COMPOUND' ? 'Fórmula: M = P(1 + i)^n' : 'Fórmula: M = P(1 + i * n)'}
          </p>
        </div>
      )}

      {isValid && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => {
              setInitial('');
              setRate('');
              setPeriod('');
              setFine('');
              setInstallments('');
            }}
            className="px-6 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl border border-slate-700 text-slate-300 transition-all font-medium"
          >
            Limpar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all"
          >
            Salvar no Histórico
          </button>
        </div>
      )}
    </motion.div>
  );
}
