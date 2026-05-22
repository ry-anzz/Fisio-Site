"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Loader2
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgIcon: string;
  textColor: string;
}

function MetricCard({ title, value, icon, bgIcon, textColor }: MetricCardProps) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <h3 className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${bgIcon}`}>
        {icon}
      </div>
    </div>
  );
}

interface RecentAppointment {
  id: string;
  appointment_time: string;
  appointment_type: string;
  appointment_date: string;
  patients: {
    name: string;
  } | null;
}

interface RecentCashFlow {
  id: string;
  description: string;
  amount: number;
  type: 'receita' | 'despesa';
  entry_date: string;
}

export default function DashboardHome() {
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointmentsToday, setTotalAppointmentsToday] = useState(0);
  const [faturamentoMes, setFaturamentoMes] = useState(0);
  const [saldoCaixa, setSaldoCaixa] = useState(0);

  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [recentCashFlow, setRecentCashFlow] = useState<RecentCashFlow[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        // 🎯 PEGA A DATA REAL DE HOJE AJUSTADA PARA O BRASIL (SEM TRAVAR EM DIA FIXO)
        const localDate = new Date();
        const offset = localDate.getTimezoneOffset();
        const adjustedDate = new Date(localDate.getTime() - (offset * 60 * 1000));
        const todayStr = adjustedDate.toISOString().split('T')[0];
        
        // Formata para exibir na tela no padrão PT-BR (DD/MM/YYYY)
        setDisplayDate(localDate.toLocaleDateString('pt-BR'));

        // 1. Total de Pacientes
        const { data: pData } = await supabase.from('patients').select('id');
        setTotalPatients(pData ? pData.length : 0);

        // 2. Agendamentos do Dia Real
        const { data: appToday } = await supabase
          .from('appointments')
          .select('id')
          .eq('appointment_date', todayStr);
        setTotalAppointmentsToday(appToday ? appToday.length : 0);

        // 3. Financeiro Global
        const { data: cashData } = await supabase.from('cash_flow').select('*');

        if (cashData && cashData.length > 0) {
          let receitas = 0;
          let despesas = 0;

          cashData.forEach(e => {
            const val = Number(e.amount) || 0;
            if (e.type === 'receita') receitas += val;
            if (e.type === 'despesa') despesas += val;
          });
          
          setFaturamentoMes(receitas);
          setSaldoCaixa(receitas - despesas);
          
          const sortedCash = [...cashData]
            .sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
            .slice(0, 4);
          setRecentCashFlow(sortedCash);
        }

        // 4. Lista de Consultas do Dia Real (Join com a tabela de pacientes)
        const { data: appListData } = await supabase
          .from('appointments')
          .select(`
            id,
            appointment_time,
            appointment_type,
            appointment_date,
            patients ( name )
          `)
          .eq('appointment_date', todayStr)
          .order('appointment_time', { ascending: true })
          .range(0, 3);
        
        if (appListData) {
          setRecentAppointments(appListData as any);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <p className="text-slate-500 font-medium text-sm">Atualizando indicadores com o banco de dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Olá, Fisioterapeuta</h1>
        <p className="text-slate-500 text-sm">Aqui está o resumo clínico e financeiro atualizado do seu consultório.</p>
      </div>

      {/* Cards Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total de Pacientes" 
          value={totalPatients} 
          icon={<Users size={20} />} 
          bgIcon="bg-indigo-50 text-indigo-600"
          textColor="text-slate-800"
        />
        <MetricCard 
          title="Consultas de Hoje" 
          value={totalAppointmentsToday} 
          icon={<CalendarIcon size={20} />} 
          bgIcon="bg-sky-50 text-sky-600"
          textColor="text-slate-800"
        />
        <MetricCard 
          title="Faturamento (Mês)" 
          value={`R$ ${faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<TrendingUp size={20} />} 
          bgIcon="bg-emerald-50 text-emerald-600"
          textColor="text-emerald-600"
        />
        <MetricCard 
          title="Saldo em Caixa" 
          value={`R$ ${saldoCaixa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          icon={<DollarSign size={20} />} 
          bgIcon="bg-slate-50 text-slate-700"
          textColor={saldoCaixa >= 0 ? "text-slate-800" : "text-rose-600"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AGENDA DE HOJE DINÂMICA */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-slate-800 text-base flex items-center justify-between">
            Próximos Atendimentos de Hoje
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
              {displayDate}
            </span>
          </h2>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 text-slate-400 text-xs rounded-xl">
              Nenhum paciente agendado para o dia de hoje.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((app) => (
                <div key={app.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border rounded text-slate-500 shadow-sm">
                      <Clock size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">
                        {app.patients ? app.patients.name : 'Paciente de Teste'}
                      </h4>
                      <span className="text-[11px] font-medium text-slate-500">{app.appointment_type}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {app.appointment_time.slice(0, 5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ÚLTIMOS LANÇAMENTOS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
          <h2 className="font-bold text-slate-800 text-base">Últimas Movimentações Financeiras</h2>

          {recentCashFlow.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 text-slate-400 text-xs rounded-xl">
              Nenhuma entrada ou saída financeira registrada.
            </div>
          ) : (
            <div className="space-y-3">
              {recentCashFlow.map((flow) => (
                <div key={flow.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium text-slate-800">{flow.description}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {flow.entry_date.split('-').reverse().join('/')}
                    </span>
                  </div>
                  <span className={`text-sm font-bold flex items-center gap-0.5 ${flow.type === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {flow.type === 'receita' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    R$ {Number(flow.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}