"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Funciona.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

const RUTA = "/landing/funciona";

// Los cuatro pasos (Figma 90:315–90:393). Los iconos llevan el alto de
// Figma (46 px); el ancho sale de la propia imagen.
const PASOS = [
    {
        captura: "paso-1-brief",
        alt: "Hoja del brief semanal con todas las campañas de la semana",
        iconos: [["sheets", "Google Sheets"], ["excel", "Excel"]],
        titulo: "Entra el brief del cliente",
        texto: (
            <>
                Desde un formulario hecho a vuestra medida, desde el Excel maestro que ya usáis, o desde el gestor de
                tareas donde vivís hoy. <strong>Vosotros elegís la puerta de entrada.</strong> El sistema se adapta a
                ella, no al revés.
            </>
        ),
    },
    {
        captura: "paso-2-ticket",
        alt: "Ticket de seguimiento abierto automáticamente con el resumen de las campañas",
        opcional: true,
        iconos: [["basecamp", "Basecamp"], ["notion", "Notion"], ["trello", "Trello"], ["jira", "Jira"], ["asana", "Asana"]],
        titulo: "Abrimos ticket de seguimiento y gestión",
        texto: (
            <>
                <strong>Nos conectamos a cualquier software de gestión</strong> y abrimos las conversaciones / hilos /
                tickets automáticamente para que el PM no tenga que hacerlo a mano.
            </>
        ),
    },
    {
        captura: "paso-3-plugin",
        alt: "El plugin de Figma generando las piezas de la campaña",
        iconos: [["figma", "Figma"]],
        titulo: "El plugin genera automáticamente las piezas con el contenido",
        texto: (
            <>
                Diseñamos y parametrizamos las plantillas para que durante tu día a día puedas{" "}
                <strong>generar cientos de piezas con tan solo un clic</strong>.
            </>
        ),
    },
    {
        captura: "paso-4-export",
        alt: "Carpetas exportadas con las piezas ordenadas por formato",
        iconos: [["ps", "Photoshop"], ["jpg", "JPG"], ["png", "PNG"], ["gif", "GIF"], ["webp", "WebP"]],
        titulo: "Exportación automática en múltiples formatos y envío",
        texto: (
            <>
                Cada pieza en su formato, con su nombre y en su carpeta. WebP, JPG, PNG, GIF animado y PSD con capas.{" "}
                <strong>Sin que nadie renombre nada a mano.</strong> Ordenado tal y como lo solicita el cliente.
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
