"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  ExternalLink,
  ShieldCheck,
  X,
  Loader2
} from 'lucide-react';

interface CashFlowEntry {
  id: string;
  description: string;
  amount: number;
  type: 'receita' | 'despesa';
  has_invoice: boolean;
  entry_date: string;
}

export default function FaturamentoPage() {
  const [entries, setEntries] = useState<CashFlowEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'receita' | 'despesa'>('receita');

  async function loadCashFlow() {
    setLoading(true);
    const { data, error } = await supabase
      .from('cash_flow')
      .select('*')
      .order('entry_date', { ascending: false });

    if (!error && data) {
      setEntries(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCashFlow();
  }, []);

  const totalReceitas = entries
    .filter(e => e.type === 'receita')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const totalDespesas = entries
    .filter(e => e.type === 'despesa')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const saldoTotal = totalReceitas - totalDespesas;
  
  const calendarPending = entries.filter(e => e.type === 'receita' && !e.has_invoice).length;

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    const { error } = await supabase
      .from('cash_flow')
      .insert([
        {
          user_id: user.id,
          description,
          amount: parseFloat(amount),
          type,
          has_invoice: false
        }
      ]);

    setSaving(false);

    if (!error) {
      setIsModalOpen(false);
      setDescription(''); setAmount(''); setType('receita');
      loadCashFlow();
    } else {
      alert("Erro ao salvar lançamento financeiro.");
    }
  };

  const handleEmitInvoice = async (id: string) => {
    const { error } = await supabase
      .from('cash_flow')
      .update({ has_invoice: true })
      .eq('id', id);

    if (!error) {
      loadCashFlow();
    } else {
      alert("Erro ao atualizar status da nota fiscal.");
    }
  };

  // 🎯 📑 FUNÇÃO QUE GERA E BAIXA O ARQUIVO EXCEL/CSV REAL
  const handleExportCSV = () => {
    if (entries.length === 0) return;

    // 1. Criar o cabeçalho do arquivo
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Data;Descricao;Valor (R$);Tipo;Nota Fiscal Emitida\n";

    // 2. Percorrer os lançamentos alimentando as linhas
    entries.forEach((item) => {
      const formattedDate = item.entry_date.split('-').reverse().join('/');
      const formattedAmount = Number(item.amount).toFixed(2).replace('.', ',');
      const invoiceStatus = item.has_invoice ? "Sim" : "Nao";
      
      csvContent += `${formattedDate};${item.description};${formattedAmount};${item.type};${invoiceStatus}\n`;
    });

    // 3. Criar o gatilho de download invisível no navegador
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Lote_Contabil_FisioSaaS_${new Date().getMonth() + 1}_2026.csv`);
    document.body.appendChild(link);
    
    // 4. Executa o download de verdade
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Controle de Caixa e Notas</h1>
          <p className="text-slate-500 text-sm">Gerencie o fluxo financeiro do consultório e emissões para Pessoa Física.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm cursor-pointer"
        >
          <Plus size={18} />
          Novo Lançamento
        </button>
      </div>

      {/* MÉTRICAS DE RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Entradas (Mês)</span>
            <h3 className="text-xl md:text-2xl font-bold text-emerald-600 mt-1">
              R$ {totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Saídas (Mês)</span>
            <h3 className="text-xl md:text-2xl font-bold text-rose-600 mt-1">
              R$ {totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <TrendingDown size={20} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase">Saldo em Caixa</span>
            <h3 className={`text-xl md:text-2xl font-bold mt-1 ${saldoTotal >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
              R$ {saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-3 bg-slate-50 text-slate-700 rounded-lg">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TABELA DE LIVRO CAIXA */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Fluxo de Caixa Recente</h2>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">Nenhum lançamento registrado no caixa.</div>
          ) : (
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
                  {entries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {item.entry_date.split('-').reverse().join('/')}
                      </td>
                      <td className="p-4 font-medium text-slate-700">{item.description}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`flex items-center gap-1 font-bold ${item.type === 'receita' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {item.type === 'receita' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          R$ {Number(item.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap">
                        {item.type === 'receita' ? (
                          item.has_invoice ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                              <FileCheck size={12} /> Emitida
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleEmitInvoice(item.id)}
                              className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 hover:border-indigo-300 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
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
          )}
        </div>

        {/* PAINEL DO RECEITA SAÚDE */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center gap-2 text-indigo-400">
              <ShieldCheck size={24} />
              <h3 className="font-bold text-white text-md">Receita Saúde PF</h3>
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Módulo para profissionais liberais. Os recibos gerados geram dados automáticos no padrão do Carnê-Leão do Governo Federal.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Status do Módulo:</span>
                <span className="text-emerald-400 font-medium">● Ativo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pendentes no lote:</span>
                <span className="font-bold text-indigo-300">{calendarPending} {calendarPending === 1 ? 'Nota' : 'Notas'}</span>
              </div>
            </div>

            {/* 🎯 BOTÃO ATUALIZADO COM A FUNÇÃO DE EXPORTAÇÃO REAL */}
            <button 
              onClick={handleExportCSV}
              disabled={entries.length === 0}
              className="w-full bg-white hover:bg-indigo-50 text-indigo-950 font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              Exportar Lote Mensal
              <ExternalLink size={12} />
            </button>
          </div>
        </div>

      </div>

      {/* MODAL PARA ADICIONAR MOVIMENTAÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-slate-800">Novo Lançamento</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tipo de Lançamento</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => setType('receita')}
                    className={`p-2.5 text-xs font-bold border rounded-lg transition-all cursor-pointer ${type === 'receita' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-500'}`}
                  >
                    Receita (Entrada)
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setType('despesa')}
                    className={`p-2.5 text-xs font-bold border rounded-lg transition-all cursor-pointer ${type === 'despesa' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'border-slate-200 text-slate-500'}`}
                  >
                    Despesa (Saída)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Descrição / Identificação *</label>
                <input required type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Atendimento Particular João" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"/>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Valor (R$) *</label>
                <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold"/>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium cursor-pointer">
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}