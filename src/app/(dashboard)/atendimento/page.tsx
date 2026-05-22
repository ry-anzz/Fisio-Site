"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ChevronDown, ChevronUp, Printer, CheckCircle, User, Loader2, Calendar } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  cpf: string;
}

interface Record {
  id: string;
  area_fisio: string;
  objetivos_ficha: string;
  procedimentos: string;
  objetivos_livre: string;
  reavaliacao: string;
  created_at: string;
}

export default function AtendimentoPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [records, setRecords] = useState<Record[]>([]); // 🎯 Estado para guardar os prontuários do paciente
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false); // 🎯 Loader para o histórico
  const [saving, setSaving] = useState(false);

  const [sections, setSections] = useState({
    anamnese: true,
    objetivosFicha: true,
    procedimentos: true,
    objetivosLivre: true,
    reavaliacao: true,
  });

  const [areaSelecionada, setAreaSelecionada] = useState<string>('');
  const [objetivosFicha, setObjetivosFicha] = useState('');
  const [procedimentos, setProcedimentos] = useState('');
  const [objetivosLivre, setObjetivosLivre] = useState('');
  const [reavaliacao, setReavaliacao] = useState('');

  const areasFisio = [
    'Traumato-ortopedia', 'Neurofuncional', 'Respiratória', 'Cardiovascular', 
    'Aquática', 'Dermatofuncional', 'Gerontologia', 'do Trabalho', 
    'Terapia Intensiva', 'Saúde da Mulher', 'Saúde do Homem', 'Psicomotricidade', 
    'Base no TEA', 'Oncologia', 'Quiropraxia', 'Osteopatia'
  ];

  // 🔄 1. Buscar a lista de pacientes iniciais
  useEffect(() => {
    async function loadPatients() {
      const { data, error } = await supabase
        .from('patients')
        .select('id, name, cpf')
        .order('name', { ascending: true });
      
      if (!error && data) {
        setPatients(data);
        if (data.length > 0) setSelectedPatientId(data[0].id);
      }
      setLoadingPatients(false);
    }
    loadPatients();
  }, []);

  // 🔄 2. BUSCAR HISTÓRICO DE PRONTUÁRIOS DO PACIENTE SELECIONADO
  async function loadPatientRecords(patientId: string) {
    if (!patientId) return;
    setLoadingRecords(true);
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false }); // Traz o mais recente primeiro

    if (!error && data) {
      setRecords(data);
    }
    setLoadingRecords(false);
  }

  // Sempre que mudar o paciente selecionado na lista, busca o histórico dele na tela
  useEffect(() => {
    if (selectedPatientId) {
      loadPatientRecords(selectedPatientId);
    }
  }, [selectedPatientId]);

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // 💾 Salvar evolução no Supabase e atualizar a tela
  const handleSaveRecord = async () => {
    if (!selectedPatientId) return;
    if (!areaSelecionada) {
      alert("Por favor, selecione a Área da Fisioterapia na seção 1.");
      return;
    }

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Sessão expirada. Faça login novamente.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('records')
      .insert([
        {
          user_id: user.id,
          patient_id: selectedPatientId,
          area_fisio: areaSelecionada,
          objetivos_ficha: objetivosFicha || null,
          procedimentos: procedimentos || null,
          objetivos_livre: objetivosLivre || null,
          reavaliacao: reavaliacao || null
        }
      ]);

    setSaving(false);

    if (!error) {
      alert("Evolução clínica salva com sucesso!");
      // Limpar campos do formulário
      setAreaSelecionada(''); setObjetivosFicha(''); setProcedimentos(''); setObjetivosLivre(''); setReavaliacao('');
      // Atualiza a listagem de históricos na tela imediatamente
      loadPatientRecords(selectedPatientId);
    } else {
      alert("Erro ao salvar no banco de dados.");
    }
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatientId);

  return (
    <div className="space-y-6 print:p-0">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Prontuário de Atendimento</h1>
          <p className="text-slate-500 text-sm">Registre e consulte o histórico de evoluções clínicas.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm cursor-pointer"
        >
          <Printer size={18} />
          Exportar / Imprimir
        </button>
      </div>

      {/* SELETOR DE PACIENTE */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between print:border-none print:p-0 print:mb-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg print:hidden">
            <User size={20} />
          </div>
          <div className="w-full">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 print:hidden">Selecione o Paciente</label>
            {loadingPatients ? (
              <Loader2 className="animate-spin text-indigo-600" size={20} />
            ) : (
              <>
                <select 
                  value={selectedPatientId} 
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="w-full sm:w-64 p-2 border border-slate-200 rounded-lg bg-white font-bold text-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500 print:hidden"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <h2 className="hidden print:block text-2xl font-bold text-slate-800">{selectedPatientData?.name}</h2>
                {selectedPatientData?.cpf && <p className="hidden print:block text-sm text-slate-500">CPF: {selectedPatientData.cpf}</p>}
              </>
            )}
          </div>
        </div>
        <div className="text-right text-xs text-slate-400 print:text-slate-700 print:text-sm">
          <strong>Data do Registro Atual:</strong> {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      {/* FORMULÁRIO DE PREENCHIMENTO */}
      <div className="space-y-4 print:hidden">
        <h2 className="text-lg font-bold text-slate-700">Nova Evolução Clínica</h2>
        
        {/* Seção 1 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('anamnese')} className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 border-b">
            <span>1. Especialidade Fisioterapêutica da Sessão *</span>
            {sections.anamnese ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 space-y-4 ${sections.anamnese ? 'block' : 'hidden'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {areasFisio.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setAreaSelecionada(area)}
                  className={`p-2.5 text-xs font-medium border rounded-lg text-left transition-all cursor-pointer ${
                    areaSelecionada === area ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seção 2 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('objetivosFicha')} className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 border-b">
            <span>2. Objetivos do Tratamento (Ficha Estruturada)</span>
            {sections.objetivosFicha ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 ${sections.objetivosFicha ? 'block' : 'hidden'}`}>
            <textarea rows={3} value={objetivosFicha} onChange={e => setObjetivosFicha(e.target.value)} placeholder="Ex: Redução do quadro álgico, ganho de ADM..." className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50/30 outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Seção 3 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('procedimentos')} className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 border-b">
            <span>3. Procedimentos / Condutas Realizadas</span>
            {sections.procedimentos ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 ${sections.procedimentos ? 'block' : 'hidden'}`}>
            <textarea rows={3} value={procedimentos} onChange={e => setProcedimentos(e.target.value)} placeholder="Ex: Cinesioterapia, eletroterapia, terapia manual..." className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50/30 outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Seção 4 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('objetivosLivre')} className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 border-b">
            <span>4. Observações de Objetivos Livres</span>
            {sections.objetivosLivre ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 ${sections.objetivosLivre ? 'block' : 'hidden'}`}>
            <textarea rows={2} value={objetivosLivre} onChange={e => setObjetivosLivre(e.target.value)} placeholder="Anotações livres de metas..." className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50/30 outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        {/* Seção 5 */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <button onClick={() => toggleSection('reavaliacao')} className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 border-b">
            <span>5. Dados de Reavaliação</span>
            {sections.reavaliacao ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 ${sections.reavaliacao ? 'block' : 'hidden'}`}>
            <textarea rows={3} value={reavaliacao} onChange={e => setReavaliacao(e.target.value)} placeholder="Métricas, testes de força ou notas evolutivas periódicas..." className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50/30 outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button onClick={handleSaveRecord} disabled={saving || patients.length === 0} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm text-sm cursor-pointer disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
            Salvar Evolução Clínica
          </button>
        </div>
      </div>

      {/* 🎯 HISTÓRICO VISUAL DE PRONTUÁRIOS (EXIBIDO DIRETO NO SITE) */}
      <div className="space-y-4 pt-4 print:block">
        <h2 className="text-lg font-bold text-slate-700 border-b pb-2">Histórico Clínica / Prontuários Salvos</h2>
        
        {loadingRecords ? (
          <div className="flex justify-center py-6 print:hidden"><Loader2 className="animate-spin text-indigo-600" size={24} /></div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 bg-white border rounded-xl border-dashed text-slate-400 text-sm">
            Nenhuma evolução registrada para este paciente ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((rec) => (
              <div key={rec.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3 break-inside-avoid print:border-none print:p-0 print:shadow-none print:border-b print:pb-6">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-bold text-indigo-600 text-sm uppercase bg-indigo-50 px-2.5 py-1 rounded-md print:bg-transparent print:p-0 print:text-slate-800">
                    {rec.area_fisio}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium print:text-slate-600">
                    <Calendar size={14} />
                    {new Date(rec.created_at).toLocaleDateString('pt-BR')} {new Date(rec.created_at).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm text-slate-600">
                  {rec.objetivos_ficha && (
                    <p><strong>Ficha de Objetivos:</strong> {rec.objetivos_ficha}</p>
                  )}
                  {rec.procedimentos && (
                    <p><strong>Procedimentos realizados:</strong> {rec.procedimentos}</p>
                  )}
                  {rec.objetivos_livre && (
                    <p><strong>Anotações Livres:</strong> {rec.objetivos_livre}</p>
                  )}
                  {rec.reavaliacao && (
                    <p><strong>Dados de Reavaliação:</strong> {rec.reavaliacao}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden print:block pt-12 text-center text-sm">
        <div className="w-64 border-t border-slate-400 mx-auto pt-2 text-slate-600">Assinatura do Fisioterapeuta</div>
      </div>
    </div>
  );
}