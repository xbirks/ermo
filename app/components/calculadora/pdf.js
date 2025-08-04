import { jsPDF } from 'jspdf';

const PROJECT_TYPE_LABELS = {
  restaurante: 'Web restaurante',
  agencias: 'Web para agencias',
  ecommerce: 'Ecommerce',
  otros: 'Otros',
};

const COMPLEJIDAD_LABELS = {
  basico: 'Básico',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

export function buildBudgetPDF({
  total,
  tipo,
  paginas,
  complejidad,
  accesibilidad,
  seoTec,
  seoCont,
  opRedaccion,
  opTraducciones,
  opImagenes,
  opFotografia,
  opUrgente,
  opRevisionExtra,
  opReunionesExtra,
  mantAnual,
  mantHoras,
  mantExternos,
}) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const m = 48;
  let y = 72;

  const p = (txt, size = 12, bold = false, color = [51, 51, 51]) => {
    doc.setTextColor(...color);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(txt, 495);
    doc.text(lines, m, y);
    y += lines.length * (size + 4);
  };

  const h = (txt) => {
    p(txt.toUpperCase(), 12, true, [120, 120, 120]);
    y += 2;
  };

  const s = () => {
    doc.setDrawColor(215, 215, 215);
    doc.line(m, y, 595 - m, y);
    y += 18;
  };

  p('RESUMEN DEL PROYECTO', 12, true, [120, 120, 120]);
  p(new Date().toLocaleDateString('es-ES'), 10, false, [153, 153, 153]);
  p(new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(total), 28, true, [63, 82, 255]);
  s();

  h('Tipo de proyecto');
  p(PROJECT_TYPE_LABELS[tipo]);

  h('Número de páginas');
  p(`${Math.max(1, Number(paginas) || 1)}`);

  h('Complejidad del diseño');
  p(COMPLEJIDAD_LABELS[complejidad]);

  h('Accesibilidad y calidad');
  p(accesibilidad === 'aa' ? 'Objetivo AA' : 'Incluido');

  const seoSel = [
    seoTec && 'Técnico extra (schema/CWV/redirects)',
    seoCont && 'Contenido y posicionamiento',
  ].filter(Boolean);
  h('SEO y rendimiento');
  p(seoSel.length ? seoSel.join(' · ') : 'Incluido');

  const opSel = [
    opRedaccion && 'Redacción de textos',
    opTraducciones && 'Traducciones',
    opImagenes && 'Imágenes/ilustraciones/íconos',
    opFotografia && 'Fotografía o vídeo',
    opUrgente && 'Entrega con urgencia',
    opRevisionExtra && 'Ronda de revisión extra',
    opReunionesExtra && 'Reuniones extra',
  ].filter(Boolean);
  h('Operativa, contenidos y recursos');
  p(opSel.length ? opSel.join(' · ') : 'Ninguno');

  const mantSel = [
    mantAnual && 'Anual',
    mantHoras && 'Por horas (10h)',
    mantExternos && 'Servicios externos',
  ].filter(Boolean);
  h('Mantenimiento');
  p(mantSel.length ? mantSel.join(' · ') : 'Ninguno');

  s();
  p(
    'Estimación orientativa. No incluye impuestos. Sujeta a validación del alcance.',
    10,
    false,
    [153, 153, 153]
  );

  return doc;
}

export default buildBudgetPDF;
