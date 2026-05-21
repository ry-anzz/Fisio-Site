"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function RecuperarSenhaPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      setLoading(true);
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6">
        
        {!success ? (
          <>
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto">
                <KeyRound size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Recupere sua senha</h1>
              <p className="text-slate-500 text-sm">Enviaremos um link de redefinição para o seu e-mail cadastrado.</p>
            </div>

            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Seu e-mail de acesso</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="exemplo@fisioterapia.com" 
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-slate-50/50" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md shadow-indigo-100 disabled:opacity-70 text-sm"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Enviar link de recuperação"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4 animate-in fade-in duration-300">
            <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Verifique sua caixa de entrada</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              O link de redefinição de senha fictício foi enviado para <strong className="text-slate-700">{email}</strong>. Siga as instruções contidas no e-mail.
            </p>
          </div>
        )}

        <div className="text-center pt-2 border-t border-slate-100">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} />
            Voltar para o Login
          </Link>
        </div>

      </div>
    </div>
  );
}