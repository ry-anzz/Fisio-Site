"use client";

import React, { useState } from 'react';
import { FileText, Printer, FileEdit, RefreshCw, CheckCircle2 } from 'lucide-react';

// Templates de documentos pré-preenchidos de Fisioterapia
const DOCUMENT_TEMPLATES = {
  contrato: {
    title: "Contrato de Prestação de Serviços Fisioterapêuticos",
    content: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nCONTRATANTE: [Nome do Paciente], portador do CPF nº [CPF do Paciente].\nCONTRATADO: Dr. [Seu Nome], Fisioterapeuta, CREFITO nº [Seu Crefito].\n\nOBJETO: O presente contrato tem por objeto a prestação de serviços de fisioterapia clínica, conforme plano de tratamento estabelecido na avaliação inicial.\n\nVALOR E PAGAMENTO: O contratante pagará o valor acordado por sessão ou pacote fechado, conforme termos da ficha financeira.\n\nPor estarem justos e contratados, assinam o presente instrumento.",
  },
  termo_acupuntura: {
    title: "Termo de Consentimento Livre e Esclarecido - Acupuntura",
    content: "TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO (TCLE) - ACUPUNTURA\n\nEu, [Nome do Paciente], declaro estar ciente de que o tratamento por Acupuntura envolve a inserção de agulhas estéreis e descartáveis na pele.\n\nFui informado(a) sobre os benefícios e os riscos mínimos possíveis do procedimento, tais como pequenos hematomas, sangramento local leve, dor temporária ou tontura.\n\nTive a oportunidade de fazer perguntas e todas foram respondidas satisfatoriamente. Compreendo que posso revogar este consentimento a qualquer momento.\n\nAssinatura do Paciente: ____________________________________",
  },
  laudo: {
    title: "Laudo Fisioterapêutico",
    content: "LAUDO FISIOTERAPÊUTICO\n\nAtesto para os devidos fins que o(a) paciente [Nome do Paciente] encontra-se em acompanhamento fisioterapêutico nesta clínica.\n\nApresenta quadro clínico compatível com [Diagnóstico Clínico / CID], evoluindo com limitação funcional de [Especificar articulação/membro], déficit de força grau [X] e dor à mobilização.\n\nNecessita manter o plano de reabilitação por tempo indeterminado, com frequência de [X] vezes por semana.\n\nSão Paulo, " + new Date().toLocaleDateString('pt-BR'),
  },
  relatorio: {
    title: "Relatório de Evolução Clínico-Fisioterapêutica",
    content: "RELATÓRIO DE FISIOTERAPEUTA\n\nPaciente: [Nome do Paciente]\n\nO(A) referido(a) paciente iniciou o tratamento em [Data]. Foram realizadas [X] sessões até o momento utilizando condutas de cinesioterapia estruturada, analgesia e terapia manual.\n\nAté a presente data, o(a) paciente apresenta melhora significativa do quadro álgico primário, ganho substancial de amplitude de movimento e maior estabilidade funcional nas atividades de vida diária (AVDs).\n\nPermanece sob cuidados fisioterapêuticos.",
  },
  encaminhamento: {
    title: "Encaminhamento Fisioterapêutico",
    content: "ENCAMINHAMENTO MÉDICO / ESPECIALIDADES\n\nAo Dr(a). [Nome do Profissional / Especialidade],\n\nEncaminho o(a) paciente [Nome do Paciente] para avaliação especializada de sua competência.\n\nO(A) paciente encontra-se em reabilitação para [Especificar o problema], contudo, durante a evolução clínica, observou-se a necessidade de [Ex: parecer cirúrgico / exame de imagem complementar / infiltração bloqueio] para melhor direcionamento do prognóstico.\n\nÀ disposição para esclarecimentos.",
  }
};

type DocType = keyof typeof DOCUMENT_TEMPLATES;

export default function DocumentosPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocType>('contrato');
  const [docContent, setDocContent] = useState(DOCUMENT_TEMPLATES.contrato.content);

  // Troca o documento e carrega o texto pré-preenchido correspondente
  const handleDocChange = (type: DocType) => {
    setSelectedDoc(type);
    setDocContent(DOCUMENT_TEMPLATES[type].content);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:p-0">
      
      {/* HEADER - Ocultado na hora da impressão */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Documentos e Termos</h1>
          <p className="text-slate-500 text-sm">Gere laudos, contratos e termos com modelos pré-preenchidos.</p>
        </div>
        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm"
        >
          <Printer size={18} />
          Imprimir / Exportar PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SELETOR DE TIPOS DE DOCUMENTO (MENU DA ESQUERDA) - Ocultado na impressão */}
        <div className="space-y-2 print:hidden">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Selecione o Documento:</h3>
          
          {(Object.keys(DOCUMENT_TEMPLATES) as DocType[]).map((key) => (
            <button
              key={key}
              onClick={() => handleDocChange(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                selectedDoc === key
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText size={18} />
              <span className="truncate">{DOCUMENT_TEMPLATES[key].title.split(" - ")[0]}</span>
            </button>
          ))}
        </div>

        {/* EDITOR E ÁREA DE VISUALIZAÇÃO (DIREITA) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden print:border-none print:shadow-none">
          
          {/* Topo do Painel de Edição - Ocultado na impressão */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 print:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <FileEdit size={14} />
              Editor de Documento (Você pode alterar o texto abaixo)
            </span>
            <button 
              onClick={() => setDocContent(DOCUMENT_TEMPLATES[selectedDoc].content)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              title="Restaurar o modelo padrão original"
            >
              <RefreshCw size={12} />
              Resetar Modelo
            </button>
          </div>

          {/* DOCUMENTO FINAL (Esta área é formatada perfeitamente na hora de imprimir) */}
          <div className="p-6 md:p-8 space-y-6 print:p-0">
            
            {/* Timbre profissional simulado para a Impressão */}
            <div className="hidden print:flex flex-col items-center justify-center border-b pb-6 text-center mb-8">
              <h2 className="text-xl font-bold tracking-wider text-slate-800 uppercase">Consultório de Fisioterapia & Acupuntura</h2>
              <p className="text-xs text-slate-500">Dr. [Seu Nome Completo] • CREFITO: XXXXX-F</p>
              <p className="text-[10px] text-slate-400">Telefone: (XX) XXXXX-XXXX • Email: seuemail@dominio.com</p>
            </div>

            {/* Título do Documento */}
            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2 print:text-center print:text-2xl print:border-none">
              {DOCUMENT_TEMPLATES[selectedDoc].title}
            </h2>

            {/* Campo de edição em tela cheia que vira texto corrido puro no papel */}
            <textarea
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full min-h-[400px] p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 leading-relaxed text-sm font-mono whitespace-pre-wrap bg-slate-50/20 print:bg-transparent print:border-none print:p-0 print:font-sans print:text-base print:leading-loose"
              placeholder="Escreva ou cole o conteúdo do documento aqui..."
            />

            {/* Rodapé de assinaturas invisível no sistema, visível apenas no PDF/Impressora */}
            <div className="hidden print:block pt-16">
              <div className="grid grid-cols-2 gap-12 text-center text-sm">
                <div className="border-t border-slate-400 pt-2 text-slate-600">
                  Assinatura do Profissional<br/>
                  <span className="text-xs text-slate-400">Carimbo e Registro</span>
                </div>
                {selectedDoc === 'termo_acupuntura' && (
                  <div className="border-t border-slate-400 pt-2 text-slate-600">
                    Assinatura do Paciente / Responsável<br/>
                    <span className="text-xs text-slate-400">Ciência dos Termos</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}