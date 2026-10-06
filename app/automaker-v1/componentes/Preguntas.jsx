"use client";

import { useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Preguntas.module.scss";

gsap.registerPlugin(ScrollTrigger, SplitText);

// "Preguntas que siempre nos hacen" (Figma: y=12073–13319). La primera
// respuesta es la de Figma; el resto se redactaron a partir de la propia
// landing (precio, ahorro, qué no hace) y conviene revisarlas.
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
                    Donde la IA sí aporta ya es en los bordes: leer un brief escrito en un correo y convertirlo en
                    datos, avisar de que un titular se desborda, proponer variantes de copy dentro del límite de
                    caracteres. Todo eso está previsto. Y el día que la IA componga layouts de verdad, va a necesitar
                    exactamente lo que aquí se instala: una librería bien nombrada, un brief estructurado y una salida
                    ordenada.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿Nuestros diseñadores van a sentir que les quitáis trabajo?",
        respuesta: (
            <>
                <p>
                    Les quitáis la parte que nadie quiere: cambiar el precio en la pieza número ochenta, renombrar
                    archivos y revisar que el legal no se haya movido. <strong>El criterio sigue siendo suyo</strong>:
                    ellos diseñan los másters, deciden la composición y aprueban lo que sale.
                </p>
                <p>
                    Además, son ellos quienes aprenden a ampliar el sistema durante la implementación. Al terminar,
                    saben crear formatos nuevos sin depender de nadie. Lo que suele pasar es lo contrario al miedo
                    inicial: recuperan un día y medio a la semana para trabajo de diseño de verdad.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿Qué entra exactamente en los 6.000 € y qué no?",
        respuesta: (
            <>
                <p>
                    <strong>Entra:</strong> el diagnóstico de vuestra producción, tres campañas máster parametrizadas
                    con todas sus referencias, el plugin instalado en vuestro Figma, la entrada de datos (hoja o
                    formulario), la formación a vuestro equipo construyendo plantillas y la revisión de las primeras
                    que hagáis solos. Sin límite de piezas ni de campañas, y sin cuota mensual.
                </p>
                <p>
                    <strong>No entra:</strong> el diseño creativo de los másters (lo aporta vuestro equipo) ni los
                    tipos de pieza nuevos que queráis añadir más adelante. Esos son un encargo aparte, o los hace
                    vuestro equipo siguiendo el criterio de los componentes, sin coste.
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
                    La cifra depende de cuántas campañas, formatos e idiomas manejéis. En el diagnóstico la medimos
                    con vuestra producción real antes de empezar.
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
                <p>
                    Si el cambio es de estilo (colores, tipografía, fotografía), lo hace vuestro equipo en Figma como
                    siempre. Si aparece un tipo de pieza que no existía, se añade como una plantilla más.
                </p>
            </>
        ),
    },
    {
        pregunta: "¿Qué pasa si dejamos de trabajar con vosotros?",
        respuesta: (
            <>
                <p>
                    Nada. <strong>El sistema es vuestro</strong>: las plantillas están en vuestro Figma, los datos en
                    vuestra hoja y las piezas en vuestras carpetas. No hay licencia que caduque ni cuenta que se
                    cierre.
                </p>
                <p>
                    Es justo la diferencia con las plataformas de pago mensual: ahí, si dejas de pagar, pierdes los
                    diseños. Aquí seguís generando campañas igual que el primer día.
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
