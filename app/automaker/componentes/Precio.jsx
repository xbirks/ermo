"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Boton from "./Boton.jsx";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Precio.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

// "Precio" (Figma: y=8623–10400). Es el punto donde se decide: todo el
// contenido está a la vista desde el principio. El movimiento solo
// acompaña (entradas cortas, una vez) y nunca esconde nada.

const INCLUYE = [
    {
        titulo: "Diagnóstico",
        texto: "Análisis de la producción actual de una marca o cuenta: piezas, formatos, brief y flujo de trabajo.",
    },
    {
        titulo: "3 campañas máster parametrizadas",
        texto: "La campaña de ofertas, el lanzamiento o la promo de temporada… De cada máster salen todas sus referencias: tamaños, idiomas, descuentos y categorías. Un máster son tantas piezas como necesites.",
    },
    {
        titulo: "Plugin",
        texto: "Instalado en vuestro Figma y mapeado contra las claves de vuestra biblioteca publicada, con las reglas de composición, ajuste de texto y jerarquía de vuestras piezas.",
    },
    {
        titulo: "Entrada de datos",
        texto: "Hoja de cálculo o formulario con validación de campos y control de estado, desde donde se lanza cada campaña y se sabe qué está listo para generar.",
    },
    {
        titulo: "Formación al equipo, construyendo",
        texto: "Las plantillas restantes las hacen vuestros diseñadores con nosotros al lado. No es un manual: salís habiendo ampliado el sistema con vuestras manos. Formatos nuevos, cambios globales y detección de errores antes de publicar.",
    },
    {
        titulo: "Revisión y checklist de publicación",
        texto: "Validamos las primeras plantillas que hagáis solos, para que la autonomía sea de verdad.",
    },
    {
        titulo: "Campañas ilimitadas",
        texto: "Generad 40 piezas o 4.000 a la semana: el precio no cambia nunca.",
    },
];

export default function Precio() {
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
                Pago único con alcance definido: sabéis qué entra, cuánto cuesta y cuándo estará funcionando. La
                implementación tiene dos fases: diagnóstico de vuestra producción actual y puesta en marcha.
            </p>

            <article className={s.tarjeta} data-tarjeta>
                <div className={s.cabecera}>
                    <div>
                        <h3 className={s.producto}>
                            <span className={s.gris}>Implementación de</span> Automaker
                        </h3>
                        <p className={s.importe}>
                            6000€<span className={s.iva}>+ IVA</span>
                        </p>
                        <p className={s.letraPequena}>
                            Pago único. Sin licencia anual, sin cuota por usuario, sin coste por pieza generada.
                        </p>
                    </div>
                    <Boton href="#contacto" variante="tinta" className={s.cta}>Solicitar demo</Boton>
                </div>

                <p className={s.amortiza}>
                    Un diseñador dedica entre 10 y 16 horas semanales a maquetación repetitiva (entre 1200€ y 1900€ al
                    mes a precio de agencia). <strong>Automaker se amortiza en 3 a 5 meses con un solo diseñador.</strong>{" "}
                    Después, esas horas son margen.
                </p>

                <div className={s.bloque}>
                    <span className={s.pastilla}>Qué incluye</span>
                    <ul className={s.incluye}>
                        {INCLUYE.map((i) => (
                            <li key={i.titulo} data-punto>
                                <h4 className={s.puntoTitulo}>{i.titulo}</h4>
                                <p className={s.puntoTexto}>{i.texto}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={s.bloque}>
                    <span className={s.pastilla}>Duración</span>
                    <p className={s.duracion} data-punto>
                        De 30 a 45 días. El plazo exacto se confirma en el diagnóstico, y hay entregas visibles cada
                        semana.
                    </p>
                </div>
            </article>

            <p className={s.nota}>
                Cada tipo de pieza que queráis añadir después es un encargo independiente. Si lo construye vuestro
                equipo siguiendo el criterio de los componentes, no nos necesitáis para él.
            </p>

            <div className={s.barra} data-barra aria-hidden="true">
                <span className={s.barraImporte}>
                    6000€ <span className={s.iva}>+ IVA</span>
                </span>
                <Boton href="#contacto" variante="tinta" className={s.barraBoton} tabIndex={-1}>
                    Solicitar demo
                </Boton>
            </div>
        </section>
    );
}
