"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Boton from "./Boton.jsx";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./ParaQuien.module.scss";
import { CONTACTO_DEMO } from "../contacto.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// "Para quién es y sobre todo para quién no es" (Figma: y=10560–11900).
// Cada tarjeta del sí lleva su propio degradado de Figma.
const SI = [
    { texto: "Lanzáis campañas con estructura repetida, semanales o quincenales", fondo: "linear-gradient(29deg, #CFD5DA 0%, #F5FAFF 83%, #BFCDDA 100%)" },
    { texto: "Cada campaña son decenas o cientos de piezas en muchos formatos", fondo: "linear-gradient(29deg, #C3EBC1 0%, #EFFEFF 83%, #C8F1F4 100%)" },
    { texto: "Las piezas se repiten una y otra vez con contenido personalizado", fondo: "linear-gradient(29deg, #BFDAD1 0%, #F5FFFC 83%, #BFDAD1 100%)" },
    { texto: "El mismo mensaje sale en display, redes, web, app… cada uno con sus medidas", fondo: "linear-gradient(29deg, #D3E4E5 0%, #F3F9FA 83%, #C8F1F4 100%)" },
    { texto: "Tenéis tiendas o franquicias que necesitan su propia versión", fondo: "linear-gradient(29deg, #EBF1D8 0%, #F3F9FA 83%, #DBE7F2 100%)" },
];

const NO = [
    "Cada campaña es una creatividad nueva desde cero",
    "Hacéis pocas piezas al mes",
    "Queréis que la herramienta decida la composición o escriba los textos",
    "El grueso de vuestro trabajo es motion o vídeo",
    "Ya tenéis una plataforma de producción dinámica y os funciona",
];

export default function ParaQuien() {
    const raiz = useRef(null);

    useLayoutIso(() => {
        const mm = gsap.matchMedia();

        mm.add(
            { animar: "(prefers-reduced-motion: no-preference)", quieto: "(prefers-reduced-motion: reduce)" },
            (ctx) => {
                const q = gsap.utils.selector(raiz);

                if (ctx.conditions.quieto) {
                    gsap.set(q("[data-entra]"), { autoAlpha: 1 });
                    return undefined;
                }

                // Las tarjetas del sí entran desde su lado y las del no desde
                // el suyo, fila a fila: se leen como pares.
                gsap.set(q("[data-si]"), { autoAlpha: 0, x: -24 });
                gsap.set(q("[data-no]"), { autoAlpha: 0, x: 24 });
                ScrollTrigger.batch(q("[data-si], [data-no]"), {
                    start: "top 88%",
                    onEnter: (lote) =>
                        gsap.to(lote, { autoAlpha: 1, x: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }),
                });

                let vivo = true;
                ctx.add("textos", () => {
                    const titulo = q("[data-titulo]")[0];
                    const corte = cortarEnLineas(titulo);
                    gsap.set(titulo, { autoAlpha: 1 });
                    gsap.timeline({
                        scrollTrigger: alLlegar(titulo, "top 82%"),
                        onComplete: () => corte.revert(),
                    })
                        .from(corte.lines, { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.09 })
                        .from(q("[data-sube]"), { autoAlpha: 0, y: 14, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.3);
                });
                esperarFuente().then(() => vivo && ctx.textos());

                return () => {
                    vivo = false;
                };
            },
            raiz
        );

        return () => mm.revert();
    }, []);

    return (
        <section id="para-quien" className={s.paraQuien} ref={raiz}>
            <h2 className={s.titulo} data-titulo data-entra>
                Para quién es<span className={s.gris}> y sobre todo </span>para quién no es.
            </h2>

            <div className={s.columnas}>
                <div className={s.columna}>
                    <h3 className={s.cabecera} data-sube data-entra>Automaker es para ti</h3>
                    <ul className={s.lista}>
                        {SI.map((t) => (
                            <li key={t.texto} className={s.si} style={{ "--fondo": t.fondo }} data-si>
                                {t.texto}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={s.columna}>
                    <h3 className={`${s.cabecera} ${s.cabeceraNo}`} data-sube data-entra>No es para ti</h3>
                    <ul className={s.lista}>
                        {NO.map((t) => (
                            <li key={t} className={s.filaNo}>
                                <span className={s.no} data-no>
                                    {/* Borde discontinuo con trazos de 12 px, como en
                                        Figma: con CSS no se puede fijar el largo. */}
                                    <svg className={s.discontinuo} aria-hidden="true">
                                        <rect width="100%" height="100%" rx="25" />
                                    </svg>
                                    {t}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={s.botones} data-sube data-entra>
                <Boton href={CONTACTO_DEMO} variante="tinta">Quiero una demo personalizada</Boton>
                <Boton href="#precio" variante="cian">Ver precio</Boton>
            </div>
        </section>
    );
}
