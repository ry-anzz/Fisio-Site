"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, MessageCircle, UserPlus, X, Loader2 } from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  cpf: string;
  address: string;
  phone: string;
  payment_type: 'plano' | 'dinheiro' | 'cartão' | 'cortesia';
}

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados do Formulário
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentType, setPaymentType] = useState<Patient['payment_type']>('dinheiro');

  // 🔄 BUSCAR PACIENTES DO SUPABASE (Filtrado automaticamente pelo RLS do seu usuário)
  async function fetchPatients() {
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('name', { ascending: true });

    if (!error && data) {
      setPatients(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  // 💾 SALVAR PACIENTE REAL NO BANCO
  async function handleCreatePatient(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    // Pega o ID do usuário atualmente logado para vincular o paciente a ele
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    // Limpa o telefone para salvar apenas números
    const cleanPhone = phone.replace(/\D/g, '');

    const { error } = await supabase
      .from('patients')
      .insert([
        { 
          user_id: user.id, // 🔒 Vincula o paciente ao seu perfil de segurança
          name, 
          cpf: cpf || null, 
          address: address || null, 
          phone: cleanPhone || null, 
          payment_type: paymentType 
        }
      ]);

    if (!error) {
      setIsModalOpen(false);
      // Limpar campos
      setName(''); setCpf(''); setAddress(''); setPhone(''); setPaymentType('dinheiro');
      fetchPatients(); // Atualiza a lista vinda do banco
    } else {
      console.error(error);
      alert("Erro ao salvar paciente no banco de dados.");
    }
  }

  // ❌ EXCLUIR PACIENTE REAL NO BANCO
  async function handleDeletePatient(id: string) {
    if (confirm("Tem certeza que deseja excluir este paciente definitivamente do banco de dados?")) {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchPatients();
      } else {
        alert("Erro ao excluir o paciente.");
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Meus Pacientes</h1>
          <p className="text-slate-500 text-sm">Gerencie o cadastro e informações de contato reais.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm cursor-pointer"
        >
          <UserPlus size={18} />
          Adicionar Paciente
        </button>
      </div>

      {/* LISTAGEM DE PACIENTES COM LOADER */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
      ) : patients.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200 text-slate-400 text-sm">
          Nenhum paciente cadastrado no seu banco de dados ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((patient) => (
            <div key={patient.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{patient.name}</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full capitalize shrink-0">
                    {patient.payment_type}
                  </span>
                </div>
                <div className="text-sm text-slate-500 space-y-1 mt-3">
                  <p><strong>CPF:</strong> {patient.cpf || 'Não informado'}</p>
                  <p className="line-clamp-1"><strong>Endereço:</strong> {patient.address || 'Não informado'}</p>
                </div>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                {patient.phone && (
                  <a 
                    href={`https://wa.me/55${patient.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors"
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </a>
                )}
                <button 
                  onClick={() => handleDeletePatient(patient.id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Excluir paciente"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL PARA ADICIONAR PACIENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xl font-bold text-slate-800">Novo Paciente</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nome Completo *</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">CPF</label>
                  <input type="text" placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Telefone (com DDD)</label>
                  <input type="text" placeholder="11999999999" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Endereço</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"/>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Tipo de Pagamento</label>
                <select value={paymentType} onChange={e => setPaymentType(e.target.value as Patient['payment_type'])} className="w-full p-2.5 border border-slate-200 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm">
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartão">Cartão</option>
                  <option value="plano">Plano de Saúde</option>
                  <option value="cortesia">Cortesia</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm cursor-pointer">Salvar Paciente</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}