import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { HistoryItem, HistoryPanel } from './components/HistoryPanel';
import { InstallPWA } from './components/InstallPWA';
import { ThemeToggle } from './components/ThemeToggle';
import { PeriodoForm, TaxaForm, ValorInicialForm } from './components/forms/OtherCalculators';
import { ValorFinalForm } from './components/forms/ValorFinalForm';

type Tab = 'FINAL' | 'INITIAL' | 'RATE' | 'PERIOD' | 'HISTORY';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('FINAL');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('calculajuros_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveHistory = (data: Omit<HistoryItem, 'id'>) => {
    const newItem = { ...data, id: Date.now().toString() };
    const newHistory = [newItem, ...history];
    setHistory(newHistory);
    localStorage.setItem('calculajuros_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('calculajuros_history');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'FINAL', label: 'Calcular Juros' },
    { id: 'INITIAL', label: 'Descobrir Capital' },
    { id: 'RATE', label: 'Descobrir Taxa' },
    { id: 'PERIOD', label: 'Descobrir Tempo' },
    { id: 'HISTORY', label: 'Histórico' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-8 bg-[#0D1117] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">%</div>
          <h1 className="text-xl font-bold tracking-tight text-white">Calcula<span className="text-blue-500">Juros</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <InstallPWA />
          <div className="w-px h-6 bg-slate-800 hidden md:block"></div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:px-8 bg-[#0A0C10]">
        <div className="mx-auto max-w-5xl">
          
          {/* Navigation Tabs */}
          <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
            <nav className="flex min-w-max gap-2 rounded-2xl bg-slate-900 border border-slate-800 p-2 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="active-tab"
                      className="absolute inset-0 rounded-xl bg-blue-600/10 border border-blue-600/20"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Form Areas */}
          <div className="min-h-[400px]">
            {activeTab === 'FINAL' && <ValorFinalForm onSaveHistory={saveHistory} />}
            {activeTab === 'INITIAL' && <ValorInicialForm onSaveHistory={saveHistory} />}
            {activeTab === 'RATE' && <TaxaForm onSaveHistory={saveHistory} />}
            {activeTab === 'PERIOD' && <PeriodoForm onSaveHistory={saveHistory} />}
            {activeTab === 'HISTORY' && <HistoryPanel items={history} onClear={clearHistory} />}
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="h-10 border-t border-slate-800 bg-[#0D1117] flex items-center justify-between px-4 md:px-8 text-[10px] text-slate-500 mt-auto">
        <p>CalculaJuros © 2026</p>
        <div className="flex gap-4">
          <span className="hidden md:inline">Versão 2.4.1-stable</span>
          <span className="text-blue-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> Sistema Online</span>
        </div>
      </footer>
    </div>
  );
}
