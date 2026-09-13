import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

export interface HistoryItem {
  id: string;
  type: string;
  date: string;
  details: string;
  result?: string;
  simple?: string;
  compound?: string;
}

export function HistoryPanel({ items, onClear }: { items: HistoryItem[]; onClear: () => void }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <p>Nenhum cálculo salvo ainda.</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2 px-2">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Histórico Recente</h3>
        <button onClick={onClear} className="text-[10px] text-blue-400 hover:underline">Limpar tudo</button>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-500 uppercase">
                  {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-xs font-bold text-white leading-relaxed">{item.details}</p>
            </div>
            
            <div className="md:text-right flex flex-col justify-center">
              {item.result ? (
                <p className="text-sm font-bold text-emerald-400">{item.result}</p>
              ) : (
                <div className="flex flex-col gap-1 md:items-end">
                  <div className="text-[10px] text-slate-400">
                    <span className="mr-2 uppercase">Simples:</span>
                    <span className="font-bold text-white">{item.simple}</span>
                  </div>
                  <div className="text-xs text-slate-300">
                    <span className="mr-2 font-bold text-blue-400 uppercase tracking-wide">Compostos:</span>
                    <span className="font-black text-white">{item.compound}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
