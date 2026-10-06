"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Ahorro.module.scss";

gsap.registerPlugin(ScrollTrigger);

// Tarjeta del ahorro (Figma 90:319). Entra suave al llegar y el
// subrayado de "a la semana" se dibuja de izquierda a derecha.
export default function Ahorro() {
    const raiz = useRef(null);

    useLayoutIso(() => {
        const mm = gsap.matchMedia();

        mm.add(
            { animar: "(prefers-reduced-motion: no-preference)", quieto: "(prefers-reduced-motion: reduce)" },
            (ctx) => {
                const tarjeta = raiz.current;
                const q = gsap.utils.selector(raiz);

                if (ctx.conditions.quieto) {
                    gsap.set(q("[data-entra]"), { autoAlpha: 1 });
                    tarjeta.classList.add(s.visto);
                    return undefined;
                }

                // La tarjeta sube, ligada al scroll, hasta quedar montada
                // sobre el final de la sección del vídeo: la cifra no se
                // puede pasar de largo.
                gsap.fromTo(tarjeta, { y: 160 }, {
                    y: 0,
                    ease: "none",
                    scrollTrigger: { trigger: tarjeta.parentElement, start: "top bottom", end: "top 50%", scrub: 0.8 },
                });

                gsap.timeline({
                    scrollTrigger: alLlegar(tarjeta, "top 85%"),
                    onStart: () => tarjeta.classList.add(s.visto),
                }).from(q("[data-entra]"), { autoAlpha: 0, y: 24, duration: 1, ease: "power3.out", stagger: 0.12 });

                return () => tarjeta.classList.remove(s.visto);
            },
            raiz
        );

        return () => mm.revert();
    }, []);

    return (
        <section className={s.seccion} aria-label="Ahorro de tiempo">
            <div className={s.tarjeta} ref={raiz}>
                <div className={s.cifra} data-entra>
                    <p className={s.horas}>10h a 16h</p>
                    <p className={s.detalle}>
                        de ahorro <span className={s.subrayado}>a la semana</span> por diseñador.
                    </p>
                </div>

                <div className={s.relato} data-entra>
                    <p>
                        Durante meses construí este sistema mientras seguía maquetando campañas para grandes cuentas
                        a mano. Estuve una temporada haciendo el mismo trabajo de las dos formas, así que{" "}
                        <strong>pude cronometrar las dos</strong>. Con el plugin ya terminado, las piezas de un mes
                        entero salían en diez o quince minutos. Revisadas y enviadas.
                    </p>
                    <p>
                        Puesto de otra manera: entre un día y medio y dos días de cada semana, que vuelven al equipo
                        para hacer trabajo de diseño.
                    </p>
                </div>
            </div>
        </section>
    );
}
