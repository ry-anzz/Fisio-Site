"use client";

import React, { useState } from 'react';
import { ClipboardList, ChevronDown, ChevronUp, Printer, CheckCircle, User } from 'lucide-react';

export default function AtendimentoPage() {
  // Estado para controlar quais seções estão abertas/fechadas (todas começam abertas)
  const [sections, setSections] = useState({
    anamnese: true,
    objetivosFicha: true,
    procedimentos: true,
    objetivosLivre: true,
    reavaliacao: true,
  });

  // Estado para a área selecionada das 16 da fisioterapia
  const [areaSelecionada, setAreaSelecionada] = useState<string>('');

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const areasFisio = [
    'Traumato-ortopedia', 'Neurofuncional', 'Respiratória', 'Cardiovascular', 
    'Aquática', 'Dermatofuncional', 'Gerontologia', 'do Trabalho', 
    'Terapia Intensiva', 'Saúde da Mulher', 'Saúde do Homem', 'Psicomotricidade', 
    'Base no TEA', 'Oncologia', 'Quiropraxia', 'Osteopatia'
  ];

  // Função para simular a impressão
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0">
      {/* CABEÇALHO - Escondido na impressão */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Prontuário de Atendimento</h1>
          <p className="text-slate-500 text-sm">Registre as evoluções, anamneses e condutas dos seus pacientes.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
        >
          <Printer size={18} />
          Exportar / Imprimir
        </button>
      </div>

      {/* SELETOR DE PACIENTE FIXO (Simulado para a demonstração) */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between print:border-none print:p-0 print:mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg print:hidden">
            <User size={20} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider print:hidden">Paciente Selecionado</span>
            <h2 className="text-lg font-bold text-slate-800 print:text-2xl">João da Silva Sauro</h2>
            <p className="text-sm text-slate-500 print:text-xs">CPF: 123.456.789-00 • Plano de Saúde</p>
          </div>
        </div>
        <div className="text-right text-xs text-slate-400 print:text-slate-700 print:text-sm">
          <strong>Data do Registro:</strong> {new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      {/* SUB-ABAS EMPILHADAS (ACCORDIONS) */}
      <div className="space-y-4">
        
        {/* 1. ANAMNESE / 1ª AVALIAÇÃO */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
          <button 
            onClick={() => toggleSection('anamnese')}
            className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 print:hidden"
          >
            <span className="flex items-center gap-2">1. Anamnese / 1ª Avaliação</span>
            {sections.anamnese ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          
          <div className={`p-5 space-y-4 ${sections.anamnese ? 'block' : 'hidden print:block'}`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Selecione a Área da Fisioterapia:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 print:hidden">
              {areasFisio.map((area) => (
                <button
                  key={area}
                  onClick={() => setAreaSelecionada(area)}
                  className={`p-2.5 text-xs font-medium border rounded-lg text-left transition-all ${
                    areaSelecionada === area 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
            {/* Visualização de Impressão da Área Selecionada */}
            <div className="hidden print:block font-medium text-slate-800 text-sm">
              <strong>Área do Atendimento:</strong> {areaSelecionada || "Não especificada"}
            </div>
          </div>
        </div>

        {/* 2. OBJETIVOS DO TRATAMENTO (FICHA) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
          <button 
            onClick={() => toggleSection('objetivosFicha')}
            className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 print:hidden"
          >
            <span>2. Objetivos do Tratamento (Ficha Estática)</span>
            {sections.objetivosFicha ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 ${sections.objetivosFicha ? 'block' : 'hidden print:block'}`}>
            <label className="hidden print:block font-bold text-sm text-slate-700 mb-1">2. Objetivos do Tratamento (Ficha):</label>
            <textarea 
              rows={4}
              placeholder="Ex: Redução do quadro álgico, ganho de amplitude de movimento (ADM), melhora da marcha..." 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/30 print:bg-transparent print:border-none print:p-0"
            />
          </div>
        </div>

        {/* 3. PROCEDIMENTOS / CONDUTAS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
          <button 
            onClick={() => toggleSection('procedimentos')}
            className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 print:hidden"
          >
            <span>3. Procedimentos / Condutas Realizadas</span>
            {sections.procedimentos ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 ${sections.procedimentos ? 'block' : 'hidden print:block'}`}>
            <label className="hidden print:block font-bold text-sm text-slate-700 mb-1">3. Procedimentos / Condutas Realizadas:</label>
            <textarea 
              rows={4}
              placeholder="Ex: Aplicação de TENS por 20min, exercícios de fortalecimento excêntrico de quadríceps, liberação miofascial manual..." 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/30 print:bg-transparent print:border-none print:p-0"
            />
          </div>
        </div>

        {/* 4. OBJETIVOS DO TRATAMENTO (CAMPO DIGITADO) */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
          <button 
            onClick={() => toggleSection('objetivosLivre')}
            className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 print:hidden"
          >
            <span>4. Objetivos do Tratamento (Campo Digitado Livre)</span>
            {sections.objetivosLivre ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 ${sections.objetivosLivre ? 'block' : 'hidden print:block'}`}>
            <label className="hidden print:block font-bold text-sm text-slate-700 mb-1">4. Objetivos do Tratamento (Campo Livre):</label>
            <textarea 
              rows={3}
              placeholder="Espaço livre para observações e anotações personalizadas de objetivos..." 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/30 print:bg-transparent print:border-none print:p-0"
            />
          </div>
        </div>

        {/* 5. REAVALIAÇÃO */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
          <button 
            onClick={() => toggleSection('reavaliacao')}
            className="w-full p-4 bg-slate-50/50 flex justify-between items-center font-bold text-slate-700 hover:bg-slate-50 transition-colors border-b border-slate-100 print:hidden"
          >
            <span>5. Reavaliação</span>
            {sections.reavaliacao ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          <div className={`p-5 ${sections.reavaliacao ? 'block' : 'hidden print:block'}`}>
            <label className="hidden print:block font-bold text-sm text-slate-700 mb-1">5. Reavaliação:</label>
            <textarea 
              rows={4}
              placeholder="Insira os dados coletados na reavaliação periódica do paciente..." 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/30 print:bg-transparent print:border-none print:p-0"
            />
          </div>
        </div>

      </div>

      {/* BOTÃO SALVAR - Escondido na impressão */}
      <div className="flex justify-end gap-3 pt-4 print:hidden">
        <button 
          onClick={() => alert('Prontuário salvo com sucesso (Simulado)!')}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
        >
          <CheckCircle size={16} />
          Salvar Evolução
        </button>
      </div>
    </div>
  );
}