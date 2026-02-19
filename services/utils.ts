import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDateFull = (date: Date): string => {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

export const getMonthYear = (date: Date): string => {
  const str = format(date, "MMMM/yyyy", { locale: ptBR });
  return str.toUpperCase();
};

export const getDayOfWeek = (date: Date): string => {
  const str = format(date, "EEEE", { locale: ptBR });
  return str.toUpperCase(); // SEGUNDA, TERÇA...
};

export const getDayOfMonth = (date: Date): string => {
  return format(date, "d", { locale: ptBR });
};
