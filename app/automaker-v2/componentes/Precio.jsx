"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Boton from "./Boton.jsx";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Precio.module.scss";
import { CONTACTO_DEMO } from "../contacto.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// "Precio" del modelo de autoservicio: alta con formación + cuota por
// diseñador. Cifras del borrador 1 del plan de negocio
// (automaker/docs/negocio/plan-de-negocio.md): PENDIENTES DE CONFIRMAR.

// Lo que incluye cada pago, en una línea por punto: la tarjeta tiene que
// leerse de un vistazo, el detalle está en las preguntas frecuentes.
const ALTA = [
    "Formación práctica al diseñador que va a usar el plugin (hasta 10 h)",
    "Vuestra primera campaña real, montada durante la formación",
    "Cuenta y Excel plantilla listos para rellenar",
    "Llamada de seguimiento a los 30 días",
];

const CUOTA = [
    "Campañas y piezas ilimitadas",
    "Excels ilimitados: uno por cliente, marca o departamento",
    "Plugin siempre actualizado",
    "Soporte cuando algo no funciona",
];

// Mensual o anual, como en cualquier SaaS. El anual son 10 meses: dos
// gratis. Cifras pendientes de confirmar (ver comentario de arriba).
const PLANES = {
    mensual: { importe: "250€", periodo: "/mes", extra: "Cada diseñador más, 100 €/mes." },
    anual: { importe: "2.500€", periodo: "/año", extra: "Cada diseñador más, 1.000 €/año. Dos meses gratis." },
};

export default function Precio() {
    const raiz = useRef(null);
    const [plan, setPlan] = useState("mensual");
    const p = PLANES[plan];

    useLayoutIso(() => {
        const mm = gsap.matchMedia();

        mm.add(
            {
                animar: "(prefers-reduced-motion: no-preference)",
                quieto: "(prefers-reduced-motion: reduce)",
                movil: "(max-width: 760px)",
            },
            (ctx) => {
                const q = gsap.utils.selector(raiz);
                const { animar, movil } = ctx.conditions;
                const tarjeta = q("[data-tarjeta]")[0];

                // Móvil: la tarjeta es larga y el botón de arriba se queda
                // atrás al leer lo que incluye. Mientras se lee, una barra
                // fija abajo recuerda el precio y deja pedir la demo.
                if (movil) {
                    ScrollTrigger.create({
                        trigger: tarjeta,
                        start: "top+=300 top",
                        end: "bottom 85%",
                        toggleClass: { targets: q("[data-barra]"), className: s.barraVisible },
                    });
                }

                if (!animar) {
                    gsap.set(q("[data-entra]"), { autoAlpha: 1 });
                    return undefined;
                }

                // Entradas cortas y una sola vez: la tarjeta sube, y los
                // puntos de lo que incluye aparecen al llegar a ellos.
                gsap.from(tarjeta, {
                    autoAlpha: 0,
                    y: 40,
                    duration: 1,
                    ease: "expo.out",
                    scrollTrigger: alLlegar(tarjeta, "top 85%"),
                });
                gsap.set(q("[data-punto]"), { autoAlpha: 0, y: 14 });
                ScrollTrigger.batch(q("[data-punto]"), {
                    start: "top 90%",
                    onEnter: (lote) =>
                        gsap.to(lote, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.07 }),
                });

                let vivo = true;
                ctx.add("titulo", () => {
                    const titulo = q("[data-titulo]")[0];
                    const corte = cortarEnLineas(titulo);
                    gsap.set(titulo, { autoAlpha: 1 });
                    gsap.timeline({
                        scrollTrigger: alLlegar(titulo, "top 85%"),
                        onComplete: () => corte.revert(),
                    })
                        .from(corte.lines, { yPercent: 115, duration: 1.2, ease: "expo.out" })
                        .from(q("[data-sube]"), { autoAlpha: 0, y: 14, duration: 0.9, ease: "power3.out" }, 0.3);
                });
                esperarFuente().then(() => vivo && ctx.titulo());

                return () => {
                    vivo = false;
                };
            },
            raiz
        );

        return () => mm.revert();
    }, []);

    return (
        <section id="precio" className={s.precio} ref={raiz}>
            <h2 className={s.titulo} data-titulo data-entra>Precio</h2>
            <p className={s.intro} data-sube data-entra>
                Dos pagos y nada más: un alta para empezar y una cuota por cada diseñador que usa el plugin. Las
                campañas y las piezas no cuentan.
            </p>

            {/* Mensual / anual: cambia la cuota; el alta es la misma. */}
            <div className={s.selector} role="group" aria-label="Forma de pago" data-sube data-entra>
                {Object.keys(PLANES).map((clave) => (
                    <button
                        key={clave}
                        type="button"
                        className={`${s.opcion} ${plan === clave ? s.opcionActiva : ""}`}
                        aria-pressed={plan === clave}
                        onClick={() => setPlan(clave)}
                    >
                        {clave === "mensual" ? "Mensual" : "Anual"}
                        {clave === "anual" && <span className={s.ahorro}>2 meses gratis</span>}
                    </button>
                ))}
            </div>

            <article className={s.tarjeta} data-tarjeta>
                <div className={s.cabecera}>
                    <div className={s.cifras}>
                        <div className={s.cifra}>
                            <h3 className={s.etiquetaCifra}>Alta</h3>
                            <p className={s.importe}>
                                1.500€<span className={s.iva}>+ IVA</span>
                            </p>
                            <p className={s.letraPequena}>Una vez, al empezar.</p>
                        </div>
                        <span className={s.mas} aria-hidden="true">+</span>
                        <div className={s.cifra}>
                            <h3 className={s.etiquetaCifra}>Cuota por diseñador</h3>
                            <p className={s.importe}>
                                {p.importe}
                                <span className={s.iva}>{p.periodo} + IVA</span>
                            </p>
                            <p className={s.letraPequena}>{p.extra}</p>
                        </div>
                    </div>
                    <Boton href={CONTACTO_DEMO} variante="tinta" className={s.cta}>Solicitar demo</Boton>
                </div>

                <p className={s.amortiza}>
                    Un diseñador dedica entre 10 y 16 horas semanales a maquetación repetitiva (entre 1200€ y 1900€ al
                    mes a precio de agencia). <strong>El alta se recupera en uno o dos meses.</strong>
                </p>

                <div className={`${s.bloque} ${s.columnas}`}>
                    <div>
                        <span className={s.pastilla}>El alta incluye</span>
                        <ul className={s.lista}>
                            {ALTA.map((t) => <li key={t} data-punto>{t}</li>)}
                        </ul>
                    </div>
                    <div>
                        <span className={s.pastilla}>La cuota incluye</span>
                        <ul className={s.lista}>
                            {CUOTA.map((t) => <li key={t} data-punto>{t}</li>)}
                        </ul>
                    </div>
                </div>
            </article>

            <p className={s.nota}>
                Permanencia de 12 meses; después, mes a mes. Si os dais de baja, todo lo diseñado sigue en vuestro
                Figma. ¿Queréis que os montemos alguna campaña? Montaje a partir de un máster aprobado, 300 €;
                formación de otra persona, 600 €. Conexión con vuestro gestor de tareas (Basecamp, Asana…), a medida.
                Adaptamos, no diseñamos desde cero.
            </p>

            <div className={s.barra} data-barra aria-hidden="true">
                <span className={s.barraImporte}>
                    1.500€ + {p.importe}
                    <span className={s.iva}>{p.periodo}</span>
                </span>
                <Boton href={CONTACTO_DEMO} variante="tinta" className={s.barraBoton} tabIndex={-1}>
                    Solicitar demo
                </Boton>
            </div>
        </section>
    );
}
