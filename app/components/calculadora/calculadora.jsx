'use client';
import { useEffect, useMemo, useState } from 'react';
import "./calculadora.scss";

/* ---------- Config ---------- */
const LS_KEY = 'calc-web-v1';
const PROJECT_TYPES = {
  restaurante: { label: 'Web restaurante', base: 400 },
  agencias:    { label: 'Web para agencias', base: 600 },
  ecommerce:   { label: 'Ecommerce',        base: 700 },
  otros:       { label: 'Otros',            base: 500 },
};
const COMPLEJIDAD = { basico: 1.0, intermedio: 1.5, avanzado: 2.2 };
const ACCESIBILIDAD = { incluido: 1.0, aa: 1.3 };
const SEO_TEC = 1.15;
const SEO_CONT = 1.35;
const PRECIO_PAGINA_INTERNA = 120; // PP interno (oculto)
const URGENCIA_MULT = 1.25;        // multiplicador interno

// Costes internos (ajústalos cuando quieras)
const EXTRA_COSTS = {
  redaccion: 300,
  traducciones: 200,
  imagenes: 250,
  fotografia: 500,
  revisionExtra: 120,
  reunionesExtra: 80,
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
              <span className="service__label">{it.label}</span>
              <label
                className={`switch ${it.checked ? 'is-on' : ''} ${it.disabled ? 'is-disabled' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={!!it.checked}
                  disabled={!!it.disabled}
                  onChange={(e) => onToggle && onToggle(it.id, e.target.checked)}
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
export default function CalculadoraWeb() {
  // Estado visible
  const [tipo, setTipo] = useState('restaurante');
  const [paginas, setPaginas] = useState(1);
  const [complejidad, setComplejidad] = useState('basico');

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

  // Cargar estado
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.tipo) setTipo(s.tipo);
      if (typeof s.paginas === 'number') setPaginas(s.paginas);
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
      tipo, paginas, complejidad, accesibilidad, seoTec, seoCont,
      opRedaccion, opTraducciones, opImagenes, opFotografia, opUrgente, opRevisionExtra, opReunionesExtra,
      mantAnual, mantHoras, mantExternos
    };
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  }, [
    tipo, paginas, complejidad, accesibilidad, seoTec, seoCont,
    opRedaccion, opTraducciones, opImagenes, opFotografia, opUrgente, opRevisionExtra, opReunionesExtra,
    mantAnual, mantHoras, mantExternos
  ]);

  // Cálculo en tiempo real
  const total = useMemo(() => {
    const base = PROJECT_TYPES[tipo].base;
    const numPags = Math.max(1, Number(paginas) || 1);
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
    tipo, paginas, complejidad, accesibilidad, seoTec, seoCont,
    opRedaccion, opTraducciones, opImagenes, opFotografia, opUrgente, opRevisionExtra, opReunionesExtra,
    mantAnual, mantHoras, mantExternos
  ]);



  // --- PDF ---
  const handleDownloadPDF = async () => {
    const { buildBudgetPDF } = await import('./pdf');
    const doc = buildBudgetPDF({
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
    });
    doc.save('presupuesto-web.pdf');
  };







  return (
    <section className="calc-grid">
      {/* Columna izquierda */}
      <div className="calc-form">
        {/* TIPO DE PROYECTO */}
        <section className="calc-block">
          <div className="calc-block__grid">
            <div className="calc-block__text">

              <h3>TIPO DE PROYECTO</h3>
              <p>Selecciona el tipo de proyecto para estimar el alcance inicial.</p>

            </div>
            
            <div className="calc-block__services" >
              <div className="tipo">
                <span className="service__label" aria-hidden="true"></span>
                <select  value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  {Object.entries(PROJECT_TYPES).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <div className="intro-landing__line"></div>

        {/* NÚMERO DE PÁGINAS */}
        <section className="calc-block__paginas">
          <div className="calc-block__grid">
            <div className="calc-block__text">
              <h3>NÚMERO DE PÁGINAS</h3>
              <p>Añade un número de páginas estimadas que creas que vas a necesitar para tu proyecto.</p>
            </div>
            <div className="calc-block__services">
              <div className="paginas">
                <span className="service__label" aria-hidden="true"></span>
                <input
                  type="number"
                  min={1}
                  value={paginas}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setPaginas(Number.isNaN(v) ? 1 : Math.max(1, v));
                  }}
                />
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

        {/* ACCESIBILIDAD Y CALIDAD (exclusivo) */}
        <SettingsBlock
          title="ACCESIBILIDAD Y CALIDAD"
          description="¿Tu público objetivo tiene necesidades especiales y quieres estar cubierto? Selecciona accesibilidad AA y trataremos el proyecto con un enfoque diferente."
          items={[
            { id: 'acc_incluido', label: 'INCLUIDO',  checked: accesibilidad === 'incluido' },
            { id: 'acc_aa',       label: 'OBJETIVO AA', checked: accesibilidad === 'aa' },
          ]}
          onToggle={(id, next) => {
            if (!next) return; // mantener siempre una opción activa
            setAccesibilidad(id === 'acc_aa' ? 'aa' : 'incluido');
          }}
        />

        {/* SEO Y RENDIMIENTO (múltiple) */}
        <SettingsBlock
          title="SEO Y RENDIMIENTO"
          description="Opciones para reforzar el posicionamiento y la calidad técnica del proyecto."
          items={[
            { id: 'seoIncluido', label: 'INCLUIDO', checked: true, disabled: true },
            { id: 'seoTec',      label: 'SCHEMA, DATOS ESTRUCTURADOS, CORE WEB VITALS', checked: seoTec },
            { id: 'seoCont',     label: 'CONTENIDO Y POSICIONAMIENTO DE PRODUCTO',      checked: seoCont },
          ]}
          onToggle={(id, next) => {
            if (id === 'seoTec') setSeoTec(next);
            if (id === 'seoCont') setSeoCont(next);
          }}
        />

        {/* OPERATIVA, CONTENIDOS Y RECURSOS */}
        <SettingsBlock
          title="OPERATIVA, CONTENIDOS Y RECURSOS"
          description="Selecciona los apoyos y recursos necesarios para producción y coordinación."
          items={[
            { id: 'op_redaccion',   label: 'REDACCIÓN DE TEXTOS',                  checked: opRedaccion },
            { id: 'op_traducciones',label: 'TRADUCCIONES',                          checked: opTraducciones },
            { id: 'op_imagenes',    label: 'IMÁGENES, ILUSTRACIONES O ICONOS',     checked: opImagenes },
            { id: 'op_foto',        label: 'FOTOGRAFÍA O VIDEO',                   checked: opFotografia },
            { id: 'op_urgente',     label: 'ENTREGA CON URGENCIA',                 checked: opUrgente },
            { id: 'op_revision',    label: 'RONDA DE REVISIÓN EXTRA',              checked: opRevisionExtra },
            { id: 'op_reuniones',   label: 'REUNIONES EXTRA',                      checked: opReunionesExtra },
          ]}
          onToggle={(id, next) => {
            if (id === 'op_redaccion') setOpRedaccion(next);
            if (id === 'op_traducciones') setOpTraducciones(next);
            if (id === 'op_imagenes') setOpImagenes(next);
            if (id === 'op_foto') setOpFotografia(next);
            if (id === 'op_urgente') setOpUrgente(next);
            if (id === 'op_revision') setOpRevisionExtra(next);
            if (id === 'op_reuniones') setOpReunionesExtra(next);
          }}
        />

        {/* MANTENIMIENTO */}
        <SettingsBlock
          title="MANTENIMIENTO"
          description="Puedes evitar muchos líos y dolores de cabeza contratando un mantenimiento para tu proyecto. Así tendrás cubierto cualquier error que pueda suceder."
          items={[
            { id: 'mant_anual',  label: 'ANUAL',             checked: mantAnual },
            { id: 'mant_horas',  label: 'POR HORAS (10h)',   checked: mantHoras },
            { id: 'mant_ext',    label: 'SERVICIOS EXTERNOS',checked: mantExternos },
          ]}
          onToggle={(id, next) => {
            if (id === 'mant_anual') setMantAnual(next);
            if (id === 'mant_horas') setMantHoras(next);
            if (id === 'mant_ext') setMantExternos(next);
          }}
        />
        
      </div>

      {/* Columna derecha (sticky) */}
      <aside className="calc-summary">
        <div className="box">
          <h4>Precio estimado</h4>
          <div className="total">{fmt(total)}</div>

          <div className="cta">
            <button className="btn danger" type="button" onClick={handleDownloadPDF}>Descargar en PDF</button>
            <a className="btn ghost" href="#contacto">Contactar</a>
          </div>
        </div>
      </aside>
    </section>
    
  );
}
