import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ScheduleEntry, HeaderData } from '../types';
import { getDayOfWeek, getDayOfMonth } from './utils';

export const generatePDF = (entries: ScheduleEntry[], headerData: HeaderData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // --- HEADER DRAWING ---
  
  // Title Bar (Gray background)
  doc.setFillColor(200, 200, 200); // Light gray
  doc.rect(14, 10, 182, 8, 'F'); // x, y, w, h
  doc.setDrawColor(0); // Black border
  doc.rect(14, 10, 182, 8, 'S'); // Stroke

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("ESCALA AMBULATORIAL – REGULAÇÃO", 105, 15.5, { align: "center" });

  // Field: REFERENTE AO MÊS
  const row2Y = 24;
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("REFERENTE AO MÊS:", 14, row2Y + 4);
  
  // Box for Month
  doc.rect(55, row2Y, 60, 6);
  doc.text(headerData.referenceMonth.toUpperCase(), 85, row2Y + 4, { align: "center" });

  // Field: UNIDADE
  const row3Y = 33;
  doc.text("UNIDADE:", 14, row3Y + 4);
  
  // Box for Unit
  doc.rect(55, row3Y, 141, 6); // Extend to right margin
  doc.text(headerData.unitName.toUpperCase(), 57, row3Y + 4);

  // --- TABLE GENERATION ---

  // Sort entries by Date then Time
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.date.getTime() !== b.date.getTime()) {
      return a.date.getTime() - b.date.getTime();
    }
    return a.time.localeCompare(b.time);
  });

  const tableBody = sortedEntries.map(entry => [
    entry.doctorName.toUpperCase(),
    entry.specialty.toUpperCase(),
    getDayOfWeek(entry.date),
    getDayOfMonth(entry.date),
    entry.time.toLowerCase().includes('h') ? entry.time : `${entry.time}h`,
    entry.qtyFirst > 0 ? entry.qtyFirst.toString() : '',
    entry.qtyReturn > 0 ? entry.qtyReturn.toString() : '',
    entry.qtyEgress > 0 ? entry.qtyEgress.toString() : ''
  ]);

  autoTable(doc, {
    startY: 45,
    head: [[
      'NOME DO MÉDICO',
      'ESPECIALIDADE CONFORME CONFIG. SISREG',
      'DIA DA SEMANA',
      'DIA(S) DO MÊS',
      'HORA DO ATENDIMENTO',
      'QTDE 1ª VEZ',
      'QTDE RETORNO',
      'EGRESSO'
    ]],
    body: tableBody,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
      lineColor: [0, 0, 0], // Black borders
      lineWidth: 0.1,
      textColor: [0, 0, 0],
      font: 'helvetica',
      halign: 'center',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [200, 200, 200], // Gray header
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
      lineColor: [0, 0, 0]
    },
    columnStyles: {
      0: { cellWidth: 40, halign: 'center' }, // Nome
      1: { cellWidth: 40, halign: 'center' }, // Especialidade
      2: { cellWidth: 25 }, // Dia Semana
      3: { cellWidth: 15 }, // Dia Mes
      4: { cellWidth: 22 }, // Hora
      5: { cellWidth: 15 }, // Qtde 1
      6: { cellWidth: 15 }, // Qtde Retorno
      7: { cellWidth: 'auto' }  // Egresso
    },
    margin: { top: 45, left: 14, right: 14 },
  });

  doc.save(`Escala_${headerData.referenceMonth.replace('/', '_')}.pdf`);
};
