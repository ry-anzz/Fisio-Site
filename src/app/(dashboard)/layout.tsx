"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Importado o useRouter para fazer o deslogar
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  Calendar, 
  FileText, 
  DollarSign, 
  Menu, 
  X,
  LogOut // Ícone de sair instalado
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Painel', href: '/painel', icon: LayoutDashboard },
    { name: 'Pacientes', href: '/pacientes', icon: Users },
    { name: 'Atendimento', href: '/atendimento', icon: ClipboardList },
    { name: 'Agenda', href: '/agenda', icon: Calendar },
    { name: 'Documentos', href: '/documentos', icon: FileText },
    { name: 'Notas Fiscais', href: '/faturamento', icon: DollarSign },
  ];

  // Função que simula o Logout e joga o usuário de volta pro login
  const handleLogout = () => {
    if (confirm("Deseja realmente sair do sistema?")) {
      setIsSidebarOpen(false);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* HEADER MOBILE */}
      <header className="bg-white border-b border-slate-200 p-4 flex justify-between items-center md:hidden sticky top-0 z-50">
        <span className="font-bold text-xl text-indigo-600">FisioSaaS</span>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-slate-600 focus:outline-none"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white border-r border-slate-200 w-64 p-5 z-40 transform transition-transform duration-200 ease-in-out flex flex-col justify-between
        md:relative md:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* PARTE DE CIMA DA SIDEBAR */}
        <div className="space-y-8">
          <div className="hidden md:block">
            <span className="font-bold text-2xl text-indigo-600">FisioSaaS</span>
            <p className="text-xs text-slate-400 mt-1">Uso Pessoal</p>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              // Ajuste para validar se a rota está ativa mesmo com subpastas
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* 🎯 PARTE DE BAIXO DA SIDEBAR: BOTÃO DE SAIR */}
        <div className="pt-4 border-t border-slate-100 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
        </div>
      </aside>

      {/* OVERLAY PARA MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}