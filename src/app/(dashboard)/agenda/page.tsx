"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  MoreVertical,
  Calendar as CalendarIcon,
  X,
  Loader2
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  appointment_time: string;
  appointment_type: string;
  patients: {
    name: string;
  };
}

export default function AgendaPage() {

  
  // Estados de dados
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Data atual no formato YYYY-MM-DD
  
  // Estados de interface/loaders
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados do Formulário de Agendamento
  const [formPatientId, setFormPatientId] = useState('');
  const [formTime, setFormTime] = useState('08:00');
  const [formType, setFormType] = useState('Fisioterapia');

  // Controle de exibição do mês (Maio 2026 fixo para a demonstração do grid do calendário)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // 🔄 1. Carregar lista de pacientes para o formulário
  useEffect(() => {
    async function loadPatients() {
      const { data } = await supabase
        .from('patients')
        .select('id, name')
        .order('name', { ascending: true });
      if (data) {
        setPatients(data);
        if (data.length > 0) setFormPatientId(data[0].id);
      }
    }
    loadPatients();
  }, []);

  // 🔄 2. Carregar os agendamentos do dia selecionado
  async function loadAppointments(dateStr: string) {
    setLoadingAppointments(true);
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        appointment_time,
        appointment_type,
        patients ( name )
      `)
      .eq('appointment_date', dateStr)
      .order('appointment_time', { ascending: true });

    if (!error && data) {
      // Forçar tipagem do Supabase join
      setAppointments(data as any);
    }
    setLoadingAppointments(false);
  }

  useEffect(() => {
    loadAppointments(selectedDate);
  }, [selectedDate]);

  // 💾 3. Salvar novo agendamento no Supabase
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPatientId || !selectedDate) return;

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          user_id: user.id,
          patient_id: formPatientId,
          appointment_date: selectedDate,
          appointment_time: formTime,
          appointment_type: formType
        }
      ]);

    setSaving(false);

    if (!error) {
      setIsModalOpen(false);
      loadAppointments(selectedDate); // Recarrega a lista da lateral
    } else {
      alert("Erro ao salvar agendamento.");
    }
  };

  // ❌ 4. Deletar um agendamento
  const handleDeleteAppointment = async (id: string) => {
    if (confirm("Deseja desmarcar este horário?")) {
      const { error } = await supabase.from('appointments').delete().eq('id', id);
      if (!error) loadAppointments(selectedDate);
    }
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Minha Agenda</h1>
          <p className="text-slate-500 text-sm">Organize seus horários e atendimentos em tempo real.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={patients.length === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm cursor-pointer disabled:opacity-50"
        >
          <Plus size={18} />
          Novo Agendamento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CALENDÁRIO MENSAL (ESQUERDA) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <CalendarIcon size={18} className="text-indigo-600" />
              Maio de 2026
            </h2>
            <span className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md">
              Dia Selecionado: {selectedDate.split('-')[2]}/{selectedDate.split('-')[1]}
            </span>
          </div>

          <div className="grid grid-cols-7 text-center border-b border-slate-100 bg-slate-50/50">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="py-3 text-xs font-bold text-slate-400 uppercase">{day}</div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-slate-100">
            {/* Espaços vazios iniciais (Maio 2026 começa numa sexta-feira = 5 dias vazios) */}
            {[...Array(5)].map((_, i) => (
              <div key={`empty-${i}`} className="bg-slate-50 h-20 md:h-24" />
            ))}
            
            {/* Dias clicáveis do mês */}
            {daysInMonth.map(day => {
              const currentDayStr = `2026-05-${day.toString().padStart(2, '0')}`;
              const isSelected = selectedDate === currentDayStr;
              
              return (
                <div 
                  key={day} 
                  onClick={() => setSelectedDate(currentDayStr)}
                  className={`bg-white h-20 md:h-24 p-2 transition-colors cursor-pointer hover:bg-indigo-50/40 relative ${
                    isSelected ? 'bg-indigo-50/60 ring-2 ring-inset ring-indigo-600' : ''
                  }`}
                >
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                    isSelected ? 'bg-indigo-600 text-white font-bold' : 'text-slate-700'
                  }`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* LISTA DE COMPROMISSOS DO DIA SELECIONADO (DIREITA) */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
              Horários Agendados
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {selectedDate.split('-').reverse().join('/')}
              </span>
            </h3>

            {loadingAppointments ? (
              <div className="flex justify-center py-8"><Loader2 className="animate-spin text-indigo-600" size={24} /></div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-slate-100 text-slate-400 text-xs rounded-xl">
                Nenhum atendimento marcado para este dia.
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((app) => (
                  <div key={app.id} className="group p-3 border border-slate-100 rounded-lg bg-slate-50/50 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="p-2 bg-white border rounded text-slate-600 shadow-sm">
                        <Clock size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{app.appointment_time.slice(0, 5)}</p>
                        <p className="text-xs text-slate-600 font-semibold">{app.patients?.name}</p>
                        <span className="inline-block text-[10px] bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded mt-1">
                          {app.appointment_type}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteAppointment(app.id)}
                      className="text-slate-300 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                      title="Desmarcar horário"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* MODAL PARA CRIAR NOVO AGENDAMENTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-slate-800">Agendar Paciente</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Data Escolhida</label>
                <input type="text" disabled value={selectedDate.split('-').reverse().join('/')} className="w-full p-2.5 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-500 font-bold"/>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Paciente *</label>
                <select value={formPatientId} onChange={e => setFormPatientId(e.target.value)} className="w-full p-2.5 border border-slate-200 bg-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Horário *</label>
                  <input type="time" required value={formTime} onChange={e => setFormTime(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tipo de Sessão</label>
                  <select value={formType} onChange={e => setFormType(e.target.value)} className="w-full p-2.5 border border-slate-200 bg-white rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Fisioterapia">Fisioterapia</option>
                    <option value="Acupuntura">Acupuntura</option>
                    <option value="Avaliação">Avaliação</option>
                    <option value="Pilates">Pilates Clínico</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium cursor-pointer flex items-center gap-1">
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  Confirmar Horário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}