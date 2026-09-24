"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import FondoVivo from "./FondoVivo.jsx";
import Boton from "./Boton.jsx";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Demo.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Vídeo en Bunny Stream (biblioteca / vídeo). El reproductor de Bunny
// solo se carga al pulsar play, y entonces arranca desde el principio y
// con sonido. Antes, en la portada, corre en bucle y sin sonido un clip
// de 16 s (1:52–2:08, cuando salen las piezas generadas): sin audio, el
// arranque del vídeo (la hoja y la voz) no dice nada.
const BUNNY = { biblioteca: "693492", video: "4b3f5591-b25e-4435-8434-95e7e4fbe65d" };
const REPRODUCTOR = `https://player.mediadelivery.net/embed/${BUNNY.biblioteca}/${BUNNY.video}?autoplay=true&preload=true&responsive=true`;
const DURACION = "2:56";
const VISTA_PREVIA = "/landing/demo-vista-previa.mp4";

// La vista previa solo se monta cuando la portada está a la vista, y
// nunca con "reducir movimiento" o "ahorro de datos": ahí se queda la
// imagen fija.
function useVistaPrevia(ref) {
    const [activa, setActiva] = useState(false);
    useEffect(() => {
        const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const ahorro = navigator.connection?.saveData;
        if (quieto || ahorro || !ref.current) return undefined;
        const vigia = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setActiva(true);
                vigia.disconnect();
            }
        }, { rootMargin: "200px" });
        vigia.observe(ref.current);
        return () => vigia.disconnect();
    }, [ref]);
    return activa;
}

export default function Demo() {
    const raiz = useRef(null);
    const [reproduciendo, setReproduciendo] = useState(false);
    const portada = useRef(null);
    const vistaPrevia = useVistaPrevia(portada);

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

                // El marco del vídeo crece hasta su tamaño mientras entra
                // en pantalla, ligado al scroll.
                const marco = q("[data-marco]")[0];
                gsap.fromTo(marco, { scale: 0.9 }, {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: { trigger: marco, start: "top bottom", end: "center center", scrub: 0.6 },
                });

                // Titular línea a línea y el resto detrás, una sola vez al
                // llegar a la sección.
                let vivo = true;
                ctx.add("textos", () => {
                    const titulo = q("[data-titulo]")[0];
                    const corte = cortarEnLineas(titulo);
                    gsap.set(titulo, { autoAlpha: 1 });
                    gsap.timeline({
                        scrollTrigger: alLlegar(raiz.current, "top 70%"),
                        onComplete: () => corte.revert(),
                    })
                        .from(corte.lines, { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.09 })
                        .from(q("[data-sube]"), { autoAlpha: 0, y: 16, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.35);
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
        <section id="demo" className={s.demo} ref={raiz}>
            <FondoVivo />

            <div className={s.contenido}>
                <h2 className={s.titulo} data-titulo data-entra>
                    <span className={s.cian}>Mira cómo hacemos </span>
                    una campaña entera en <span className={s.subrayado}>3 minutos</span>
                </h2>

                <p className={s.subtitulo} data-sube data-entra>
                    Entra el brief de una semana y salen 42 piezas en varios formatos. Sin IA, respetando la
                    identidad del cliente.
                </p>

                <div className={s.marco} data-marco>
                    {reproduciendo ? (
                        <iframe
                            className={s.reproductor}
                            src={REPRODUCTOR}
                            title="Demo de Automaker: una campaña entera en 3 minutos"
                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                        />
                    ) : (
                        <button
                            type="button"
                            ref={portada}
                            className={s.portada}
                            onClick={() => setReproduciendo(true)}
                            aria-label={`Reproducir la demo (${DURACION})`}
                        >
                            <img className={s.poster} src="/landing/demo-poster.webp" alt="" width={1600} height={900} />
                            {vistaPrevia && (
                                <video
                                    className={s.poster}
                                    src={VISTA_PREVIA}
                                    poster="/landing/demo-poster.webp"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    aria-hidden="true"
                                />
                            )}
                            <span className={s.play} aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M8.5 5.8v12.4L18.6 12z" />
                                </svg>
                            </span>
                            <span className={s.duracion} aria-hidden="true">Ver la demo · {DURACION}</span>
                        </button>
                    )}
                </div>

                <div className={s.botones} data-sube data-entra>
                    <Boton href="#contacto" variante="claro">Quiero una demo personalizada</Boton>
                    <Boton href="#precio" variante="cian">Ver precio</Boton>
                </div>
            </div>
        </section>
    );
}
