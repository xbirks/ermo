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

// "Automaker vs otros". En este borrador "otros" son dos familias: las
// herramientas que rellenan plantillas desde una hoja (algunas dentro del
// propio Figma) y las plataformas de producción creativa. No se nombra a
// ninguna marca: comparar precios con un producto que hace otras cosas
// puede leerse como publicidad engañosa. Datos y fuentes en
// automaker/docs/negocio/competencia-datos.md (consultados el 1/10/2026).
const FILAS = [
    {
        criterio: "Qué rellena desde el Excel",
        otros: "Textos e imágenes.",
        automaker: <>Textos, imágenes y <strong>componentes de vuestra librería</strong>: pictos, precios, descuentos, logos.</>,
    },
    {
        criterio: "Varios tamaños",
        otros: "Un diseño que se redimensiona solo. Con piezas complejas, la composición se descoloca.",
        automaker: <><strong>Un máster por formato</strong>, diseñado por una persona. El motor solo rellena.</>,
    },
    {
        criterio: "Textos largos y fotos",
        otros: "Lo revisa alguien, pieza a pieza.",
        automaker: <>El texto se ajusta a su caja y <strong>avisa si no cabe</strong>. El recorte de la foto respeta lo importante.</>,
    },
    {
        criterio: "De dónde salen los datos",
        otros: "Un archivo que se vuelve a subir cada vez que algo cambia.",
        automaker: <>Un <strong>Excel vivo</strong> en Google Sheets: se edita y se vuelve a generar.</>,
    },
    {
        criterio: "Diseño",
        otros: "Las plataformas traen su propio editor, limitado a lo que sabe representar.",
        automaker: <>Vuestros diseñadores siguen en <strong>Figma</strong>. Todo lo que Figma permite.</>,
    },
    {
        criterio: "Exportación",
        otros: "PNG, JPG o PDF, o los formatos de display de la plataforma.",
        automaker: <>Zip ordenado por carpetas. <strong>GIF animado, PSD, WebP</strong>, JPG y PNG.</>,
    },
    {
        criterio: "Coste",
        otros: "Plataformas de producción: desde unos 10.000 $ al año**. La empresa típica paga más de 50.000 $ al año*.",
        automaker: <><strong>Desde 250 € al mes.</strong> Campañas y piezas ilimitadas.</>,
    },
    {
        criterio: "Si os dais de baja",
        otros: "Las creatividades viven dentro de la plataforma.",
        automaker: <>Másters y piezas están en <strong>vuestro Figma y vuestras carpetas</strong>. Lo diseñado sigue siendo vuestro.</>,
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
                    Rellenar plantillas desde un Excel ya lo hacen muchas herramientas, algunas dentro del propio Figma.
                    Y hay plataformas enteras de producción creativa. <strong>Las plantillas rellenan textos. Automaker
                    monta campañas</strong>: elige el picto, el precio y el descuento de vuestra librería, respeta el
                    diseño de cada formato y os entrega el zip ordenado.
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

                <div className={s.fuentes} data-sube data-entra>
                    <p>
                        * Dato real: mediana de lo que pagan las empresas por una plataforma líder de producción
                        creativa, según compras reales recopiladas por{" "}
                        <a href="https://www.vendr.com/marketplace/celtra" target="_blank" rel="noopener noreferrer">Vendr</a>.
                        Consultado en octubre de 2026.
                    </p>
                    <p>
                        ** Estimación del precio mínimo de otra plataforma del sector, según{" "}
                        <a href="https://www.itqlick.com/bannerflow/pricing" target="_blank" rel="noopener noreferrer">ITQlick</a>.
                        Consultado en octubre de 2026.
                    </p>
                </div>
            </div>
        </section>
    );
}
