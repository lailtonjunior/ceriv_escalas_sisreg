import React, { useMemo, useState } from 'react';
import { FormData } from '../types';
import { PlusCircle, X, UserPlus, FolderPlus, Save } from 'lucide-react';

interface ScheduleFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onAdd: () => void;
  selectedCount: number;
}

const DOCTORS_DATA: Record<string, string[]> = {
  "ANA CAROLINA NUNES RIBEIRO": [
    "BERA",
    "CONSULTA EM REABILITACAO AUDITIVA I - RETORNO",
    "GRUPO - FONOAUDIOLOGIA II",
    "GRUPO - REABILITAÇÃO AUDITIVA",
    "SELECAO E VERIFICACAO DE BENEFICIO DO AASI"
  ],
  "DANIEL BRAZ NUNES AZEVEDO": [
    "CONSULTA EM REABILITACAO AUDITIVA I - RETORNO",
    "CONSULTA EM REABILITACAO INTELECTUAL / AUTISMO - RETORNO",
    "GRUPO - FONOAUDIOLOGIA II",
    "REABILITACAO EM PESSOA COM DEFICIENCIA AUDITIVA"
  ],
  "ANDREY PEREIRA FREITAS": [
    "CONSULTA EM REABILITACAO INTELECTUAL / AUTISMO"
  ],
  "DANIEL MEDLIG DE SOUSA CRAVO": [
    "CONSULTA EM REABILITACAO VISUAL I"
  ],
  "IGOR MEDEIROS DOS SANTOS": [
    "AVALIACAO PACIENTE OSTOMIZADO",
    "CONSULTA EM REABILITACAO FISICA"
  ],
  "JOSYANE BORGES DA SILVA GONCALVES": [
    "BERA",
    "CONSULTA EM REABILITACAO AUDITIVA I - RETORNO",
    "CONSULTA EM REABILITACAO INTELECTUAL / AUTISMO - RETORNO",
    "GRUPO - FONOAUDIOLOGIA II",
    "REABILITACAO EM PESSOA COM DEFICIENCIA AUDITIVA"
  ],
  "LEONARDO MACHADO XAVIER DE OLIVEIRA": [
    "BERA",
    "CONSULTA EM REABILITACAO INTELECTUAL / AUTISMO",
    "CONSULTA EM REABILITACAO INTELECTUAL / AUTISMO - RETORNO"
  ]
};

const TIME_OPTIONS = ["8h", "13:30h", "14h"];

const ScheduleForm: React.FC<ScheduleFormProps> = ({ formData, setFormData, onAdd, selectedCount }) => {
  const [addedDoctors, setAddedDoctors] = useState<string[]>([]);
  const [addedSpecialties, setAddedSpecialties] = useState<string[]>([]);
  
  const [isAddingDoctor, setIsAddingDoctor] = useState(false);
  const [newDoctorName, setNewDoctorName] = useState("");
  
  const [isAddingSpecialty, setIsAddingSpecialty] = useState(false);
  const [newSpecialtyName, setNewSpecialtyName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: e.target.type === 'number' ? Number(value) : value
      };
      
      // If doctor changes, clear specialty if it's not valid for the new doctor (and no custom ones are set)
      if (name === 'doctorName' && DOCTORS_DATA[value] && DOCTORS_DATA[value].length === 1) {
         newData.specialty = DOCTORS_DATA[value][0];
      }

      return newData;
    });
  };

  const handleTimeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !formData.times.includes(value)) {
      setFormData(prev => ({
        ...prev,
        times: [...prev.times, value].sort()
      }));
    }
    e.target.value = "";
  };

  const removeTime = (timeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter(t => t !== timeToRemove)
    }));
  };

  // Logic to add new Doctor
  const handleSaveNewDoctor = () => {
    if (newDoctorName.trim()) {
      const nameUpper = newDoctorName.toUpperCase();
      if (!DOCTORS_DATA[nameUpper] && !addedDoctors.includes(nameUpper)) {
        setAddedDoctors(prev => [...prev, nameUpper]);
        setFormData(prev => ({ ...prev, doctorName: nameUpper }));
      }
      setNewDoctorName("");
      setIsAddingDoctor(false);
    }
  };

  // Logic to add new Specialty
  const handleSaveNewSpecialty = () => {
    if (newSpecialtyName.trim()) {
      const specUpper = newSpecialtyName.toUpperCase();
      setAddedSpecialties(prev => [...prev, specUpper]);
      setFormData(prev => ({ ...prev, specialty: specUpper }));
      setNewSpecialtyName("");
      setIsAddingSpecialty(false);
    }
  };

  const doctorNames = useMemo(() => {
    const defaultDocs = Object.keys(DOCTORS_DATA);
    return [...defaultDocs, ...addedDoctors].sort();
  }, [addedDoctors]);

  const availableSpecialties = useMemo(() => {
    let list: string[];
    
    // If doctor is in default data, get their specific list
    if (formData.doctorName && DOCTORS_DATA[formData.doctorName]) {
      list = [...DOCTORS_DATA[formData.doctorName]];
    } else {
      // If new doctor or no doctor, show all unique + added
      const all = new Set<string>();
      Object.values(DOCTORS_DATA).forEach(l => l.forEach(s => all.add(s)));
      list = Array.from(all);
    }

    // Always append manually added specialties so they are available for anyone
    return [...list, ...addedSpecialties].sort();
  }, [formData.doctorName, addedSpecialties]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2 flex items-center gap-2">
        <span className="w-2 h-6 bg-brand-blue rounded-full"></span>
        1. Dados do Atendimento
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Doctor Selection */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">Nome do Médico</label>
            <button 
              onClick={() => setIsAddingDoctor(!isAddingDoctor)}
              className="text-xs flex items-center gap-1 text-brand-blue hover:text-blue-800 font-medium transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              {isAddingDoctor ? 'Cancelar' : 'Novo Médico'}
            </button>
          </div>
          
          {isAddingDoctor ? (
            <div className="flex gap-2">
              <input 
                type="text"
                value={newDoctorName}
                onChange={(e) => setNewDoctorName(e.target.value)}
                placeholder="Digite o nome do novo médico..."
                className="w-full border border-blue-300 bg-blue-50 rounded-lg p-2 outline-none uppercase text-sm focus:ring-1 focus:ring-brand-blue"
                autoFocus
              />
              <button 
                onClick={handleSaveNewDoctor}
                className="bg-brand-blue hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <input 
              type="text"
              list="doctors-list"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleChange}
              placeholder="Selecione ou digite..."
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none uppercase transition-all"
              autoComplete="off"
            />
          )}
          <datalist id="doctors-list">
            {doctorNames.map(name => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        {/* Specialty */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-gray-700">Especialidade / Ambiente</label>
            <button 
              onClick={() => setIsAddingSpecialty(!isAddingSpecialty)}
              className="text-xs flex items-center gap-1 text-brand-blue hover:text-blue-800 font-medium transition-colors"
            >
              <FolderPlus className="w-3 h-3" />
              {isAddingSpecialty ? 'Cancelar' : 'Novo Ambiente'}
            </button>
          </div>

          {isAddingSpecialty ? (
            <div className="flex gap-2">
               <input 
                type="text"
                value={newSpecialtyName}
                onChange={(e) => setNewSpecialtyName(e.target.value)}
                placeholder="Digite o novo ambiente/procedimento..."
                className="w-full border border-blue-300 bg-blue-50 rounded-lg p-2 outline-none uppercase text-sm focus:ring-1 focus:ring-brand-blue"
                autoFocus
              />
              <button 
                onClick={handleSaveNewSpecialty}
                className="bg-brand-blue hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <input 
              type="text"
              list="specialties-list"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Selecione o Procedimento"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none uppercase transition-all"
              autoComplete="off"
            />
          )}
          <datalist id="specialties-list">
             {availableSpecialties.map(spec => (
               <option key={spec} value={spec} />
             ))}
          </datalist>
        </div>

        {/* Time Multi-Select */}
        <div className="space-y-1 md:col-span-2">
          <label className="text-sm font-bold text-black">Horário de Atendimento</label>
          
          <select
            onChange={handleTimeSelect}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none bg-white transition-all"
            defaultValue=""
          >
            <option value="" disabled>Selecione para adicionar horário...</option>
            {TIME_OPTIONS.map(time => (
              <option 
                key={time} 
                value={time} 
                disabled={formData.times.includes(time)}
                className={formData.times.includes(time) ? "text-gray-400" : "text-black"}
              >
                {time} {formData.times.includes(time) ? '(Selecionado)' : ''}
              </option>
            ))}
          </select>

          {/* Selected Times Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.times.map(time => (
              <span key={time} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-brand-blue border border-blue-100 shadow-sm">
                {time}
                <button
                  onClick={() => removeTime(time)}
                  className="ml-2 text-brand-blue hover:text-brand-red focus:outline-none transition-colors"
                  title="Remover horário"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {formData.times.length === 0 && (
              <span className="text-xs text-brand-red italic opacity-70">Nenhum horário selecionado</span>
            )}
          </div>
        </div>
      </div>

      {/* Quantities */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 block">Distribuição de Vagas</label>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-600">1ª Vez</label>
            <input 
              type="number"
              name="qtyFirst"
              value={formData.qtyFirst}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-300 rounded-lg p-2 text-center focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-600">Retorno</label>
            <input 
              type="number"
              name="qtyReturn"
              value={formData.qtyReturn}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-300 rounded-lg p-2 text-center focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-600">Egresso</label>
            <input 
              type="number"
              name="qtyEgress"
              value={formData.qtyEgress}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-300 rounded-lg p-2 text-center focus:ring-1 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        {/* Using brand-green for main action as implied by logo logic (growth/positive) */}
        <button
          onClick={onAdd}
          disabled={selectedCount === 0 || !formData.doctorName || formData.times.length === 0}
          className={`w-full flex items-center justify-center py-3 rounded-lg font-bold text-white transition-all
            ${selectedCount === 0 || !formData.doctorName || formData.times.length === 0
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-brand-green hover:bg-green-700 shadow-md hover:shadow-lg'}`}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Adicionar para {selectedCount} dia(s) selecionado(s)
        </button>
      </div>
    </div>
  );
};

export default ScheduleForm;