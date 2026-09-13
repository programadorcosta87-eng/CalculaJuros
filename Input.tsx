import React from 'react';

export interface InputProps {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  [key: string]: any;
}

export function Input({ label, error, icon, rightElement, className = '', ...props }: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-500">
            {icon}
          </div>
        )}
        <input
          className={`w-full bg-slate-900 border rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none text-white font-medium transition-colors ${
            icon ? 'pl-10' : ''
          } ${
            rightElement ? 'pr-20' : ''
          } ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-slate-800'
          }`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-2 text-sm text-slate-400">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export function CurrencyInput({ value, onChange, label, ...props }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      onChange('');
      return;
    }
    const numValue = parseInt(rawValue, 10) / 100;
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numValue);
    onChange(formatted);
  };

  return (
    <Input
      label={label}
      value={value}
      onChange={handleChange}
      inputMode="numeric"
      {...props}
    />
  );
}

export function NumberInput({ value, onChange, label, ...props }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value.replace(/[^0-9,]/g, '');
    // Ensure only one comma
    const parts = rawValue.split(',');
    if (parts.length > 2) {
      rawValue = parts[0] + ',' + parts.slice(1).join('');
    }
    onChange(rawValue);
  };

  return (
    <Input
      label={label}
      value={value}
      onChange={handleChange}
      inputMode="decimal"
      {...props}
    />
  );
}
export function Select({
  label,
  options,
  value,
  onChange,
  className = ''
}: {
  label?: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-slate-800 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
