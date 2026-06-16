'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import StandardButton from '@/app/buttons/standard-button';
import './calculadora.scss';
import { trackCalcInteraction } from '@/app/lib/ga';

/* ---------- Config ---------- */
const LS_KEY = 'calc-web-v1';

const PROJECT_TYPES = {
  corporativa: { label: 'Web corporativa', base: 400 },
  portfolio: { label: 'Portfolio personal o profesional', base: 450 },
  restaurante: { label: 'Web restaurante', base: 400 },
  agencias: { label: 'Web para agencias', base: 600 },
  ecommerce: { label: 'Ecommerce', base: 700 },
  reservas: { label: 'Web con sistema de reservas', base: 950 },
  landing: { label: 'Landing page', base: 350 },
  otros: { label: 'Otros', base: 700 },
};

const COMPLEJIDAD = { basico: 1.0, intermedio: 1.5, avanzado: 2.1 };
const ACCESIBILIDAD = { incluido: 1.0, aa: 1.3 };
const SEO_TEC = 1.1;
const SEO_CONT = 1.35;
const PRECIO_PAGINA_INTERNA = 70;
const URGENCIA_MULT = 1.45;
const TAMANOS = { pequena: 1, mediana: 10, grande: 20 };

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

/* ---------- Opciones específicas RESTAURANTE (solo modo interno) ----------
   Precios provisionales orientados a España, nivel estudio (no WordPress
   cutre, no agencia internacional). Ajusta libremente los importes aquí.
   Agrupado en bloques para ir señalando opción por opción en reunión. */
const REST_BLOCKS = [
  {
    id: 'carta',
    title: 'CARTA / MENÚ',
    description: 'Todo lo relativo a mostrar la carta en la web.',
    items: [
      {
        id: 'rest_carta_basica',
        label: 'Carta digital (categorías, platos, precios, menú del día, alérgenos)',
        cost: 450,
        hint: 'Incluye menú del día y alérgenos/info nutricional. Carta estática gestionada por nosotros.',
      },
      { id: 'rest_fotos_plato', label: 'Foto por plato', cost: 150 },
      { id: 'rest_carta_multiidioma', label: 'Carta multiidioma', cost: 180 },
      {
        id: 'rest_carta_editable',
        label: 'Carta editable',
        cost: 450,
        hint: 'CMS headless: editan ellos platos, precios, alérgenos e imágenes sin tocarnos.',
      },
      { id: 'rest_qr_mesa', label: 'QR de mesa que abre la carta', cost: 50 },
    ],
  },
  {
    id: 'contenido',
    title: 'PÁGINAS DE CONTENIDO',
    description: 'Secciones típicas de restaurante para dar confianza.',
    items: [
      {
        id: 'rest_paginas_contenido',
        label: 'Nosotros / Historia / Dónde estamos + galería del local',
        cost: 250,
        hint: 'Páginas de marca: quiénes somos, historia, ubicación y galería de fotos del local.',
      },
    ],
  },
  {
    id: 'reservas',
    title: 'RESERVAS',
    description: 'Gestión de reservas de mesa.',
    items: [
      {
        id: 'rest_reserva_propia',
        label: 'Reserva de mesa propia (formulario, incl. grupos/eventos)',
        cost: 250,
        hint: 'Formulario a medida. Incluye campo de grupos/eventos privados (mismo form).',
      },
      {
        id: 'rest_reserva_integracion',
        label: 'Integración CoverManager / TheFork',
        cost: 0,
        hint: 'Gratis: básicamente pegar su embed/script. Lo incluimos sin coste.',
      },
    ],
  },
  {
    id: 'pedidos',
    title: 'PEDIDOS',
    description: 'Venta y pedidos online. Funcionalidad cara: estado, productos, emails.',
    items: [
      {
        id: 'rest_takeaway',
        label: 'Takeaway (carrito + recoger en local)',
        cost: 600,
        hint: 'Carrito, gestión de productos, confirmación. Base del sistema de pedidos.',
      },
      {
        id: 'rest_delivery',
        label: 'Reparto a domicilio (zonas + coste envío)',
        cost: 450,
        hint: 'Suma sobre takeaway: zonas de reparto, dirección, cálculo de envío.',
      },
      {
        id: 'rest_pago_online',
        label: 'Pago online real (Stripe / Redsys)',
        cost: 700,
        hint: 'Pasarela real, webhooks, confirmaciones. El cliente asume comisiones de pasarela.',
      },
    ],
  },
  {
    id: 'presencia',
    title: 'PRESENCIA / GOOGLE',
    description: 'Visibilidad local y mapas.',
    items: [
      { id: 'rest_google_business', label: 'Ficha Google Business optimizada', cost: 150 },
      { id: 'rest_resenas', label: 'Reseñas embebidas', cost: 120 },
    ],
  },
  {
    id: 'extras',
    title: 'EXTRAS HOSTELERÍA',
    description: 'Comunicación directa.',
    items: [
      { id: 'rest_whatsapp', label: 'WhatsApp directo reservas/pedidos', cost: 0, hint: 'Gratis: es un botón. Lo pide todo el mundo, lo incluimos.' },
    ],
  },
  {
    id: 'recurrentes',
    title: 'PUESTA EN MARCHA + RECURRENTES',
    description: 'Costes de arranque y cuotas. Sepáralos del pago único al presentar.',
    items: [
      {
        id: 'rest_dominio',
        label: 'Dominio (gestión 1er año)',
        cost: 30,
        hint: 'Coste ~15€ + gestión. Recurrente anual después.',
      },
      {
        id: 'rest_hosting',
        label: 'Despliegue + hosting Next.js (Vercel)',
        cost: 90,
        hint: 'Setup de despliegue. Vercel puede tener cuota mensual según tráfico/plan.',
      },
      {
        id: 'rest_mant_basico',
        label: 'Mantenimiento básico (actualizaciones + soporte)',
        cost: 200,
        hint: 'Recurrente anual. Copias, actualizaciones, pequeños arreglos.',
      },
    ],
  },
];

// Mapa plano id -> coste, para el cálculo
const REST_COST_BY_ID = REST_BLOCKS.reduce((acc, blk) => {
  blk.items.forEach((it) => {
    acc[it.id] = it.cost;
  });
  return acc;
}, {});

const ALL_REST_IDS = Object.keys(REST_COST_BY_ID);

/* ---------- "El servicio NO incluye" (estándar, no suma) ----------
   Basado en presupuestos reales. Sirve de recordatorio en reunión y
   para dejarlo por escrito en el PDF y evitar malentendidos. */
const REST_EXCLUSIONES = [
  'Compra de imágenes, vídeos o material gráfico adicional.',
  'Servicios de fotografía, vídeo o producción audiovisual.',
  'Diseño de piezas complementarias (flyers, tarjetas, señalética, etc.).',
  'Compra del dominio (se gestiona, no se asume su coste).',
  'Comisiones de la pasarela de pago (Stripe/Redsys) si hay pedidos online.',
];

/* ---------- Formateo ---------- */
const EUR_FMT = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const fmt = (n) => EUR_FMT.format(n);

/* ---------- Fallback mínimos para evitar ReferenceError ---------- */
const trackClickCall = (destino) => {
  try {
    window.gtag?.('event', 'contact_click', { destino });
  } catch {}
};

const trackCalcPDF = (total) => {
  try {
    window.gtag?.('event', 'calc_pdf_download', { value: total, currency: 'EUR' });
  } catch {}
};

/* ====== TRACKING CALCULADORA (versión notificación única) ====== */
function getSessionId() {
  try {
    const k = 'calc_sid';
    let sid = sessionStorage.getItem(k);
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(k, sid);
    }
    return sid;
  } catch {
    return 'sid-' + Date.now();
  }
}

const DEBUG = false;
const log = (...args) => {
  if (DEBUG) console.debug('[calc-track]', ...args);
};

function sendCalcEvent(payload) {
  try {
    const body = JSON.stringify(payload);

    if ('sendBeacon' in navigator && typeof Blob !== 'undefined') {
      const ok = navigator.sendBeacon('/api/calc-interaction', new Blob([body], { type: 'application/json' }));
      log('sendBeacon:', ok, payload);
      return;
    }

    fetch('/api/calc-interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    })
      .then((r) => log('fetch keepalive status:', r.status))
      .catch((e) => log('fetch keepalive error:', e));
  } catch (e) {
    log('sendCalcEvent error:', e);
  }
}

/* ====== TRACKING: Notificación única tras 5 min (o evento clave/leave/view) ====== */
export function useCalcTracking(state) {
  const timerRef = useRef(null);
  const sentRef = useRef(false);
  const lastStateRef = useRef(state);
  const touchedRef = useRef(false);
  const RECAP_DELAY_MS = 5 * 60 * 1000;

  const buildMinimalState = (s) => ({
    total: s?.total,
    tipo: s?.tipo,
    tamano: s?.tamano,
    complejidad: s?.complejidad,
  });

  const sendSummary = (reason) => {
    if (sentRef.current) {
      log('skip: already sent');
      return;
    }

    const allowWithoutTouch =
      reason === 'download_pdf' || reason === 'contact_click' || reason === 'leave' || reason === 'view';

    if (!touchedRef.current && !allowWithoutTouch) {
      log('blocked: no human interaction for reason', reason);
      return;
    }

    sentRef.current = true;

    const payload = {
      event: 'summary',
      state: buildMinimalState(lastStateRef.current),
      sid: getSessionId(),
      t: Date.now(),
      url: typeof location !== 'undefined' ? location.href : '',
      reason,
    };
    log('sending summary:', payload);
    sendCalcEvent(payload);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    try {
      sessionStorage.setItem('calc_summary_sent', '1');
    } catch {}
  };

  const scheduleSummary = () => {
    if (sentRef.current || !touchedRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => sendSummary('activity'), RECAP_DELAY_MS);
    log('timer scheduled for activity');
  };

  useEffect(() => {
    try {
      if (sessionStorage.getItem('calc_summary_sent') === '1') sentRef.current = true;
    } catch {}
    if (!sentRef.current) {
      const t = window.setTimeout(() => sendSummary('view'), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    lastStateRef.current = state;
  }, [state]);

  useEffect(() => {
    const onHuman = () => {
      touchedRef.current = true;
      scheduleSummary();
    };
    window.addEventListener('pointerdown', onHuman, { capture: true, passive: true });
    window.addEventListener('keydown', onHuman, { capture: true });

    return () => {
      window.removeEventListener('pointerdown', onHuman, { capture: true });
      window.removeEventListener('keydown', onHuman, { capture: true });
    };
  }, []);

  useEffect(() => {
    const onPdf = () => {
      touchedRef.current = true;
      sendSummary('download_pdf');
    };
    const onContact = () => {
      touchedRef.current = true;
      sendSummary('contact_click');
    };

    window.addEventListener('calc:download_pdf', onPdf);
    window.addEventListener('calc:contact_click', onContact);
    try {
      window.__calcSendSummary = (r) => sendSummary(r);
    } catch {}

    return () => {
      window.removeEventListener('calc:download_pdf', onPdf);
      window.removeEventListener('calc:contact_click', onContact);
      try {
        delete window.__calcSendSummary;
      } catch {}
    };
  }, []);

  useEffect(() => {
    const onLeave = () => sendSummary('leave');
    const onVis = () => {
      if (document.visibilityState === 'hidden') sendSummary('leave');
    };

    window.addEventListener('pagehide', onLeave, { capture: true, passive: true });
    document.addEventListener('visibilitychange', onVis, { capture: true });

    return () => {
      window.removeEventListener('pagehide', onLeave, { capture: true });
      document.removeEventListener('visibilitychange', onVis, { capture: true });
    };
  }, []);
}

/* ---------- Bloque reutilizable: Título + descripción + toggles ---------- */
function SettingsBlock({ title, description, items, onToggle, interno = false }) {
  return (
    <section className={`calc-block ${interno ? 'calc-block--rest' : ''}`}>
      <div className="calc-block__grid">
        <div className="calc-block__text">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <ul className="calc-block__services">
          {items.map((it) => (
            <li className="service" key={it.id}>
              <span className="service__info">
                <span id={`lbl-${it.id}`} className="service__label">
                  {it.label}
                </span>
                {typeof it.cost === 'number' && (
                  <span className="service__price">{it.cost === 0 ? 'GRATIS' : fmt(it.cost)}</span>
                )}
              </span>

              <label className={`switch ${it.checked ? 'is-on' : ''} ${it.disabled ? 'is-disabled' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!it.checked}
                  disabled={!!it.disabled}
                  onChange={(e) => onToggle && onToggle(it.id, e.target.checked)}
                  aria-labelledby={`lbl-${it.id}`}
                  role="switch"
                  aria-checked={!!it.checked}
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

/* ---------- Bloque RESTAURANTE: toggles con precio visible (modo interno) ---------- */
function RestaurantBlock({ block, restOpts, onToggle }) {
  return (
    <section className="calc-block calc-block--rest">
      <div className="calc-block__grid">
        <div className="calc-block__text">
          <h3>{block.title}</h3>
          <p>{block.description}</p>
        </div>

        <ul className="calc-block__services">
          {block.items.map((it) => {
            const checked = !!restOpts[it.id];
            return (
              <li className="service" key={it.id}>
                <span className="service__info">
                  <span id={`lbl-${it.id}`} className="service__label">
                    {it.label}
                  </span>
                  {it.hint && <span className="service__hint">{it.hint}</span>}
                  <span className={`service__price ${it.cost === 0 ? 'is-free' : ''}`}>
                    {it.cost === 0 ? 'GRATIS' : fmt(it.cost)}
                  </span>
                </span>

                <label className={`switch ${checked ? 'is-on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onToggle(it.id, e.target.checked)}
                    aria-labelledby={`lbl-${it.id}`}
                    role="switch"
                    aria-checked={checked}
                  />
                  <span className="slider" aria-hidden="true" />
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Componente reutilizable: RESUMEN PRECIOS ---------- */
function SummaryBox({ total, onDownloadPDF, esInterno = false }) {
  return (
    <div className="box">
      <div className="box__resumen">
        <h4>
          Resumen del
          <br />
          proyecto
        </h4>
        <div className="total">{fmt(total)}</div>
      </div>

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
            trackCalcPDF(total);
            try {
              window.dispatchEvent(new CustomEvent('calc:download_pdf'));
            } catch {}
            try {
              window.__calcSendSummary?.('download_pdf');
            } catch {}
            onDownloadPDF();
          }}
        />

        {!esInterno && (
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
              onClick={() => {
                trackClickCall('contacto');
                try {
                  window.dispatchEvent(new CustomEvent('calc:contact_click'));
                } catch {}
                try {
                  window.__calcSendSummary?.('contact_click');
                } catch {}
              }}
            />
          </span>
        )}

        <p className="precios_disclaimer">
          Precios orientativos. Si quieres un presupuesto cerrado ponte en contacto. Precios sin IVA.
        </p>
      </div>
    </div>
  );
}

export default function CalculadoraWeb({ modo = 'publico' }) {
  const esInterno = modo === 'interno';

  // Estado visible
  const [tipo, setTipo] = useState('restaurante');

  // Opciones de restaurante (solo modo interno). { [id]: true }
  const [restOpts, setRestOpts] = useState({});
  const toggleRestOpt = (id, next) =>
    setRestOpts((prev) => {
      const copy = { ...prev };
      if (next) copy[id] = true;
      else delete copy[id];
      return copy;
    });
  const [tamano, setTamano] = useState('pequena');
  const [complejidad, setComplejidad] = useState('basico');

  const sectionRef = useRef(null);
  const bottomRef = useRef(null);
  const [showSummary, setShowSummary] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  // Estado de bloques
  const [accesibilidad, setAccesibilidad] = useState('incluido');
  const [seoTec, setSeoTec] = useState(false);
  const [seoCont, setSeoCont] = useState(false);

  const [opRedaccion, setOpRedaccion] = useState(false);
  const [opTraducciones, setOpTraducciones] = useState(false);
  const [opImagenes, setOpImagenes] = useState(false);
  const [opFotografia, setOpFotografia] = useState(false);
  const [opUrgente, setOpUrgente] = useState(false);
  const [opRevisionExtra, setOpRevisionExtra] = useState(false);
  const [opReunionesExtra, setOpReunionesExtra] = useState(false);

  const [mantAnual, setMantAnual] = useState(false);
  const [mantHoras, setMantHoras] = useState(false);
  const [mantExternos, setMantExternos] = useState(false);

  /* ---- Observers ---- */
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setShowSummary(entry.isIntersecting), {
      root: null,
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const node = bottomRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => setAtBottom(entry.isIntersecting), {
      root: null,
      threshold: 0,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const lsKey = esInterno ? `${LS_KEY}-interno` : LS_KEY;

  /* ---- Cargar estado ---- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(lsKey);
      if (!raw) return;
      const s = JSON.parse(raw);

      if (s.tipo && PROJECT_TYPES[s.tipo]) setTipo(s.tipo);
      if (s.tamano && TAMANOS[s.tamano]) {
        setTamano(s.tamano);
      } else if (typeof s.paginas === 'number') {
        const p = s.paginas;
        setTamano(p <= 3 ? 'pequena' : p <= 7 ? 'mediana' : 'grande');
      }

      if (s.complejidad && COMPLEJIDAD[s.complejidad]) setComplejidad(s.complejidad);
      if (s.accesibilidad && ACCESIBILIDAD[s.accesibilidad]) setAccesibilidad(s.accesibilidad);
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
      if (esInterno && s.restOpts && typeof s.restOpts === 'object') {
        // Solo conservamos ids válidos por si cambian las opciones
        const clean = {};
        ALL_REST_IDS.forEach((id) => {
          if (s.restOpts[id]) clean[id] = true;
        });
        setRestOpts(clean);
      }
    } catch {}
  }, []);

  /* ---- Guardar estado ---- */
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
      ...(esInterno ? { restOpts } : {}),
    };
    try {
      localStorage.setItem(lsKey, JSON.stringify(s));
    } catch {}
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
    mantExternos,
    restOpts,
  ]);

  /* ---- Cálculo en tiempo real ---- */
  const total = useMemo(() => {
    // En interno (restaurante) no hay precio base oculto: el total arranca en 0
    // y sale de las opciones marcadas. El tamaño SÍ suma (coste por páginas),
    // porque es la 1ª pregunta (cómo de extensa es la carta).
    const internoRest = esInterno && tipo === 'restaurante';

    const base = internoRest ? 0 : PROJECT_TYPES[tipo]?.base ?? 0;

    const numPags = TAMANOS[tamano] || 1;
    const pagesCost = Math.max(0, numPags - 1) * PRECIO_PAGINA_INTERNA;

    const extrasOperativa =
      (opRedaccion ? EXTRA_COSTS.redaccion : 0) +
      (opTraducciones ? EXTRA_COSTS.traducciones : 0) +
      (opImagenes ? EXTRA_COSTS.imagenes : 0) +
      (opFotografia ? EXTRA_COSTS.fotografia : 0) +
      (opRevisionExtra ? EXTRA_COSTS.revisionExtra : 0) +
      (opReunionesExtra ? EXTRA_COSTS.reunionesExtra : 0);

    // Opciones específicas de restaurante (solo interno + tipo restaurante)
    const extrasRestaurante = internoRest
      ? Object.keys(restOpts).reduce((sum, id) => sum + (REST_COST_BY_ID[id] || 0), 0)
      : 0;

    const multiplicador =
      (COMPLEJIDAD[complejidad] || 1) *
      (ACCESIBILIDAD[accesibilidad] || 1) *
      (seoTec ? SEO_TEC : 1) *
      (seoCont ? SEO_CONT : 1) *
      (opUrgente ? URGENCIA_MULT : 1);

    const mantenimiento =
      (mantAnual ? MANT_COSTS.anual : 0) + (mantHoras ? MANT_COSTS.bolsa10h : 0) + (mantExternos ? MANT_COSTS.externos : 0);

    return Math.round(((base + pagesCost + extrasOperativa + extrasRestaurante) * multiplicador + mantenimiento) * 100) / 100;
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
    mantExternos,
    restOpts,
    esInterno,
  ]);

  /* ---- Tracking ---- */
  useCalcTracking({
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
    total,
  });

  /* --- PDF --- */
  async function loadPngWithSize(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    const blob = await res.blob();
    const dataURL = await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(String(r.result));
      r.readAsDataURL(blob);
    });
    const img = await new Promise((resolve) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.src = dataURL;
    });
    return { dataURL, naturalW: img.naturalWidth, naturalH: img.naturalHeight };
  }

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true, precision: 12 });

    const m = 48;
    let y = 72;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const colW = pageW - m * 2;
    const fmtLocal = (n) => EUR_FMT.format(n);

    doc.setLineHeightFactor(1.3);
    const p = (txt, size = 9.5, bold = false, color = [51, 51, 51]) => {
      doc.setTextColor(...color);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      const lines = doc.splitTextToSize(txt, colW);
      doc.text(lines, m, y);
      y += lines.length * (size * 1.3);
    };
    const h = (txt) => {
      p(txt.toUpperCase(), 9, true, [120, 120, 120]);
      y += 2;
    };
    const hr = () => {
      doc.setDrawColor(215, 215, 215);
      doc.line(m, y, pageW - m, y);
      y += 18;
    };
    // salto de página si no cabe lo siguiente
    const ensure = (need = 60) => {
      if (y + need > pageH - 60) {
        doc.addPage();
        y = 60;
      }
    };
    // línea "concepto ............ precio" (precio a la derecha)
    const lineItem = (label, cost) => {
      ensure(22);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 51, 51);
      const priceTxt = cost === 0 ? 'GRATIS' : fmtLocal(cost);
      const priceW = doc.getTextWidth(priceTxt);
      const labelLines = doc.splitTextToSize(label, colW - priceW - 16);
      doc.text(labelLines, m, y);
      doc.setTextColor(63, 82, 255);
      doc.text(priceTxt, pageW - m, y, { align: 'right' });
      y += labelLines.length * (9.5 * 1.3) + 3;
    };

    const { dataURL, naturalW, naturalH } = await loadPngWithSize('/assets/01_ERMO_MARCA.jpg');

    const logoX = m, logoY = 20, logoW = 120;
    const logoH = logoW * (naturalH / naturalW);
    doc.addImage(dataURL, 'PNG', logoX, logoY, logoW, logoH);

    const headerBottom = logoY + logoH;
    const gap = 18;
    const yHeader = headerBottom + gap;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text('RESUMEN DEL PROYECTO', m, yHeader);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(153, 153, 153);
    doc.text(new Date().toLocaleDateString('es-ES'), m, yHeader + 14);

    const rightX = pageW - m;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(63, 82, 255);
    doc.text(fmtLocal(total), rightX, yHeader, { align: 'right', baseline: 'alphabetic' });

    y = yHeader + 32;
    hr();

    const tipoLabel = PROJECT_TYPES[tipo]?.label ?? '';
    const numPags = TAMANOS[tamano] || 1;
    const complejidadLabel = { basico: 'Básico', intermedio: 'Intermedio', avanzado: 'Avanzado' }[complejidad];
    const internoRest = esInterno && tipo === 'restaurante';

    if (internoRest) {
      // ---- PDF DETALLADO RESTAURANTE ----
      h('PROYECTO'); p(`${tipoLabel} · ${complejidadLabel} · ${numPags} pág. aprox.`);
      y += 6;

      // Desglose por bloque, solo opciones marcadas
      let algunaMarcada = false;
      REST_BLOCKS.forEach((block) => {
        const marcadas = block.items.filter((it) => restOpts[it.id]);
        if (!marcadas.length) return;
        algunaMarcada = true;
        ensure(40);
        h(block.title);
        marcadas.forEach((it) => lineItem(it.label, it.cost));
        y += 6;
      });

      // Contenidos y extras genéricos (redacción, traducciones, etc.) marcados
      const contenidos = [
        opRedaccion && { label: 'Redacción de textos', cost: EXTRA_COSTS.redaccion },
        opTraducciones && { label: 'Traducciones', cost: EXTRA_COSTS.traducciones },
        opImagenes && { label: 'Imágenes, ilustraciones o iconos', cost: EXTRA_COSTS.imagenes },
        opFotografia && { label: 'Fotografía o vídeo', cost: EXTRA_COSTS.fotografia },
      ].filter(Boolean);
      if (contenidos.length) {
        algunaMarcada = true;
        ensure(40);
        h('CONTENIDOS Y RECURSOS');
        contenidos.forEach((it) => lineItem(it.label, it.cost));
        y += 6;
      }

      // Operativa (urgencia y accesibilidad son multiplicadores: se reflejan en el total)
      const ajustes = [
        complejidad !== 'basico' && `Complejidad ${complejidadLabel.toLowerCase()}`,
        accesibilidad === 'aa' && 'Accesibilidad objetivo AA',
        opUrgente && 'Entrega con urgencia',
      ].filter(Boolean);
      if (ajustes.length) {
        ensure(40);
        h('AJUSTES (aplicados al total)');
        ajustes.forEach((txt) => p(`—  ${txt}`, 10.5, false, [120, 120, 120]));
        y += 6;
      }

      if (!algunaMarcada) {
        p('Sin opciones seleccionadas todavía.', 9.5, false, [153, 153, 153]);
      }

      // Totales: base, IVA 21% y total con IVA
      const iva = Math.round(total * 0.21 * 100) / 100;
      const totalConIva = Math.round((total + iva) * 100) / 100;

      ensure(70);
      hr();
      // Subtotal e IVA (pequeños, a la derecha)
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('Subtotal (sin IVA)', m, y);
      doc.text(fmtLocal(total), pageW - m, y, { align: 'right' });
      y += 13;
      doc.text('IVA (21%)', m, y);
      doc.text(fmtLocal(iva), pageW - m, y, { align: 'right' });
      y += 16;

      // Total con IVA destacado
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      doc.text('TOTAL ESTIMADO (IVA incl.)', m, y);
      doc.setFontSize(14);
      doc.setTextColor(63, 82, 255);
      doc.text(fmtLocal(totalConIva), pageW - m, y, { align: 'right' });
      y += 24;

      // Sección "EL SERVICIO NO INCLUYE" — muy pequeña
      ensure(30 + REST_EXCLUSIONES.length * 11);
      hr();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 120, 120);
      doc.text('EL SERVICIO NO INCLUYE', m, y);
      y += 11;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(140, 140, 140);
      REST_EXCLUSIONES.forEach((txt) => {
        ensure(11);
        doc.text(`—  ${txt}`, m, y);
        y += 9.5;
      });
      y += 6;
      doc.setFontSize(7);
      doc.setTextColor(160, 160, 160);
      doc.text('Presupuesto no vinculante, solo orientativo.', m, y);
      y += 12;
    } else {
      // ---- PDF GENÉRICO (calculadora pública) ----
      h('TIPO DE PROYECTO'); p(tipoLabel);
      h('NÚMERO DE PÁGINAS'); p(String(numPags));
      h('COMPLEJIDAD DEL DISEÑO'); p(complejidadLabel);
      h('ACCESIBILIDAD Y CALIDAD'); p(accesibilidad === 'aa' ? 'Objetivo AA' : 'Incluido');

      const seoSel = ['Incluido', seoTec && 'Avanzado y estándares Google', seoCont && 'Optimización de contenidos']
        .filter(Boolean)
        .join(' · ');
      h('SEO Y RENDIMIENTO'); p(seoSel || 'Incluido');

      const opSel = [
        opRedaccion && 'Redacción de textos',
        opTraducciones && 'Traducciones',
        opImagenes && 'Imágenes/ilustraciones/íconos',
        opFotografia && 'Fotografía o vídeo',
        opRevisionExtra && 'Ronda de revisión extra',
        opReunionesExtra && 'Reuniones extra',
        opUrgente && 'Entrega con urgencia',
      ].filter(Boolean).join(' · ') || 'Ninguno';
      h('CONTENIDOS Y RECURSOS'); p(opSel);

      const mantSel = [mantAnual && 'Anual', mantHoras && 'Por horas (10h)', mantExternos && 'Servicios externos']
        .filter(Boolean).join(' · ') || 'Ninguno';
      h('MANTENIMIENTO'); p(mantSel);

      hr();
      p('Presupuesto no vinculante, solo orientativo.', 10, false, [153, 153, 153]);
    }

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('ERMO Estudio de diseño · andresortega@ermo.es · 675 392 216 · ermo.es', m, pageH - 30);

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

                <label htmlFor="tipo-proyecto" className="visually-hidden">
                  Tipo de proyecto
                </label>

                <select id="tipo-proyecto" value={tipo} onChange={(e) => setTipo(e.target.value)}>
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

        {/* TAMAÑO DEL SITIO (primera pregunta: ¿cómo de extensa es la carta?) */}
        <section className="calc-block">
          <div className="calc-block__grid">
            <div className="calc-block__text">
              <h3>TAMAÑO DEL SITIO</h3>
              <p>
                Elige un tamaño aproximado. Siempre podremos ajustar después en la propuesta cerrada. <br />
                <br />
                /Pequeño: 1-8 pág. <br />
                /Mediano: 8-15 pág. <br />
                /Grande: +15 pág.
              </p>
            </div>
            <div className="calc-block__services">
              <div className="service">
                <span className="service__label" aria-hidden="true"></span>
                <div className="chips">
                  {['pequena', 'mediana', 'grande'].map((k) => (
                    <button
                      key={k}
                      className={`chip ${tamano === k ? 'active' : ''}`}
                      onClick={() => {
                        setTamano(k);
                        trackCalcInteraction('tamano', k, total);
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

        {/* COMPLEJIDAD DEL DISEÑO (segunda pregunta: ¿sencillo o elaborado?) */}
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
                    <button key={k} className={`chip ${complejidad === k ? 'active' : ''}`} onClick={() => setComplejidad(k)} type="button">
                      {k === 'basico' ? 'BÁSICO' : k === 'intermedio' ? 'INTERMEDIO' : 'AVANZADO'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OPCIONES RESTAURANTE (solo interno + tipo restaurante) */}
        {esInterno && tipo === 'restaurante' && (
          <>
            {REST_BLOCKS.map((block) => (
              <RestaurantBlock key={block.id} block={block} restOpts={restOpts} onToggle={toggleRestOpt} />
            ))}

            <div className="intro-landing__line"></div>
          </>
        )}

        {/* CONTENIDOS Y RECURSOS */}
        <SettingsBlock
          interno={esInterno}
          title="CONTENIDOS Y RECURSOS"
          description="Selecciona el apoyo que necesites para crear y preparar todo el contenido de la web. Tener contenido bien hecho ayuda a que tu web sea más atractiva, clara y convincente para tus clientes."
          items={[
            { id: 'op_redaccion', label: 'REDACCIÓN DE TEXTOS', checked: opRedaccion, cost: esInterno ? EXTRA_COSTS.redaccion : undefined },
            { id: 'op_traducciones', label: 'TRADUCCIONES', checked: opTraducciones, cost: esInterno ? EXTRA_COSTS.traducciones : undefined },
            { id: 'op_imagenes', label: 'IMÁGENES, ILUSTRACIONES O ICONOS', checked: opImagenes, cost: esInterno ? EXTRA_COSTS.imagenes : undefined },
            { id: 'op_foto', label: 'FOTOGRAFÍA O VIDEO', checked: opFotografia, cost: esInterno ? EXTRA_COSTS.fotografia : undefined },
          ]}
          onToggle={(id, next) => {
            if (id === 'op_redaccion') setOpRedaccion(next);
            else if (id === 'op_traducciones') setOpTraducciones(next);
            else if (id === 'op_imagenes') setOpImagenes(next);
            else if (id === 'op_foto') setOpFotografia(next);
          }}
        />

        {/* ACCESIBILIDAD Y CALIDAD */}
        <SettingsBlock
          interno={esInterno}
          title="ACCESIBILIDAD Y CALIDAD"
          description="¿Quieres que tu web pueda ser utilizada por cualquier persona, incluso con limitaciones visuales, auditivas o de movilidad? La opción AA garantiza un nivel avanzado de accesibilidad para que todos tus usuarios puedan navegar sin barreras."
          items={[
            { id: 'acc_incluido', label: 'INCLUIDO', checked: accesibilidad === 'incluido' },
            { id: 'acc_aa', label: 'OBJETIVO AA', checked: accesibilidad === 'aa' },
          ]}
          onToggle={(id, next) => {
            if (!next) return;
            setAccesibilidad(id === 'acc_aa' ? 'aa' : 'incluido');
          }}
        />

        {/* SEO Y RENDIMIENTO — en interno restaurante lo cubre PRESENCIA / GOOGLE */}
        {!(esInterno && tipo === 'restaurante') && (
          <SettingsBlock
            title="SEO (APARECER EN GOOGLE)"
            description="Opciones para que tu web aparezca mejor posicionada en Google y cargue más rápido. Esto ayuda a que más personas te encuentren y a que la experiencia de navegación sea fluida."
            items={[
              { id: 'seoIncluido', label: 'INCLUIDO', checked: true, disabled: true },
              { id: 'seoTec', label: 'AVANZADO Y ESTANDARES GOOGLE', checked: seoTec },
              { id: 'seoCont', label: 'OPTIMIZACIÓN DE CONTENIDOS', checked: seoCont },
            ]}
            onToggle={(id, next) => {
              if (id === 'seoTec') setSeoTec(next);
              if (id === 'seoCont') setSeoCont(next);
            }}
          />
        )}

        {/* MANTENIMIENTO — en interno restaurante lo cubre PUESTA EN MARCHA + RECURRENTES.
            Allí solo mostramos la entrega con urgencia (no solapa). */}
        {esInterno && tipo === 'restaurante' ? (
          <SettingsBlock
            interno={esInterno}
            title="OPERATIVA"
            description="Plazo de entrega del proyecto."
            items={[
              { id: 'op_urgente', label: 'ENTREGA CON URGENCIA', checked: opUrgente },
            ]}
            onToggle={(id, next) => {
              if (id === 'op_urgente') setOpUrgente(next);
            }}
          />
        ) : (
          <SettingsBlock
            title="MANTENIMIENTO Y OPERATIVA"
            description="Puedes evitar muchos líos y dolores de cabeza contratando un mantenimiento para tu proyecto. Así tendrás cubierto cualquier error que pueda suceder."
            items={[
              { id: 'mant_anual', label: 'MANT. ANUAL', checked: mantAnual },
              { id: 'mant_horas', label: 'POR HORAS (10h)', checked: mantHoras },
              { id: 'mant_ext', label: 'SERVICIOS EXTERNOS', checked: mantExternos },
              { id: 'op_urgente', label: 'ENTREGA CON URGENCIA', checked: opUrgente },
            ]}
            onToggle={(id, next) => {
              if (id === 'mant_anual') setMantAnual(next);
              else if (id === 'mant_horas') setMantHoras(next);
              else if (id === 'mant_ext') setMantExternos(next);
              else if (id === 'op_urgente') setOpUrgente(next);
            }}
          />
        )}

        <div ref={bottomRef} style={{ height: 1 }} />

        {/* Banner final solo móvil */}
        <div className="calc-summary calc-summary--mobileEnd">
          <SummaryBox total={total} onDownloadPDF={handleDownloadPDF} esInterno={esInterno} />
        </div>
      </div>

      {/* Columna derecha (sticky) */}
      <aside className={`calc-summary ${showSummary ? 'is-visible' : ''} ${atBottom ? 'is-bottom' : ''}`}>
        <SummaryBox total={total} onDownloadPDF={handleDownloadPDF} esInterno={esInterno} />
      </aside>
    </section>
  );
}
