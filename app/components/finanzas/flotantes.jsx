"use client";

import { useState, useEffect } from 'react';

/**
 * Los dos botones que van pegados a la esquina, siempre a mano.
 *
 *   · El «+» abre el formulario de anotar un movimiento. Antes vivía a
 *     media página: con las secciones desplegadas había que subir a
 *     buscarlo cada vez, y es lo que más se usa de toda la app.
 *
 *   · La flecha sube al principio. La página del mes, con todo abierto,
 *     pasa de veinte pantallas de scroll, y volver arriba a dedo es un
 *     viaje.
 *
 * La flecha sólo aparece cuando hay recorrido hecho: un botón para
 * volver arriba estando ya arriba es ruido.
 */
export default function Flotantes({ anotando, conAnotar = true, onAnotar }) {
    const [lejos, setLejos] = useState(false);

    useEffect(() => {
        // Pasada una pantalla y media ya se ha perdido de vista la
        // cabecera, que es cuando volver arriba empieza a costar.
        const umbral = () => window.innerHeight * 1.5;

        const alScroll = () => setLejos(window.scrollY > umbral());
        alScroll();

        // `passive` para no bloquear el scroll: el listener sólo lee.
        window.addEventListener('scroll', alScroll, { passive: true });
        return () => window.removeEventListener('scroll', alScroll);
    }, []);

    function arriba() {
        // `smooth` respeta la preferencia del sistema de reducir
        // movimiento: si está activada, el navegador salta sin animar.
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="fz-flotantes">
            {lejos && (
                <button
                    className="fz-flotante fz-flotante--subir"
                    type="button"
                    onClick={arriba}
                    aria-label="Volver arriba"
                    title="Volver arriba"
                >
                    <span aria-hidden="true">↑</span>
                </button>
            )}

            {conAnotar && (
                <button
                    className={`fz-flotante fz-flotante--anotar${anotando ? ' fz-flotante--abierto' : ''}`}
                    type="button"
                    onClick={onAnotar}
                    aria-label={anotando ? 'Cerrar el formulario' : 'Anotar un movimiento'}
                    title={anotando ? 'Cerrar' : 'Anotar movimiento'}
                >
                    <span aria-hidden="true">+</span>
                </button>
            )}
        </div>
    );
}
