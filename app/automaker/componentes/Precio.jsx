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

// "Precio" del modelo V3: puesta en marcha de pago único (se instala, se
// forma al equipo y se va) + mantenimiento mensual obligatorio (el plugin
// depende de nuestro servidor y de que Figma no cambie). Precios cerrados
// el 6/10/2026. La rebaja por caso de éxito (−500 €, primeros clientes) y
// las cifras de las cuotas no se publican: se ofrecen solo en la reunión.

// Lo que incluye cada pago, en una línea por punto: la tarjeta tiene que
// leerse de un vistazo, el detalle está en las preguntas frecuentes.
const ALTA = [
    "Diagnóstico de cómo producís hoy vuestras cuentas",
    "Plugin instalado y conectado a vuestra librería de Figma y a vuestro Excel",
    "Los 3 primeros másters de cada cuenta, preparados junto a vuestro diseñador",
    "Vuestra primera campaña real, generada y entregada",
    "Formación hasta que vuestro equipo prepara un máster sin ayuda",
];

const CUOTA = [
    "Campañas, piezas e idiomas ilimitados",
    "Plugin actualizado cuando Figma cambia",
    "Servidor y conexión con vuestro Excel",
    "Soporte cuando algo no funciona, con respuesta en un día laborable",
];

// Mensual o anual: cambia el mantenimiento. El anual son 10 meses: dos gratis.
const PLANES = {
    mensual: { importe: "99€", periodo: "/mes", extra: "Mínimo 12 meses; después, mes a mes." },
    anual: { importe: "990€", periodo: "/año", extra: "Dos meses gratis." },
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
                Pagáis una vez por dejarlo funcionando y un mantenimiento pequeño para que siga funcionando. Sin
                cuota por diseñador: lo puede usar todo el equipo. Las campañas y las piezas no cuentan.
            </p>

            {/* Mensual / anual: cambia el mantenimiento; la puesta en marcha es la misma. */}
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
                            <h3 className={s.etiquetaCifra}>Puesta en marcha</h3>
                            <p className={s.importe}>
                                2.900€<span className={s.iva}>+ IVA</span>
                            </p>
                            <p className={s.letraPequena}>Una vez, para una cuenta. Para tres cuentas, 3.900 €.</p>
                        </div>
                        <span className={s.mas} aria-hidden="true">+</span>
                        <div className={s.cifra}>
                            <h3 className={s.etiquetaCifra}>Mantenimiento</h3>
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
                    Si vuestro equipo dedica 10 horas a la semana a repetir piezas de una cuenta, son unos 700 € al mes
                    de su tiempo. <strong>La puesta en marcha se recupera en unos cinco meses</strong>, y desde entonces esas horas
                    vuelven a trabajo de diseño que sí facturáis.
                </p>

                <div className={`${s.bloque} ${s.columnas}`}>
                    <div>
                        <span className={s.pastilla}>La puesta en marcha incluye</span>
                        <ul className={s.lista}>
                            {ALTA.map((t) => <li key={t} data-punto>{t}</li>)}
                        </ul>
                    </div>
                    <div>
                        <span className={s.pastilla}>El mantenimiento incluye</span>
                        <ul className={s.lista}>
                            {CUOTA.map((t) => <li key={t} data-punto>{t}</li>)}
                        </ul>
                    </div>
                </div>
            </article>

            <p className={s.nota}>
                Una cuenta es cada marca para la que hacéis piezas. La puesta en marcha se paga la mitad al empezar
                y la mitad al entregar la primera campaña; si preferís cuotas, también se puede. Cuenta extra más
                adelante, 700 € (conectada y con sus 3 primeros másters); el mantenimiento no cambia. Los másters
                siguientes los prepara vuestro equipo, sin coste; si preferís que lo hagamos nosotros, 150 € por
                máster. Formación de otra persona, 600 €. Adaptamos, no diseñamos desde cero.
            </p>

            <div className={s.barra} data-barra aria-hidden="true">
                <span className={s.barraImporte}>
                    2.900€ + {p.importe}
                    <span className={s.iva}>{p.periodo}</span>
                </span>
                <Boton href={CONTACTO_DEMO} variante="tinta" className={s.barraBoton} tabIndex={-1}>
                    Solicitar demo
                </Boton>
            </div>
        </section>
    );
}
