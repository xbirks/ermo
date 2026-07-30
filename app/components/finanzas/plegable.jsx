"use client";

import { useState } from 'react';

/**
 * Sección que se abre al pulsar el título.
 *
 * Las secciones secundarias (gastos fijos, IVA, dinero apartado, el
 * formulario de alta) van cerradas por defecto: con todo desplegado la
 * página del mes pasaba de 5.000 px en el móvil.
 *
 * El resumen de la derecha es lo que permite tenerlas cerradas sin
 * perder información: dice de un vistazo si hay algo que atender.
 */
export default function Plegable({
    titulo,
    resumen,
    etiqueta,
    inicial = false,
    children,
}) {
    const [abierta, setAbierta] = useState(inicial);

    return (
        <section className={`fz-plegable${abierta ? ' fz-plegable--abierta' : ''}`}>
            <button
                type="button"
                className="fz-plegable__cabecera"
                onClick={() => setAbierta((v) => !v)}
                aria-expanded={abierta}
            >
                <span className="fz-plegable__titulo">
                    <span className="fz-plegable__flecha" aria-hidden="true">›</span>
                    {titulo}
                    {etiqueta}
                </span>
                {!abierta && resumen && (
                    <span className="fz-plegable__resumen">{resumen}</span>
                )}
            </button>

            {abierta && <div className="fz-plegable__cuerpo">{children}</div>}
        </section>
    );
}
