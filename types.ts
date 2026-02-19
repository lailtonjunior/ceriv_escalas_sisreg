export interface ScheduleEntry {
  id: string;
  doctorName: string;
  specialty: string;
  date: Date;
  time: string;
  qtyFirst: number;
  qtyReturn: number;
  qtyEgress: number;
}

export interface HeaderData {
  unitName: string;
  referenceMonth: string;
}

export interface FormData {
  doctorName: string;
  specialty: string;
  times: string[]; // Changed to array for multiple selection
  qtyFirst: number;
  qtyReturn: number;
  qtyEgress: number;
}
