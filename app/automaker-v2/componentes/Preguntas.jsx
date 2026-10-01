"use client";

import { useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Preguntas.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

// "Preguntas que siempre nos hacen". Reescritas para el modelo de
// autoservicio. La de la IA se mantiene de la landing publicada.
const PREGUNTAS = [
    {
        pregunta: "¿Esto no lo hará la IA sola dentro de poco?",
        respuesta: (
            <>
                <p>
                    Hoy no, y por una razón que juega a vuestro favor: lo que compráis aquí es{" "}
                    <strong>que el resultado sea idéntico las mil veces</strong>. El texto legal no puede moverse tres
                    píxeles, el logo no puede salir a otra escala y el descuento no puede aparecer con un tamaño en
                    Instagram y otro en el cartel de tienda. Un sistema que compone cada pieza de nuevo es impredecible
                    por definición, y <u>en producción de campañas eso es un defecto</u>.
                </p>
                <p>
                    Automaker no inventa nada: repite lo que vuestro equipo ya diseñó y aprobó. Por eso el resultado es
                    siempre de vuestra marca.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿De verdad lo podemos llevar solos?",
        respuesta: (
            <>
                <p>
                    Sí, es la idea. En la formación montamos juntos vuestra primera campaña real. La primera cuesta
                    un par de horas; la segunda, una; a partir de la tercera,{" "}
                    <strong>unos veinte minutos</strong>.
                </p>
                <p>
                    Basta con alguien que sepa Figma: renombrar capas y abrir el plugin. Si además domina auto layout,
                    mejor. Y quien rellena el Excel ni siquiera tiene que abrir Figma.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿En qué se diferencia de las herramientas que rellenan plantillas?",
        respuesta: (
            <>
                <p>
                    Las plantillas rellenan textos e imágenes. <strong>Automaker monta campañas</strong>: además del
                    texto y la foto, pone el picto, el precio, el descuento y el logo de vuestra librería, cada uno en
                    su hueco.
                </p>
                <p>
                    Y no redimensiona un diseño a la fuerza: cada formato tiene su máster, diseñado por una persona.
                    Al final os entrega un zip ordenado por carpetas, con GIF animado, PSD y WebP.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿Qué incluye el alta y qué la cuota?",
        respuesta: (
            <>
                <p>
                    <strong>El alta</strong> (1.500 € + IVA, una vez): formación práctica al diseñador que va a usar
                    el plugin (hasta 10 h), vuestra primera campaña montada durante la formación, la cuenta y el Excel plantilla, y una
                    llamada a los 30 días.
                </p>
                <p>
                    <strong>La cuota</strong> (250 € al mes el primer diseñador, 100 € cada uno más): el plugin con sus
                    actualizaciones, campañas, Excels y piezas ilimitados, y el soporte cuando algo no funciona. Lo que
                    no entra es el diseño: los másters los hace vuestro equipo.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿De dónde salen las diez a dieciséis horas semanales?",
        respuesta: (
            <>
                <p>
                    De cronometrarlo. Durante una temporada hicimos el mismo trabajo de las dos formas para cuentas
                    grandes con campañas semanales: a mano, maquetar, adaptar a cada formato, revisar y exportar
                    ocupaba <strong>entre 10 y 16 horas por diseñador cada semana</strong>. Con el sistema, las piezas
                    de un mes entero salían en diez o quince minutos.
                </p>
                <p>
                    La cifra depende de cuántas campañas, formatos e idiomas manejéis. En la demo hacemos la cuenta
                    con vuestra producción real.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿Y si dentro de seis meses cambiamos el diseño?",
        respuesta: (
            <>
                <p>
                    Se cambia una vez. Las piezas no son dibujos sueltos: salen de los componentes de vuestra librería
                    de Figma. Si cambia el máster o un componente, <strong>todas las referencias se regeneran</strong>{" "}
                    con el diseño nuevo al volver a generar.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿Podéis poner las fotos de producto por SKU?",
        respuesta: (
            <>
                <p>
                    Está en camino: <strong>imágenes por enlace o por SKU</strong> directamente desde el Excel. Hoy las
                    fotos salen de vuestra librería de Figma, que funciona muy bien para decenas de productos. Si
                    trabajáis con miles, contádnoslo en la demo.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿Qué pasa si dejamos de pagar?",
        respuesta: (
            <>
                <p>
                    El plugin deja de generar piezas. <strong>Todo lo demás es vuestro</strong>: los másters y la
                    librería siguen en vuestro Figma, los Excels en vuestro Google Drive y las piezas exportadas en
                    vuestras carpetas.
                </p>
            </>
        ),
    },
];


function Pregunta({ item, abierta, alternar }) {
    const id = useId();
    return (
        <li className={`${s.item} ${abierta ? s.abierta : ""}`} data-item>
            <h3 className={s.encabezado}>
                <button
                    type="button"
                    className={s.boton}
                    aria-expanded={abierta}
                    aria-controls={id}
                    onClick={alternar}
                >
                    {item.pregunta}
                    <svg className={s.flecha} viewBox="0 0 10 10" aria-hidden="true">
                        <path d="M9.5 10V.5H0M9.5.5 0 10" />
                    </svg>
                </button>
            </h3>
            {/* La altura se anima con grid (0fr → 1fr): no hace falta
                medir el contenido. */}
            <div id={id} className={s.panel} role="region" aria-hidden={!abierta}>
                <div className={s.panelInterior}>
                    <div className={s.respuesta}>{item.respuesta}</div>
                </div>
            </div>
        </li>
    );
}

export default function Preguntas() {
    const raiz = useRef(null);
    const [abierta, setAbierta] = useState(-1);

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

                gsap.set(q("[data-item]"), { autoAlpha: 0, y: 18 });
                ScrollTrigger.batch(q("[data-item]"), {
                    start: "top 90%",
                    onEnter: (lote) =>
                        gsap.to(lote, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 }),
                });

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
        <section id="preguntas" className={s.preguntas} ref={raiz}>
            <h2 className={s.titulo} data-titulo data-entra>Preguntas que siempre nos hacen</h2>

            <ul className={s.lista}>
                {PREGUNTAS.map((item, i) => (
                    <Pregunta
                        key={item.pregunta}
                        item={item}
                        abierta={abierta === i}
                        alternar={() => setAbierta(abierta === i ? -1 : i)}
                    />
                ))}
            </ul>
        </section>
    );
}
