'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import StandardButton from '@/app/buttons/standard-button';
import "./calculadora.scss";
import { trackCalcInteraction, trackFirstCalcInteraction } from '@/app/lib/ga';


// --- fallback mínimos para evitar ReferenceError ---
const trackClickCall = (destino) => {
  try {
    // Si tienes GA4 cargado, registra el evento; si no, no pasa nada.
    window.gtag?.('event', 'contact_click', { destino });
  } catch {}
};

const trackCalcPDF = (total) => {
  try {
    window.gtag?.('event', 'calc_pdf_download', { value: total, currency: 'EUR' });
  } catch {}
};



/* ---------- Config ---------- */
const LS_KEY = 'calc-web-v1';

const PROJECT_TYPES = {
  corporativa:    { label: 'Web corporativa', base: 500 },
  portfolio:      { label: 'Portfolio personal o profesional', base: 450 },
  restaurante:    { label: 'Web restaurante', base: 400 },
  agencias:       { label: 'Web para agencias', base: 600 },
  ecommerce:      { label: 'Ecommerce', base: 700 },
  reservas:       { label: 'Web con sistema de reservas', base: 950 },
  landing:        { label: 'Landing page', base: 450 },
  otros:          { label: 'Otros', base: 700 },
};

const COMPLEJIDAD = { basico: 1.0, intermedio: 1.5, avanzado: 2.1 };
const ACCESIBILIDAD = { incluido: 1.0, aa: 1.3 };
const SEO_TEC = 1.1;
const SEO_CONT = 1.35;
const PRECIO_PAGINA_INTERNA = 70; // PP interno (oculto)
const URGENCIA_MULT = 1.45;        // multiplicador interno
const TAMANOS = { pequena: 1, mediana: 10, grande: 20 }; // nº de páginas aprox.
const TAMANO_LABEL = { pequena: 'Pequeño', mediana: 'Mediano', grande: 'Grande' };


// Costes internos (ajústalos cuando quieras)
const EXTRA_COSTS = {
  redaccion: 200,
  traducciones: 120,
  imagenes: 250,
  fotografia: 700,
  revisionExtra: 80,
  reunionesExtra: 60,
};
const MANT_COSTS = {
  anual: 300,
  bolsa10h: 350,
  externos: 120,
};

const fmt = (n) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

/* ---------- Bloque reutilizable: Título + descripción + toggles ---------- */
function SettingsBlock({ title, description, items, onToggle }) {
  return (
    <section className="calc-block">
      <div className="calc-block__grid">
        <div className="calc-block__text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <ul className="calc-block__services">
          {items.map((it) => (
            <li className="service" key={it.id}>
              {/* añade id para referenciarlo desde el input */}
              <span id={`lbl-${it.id}`} className="service__label">{it.label}</span>

              <label
                className={`switch ${it.checked ? 'is-on' : ''} ${it.disabled ? 'is-disabled' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={!!it.checked}
                  disabled={!!it.disabled}
                  onChange={(e) => onToggle && onToggle(it.id, e.target.checked)}
                  /* === accesibilidad === */
                  aria-labelledby={`lbl-${it.id}`}   // usa el texto de la izquierda como nombre
                  role="switch"                      // opcional: semántica de switch
                  aria-checked={!!it.checked}        // opcional: estado para AT
                />
                <span className="slider" aria-hidden="true" />
              </label>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Calculadora ---------- */

/* ---------- Componente reutilizable: RESUMEN PRECIOS ---------- */
function SummaryBox({ total, onDownloadPDF }) {
  return (
    <div className="box">
      <div className="box__resumen"><h4>Resumen del<br></br>proyecto</h4>
      <div className="total">{fmt(total)}</div></div>

      <div className="cta">
        <StandardButton
          link="#precio"
          title="Descargar PDF"
          style="mt-m"
          bg="#DC4946"
          color="white"
          borderColor="transparent"
          hoverBg="#3F52FF"
          hoverColor="white"
          hoverBorderColor=""
              onClick={(e) => {
                e.preventDefault();
                trackCalcPDF(total);   // 👈 envía evento GA4
                onDownloadPDF();       // sigue generando el PDF
              }}
        />

        <span id="contacto_calc">
          <StandardButton
            link="#contacto"
            title="Contactar"
            style=""
            bg="#B3B3B3"
            color="white"
            borderColor="transparent"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#0E1C9D"
            onClick={() => trackClickCall("contacto")}
          />
        </span>

        <p className="precios_disclaimer">
          Precios orientativos. Si quieres un presupuesto cerrado ponte en contacto. Precios sin IVA.
        </p>
      </div>
    </div>
  );
}



export default function CalculadoraWeb() {
  // Estado visible
  const [tipo, setTipo] = useState('restaurante');
  const [tamano, setTamano] = useState('pequena');
  const [complejidad, setComplejidad] = useState('basico');

  const sectionRef = useRef(null);
  const bottomRef = useRef(null);
  const [showSummary, setShowSummary] = useState(false);
  const [atBottom, setAtBottom] = useState(false);


  // Estado de bloques
  const [accesibilidad, setAccesibilidad] = useState('incluido'); // 'incluido' | 'aa'
  const [seoTec, setSeoTec] = useState(false);
  const [seoCont, setSeoCont] = useState(false);

  // Operativa / recursos
  const [opRedaccion, setOpRedaccion] = useState(false);
  const [opTraducciones, setOpTraducciones] = useState(false);
  const [opImagenes, setOpImagenes] = useState(false);
  const [opFotografia, setOpFotografia] = useState(false);
  const [opUrgente, setOpUrgente] = useState(false);
  const [opRevisionExtra, setOpRevisionExtra] = useState(false);
  const [opReunionesExtra, setOpReunionesExtra] = useState(false);

  // Mantenimiento
  const [mantAnual, setMantAnual] = useState(false);
  const [mantHoras, setMantHoras] = useState(false);
  const [mantExternos, setMantExternos] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSummary(entry.isIntersecting)
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  useEffect(() => {
    const node = bottomRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      const { top } = entry.boundingClientRect;
      setAtBottom(top <= window.innerHeight);
    });
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  useEffect(() => {
    const node = bottomRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setAtBottom(entry.isIntersecting)
    );
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);


  // Cargar estado
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.tipo) setTipo(s.tipo);
      if (s.tamano) {
        setTamano(s.tamano);
      } else if (typeof s.paginas === 'number') {
        const p = s.paginas;
        setTamano(p <= 3 ? 'pequena' : p <= 7 ? 'mediana' : 'grande');
      }

      if (s.complejidad) setComplejidad(s.complejidad);
      if (s.accesibilidad) setAccesibilidad(s.accesibilidad);
      setSeoTec(!!s.seoTec);
      setSeoCont(!!s.seoCont);
      setOpRedaccion(!!s.opRedaccion);
      setOpTraducciones(!!s.opTraducciones);
      setOpImagenes(!!s.opImagenes);
      setOpFotografia(!!s.opFotografia);
      setOpUrgente(!!s.opUrgente);
      setOpRevisionExtra(!!s.opRevisionExtra);
      setOpReunionesExtra(!!s.opReunionesExtra);
      setMantAnual(!!s.mantAnual);
      setMantHoras(!!s.mantHoras);
      setMantExternos(!!s.mantExternos);
    } catch {}
  }, []);

// Guardar estado
useEffect(() => {
  const s = {
    tipo,
    tamano,
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
  };
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}, [
  tipo,
  tamano,
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
  mantExternos
]);


  // Cálculo en tiempo real
const total = useMemo(() => {
  const base = PROJECT_TYPES[tipo].base;

  const numPags = TAMANOS[tamano] || 1;
  const extraPages = Math.max(0, numPags - 1); // Home incluida
  const pagesCost = extraPages * PRECIO_PAGINA_INTERNA;

  const extrasOperativa =
    (opRedaccion ? EXTRA_COSTS.redaccion : 0) +
    (opTraducciones ? EXTRA_COSTS.traducciones : 0) +
    (opImagenes ? EXTRA_COSTS.imagenes : 0) +
    (opFotografia ? EXTRA_COSTS.fotografia : 0) +
    (opRevisionExtra ? EXTRA_COSTS.revisionExtra : 0) +
    (opReunionesExtra ? EXTRA_COSTS.reunionesExtra : 0);

  const multiplicador =
    (COMPLEJIDAD[complejidad] || 1) *
    (ACCESIBILIDAD[accesibilidad] || 1) *
    (seoTec ? SEO_TEC : 1) *
    (seoCont ? SEO_CONT : 1) *
    (opUrgente ? URGENCIA_MULT : 1);

  const mantenimiento =
    (mantAnual ? MANT_COSTS.anual : 0) +
    (mantHoras ? MANT_COSTS.bolsa10h : 0) +
    (mantExternos ? MANT_COSTS.externos : 0);

  return Math.round(((base + pagesCost + extrasOperativa) * multiplicador + mantenimiento) * 100) / 100;
}, [
  tipo, tamano, complejidad, accesibilidad, seoTec, seoCont,
  opRedaccion, opTraducciones, opImagenes, opFotografia, opUrgente, opRevisionExtra, opReunionesExtra,
  mantAnual, mantHoras, mantExternos
]);





// DISCORD Envia un ping solo una vez por sesión (por pestaña)
function notifyFirstCalcInteraction(source, total) {
  try {
    if (sessionStorage.getItem('calcPingSent')) return;
    sessionStorage.setItem('calcPingSent', '1');

    const payload = { t: Date.now(), source, total };

    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/calc-interaction', blob);
    } else {
      fetch('/api/calc-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }

    // Opcional: GA4
    window.gtag?.('event', 'calc_interaction', {
      interaction: source,
      value: total,
      currency: 'EUR',
    });
  } catch {}
}




  // --- PDF ---
async function loadPngWithSize(path) {
  const res = await fetch(path, { cache: 'no-cache' });
  const blob = await res.blob();
  const dataURL = await new Promise((resolve) => {
    const r = new FileReader();
    r.onloadend = () => resolve(r.result);
    r.readAsDataURL(blob);
  });
  const img = await new Promise((resolve) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.src = dataURL;
  });
  return { dataURL, naturalW: img.naturalWidth, naturalH: img.naturalHeight };
}

/* ---------- PDF ---------- */
const handleDownloadPDF = async () => {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true, precision: 12 });

  const m = 48;
  let y = 72;
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const colW  = pageW - m * 2;
  const fmt = (n) => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);

  // helpers de texto
  doc.setLineHeightFactor(1.35);
  const p = (txt, size = 12, bold = false, color = [51,51,51]) => {
    doc.setTextColor(...color);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(txt, colW);
    doc.text(lines, m, y);
    y += lines.length * (size * 1.35);
  };
  const h  = (txt) => { p(txt.toUpperCase(), 12, true, [120,120,120]); y += 2; };
  const hr = () => { doc.setDrawColor(215,215,215); doc.line(m, y, pageW - m, y); y += 18; };

  /* --------- HEADER: logo + título/fecha + precio derecha --------- */
  // Cambia la ruta del logo si procede
  const { dataURL, naturalW, naturalH } = await loadPngWithSize('/assets/01_ERMO_MARCA.jpg');

  const logoX = m, logoY = 20, logoW = 120;
  const logoH = logoW * (naturalH / naturalW);
  doc.addImage(dataURL, 'PNG', logoX, logoY, logoW, logoH);

  const headerBottom = logoY + logoH;
  const gap = 18;
  const yHeader = headerBottom + gap;

  // Título + fecha (izquierda)
  doc.setFont('helvetica', 'bold');  doc.setFontSize(12); doc.setTextColor(120,120,120);
  doc.text('RESUMEN DEL PROYECTO', m, yHeader);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(153,153,153);
  doc.text(new Date().toLocaleDateString('es-ES'), m, yHeader + 16);

  // Precio (derecha)
  const rightX = pageW - m;
  doc.setFont('helvetica', 'bold'); doc.setFontSize(28); doc.setTextColor(63,82,255);
  doc.text(fmt(total), rightX, yHeader, { align: 'right', baseline: 'alphabetic' });

  // Cursor global para el cuerpo
  y = yHeader + 32;
  hr();

  /* ------------------ CUERPO ------------------ */
  h('TIPO DE PROYECTO');          p(PROJECT_TYPES[tipo].label);

  const numPags = TAMANOS[tamano] || 1;
  h('NÚMERO DE PÁGINAS');         p(String(numPags));

  h('COMPLEJIDAD DEL DISEÑO');    p({ basico:'Básico', intermedio:'Intermedio', avanzado:'Avanzado' }[complejidad]);

  h('ACCESIBILIDAD Y CALIDAD');   p(accesibilidad === 'aa' ? 'Objetivo AA' : 'Incluido');

  const seoSel = [
    'Incluido',
    seoTec  && 'Avanzado y estándares Google',
    seoCont && 'Optimización de contenidos',
  ].filter(Boolean).join(' · ');
  h('SEO Y RENDIMIENTO');         p(seoSel || 'Incluido');

  const opSel = [
    opRedaccion      && 'Redacción de textos',
    opTraducciones   && 'Traducciones',
    opImagenes       && 'Imágenes/ilustraciones/íconos',
    opFotografia     && 'Fotografía o vídeo',
    opRevisionExtra  && 'Ronda de revisión extra',
    opReunionesExtra && 'Reuniones extra',
    opUrgente        && 'Entrega con urgencia',
  ].filter(Boolean).join(' · ') || 'Ninguno';
  h('CONTENIDOS Y RECURSOS');     p(opSel);

  const mantSel = [
    mantAnual && 'Anual',
    mantHoras && 'Por horas (10h)',
    mantExternos && 'Servicios externos',
  ].filter(Boolean).join(' · ') || 'Ninguno';
  h('MANTENIMIENTO');             p(mantSel);

  hr();
  p('Estimación orientativa. No incluye impuestos. Sujeta a validación del alcance.', 10, false, [153,153,153]);

  // Footer
  doc.setFontSize(10); doc.setTextColor(120,120,120);
  doc.text('ERMO Estudio de diseño · hola@soyandres.es · 675 392 216 · ermo.es', m, pageH - 30);

  doc.save('presupuesto-web.pdf');
};




  return (
    <section ref={sectionRef} className="calculadora__master calc-grid">
      {/* Columna izquierda */}
      <div className="calc-form">
        {/* TIPO DE PROYECTO */}
        <section className="calc-block">
          <div className="calc-block__grid">
            <div className="calc-block__text">
              <h3>TIPO DE PROYECTO</h3>
              <p>Selecciona el tipo de proyecto para estimar el alcance inicial.</p>
            </div>
            
            <div className="calc-block__services">
              <div className="tipo">
                <span className="service__label" aria-hidden="true"></span>

                {/* Label accesible pero oculto visualmente */}
                <label htmlFor="tipo-proyecto" className="visually-hidden">
                  Tipo de proyecto
                </label>

                <select
                  id="tipo-proyecto"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                >
                  {Object.entries(PROJECT_TYPES).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <div className="intro-landing__line"></div>

        {/* TAMAÑO DEL SITIO */}
        <section className="calc-block">
          <div className="calc-block__grid">
            <div className="calc-block__text">
              <h3>TAMAÑO DEL SITIO</h3>
              <p>Elige un tamaño aproximado. Siempre podremos ajustar después en la propuesta cerrada. <br></br><br></br>/Pequeño: 1-5 pág. <br></br>/Mediano: 5-10 pág. <br></br>/Grande: +10 pág.</p>
            </div>
            <div className="calc-block__services">
              <div className="service">
                <span className="service__label" aria-hidden="true"></span>
                <div className="chips">
                  {['pequena','mediana','grande'].map((k) => (
                    <button
                      key={k}
                      className={`chip ${tamano === k ? 'active' : ''}`}
                      onClick={() => {
                        setTamano(k);
                        trackCalcInteraction('tamano', k, total);
                        notifyFirstCalcInteraction('tamano', total); // <-- ping a /api/calc-interaction (una vez por pestaña)
                        // trackFirstCalcInteraction('tamano', k, total);
                      }}
                      type="button"
                    >
                      {k === 'pequena' ? 'PEQUEÑO' : k === 'mediana' ? 'MEDIANO' : 'GRANDE'}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* COMPLEJIDAD DEL DISEÑO */}
        <section className="calc-block">
          <div className="calc-block__grid">
            <div className="calc-block__text">
              <h3>COMPLEJIDAD DEL DISEÑO</h3>
              <p>¿Qué tienes en mente? ¿Un diseño espectacular o algo más sencillito?</p>
            </div>
            <div className="calc-block__services">
              <div className="service">
                <span className="service__label" aria-hidden="true"></span>
                <div className="chips">
                  {['basico', 'intermedio', 'avanzado'].map((k) => (
                    <button
                      key={k}
                      className={`chip ${complejidad === k ? 'active' : ''}`}
                      onClick={() => setComplejidad(k)}
                      type="button"
                    >
                      {k === 'basico' ? 'BÁSICO' : k === 'intermedio' ? 'INTERMEDIO' : 'AVANZADO'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


                {/* OPERATIVA, CONTENIDOS Y RECURSOS */}
        <SettingsBlock
          title="CONTENIDOS Y RECURSOS"
          description="Selecciona el apoyo que necesites para crear y preparar todo el contenido de la web. Tener contenido bien hecho ayuda a que tu web sea más atractiva, clara y convincente para tus clientes."
          items={[
            { id: 'op_redaccion',   label: 'REDACCIÓN DE TEXTOS',                  checked: opRedaccion },
            { id: 'op_traducciones',label: 'TRADUCCIONES',                          checked: opTraducciones },
            { id: 'op_imagenes',    label: 'IMÁGENES, ILUSTRACIONES O ICONOS',     checked: opImagenes },
            { id: 'op_foto',        label: 'FOTOGRAFÍA O VIDEO',                   checked: opFotografia },

           
          ]}
          onToggle={(id, next) => {
            if (id === 'op_redaccion') setOpRedaccion(next);
            if (id === 'op_traducciones') setOpTraducciones(next);
            if (id === 'op_imagenes') setOpImagenes(next);
            if (id === 'op_foto') setOpFotografia(next);


          }}
        />




        {/* ACCESIBILIDAD Y CALIDAD (exclusivo) */}
        <SettingsBlock
          title="ACCESIBILIDAD Y CALIDAD"
          description="¿Quieres que tu web pueda ser utilizada por cualquier persona, incluso con limitaciones visuales, auditivas o de movilidad? La opción AA garantiza un nivel avanzado de accesibilidad para que todos tus usuarios puedan navegar sin barreras."
          items={[
            { id: 'acc_incluido', label: 'INCLUIDO',  checked: accesibilidad === 'incluido' },
            { id: 'acc_aa',       label: 'OBJETIVO AA', checked: accesibilidad === 'aa' },
          ]}
          onToggle={(id, next) => {
            if (!next) return; 
            setAccesibilidad(id === 'acc_aa' ? 'aa' : 'incluido');
          }}
        />

        {/* SEO Y RENDIMIENTO (múltiple) */}
        <SettingsBlock
          title="SEO (APARECER EN GOOGLE)"
          description="Opciones para que tu web aparezca mejor posicionada en Google y cargue más rápido. Esto ayuda a que más personas te encuentren y a que la experiencia de navegación sea fluida."
          items={[
            { id: 'seoIncluido', label: 'INCLUIDO', checked: true, disabled: true },
            { id: 'seoTec',      label: 'AVANZADO Y ESTANDARES GOOGLE', checked: seoTec },
            { id: 'seoCont',     label: 'OPTIMIZACIÓN DE CONTENIDOS',      checked: seoCont },
          ]}
          onToggle={(id, next) => {
            if (id === 'seoTec') setSeoTec(next);
            if (id === 'seoCont') setSeoCont(next);
          }}
        />


        {/* MANTENIMIENTO */}
        <SettingsBlock
          title="MANTENIMIENTO Y OPERATIVA"
          description="Puedes evitar muchos líos y dolores de cabeza contratando un mantenimiento para tu proyecto. Así tendrás cubierto cualquier error que pueda suceder."
          items={[
            { id: 'mant_anual',  label: 'MANT. ANUAL',             checked: mantAnual },
            { id: 'mant_horas',  label: 'POR HORAS (10h)',   checked: mantHoras },
            { id: 'mant_ext',    label: 'SERVICIOS EXTERNOS',checked: mantExternos },
            //  { id: 'op_revision',    label: 'RONDA DE REVISIÓN EXTRA',              checked: opRevisionExtra },
            // { id: 'op_reuniones',   label: 'REUNIONES EXTRA',                      checked: opReunionesExtra },
            { id: 'op_urgente',     label: 'ENTREGA CON URGENCIA',                 checked: opUrgente },
          ]}
          onToggle={(id, next) => {
            if (id === 'mant_anual') setMantAnual(next);
            if (id === 'mant_horas') setMantHoras(next);
            if (id === 'mant_ext') setMantExternos(next);
                        if (id === 'op_revision') setOpRevisionExtra(next);
            if (id === 'op_reuniones') setOpReunionesExtra(next);
                        if (id === 'op_urgente') setOpUrgente(next);
          }}
        />

        <div ref={bottomRef} style={{ height: 1 }}></div>

        {/* Banner final solo móvil */}
        <div className="calc-summary calc-summary--mobileEnd">
          <SummaryBox total={total} onDownloadPDF={handleDownloadPDF} />
        </div>


      </div>

      {/* Columna derecha (sticky) */}
       <aside className={`calc-summary ${showSummary ? 'is-visible' : ''} ${atBottom ? 'is-bottom' : ''}`}> <SummaryBox total={total} onDownloadPDF={handleDownloadPDF} /></aside>
  
    </section>
    
  );
}
