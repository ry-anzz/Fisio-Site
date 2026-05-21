"use client";

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function FaturamentoPage() {
  // Simulação de lançamentos no caixa
  const [lancamentos, setLancamentos] = useState([
    { id: 1, descricao: 'Atendimento Fisioterapia - João da Silva', valor: 180.00, tipo: 'receita', data: '20/05/2026', nf: true },
    { id: 2, descricao: 'Sessão Acupuntura - Maria Oliveira', valor: 150.00, tipo: 'receita', data: '20/05/2026', nf: false },
    { id: 3, descricao: 'Compra de agulhas e tapes descartáveis', valor: 95.00, tipo: 'despesa', data: '18/05/2026', nf: false },
    { id: 4, descricao: 'Atendimento Fisioterapia - Pedro Alcântara', valor: 180.00, tipo: 'receita', data: '17/05/2026', nf: true },
  ]);

  // Função para simular a emissão/vinculação da nota fiscal PF
  const emitirNotaSimulada = (id: number) => {
    setLancamentos(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, nf: true };
      }
      return item;
    }));
    alert("Recibo/Nota exportado com sucesso para o lote do Receita Saúde!");
  };

  return (
    <div className="space-y-6">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Controle de Caixa e Notas</h1>
          <p className="text-slate-500 text-sm">Gerencie o fluxo financeiro do consultório e emissões para Pessoa Física.</p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-2">
          <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm">
            <Plus size={18} />
            Novo Lançamento
          </button>
        </div>
      </div>

      {/* METRICAS DE RESUMO DO CAIXA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Entradas (Mês)</span>
            <h3 className="text-xl md:text-2xl font-bold text-emerald-600 mt-1">R$ 510,00</h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Saídas (Mês)</span>
            <h3 className="text-xl md:text-2xl font-bold text-rose-600 mt-1">R$ 95,00</h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Saldo em Caixa</span>
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mt-1">R$ 415,00</h3>
          </div>
          <div className="p-3 bg-slate-50 text-slate-700 rounded-lg">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TABELA DE LIVRO CAIXA (ESQUERDA) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Fluxo de Caixa Recente</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                  <th className="p-4">Data</th>
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Valor</th>
                  <th className="p-4 text-center">Nota PF</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {lancamentos.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-slate-500 whitespace-nowrap">{item.data}</td>
                    <td className="p-4 font-medium text-slate-700">{item.descricao}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`flex items-center gap-1 font-bold ${item.tipo === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {item.tipo === 'receita' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        R$ {item.valor.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      {item.tipo === 'receita' ? (
                        item.nf ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                            <FileCheck size={12} /> Emitida
                          </span>
                        ) : (
                          <button 
                            onClick={() => emitirNotaSimulada(item.id)}
                            className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 px-2.5 py-1 rounded-lg transition-all"
                          >
                            Gerar Nota
                          </button>
                        )
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* INTEGRADOR CONCEITUAL RECEITA SAÚDE (DIREITA) */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <ShieldCheck size={24} />
              <h3 className="font-bold text-white text-md">Receita Saúde PF</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Módulo de integração para profissionais liberais. Os dados de recibos de pacientes gerados aqui são preparados no padrão do Carnê-Leão da Receita Federal.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Status do Módulo:</span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  ● Pronto p/ Envio
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pendentes no lote:</span>
                <span className="font-bold">1 Nota</span>
              </div>
            </div>

            <button 
              onClick={() => alert("Sincronizando lote com o ambiente Receita Saúde...")}
              className="w-full bg-white hover:bg-indigo-50 text-indigo-950 font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              Exportar Lote Mensal
              <ExternalLink size={12} />
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-400 leading-relaxed">
            <strong>Dica tributária:</strong> Lançamentos marcados com o botão <span className="font-semibold text-indigo-600">Gerar Nota</span> criam um recibo contendo o nome completo e o CPF do paciente, essencial para cruzamento de dados na declaração anual de IRPF deles.
          </div>
        </div>

      </div>
    </div>
  );
}