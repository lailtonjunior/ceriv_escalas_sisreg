import React from 'react';
import { ScheduleEntry } from '../types';
import { getDayOfWeek, getDayOfMonth } from '../services/utils';
import { Trash2 } from 'lucide-react';

interface PreviewTableProps {
  entries: ScheduleEntry[];
  onRemove: (id: string) => void;
}

const PreviewTable: React.FC<PreviewTableProps> = ({ entries, onRemove }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-12 px-4 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
        <p>Nenhum item adicionado à escala ainda.</p>
        <p className="text-xs mt-1">Preencha o formulário e adicione datas para começar.</p>
      </div>
    );
  }

  // Sort by date then time
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.date.getTime() !== b.date.getTime()) {
      return a.date.getTime() - b.date.getTime();
    }
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden border-t-4 border-t-brand-blue">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-700 text-xs uppercase border-b border-gray-200">
              <th className="py-3 px-2 border-r border-gray-200 font-bold">Nome do Médico</th>
              <th className="py-3 px-2 border-r border-gray-200 w-1/4 font-bold">Especialidade (SISREG)</th>
              <th className="py-3 px-2 border-r border-gray-200 font-bold">Dia da Semana</th>
              <th className="py-3 px-2 border-r border-gray-200 font-bold">Dia(s)</th>
              <th className="py-3 px-2 border-r border-gray-200 font-bold">Hora</th>
              <th className="py-3 px-1 border-r border-gray-200 font-bold">1ª Vez</th>
              <th className="py-3 px-1 border-r border-gray-200 font-bold">Retorno</th>
              <th className="py-3 px-1 border-r border-gray-200 font-bold">Egresso</th>
              <th className="py-3 px-2 font-bold">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-blue-50 transition-colors">
                <td className="py-3 px-2 border-r border-gray-100 font-medium text-center text-gray-800">{entry.doctorName.toUpperCase()}</td>
                <td className="py-3 px-2 border-r border-gray-100 text-center text-xs text-gray-600">{entry.specialty.toUpperCase()}</td>
                <td className="py-3 px-2 border-r border-gray-100 text-center text-gray-600">{getDayOfWeek(entry.date)}</td>
                <td className="py-3 px-2 border-r border-gray-100 text-center font-bold text-brand-blue">{getDayOfMonth(entry.date)}</td>
                <td className="py-3 px-2 border-r border-gray-100 text-center text-gray-700">{entry.time}</td>
                <td className="py-3 px-2 border-r border-gray-100 text-center text-gray-600">{entry.qtyFirst || '-'}</td>
                <td className="py-3 px-2 border-r border-gray-100 text-center text-gray-600">{entry.qtyReturn || '-'}</td>
                <td className="py-3 px-2 border-r border-gray-100 text-center text-gray-600">{entry.qtyEgress || '-'}</td>
                <td className="py-3 px-2 text-center">
                  <button 
                    onClick={() => onRemove(entry.id)}
                    className="text-gray-400 hover:text-brand-red p-1 transition-colors"
                    title="Remover linha"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PreviewTable;