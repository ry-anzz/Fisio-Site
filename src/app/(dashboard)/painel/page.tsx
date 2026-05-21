// src/app/(dashboard)/page.tsx
import React from 'react';
import { Users, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';

export default function DashboardHome() {
  const stats = [
    { title: 'Total de Pacientes', value: '0', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { title: 'Consultas este Mês', value: '0', icon: Calendar, color: 'text-indigo-600 bg-indigo-50' },
    { title: 'Faturamento Mensal', value: 'R$ 0,00', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Bem-vindo de volta!</h1>
        <p className="text-slate-500 text-sm">Aqui está o resumo do seu consultório hoje.</p>
      </div>

      {/* CARDS INDICADORES RESPONSIVOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="space-y-2">
                <span className="text-sm text-slate-500 font-medium">{stat.title}</span>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ESPAÇO PARA PRÓXIMAS CONSULTAS DO DIA */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Agenda de Hoje</h2>
        <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
          Nenhum paciente agendado para hoje.
        </div>
      </div>
    </div>
  );
}