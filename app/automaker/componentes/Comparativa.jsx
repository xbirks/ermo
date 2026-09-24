"use client";

import { useRef } from "react";
import { IBM_Plex_Mono } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Comparativa.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

// En Figma los criterios van en Consolas, que solo existe en Windows. IBM
// Plex Mono es del mismo estilo y se sirve desde la web: se ve igual en
// todos los equipos.
const mono = IBM_Plex_Mono({ weight: "400", subsets: ["latin"], variable: "--f-mono", display: "swap" });

// "Automaker vs otros" (Figma: y=7377–8623).
const FILAS = [
    {
        criterio: "Propiedad",
        otros: "Todo vive dentro del SaaS. Si dejas de pagar, pierdes todo.",
        automaker: <>El sistema es de <strong>tu propiedad</strong>. Vuestros archivos, vuestras cuentas.</>,
    },
    {
        criterio: "Coste",
        otros: "Pago mensual por usuario. Aprox. 7.000 € al año.",
        automaker: <><strong>Pago único.</strong> Sin licencia por persona.</>,
    },
    {
        criterio: "Diseño",
        otros: "Los diseñadores están muy limitados con el diseño, tipografías, efectos.",
        automaker: <>Los diseñadores mantienen <strong>Figma</strong> como software de diseño.</>,
    },
    {
        criterio: "Creatividad",
        otros: "Limitados a lo que su editor sabe representar.",
        automaker: "Todo lo que Figma permite, que es todo lo que ya hacéis.",
    },
    {
        criterio: "Feedback de última hora",
        otros: "Hay que salir de la plataforma y rehacer la pieza aparte o perder horas modificando plantillas para un ajuste sencillo.",
        automaker: <>Se ajusta la pieza/componente desde Figma y se vuelve a exportar. <strong>&lt;10 min.</strong></>,
    },
    {
        criterio: "De dónde salen los datos",
        otros: "El project manager o el propio diseñador tiene que volcarlos a mano.",
        automaker: <>Del sitio donde ya están: nos adaptamos a <strong>vuestro Excel</strong>, vuestro gestor, vuestro brief.</>,
    },
    {
        criterio: "Exportación",
        otros: "Los formatos de su ecosistema, orientados a display.",
        automaker: "Lo que vuestro cliente pida. Estático, GIF, Display, PSD, WebP, PNG…",
    },
];

// Móvil: la tabla se desplaza en horizontal. Para que se descubra, se
// asoma hacia la izquierda lo justo para enseñar el arranque de la
// columna de Automaker, se queda un momento y vuelve, cada pocos
// segundos, hasta que el usuario la toca o la desliza; entonces se para
// para siempre.
function montarEmpujon(q) {
    const desplazable = q("[data-desplazable]")[0];
    const interior = q("[data-interior]")[0];

    const empujon = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 2.2 })
        .to(interior, { x: -170, duration: 0.8, ease: "power3.inOut" })
        .to(interior, { x: 0, duration: 0.9, ease: "power3.inOut" }, "+=0.7");

    let parado = false;
    // Sin animación asociada: solo el aviso de llegada (ver alLlegar).
    const disparo = ScrollTrigger.create({
        trigger: desplazable,
        start: "top 70%",
        end: "max",
        onEnter: () => !parado && empujon.play(),
    });

    const parar = () => {
        parado = true;
        empujon.kill();
        disparo.kill();
        gsap.to(interior, { x: 0, duration: 0.3, ease: "power2.out" });
        quitar();
    };
    const quitar = () => {
        desplazable.removeEventListener("scroll", parar);
        desplazable.removeEventListener("pointerdown", parar);
    };
    desplazable.addEventListener("scroll", parar, { passive: true });
    desplazable.addEventListener("pointerdown", parar, { passive: true });

    return () => {
        quitar();
        empujon.kill();
    };
}

export default function Comparativa() {
    const raiz = useRef(null);

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

                if (ctx.conditions.quieto) {
                    gsap.set(q("[data-entra]"), { autoAlpha: 1 });
                    return undefined;
                }

                const limpiar = [];
                if (ctx.conditions.movil) limpiar.push(montarEmpujon(q));

                // La columna de Automaker sube un poco antes que las filas;
                // en cada fila entra primero lo de "otros" y después la
                // respuesta de Automaker.
                const tabla = q("[data-tabla]")[0];
                gsap.set(q("[data-columna]"), { autoAlpha: 0, y: 30 });
                gsap.set(q("[data-celda]"), { autoAlpha: 0, y: 12 });
                const tl = gsap.timeline({ scrollTrigger: alLlegar(tabla, "top 75%") });
                tl.to(q("[data-columna]"), { autoAlpha: 1, y: 0, duration: 1, ease: "expo.out" }, 0);
                q("[data-fila]").forEach((fila, i) => {
                    const f = gsap.utils.selector(fila);
                    tl.to(f("[data-celda]"), { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.12 }, 0.2 + i * 0.1);
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
                    limpiar.forEach((f) => f());
                };
            },
            raiz
        );

        return () => mm.revert();
    }, []);

    return (
        <section id="comparativa" className={`${s.comparativa} ${mono.variable}`} ref={raiz}>
            <div className={s.contenido}>
                <h2 className={s.titulo} data-titulo data-entra>
                    Automaker <span className={s.gris}>vs otros</span>
                </h2>
                <p className={s.intro} data-sube data-entra>
                    Automatizar la maquetación de piezas lo hacen varias plataformas. Muchas, de hecho. Y todas tienen
                    el mismo problema: <strong>te secuestran como cliente</strong>. Todas tus creatividades viven bajo su
                    propio sistema. No puedes descargarlas y editarlas, no puedes dejar de pagar o si no, pierdes todos
                    tus diseños, e incluso te limitan a la hora de ser creativo.
                </p>

                {/* En móvil este contenedor se desplaza en horizontal. */}
                <div className={s.desplazable} data-desplazable>
                <div className={s.interior} data-interior>
                <div className={s.cabeceras} aria-hidden="true" data-sube data-entra>
                    <span />
                    <span className={s.cabeceraOtros}>Otros</span>
                    <span className={s.cabeceraAutomaker}>Automaker</span>
                </div>

                <div className={s.tabla} role="table" aria-label="Comparativa entre Automaker y otras plataformas" data-tabla>
                    {/* Fondo blanco de la columna de Automaker: va por detrás
                        de las celdas y sobresale del borde de la tabla. */}
                    <span className={s.columnaAutomaker} aria-hidden="true" data-columna />

                    {FILAS.map((f) => (
                        <div key={f.criterio} className={s.fila} role="row" data-fila>
                            <div className={s.criterio} role="rowheader" data-celda>{f.criterio}:</div>
                            <div className={s.otros} role="cell" data-celda>
                                <span>{f.otros}</span>
                            </div>
                            <div className={s.automaker} role="cell" data-celda>
                                <span>{f.automaker}</span>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
                </div>
            </div>
        </section>
    );
}
