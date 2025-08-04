'use client';
import { useEffect, useMemo, useState } from 'react';

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
const PRECIO_PAGINA_INTERNA = 250; // PP interno (oculto)

const fmt = (n) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
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
              <label className={`switch ${it.checked ? 'is-on' : ''} ${it.disabled ? 'is-disabled' : ''}`}>
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
    } catch {}
  }, []);

  // Guardar estado
  useEffect(() => {
    const s = { tipo, paginas, complejidad, accesibilidad, seoTec, seoCont };
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  }, [tipo, paginas, complejidad, accesibilidad, seoTec, seoCont]);

  // Cálculo en tiempo real
  const total = useMemo(() => {
    const base = PROJECT_TYPES[tipo].base;
    const numPags = Math.max(1, Number(paginas) || 1);
    const extraPages = Math.max(0, numPags - 1); // Home incluida
    const pagesCost = extraPages * PRECIO_PAGINA_INTERNA;

    const multiplicador =
      (COMPLEJIDAD[complejidad] || 1) *
      (ACCESIBILIDAD[accesibilidad] || 1) *
      (seoTec ? SEO_TEC : 1) *
      (seoCont ? SEO_CONT : 1);

    return Math.round((base + pagesCost) * multiplicador * 100) / 100;
  }, [tipo, paginas, complejidad, accesibilidad, seoTec, seoCont]);

  return (
    <section className="calc-grid">
      {/* Columna izquierda */}
      <div className="calc-form">
        <div className="field">
          <label htmlFor="tipo">Tipo de proyecto</label>
          <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {Object.entries(PROJECT_TYPES).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>

        <hr />

        <div className="field row">
          <label htmlFor="paginas">Número de páginas</label>
          <input
            id="paginas"
            type="number"
            min={1}
            value={paginas}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              setPaginas(Number.isNaN(v) ? 1 : Math.max(1, v));
            }}
          />
        </div>

        <hr />

        {/* Complejidad como chips (sin mostrar multiplicadores) */}
        <div className="field">
          <label>Complejidad del diseño</label>
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

        {/* Accesibilidad en bloque (exclusivo) */}
        <SettingsBlock
          title="ACCESIBILIDAD Y CALIDAD"
          description="¿Tu público objetivo tiene necesidades especiales? Selecciona objetivo AA y abordaremos el proyecto con un enfoque específico."
          items={[
            { id: 'acc_incluido', label: 'INCLUIDO',  checked: accesibilidad === 'incluido' },
            { id: 'acc_aa',       label: 'OBJETIVO AA', checked: accesibilidad === 'aa' },
          ]}
          onToggle={(id, next) => {
            if (!next) return; // mantener siempre una opción activa
            setAccesibilidad(id === 'acc_aa' ? 'aa' : 'incluido');
          }}
        />

        {/* SEO y rendimiento (múltiple) */}
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
      </div>

      {/* Columna derecha (sticky) */}
      <aside className="calc-summary">
        <div className="box">
          <h4>Precio estimado</h4>
          <div className="total">{fmt(total)}</div>

          <div className="cta">
            <button className="btn danger" type="button">Descargar en PDF</button>
            <a className="btn ghost" href="#contacto">Contactar</a>
          </div>
        </div>
      </aside>
    </section>
  );
}
