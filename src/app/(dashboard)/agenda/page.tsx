"use client";

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  MoreVertical,
  Calendar as CalendarIcon
} from 'lucide-react';

export default function AgendaPage() {
  // Simulação de troca de meses
  const [currentMonth, setCurrentMonth] = useState("Maio de 2026");
  
  // Simulação de compromissos para o dia selecionado (20 de Maio)
  const appointments = [
    { id: 1, time: '08:00', patient: 'João da Silva Sauro', type: 'Avaliação' },
    { id: 2, time: '09:30', patient: 'Maria Oliveira', type: 'Fisio. Traumato' },
    { id: 3, time: '14:00', patient: 'Pedro Alcântara', type: 'Pilates Clínico' },
    { id: 4, time: '16:00', patient: 'Ana Beatriz', type: 'Reavaliação' },
  ];

  // Gerar dias do mês de Maio de 2026 (Exemplo estático para demonstração)
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA AGENDA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Minha Agenda</h1>
          <p className="text-slate-500 text-sm">Organize seus horários e atendimentos.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm">
          <Plus size={18} />
          Novo Agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CALENDÁRIO MENSAL (COLUNA DA ESQUERDA) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {/* Navegação do Mês */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <CalendarIcon size={18} className="text-indigo-600" />
              {currentMonth}
            </h2>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Grid de Dias */}
          <div className="grid grid-cols-7 text-center border-b border-slate-100 bg-slate-50/50">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="py-3 text-xs font-bold text-slate-400 uppercase">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-slate-100">
            {/* Espaços vazios para o início do mês (Maio 2026 começa na sexta) */}
            {[...Array(5)].map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50 h-20 md:h-28" />
            ))}
            
            {/* Dias do Mês */}
            {days.map(day => (
              <div 
                key={day} 
                className={`bg-white h-20 md:h-28 p-2 transition-colors cursor-pointer hover:bg-indigo-50/30 group relative ${day === 20 ? 'ring-2 ring-inset ring-indigo-600' : ''}`}
              >
                <span className={`text-sm font-semibold ${day === 20 ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-700'}`}>
                  {day}
                </span>
                
                {/* Indicadores de compromisso (Pontinhos) */}
                <div className="mt-1 flex flex-wrap gap-1">
                  {day % 3 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                  {day % 4 === 0 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  {day === 20 && (
                    <div className="hidden md:block w-full">
                      <div className="text-[10px] bg-indigo-100 text-indigo-700 p-1 rounded mt-1 truncate">4 pacientes</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA DO DIA (COLUNA DA DIREITA / ABAIXO NO MOBILE) */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Horários de Hoje
              <span className="text-xs font-normal text-slate-500">20 de Maio</span>
            </h3>

            <div className="space-y-3">
              {appointments.map((app) => (
                <div key={app.id} className="group p-3 border border-slate-100 rounded-lg hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="p-2 bg-slate-100 rounded text-slate-600 group-hover:bg-white transition-colors">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{app.time}</p>
                        <p className="text-xs text-slate-500 font-medium">{app.patient}</p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                      {app.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-sm hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2">
              <Plus size={16} />
              Encaixar Horário
            </button>
          </div>

          {/* CARD DE RESUMO RAPIDO */}
          <div className="bg-indigo-600 rounded-xl p-5 text-white shadow-lg shadow-indigo-200">
            <h4 className="font-bold mb-1">Dica de hoje</h4>
            <p className="text-indigo-100 text-xs leading-relaxed">
              Você tem 4 atendimentos hoje. O primeiro começa em 30 minutos. Não esqueça de registrar as evoluções!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}