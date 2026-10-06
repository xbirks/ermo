"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import FondoVivo from "./FondoVivo.jsx";
import Boton from "./Boton.jsx";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./NoHace.module.scss";
import { CONTACTO_DEMO } from "../contacto.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// "Lo que Automaker no hace" (Figma: y=5687–7377). Un tronco central con
// brazos hacia tarjetas a un lado y otro. `sube` es el margen superior de
// cada tarjeta en escritorio, sacado de sus alturas en Figma: las de un
// lado se solapan en vertical con las del otro.
const TARJETAS = [
    {
        lado: "izq",
        sube: 0,
        fuerte: "No sustituye",
        titulo: " a vuestro equipo creativo.",
        texto: "Les quita la parte del trabajo que nunca quisieron hacer. El criterio, la dirección de arte y las decisiones siguen siendo suyas.",
    },
    {
        lado: "der",
        sube: -106,
        fuerte: "No usa IA",
        titulo: " para diseñar",
        texto: "Por eso el resultado es idéntico las mil veces. Nada se inventa, nada se mueve tres píxeles, nada sorprende en revisión.",
    },
    {
        lado: "izq",
        sube: 39,
        fuerte: "No inventa",
        titulo: " creatividades ni propone composiciones.",
        texto: "Solo rellena lo que vuestro equipo ya diseñó y aprobó. Si no está en la plantilla, no existe.",
    },
    {
        lado: "der",
        sube: -80,
        fuerte: "No adapta",
        titulo: " un diseño a un formato que no exista.",
        texto: "Cada formato nuevo lo crea un diseñador, una vez. A partir de ahí, se produce solo para siempre.",
    },
    {
        lado: "izq",
        sube: 4,
        fuerte: "No decide",
        titulo: " si esta semana toca foto de producto o lifestyle.",
        texto: "Eso lo dice el brief. Automaker lee la hoja y coloca exactamente lo que pone en ella.",
    },
];

export default function NoHace() {
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

                const arbol = q("[data-arbol]")[0];
                const tronco = q("[data-tronco]")[0];
                const punta = q("[data-punta]")[0];

                // El tronco crece con el scroll. Es una sola línea (y el
                // punto de luz de su extremo), así que va fluido.
                gsap.set(tronco, { scaleY: 0, transformOrigin: "50% 0%" });
                gsap.timeline({
                    scrollTrigger: {
                        trigger: arbol,
                        start: "top 70%",
                        end: "bottom 65%",
                        scrub: 0.8,
                        invalidateOnRefresh: true,
                    },
                })
                    .to(tronco, { scaleY: 1, ease: "none" }, 0)
                    .fromTo(punta, { y: 0, autoAlpha: 1 }, { y: () => arbol.offsetHeight, ease: "none" }, 0)
                    .to(punta, { autoAlpha: 0, duration: 0.04 }, 0.96);

                // Cada brazo brota cuando el tronco llega a su altura; después
                // se dibuja la tarjeta y entra el texto. Con tiempo propio,
                // no atado al scroll: siempre se ve suave.
                q("[data-tarjeta]").forEach((tarjeta) => {
                    const t = gsap.utils.selector(tarjeta);
                    const izquierda = tarjeta.dataset.lado === "izq";
                    gsap.set(t("[data-rama]"), { scaleX: 0, transformOrigin: izquierda ? "100% 50%" : "0% 50%" });
                    gsap.set(tarjeta, { borderColor: "rgba(255,255,255,0)" });
                    gsap.set(t("[data-sube]"), { autoAlpha: 0, y: 16 });

                    gsap.timeline({ scrollTrigger: alLlegar(tarjeta, "top 68%") })
                        .to(t("[data-rama]"), { scaleX: 1, duration: 0.5, ease: "power2.out" })
                        .to(tarjeta, { borderColor: "rgba(255,255,255,1)", duration: 0.6, ease: "power1.out" }, 0.35)
                        .to(t("[data-sube]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.45);
                });

                // El tronco desemboca en la tarjeta blanca.
                const siHace = q("[data-si-hace]")[0];
                gsap.set(siHace, { autoAlpha: 0, scale: 0.96, y: 20 });
                gsap.set(q("[data-botones]"), { autoAlpha: 0, y: 14 });
                gsap.timeline({ scrollTrigger: alLlegar(siHace, "top 78%") })
                    .to(siHace, { autoAlpha: 1, scale: 1, y: 0, duration: 1, ease: "expo.out" })
                    .to(q("[data-botones]"), { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.35);

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
                        scrollTrigger: alLlegar(titulo, "top 82%"),
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
        <section id="que-no-hace" className={s.noHace} ref={raiz}>
            <FondoVivo />

            <div className={s.contenido}>
                <h2 className={s.titulo} data-titulo data-entra>
                    <span className={s.cian}>Lo que Automaker </span>no hace
                </h2>

                <div className={s.arbol} data-arbol>
                    <span className={s.tronco} data-tronco aria-hidden="true" />
                    <span className={s.punta} data-punta aria-hidden="true" />

                    <ul className={s.tarjetas}>
                        {TARJETAS.map((c) => (
                            <li
                                key={c.fuerte}
                                className={`${s.tarjeta} ${c.lado === "izq" ? s.izq : s.der}`}
                                style={{ "--sube": `${c.sube}px` }}
                                data-tarjeta
                                data-lado={c.lado}
                            >
                                <span className={s.rama} data-rama aria-hidden="true" />
                                <h3 className={s.tituloTarjeta} data-sube>
                                    <strong>{c.fuerte}</strong>
                                    {c.titulo}
                                </h3>
                                <p className={s.textoTarjeta} data-sube>{c.texto}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={s.siHace} data-si-hace>
                    <h3 className={s.siHaceTitulo}>
                        <span className={s.gris}>Lo que sí hace: </span>la repetición
                    </h3>
                    <p className={s.siHaceTexto}>
                        Los cientos de veces que una plantilla ya aprobada se rellena con datos nuevos. Los cambios de
                        precio, de foto, de fecha, de formato… El trabajo creativo se hace una vez y se conserva.{" "}
                        <strong>El diseñador deja de perder tiempo con repeticiones y revisiones.</strong>
                    </p>
                </div>

                <div className={s.botones} data-botones>
                    <Boton href={CONTACTO_DEMO} variante="claro">Quiero una demo personalizada</Boton>
                    <Boton href="#precio" variante="cian">Ver precio</Boton>
                </div>
            </div>
        </section>
    );
}
