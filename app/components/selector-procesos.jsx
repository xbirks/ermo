'use client';
import { useState } from 'react';
import Image from 'next/image';

const STEPS = [
  {
    key: 'analisis',
    label: 'ANÁLISIS',
    title: 'CONOCEMOS AL CLIENTE Y ANALIZAMOS EL PROYECTO',
    paragraphs: [
      'Empezamos con una reunión de descubrimiento para entender objetivos, público, competencia, tono y alcance. Auditamos materiales existentes y referentes del sector para detectar oportunidades y riesgos.',
      'Con esa información definimos un plan de trabajo con fases, hitos y entregables, y cerramos presupuesto y plazos. Tendrás claridad desde el primer día sobre qué haremos, cuándo y qué necesitaremos de tu parte.',
    ],
  },
  {
    key: 'diseno',
    label: 'DISEÑO',
    title: 'DISEÑAMOS EL PROTOTIPO DE LA WEB JUNTO AL CLIENTE',
    paragraphs: [
      'Convertimos el diagnóstico en un prototipo navegable. Lo revisamos contigo en sesiones breves para ajustarlo hasta dejar cerrados interfaz, contenidos prioritarios y secciones.',
      'Una vez aprobado el diseño, pasamos a programación y el diseño queda congelado. Cualquier cambio de secciones, páginas completas o nuevos componentes se presupuestará aparte.',
    ],
  },
  {
    key: 'programacion',
    label: 'PROGRAMACIÓN',
    title: 'FASE DE PROGRAMACIÓN DE LA WEB',
    paragraphs: [
      'Desarrollamos el diseño aprobado con Next.js y SCSS. Construimos componentes y plantillas a medida, con maquetación responsive y criterios de accesibilidad. Integramos las funcionalidades acordadas (formularios, búsquedas, etc.) y los servicios necesarios.',
      'Trabajamos en un entorno de pruebas para que puedas revisar el funcionamiento y la usabilidad antes del lanzamiento.',
    ],
  },
  {
    key: 'optimizacion',
    label: 'OPTIMIZACIÓN',
    title: 'FASE DE OPTIMIZACIÓN DE SEO Y RENDIMIENTO',
    paragraphs: [
      'Mejoramos velocidad y estabilidad: Core Web Vitals, compresión, caché y optimización de imágenes. Completamos metadatos, marcado estructurado, redirecciones y configuramos analítica y Search Console para medir resultados reales.',
      'Si contratas el SEO avanzado, realizamos investigación de palabras clave, definimos arquitectura y clusters de contenido, optimizamos on-page (títulos, headings, descripciones y enlazado interno) y afinamos aspectos técnicos adicionales.',
    ],
  },
  {
    key: 'entrega',
    label: 'ENTREGA',
    title: 'ENTREGAMOS LA WEB',
    paragraphs: [
      'Hacemos control de calidad final, migramos contenidos y publicamos en producción (Vercel). Dejamos copias de seguridad y medidas de seguridad básicas activas.',
    ],
  },
];

const IMAGE_MAP = {
  analisis: 'nu01',
  diseno: 'nu02',
  programacion: 'nu03',
  optimizacion: 'nu04',
  entrega: 'nu05',
};

export default function ProcesoSection() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const imageSrc = `/assets/${IMAGE_MAP[step.key]}.png`;

  return (
    <section className="proceso">
      <div className="col izq">
        <nav className="tabs">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              className={`tab ${i === active ? 'active' : ''}`}
              onClick={() => setActive(i)}
              aria-current={i === active ? 'page' : undefined}
            >
              <span>{s.label}</span>
              {i === active && (
                <svg width="26" height="16" viewBox="0 0 34 23" aria-hidden="true">
                  <path d="M21.03 0L19.95 1.23L30.6 10.68H0V12.33H30.6L19.95 21.77L21.03 23L34 11.5L21.03 0Z" fill="currentColor" />
                </svg>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="col der">
        <article className="card">
          <Image
            src={imageSrc}
            width={70}
            height={47}
            alt={`Ilustración del paso ${step.label.toLowerCase()}`}
            className="grid__element-img"
            priority
          />
          <h3>{step.title}</h3>
          {step.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </article>

        <div className="cred">
          <div className="pill">
            <div className="avatars">
              <span className="stack">
                <Image src="/assets/pp1.png" alt="Cliente 1" width={24} height={24} />
              </span>
              <span className="stack">
                <Image src="/assets/pp2.png" alt="Cliente 2" width={24} height={24} />
              </span>
              <span className="stack">
                <Image src="/assets/pp3.png" alt="Cliente 3" width={24} height={24} />
              </span>
              <span className="stack">
                <Image src="/assets/pp4.png" alt="Cliente 4" width={24} height={24} />
              </span>
            </div>
            <p>+82 clientes satisfechos con el sistema</p>
          </div>
        </div>
      </div>
    </section>
  );
}
