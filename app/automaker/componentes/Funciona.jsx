"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Funciona.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

const RUTA = "/landing/funciona";

// Tres pasos. El del ticket de seguimiento (Basecamp, Asana…) no va aquí:
// es una integración a medida (hoy solo existe la de Basecamp, hecha para
// un cliente) y se menciona como extra en la nota del precio.
const PASOS = [
    {
        captura: "paso-1-brief",
        alt: "Excel en Google Sheets con las campañas de la semana, una por fila",
        iconos: [["sheets", "Google Sheets"]],
        titulo: "Rellenáis un Excel",
        texto: (
            <>
                En Google Sheets. Una fila, una campaña: titular, precio, picto, descuento y los formatos que hacen
                falta. <strong>Lo puede rellenar la cuenta, el cliente o quien lleve la campaña</strong>, sin abrir
                Figma. Los desplegables solo dejan elegir lo que existe.
            </>
        ),
    },
    {
        captura: "paso-3-plugin",
        alt: "El plugin de Figma generando las piezas de la campaña",
        iconos: [["figma", "Figma"]],
        titulo: "Un clic en Figma y salen todas las piezas",
        texto: (
            <>
                Vuestro diseñador diseña cada formato una vez. Después, el plugin pone en cada pieza el texto, la
                foto, el picto y el descuento de vuestra librería, cada uno en su hueco.{" "}
                <strong>Si un texto no cabe, avisa</strong>: nunca sale una pieza a medias que parezca terminada.
            </>
        ),
    },
    {
        captura: "paso-4-export",
        alt: "Carpetas exportadas con las piezas ordenadas por formato",
        iconos: [["ps", "Photoshop"], ["jpg", "JPG"], ["png", "PNG"], ["gif", "GIF"], ["webp", "WebP"]],
        titulo: "Exportación lista para entregar",
        texto: (
            <>
                Cada pieza en su formato, con su nombre y en su carpeta. WebP, JPG, PNG, GIF animado y PSD.{" "}
                <strong>Sin que nadie renombre nada a mano.</strong> Las carpetas se ordenan como decidáis en el Excel.
            </>
        ),
    },
];


// Cada paso entra al llegar: primero la captura, luego el texto con los
// iconos escalonados. La captura, además, se desplaza un poco dentro de
// su marco con el scroll, para dar profundidad.
function montarPasos(q) {
    q("[data-paso]").forEach((paso) => {
        const p = gsap.utils.selector(paso);

        gsap.timeline({ scrollTrigger: alLlegar(paso, "top 82%") })
            .from(p("[data-tarjeta]"), { autoAlpha: 0, y: 40, scale: 0.97, duration: 1.1, ease: "expo.out" })
            .from(p("[data-sube]"), { autoAlpha: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.2)
            .from(p("[data-icono]"), { autoAlpha: 0, y: 10, scale: 0.85, duration: 0.6, ease: "back.out(2)", stagger: 0.06 }, 0.25);

        gsap.fromTo(p("[data-imagen]"), { yPercent: -4 }, {
            yPercent: 4,
            ease: "none",
            scrollTrigger: { trigger: paso, start: "top bottom", end: "bottom top", scrub: true },
        });
    });
}

export default function Funciona() {
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

                montarPasos(q);

                let vivo = true;
                ctx.add("titulo", () => {
                    const titulo = q("[data-titulo]")[0];
                    const corte = cortarEnLineas(titulo);
                    gsap.set(titulo, { autoAlpha: 1 });
                    gsap.from(corte.lines, {
                        yPercent: 115,
                        duration: 1.2,
                        ease: "expo.out",
                        stagger: 0.09,
                        scrollTrigger: alLlegar(titulo, "top 80%"),
                        onComplete: () => corte.revert(),
                    });
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
        <section id="como-funciona" className={s.funciona} ref={raiz}>
            <h2 className={s.titulo} data-titulo data-entra>
                <span className={s.gris}>Así funciona</span> Automaker
            </h2>

            <ol className={s.pasos}>
                {PASOS.map((p) => (
                    <li key={p.captura} className={s.paso} data-paso>
                        <div className={s.tarjeta} data-tarjeta>
                            <div className={s.ventana}>
                                <img
                                    className={s.imagen}
                                    src={`${RUTA}/${p.captura}.webp`}
                                    alt={p.alt}
                                    loading="lazy"
                                    data-imagen
                                />
                            </div>
                        </div>

                        <div className={s.texto}>
                            {p.opcional && <span className={s.opcional} data-sube>Opcional</span>}
                            <div className={s.iconos}>
                                {p.iconos.map(([archivo, nombre]) => (
                                    <img
                                        key={archivo}
                                        className={s.icono}
                                        src={`${RUTA}/icono-${archivo}.webp`}
                                        alt={nombre}
                                        title={nombre}
                                        height={46}
                                        loading="lazy"
                                        data-icono
                                    />
                                ))}
                            </div>
                            <h3 className={s.tituloPaso} data-sube>{p.titulo}</h3>
                            <p className={s.cuerpo} data-sube>{p.texto}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    );
}
