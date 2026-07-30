"use client";

import { useState, useEffect, useRef } from 'react';

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
    abrir,          // fuerza la apertura desde fuera (un botón de arriba)
    children,
}) {
    const [abierta, setAbierta] = useState(inicial);
    const contenedor = useRef(null);

    // Al abrirse desde fuera, se desplaza hasta la sección: sin esto,
    // pulsar el botón de arriba abre algo que queda fuera de pantalla y
    // parece que no ha pasado nada.
    useEffect(() => {
        if (!abrir) return;
        setAbierta(true);
        contenedor.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [abrir]);

    return (
        <section
            ref={contenedor}
            className={`fz-plegable${abierta ? ' fz-plegable--abierta' : ''}`}
        >
            <button
                type="button"
                className="fz-plegable__cabecera"
                onClick={() => setAbierta((v) => !v)}
                aria-expanded={abierta}
            >
                <span className="fz-plegable__titulo">
                    {titulo}
                    {etiqueta}
                </span>
                <span className="fz-plegable__lado">
                    {!abierta && resumen && (
                        <span className="fz-plegable__resumen">{resumen}</span>
                    )}
                    <span className="fz-plegable__abrir" aria-hidden="true">+</span>
                </span>
            </button>

            {abierta && <div className="fz-plegable__cuerpo">{children}</div>}
        </section>
    );
}
