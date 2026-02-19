import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import ScheduleForm from './components/ScheduleForm';
import PreviewTable from './components/PreviewTable';
import { ScheduleEntry, FormData, HeaderData } from './types';
import { generatePDF } from './services/pdfGenerator';
import { getMonthYear } from './services/utils';
import { FileDown, Building2, FileText, Trash2 } from 'lucide-react';
import { isSameDay } from 'date-fns';

const simpleId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  
  const [headerData, setHeaderData] = useState<HeaderData>({
    unitName: 'APAE DE COLINAS',
    referenceMonth: getMonthYear(new Date())
  });

  const [formData, setFormData] = useState<FormData>({
    doctorName: '',
    specialty: '',
    times: ['8h'], // Default value as array
    qtyFirst: 0,
    qtyReturn: 0,
    qtyEgress: 0
  });

  // Update reference month string when calendar changes
  useEffect(() => {
    setHeaderData(prev => ({
      ...prev,
      referenceMonth: getMonthYear(currentMonth)
    }));
  }, [currentMonth]);

  const toggleDate = (date: Date) => {
    setSelectedDates(prev => {
      const exists = prev.find(d => d.getTime() === date.getTime());
      if (exists) {
        return prev.filter(d => d.getTime() !== date.getTime());
      } else {
        return [...prev, date];
      }
    });
  };

  // Nova função para aceitar um intervalo de datas vindo do drag-and-drop
  const handleRangeSelect = (dates: Date[]) => {
    setSelectedDates(prev => {
      const newDates = [...prev];
      dates.forEach(d => {
        // Adiciona apenas se ainda não estiver selecionado
        if (!newDates.some(existing => isSameDay(existing, d))) {
          newDates.push(d);
        }
      });
      return newDates;
    });
  };

  const handleAddSchedule = () => {
    if (selectedDates.length === 0) return;
    
    // Use the array directly. 
    // This logic ensures that for every selected time, a separate entry is created.
    // Consequently, the PDF generator will create a separate row for each.
    const timesList = formData.times;
    
    const newEntries: ScheduleEntry[] = [];

    selectedDates.forEach(date => {
      timesList.forEach(time => {
        newEntries.push({
          id: simpleId(),
          doctorName: formData.doctorName,
          specialty: formData.specialty,
          date: date,
          time: time,
          qtyFirst: formData.qtyFirst,
          qtyReturn: formData.qtyReturn,
          qtyEgress: formData.qtyEgress
        });
      });
    });

    setEntries(prev => [...prev, ...newEntries]);
    setSelectedDates([]); // Clear selection after adding
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleExportPDF = () => {
    generatePDF(entries, headerData);
  };

  return (
    <div className="min-h-screen pb-12 bg-slate-50">
      {/* Header seguindo Manual de Identidade Visual */}
      <header className="bg-white border-t-[6px] border-brand-blue shadow-md mb-8">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Lado Esquerdo: Marca da Rede + Título da Unidade */}
          <div className="flex items-center gap-5 w-full md:w-auto justify-center md:justify-start">
            {/* Logo da Rede Saúde Sem Limite (Elemento Visual) */}
            <div className="relative shrink-0">
              <img 
                src="/logo.png" 
                alt="Logo Saúde Sem Limite" 
                className="h-20 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.querySelector('.fallback-logo')?.classList.remove('hidden');
                }}
              />
              {/* Fallback visual estilizado como DNA (conforme manual) se a imagem falhar */}
              <div className="fallback-logo hidden h-20 w-12 flex-col items-center justify-center relative opacity-90">
                 {/* Cabeça (Azul) */}
                 <div className="w-6 h-6 rounded-full bg-brand-blue mb-1"></div>
                 {/* Corpo (Curvas simplificadas) */}
                 <div className="w-10 h-8 rounded-tr-3xl rounded-bl-3xl bg-brand-green -mb-2 z-10"></div>
                 <div className="flex -mb-2">
                    <div className="w-5 h-8 rounded-tr-3xl bg-brand-red opacity-90"></div>
                    <div className="w-5 h-8 rounded-tl-3xl bg-brand-yellow opacity-90"></div>
                 </div>
                 <div className="w-10 h-6 rounded-tl-3xl rounded-br-3xl bg-brand-yellow -mt-1"></div>
              </div>
            </div>
            
            <div className="text-center md:text-left border-l-0 md:border-l-2 border-gray-100 md:pl-5">
              <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight leading-none uppercase">
                CER IV APAE COLINAS
              </h1>
              <p className="text-brand-blue font-bold text-sm md:text-base mt-1 tracking-wide">
                Rede de Cuidados à Pessoa com Deficiência
              </p>
            </div>
          </div>
          
          {/* Lado Direito: Logo Ministério da Saúde / Governo Federal */}
          <div className="flex flex-col items-center md:items-end mt-2 md:mt-0">
            <img 
              src="/logo-ms.png" 
              alt="Ministério da Saúde - Governo Federal" 
              className="h-12 md:h-14 object-contain"
              onError={(e) => {
                // Tenta carregar uma URL pública do Governo Federal se o arquivo local falhar
                e.currentTarget.src = "https://www.gov.br/planalto/pt-br/conheca-a-presidencia/acervo/simbolos-nacionais/brasao-da-republica/@@images/image";
                // Se falhar novamente, esconde
                e.currentTarget.onerror = (evt) => {
                   (evt.target as HTMLImageElement).style.display = 'none';
                   (evt.target as HTMLImageElement).parentElement?.querySelector('.fallback-gov')?.classList.remove('hidden');
                };
              }}
            />
            {/* Fallback texto para Governo */}
            <div className="fallback-gov hidden flex flex-col items-end">
               <span className="text-xs font-bold text-gray-600 uppercase">Ministério da Saúde</span>
               <div className="flex gap-1 mt-1">
                 <div className="w-6 h-1 bg-brand-blue"></div>
                 <div className="w-6 h-1 bg-brand-yellow"></div>
                 <div className="w-6 h-1 bg-brand-green"></div>
               </div>
               <span className="text-[10px] font-black text-gray-800 uppercase mt-1">Governo Federal</span>
            </div>
          </div>

        </div>
      </header>

      <main className="container mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Configuration & Inputs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Unit & Month Settings */}
          <section className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-brand-yellow">
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-brand-yellow" /> Configuração do Cabeçalho
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Unidade</label>
                <input 
                  type="text" 
                  value={headerData.unitName}
                  onChange={(e) => setHeaderData({...headerData, unitName: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 text-sm uppercase focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mês de Referência</label>
                <input 
                  type="text" 
                  value={headerData.referenceMonth}
                  onChange={(e) => setHeaderData({...headerData, referenceMonth: e.target.value})}
                  className="w-full border border-gray-300 rounded p-2 text-sm uppercase bg-gray-50 text-black font-bold focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Calendar Selection */}
          <section>
            <h2 className="text-sm font-bold text-gray-500 uppercase mb-2 pl-1">2. Selecione os dias</h2>
            <Calendar 
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              selectedDates={selectedDates}
              onToggleDate={toggleDate}
              onSelectRange={handleRangeSelect}
            />
          </section>

          {/* Form */}
          <ScheduleForm 
            formData={formData}
            setFormData={setFormData}
            onAdd={handleAddSchedule}
            selectedCount={selectedDates.length}
          />

        </div>

        {/* Right Column: Preview & Actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 sm:mb-0">
              <FileText className="w-5 h-5 text-brand-blue" /> 
              Pré-visualização da Escala
            </h2>
            <div className="flex gap-3">
               {entries.length > 0 && (
                <button 
                  onClick={() => setEntries([])}
                  className="px-4 py-2 text-brand-red hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-transparent hover:border-red-100"
                >
                  <Trash2 className="w-4 h-4" /> Limpar
                </button>
               )}
              <button 
                onClick={handleExportPDF}
                disabled={entries.length === 0}
                className={`px-6 py-2 rounded-lg font-bold text-white shadow transition-all flex items-center gap-2
                  ${entries.length === 0 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-brand-blue hover:bg-blue-700 hover:shadow-md'}`}
              >
                <FileDown className="w-5 h-5" />
                Exportar PDF
              </button>
            </div>
          </div>

          <PreviewTable entries={entries} onRemove={handleRemoveEntry} />
          
          <div className="bg-blue-50 border-l-4 border-brand-blue p-4 rounded-r-md text-sm text-blue-900 shadow-sm">
            <strong>Dica:</strong> Após gerar o PDF, verifique se os dados conferem com o padrão exigido pela regulação. O arquivo será salvo na sua pasta de downloads.
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;