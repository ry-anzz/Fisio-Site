"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  DollarSign, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const menuItems = [
    { name: 'Painel', href: '/', icon: LayoutDashboard },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Documentos', href: '/documentos', icon: FileText },
    { name: 'Faturamento', href: '/faturamento', icon: DollarSign },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      
      {/* 📱 TOPO MÓVEL (Apenas botão de abrir menu, sem logo) */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-end px-4 z-30">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 💻 SIDEBAR DESKTOP (Logo grande exclusiva para Computador) */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col justify-between z-20">
        <div className="p-5 space-y-6">
          {/* LOGO GRANDE */}
          <div className="flex items-center gap-2.5 px-2">
            <Image src="/logo.png" width={500} height={500} alt="Logo" className="" />
          </div>

          {/* ITENS DO MENU */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-50/50'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* BOTÃO DE LOGOUT */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50/50 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* 📱 SIDEBAR RETRÁTIL MÓVEL */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <aside className="lg:hidden fixed top-0 bottom-0 left-0 w-64 bg-white z-50 flex flex-col justify-between animate-in slide-in-from-left duration-200 shadow-2xl">
            <div className="p-5 space-y-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-bold text-slate-800">Menu de Navegação</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut size={18} />
                Sair da Conta
              </button>
            </div>
          </aside>
        </>
      )}

      {/* 🖥️ ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto pt-20 pb-6 px-4 md:p-8 lg:pt-8 relative">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}