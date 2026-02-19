import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  addMonths, 
  subMonths,
  getDay,
  isWithinInterval,
  min,
  max
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDates: Date[];
  onToggleDate: (date: Date) => void;
  onSelectRange: (dates: Date[]) => void;
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ 
  selectedDates, 
  onToggleDate, 
  onSelectRange, 
  currentMonth, 
  onMonthChange 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);
  const [dragEnd, setDragEnd] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  
  // Generate all days in the month
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fill in empty slots for start of week (Sunday is 0)
  const startDayOfWeek = getDay(monthStart); 
  const emptySlots = Array(startDayOfWeek).fill(null);

  // Check if date is permanently selected
  const isSelected = (date: Date) => {
    return selectedDates.some(d => isSameDay(d, date));
  };

  // Check if date is currently in the drag range
  const isInDragRange = (date: Date) => {
    if (!isDragging || !dragStart || !dragEnd) return false;
    const start = min([dragStart, dragEnd]);
    const end = max([dragStart, dragEnd]);
    return isWithinInterval(date, { start, end });
  };

  const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));

  // --- Drag & Drop Handlers ---

  const handleMouseDown = (date: Date) => {
    setIsDragging(true);
    setDragStart(date);
    setDragEnd(date);
  };

  const handleMouseEnter = (date: Date) => {
    if (isDragging) {
      setDragEnd(date);
    }
  };

  const handleMouseUp = (date: Date) => {
    if (!isDragging || !dragStart) return;

    // If start and end are the same day, treat as a toggle click
    if (isSameDay(dragStart, date)) {
      onToggleDate(date);
    } else {
      // If it's a range, generate the interval
      const start = min([dragStart, date]);
      const end = max([dragStart, date]);
      const range = eachDayOfInterval({ start, end });
      onSelectRange(range);
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  // Global mouse up to cancel drag if released outside calendar dates
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 select-none">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-brand-blue">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-800 capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h3>
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-brand-blue">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 uppercase">
            {day}
          </div>
        ))}
      </div>

      <div 
        className="grid grid-cols-7 gap-1"
        onMouseLeave={() => {
           // Optional: clear drag if mouse leaves the grid entirely? 
        }}
      >
        {emptySlots.map((_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}
        {daysInMonth.map((day) => {
          const selected = isSelected(day);
          const inRange = isInDragRange(day);
          
          return (
            <div
              key={day.toISOString()}
              onMouseDown={(e) => { e.preventDefault(); handleMouseDown(day); }}
              onMouseEnter={() => handleMouseEnter(day)}
              onMouseUp={() => handleMouseUp(day)}
              className={`
                h-10 w-full rounded-md flex items-center justify-center text-sm font-medium transition-all duration-75 cursor-pointer
                ${selected 
                  ? 'bg-brand-blue text-white shadow-md' 
                  : inRange 
                    ? 'bg-blue-200 text-brand-blue' // Visual style for dragging range
                    : 'text-gray-700 hover:bg-blue-50 bg-gray-50'
                }
              `}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-3 text-center">
        Clique para selecionar um dia ou arraste para selecionar um período.
      </p>
    </div>
  );
};

export default Calendar;