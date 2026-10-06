"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Flecha from "./Flecha.jsx";
import { cortarEnLineas, esperarFuente, useLayoutIso } from "./movimiento.js";
import s from "./Hero.module.scss";

gsap.registerPlugin(SplitText);

const ETIQUETAS = [
    "Campañas recurrentes",
    "ADS en masa",
    "Tests A/B sin límite",
    "Cambios de última hora",
    "Exportación automática",
    "Diseño uniforme sin IA",
];

// Piezas del escenario en píxeles del frame de 1728 de Figma (nodos
// 90:490–90:509). El SCSS las convierte a porcentajes de la caja que
// las envuelve, así que la composición escala sin recalcular nada.
const PIEZAS = [
    { img: "pieza-1080x1350", x: 363.66, y: 595.47, w: 213.44, h: 266.8 },
    { img: "pieza-1080x1350", x: 1160.44, y: 591, w: 157.57, h: 196.96 },
    { img: "pieza-1080x1350", x: 817.37, y: 794.39, w: 157.57, h: 196.96 },
    { img: "pieza-800x600", x: 625.16, y: 639.05, w: 173.18, h: 129.89 },
    { img: "pieza-800x600", x: 1240.9, y: 804.44, w: 173.18, h: 129.89 },
    { img: "pieza-820x312", x: 1105.28, y: 968.4, w: 177.51, h: 67.54 },
    { img: "pieza-820x312", x: 1035.28, y: 823.44, w: 177.51, h: 67.54 },
    { img: "pieza-200x200", x: 597.22, y: 793.27, w: 97.05, h: 97.05 },
    { img: "pieza-200x200", x: 1026.34, y: 671.46, w: 97.05, h: 97.05 },
    { img: "pieza-200x200", x: 566.7, y: 976.95, w: 97.05, h: 97.05 },
    { img: "pieza-234x60", x: 995.21, y: 918.18, w: 113.54, h: 29.11 },
    { img: "pieza-234x60", x: 402.13, y: 888.26, w: 113.54, h: 29.11 },
    { img: "pieza-320x50", x: 816.76, y: 596.53, w: 279.98, h: 43.75 },
    { img: "pieza-320x50", x: 551.74, y: 916.04, w: 224.41, h: 35.06 },
];

// Ancho, en píxeles de Figma, de la caja que envuelve las piezas: el
// escenario mide eso "a escala". Tiene que coincidir con $caja-ancho.
const ANCHO_CAJA = 1050.42;
const BOTON = { x: 635.6, y: 712.52 };
const CURSOR = { x: 1002.7, y: 976.77 };

// Centro del botón «Generar piezas»: de ahí salen las piezas y ahí
// vuelven.
const ORIGEN = { x: 855.6, y: 766 };

// Pose del cursor cuando pulsa el botón, relativa a su sitio de reposo
// y en % de su propio tamaño, para que escale sola con el escenario.
const CURSOR_PULSANDO = { xPercent: 15, yPercent: -330 };

const posicion = (p) => ({ "--x": p.x, "--y": p.y, "--w": p.w, "--h": p.h });

function montarTitular(q) {
    const cortes = q("[data-linea]").map(cortarEnLineas);
    gsap.set(q("[data-titular]"), { autoAlpha: 1 });

    gsap.timeline({ onComplete: () => cortes.forEach((c) => c.revert()) })
        .from(cortes[0].lines, { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.09 }, 0.1)
        .from(cortes[1].lines, { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.09 }, 0.4)
        .from(q("[data-etiqueta]"), { autoAlpha: 0, y: 12, duration: 0.8, ease: "power3.out", stagger: 0.045 }, 0.75);
}

// El bucle del escenario: el cursor pulsa, las piezas explotan desde
// detrás del botón, flotan un rato y vuelven dentro. Y otra vez.
function montarEscenario(q, escenario) {
    const saltos = q("[data-salto]");
    const boton = q("[data-boton]")[0];
    const cursor = q("[data-cursor]")[0];
    const onda = q("[data-onda]")[0];

    // Desplazamiento de cada pieza hasta el centro del botón, en píxeles
    // reales. Son funciones para que se recalculen en cada vuelta
    // (repeatRefresh) y sigan cuadrando si cambia el ancho de la ventana.
    const escala = () => escenario.clientWidth / ANCHO_CAJA;
    const recogida = {
        x: (i) => (ORIGEN.x - (PIEZAS[i].x + PIEZAS[i].w / 2)) * escala(),
        y: (i) => (ORIGEN.y - (PIEZAS[i].y + PIEZAS[i].h / 2)) * escala(),
        scale: 0.15,
        rotation: "random(-14, 14)",
    };
    const orden = { each: 0.025, from: "random" };

    // Vaivén: cada pieza con su amplitud y su ritmo, y dos movimientos de
    // periodos distintos, para que ninguna se mueva igual que otra.
    const flotes = q("[data-flota]").flatMap((el) => [
        gsap.to(el, {
            y: gsap.utils.random(4, 9) * (Math.random() < 0.5 ? -1 : 1),
            duration: gsap.utils.random(2.2, 3.6),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        }),
        gsap.to(el, {
            x: gsap.utils.random(-3, 3),
            rotation: gsap.utils.random(-0.8, 0.8),
            duration: gsap.utils.random(3.2, 5),
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
        }),
    ]);

    const bucle = gsap.timeline({ delay: 1.2, repeat: -1, repeatDelay: 0.2, repeatRefresh: true });
    bucle
        .set(saltos, { ...recogida, autoAlpha: 0 }, 0)

        // 1. El cursor sube desde abajo hasta el botón.
        .to(cursor, { ...CURSOR_PULSANDO, duration: 1.05, ease: "power2.inOut" }, 0)

        // 2. Clic: el botón se hunde y rebota hacia fuera.
        .to(cursor, { scale: 0.86, duration: 0.12, ease: "power2.out" }, 1.05)
        .to(boton, { scale: 0.93, duration: 0.14, ease: "power2.out" }, 1.05)
        .to(cursor, { scale: 1, duration: 0.4, ease: "power2.out" }, 1.19)
        .to(boton, { scale: 1, duration: 0.55, ease: "back.out(2.4)" }, 1.19)
        .fromTo(onda,
            { scaleX: 1, scaleY: 1, autoAlpha: 0.6 },
            { scaleX: 1.08, scaleY: 1.4, autoAlpha: 0, duration: 0.9, ease: "power2.out" }, 1.19)

        // 3. Explosión: salen desde detrás del botón hacia su sitio.
        .set(saltos, { autoAlpha: 1 }, 1.2)
        .to(saltos, { x: 0, y: 0, scale: 1, rotation: 0, duration: 1.3, ease: "expo.out", stagger: orden }, 1.2)

        // 4. El cursor vuelve abajo mientras las piezas flotan.
        .to(cursor, { xPercent: 0, yPercent: 0, duration: 1.3, ease: "power2.inOut" }, 1.7)

        // 5. Vuelven dentro del botón, que acusa la entrada.
        .to(saltos, { ...recogida, duration: 0.7, ease: "power3.in", stagger: orden }, 6.3)
        .to(boton, { scale: 1.04, duration: 0.18, ease: "power2.out" }, 7.2)
        .to(boton, { scale: 1, duration: 0.5, ease: "power3.out" }, 7.38)
        .set(saltos, { autoAlpha: 0 }, 7.4);

    // Fuera de pantalla no tiene sentido gastar batería.
    const vigia = new IntersectionObserver(([e]) => {
        const accion = e.isIntersecting ? "resume" : "pause";
        bucle[accion]();
        flotes.forEach((t) => t[accion]());
    });
    vigia.observe(escenario);

    return () => vigia.disconnect();
}

// Las etiquetas se van encendiendo en cian de una en una y al azar,
// nunca la misma dos veces seguidas. En la cinta de móvil hay dos
// copias de cada una: se encienden a la vez para que el bucle no delate.
function montarEtiquetas(q, claseActiva) {
    const items = q("[data-etiqueta]");
    let actual = -1;

    const encender = () => {
        let siguiente;
        do {
            siguiente = Math.floor(Math.random() * ETIQUETAS.length);
        } while (siguiente === actual);
        actual = siguiente;
        items.forEach((el) => el.classList.toggle(claseActiva, Number(el.dataset.indice) === actual));
    };

    const reloj = gsap.to({}, { duration: 1.6, delay: 2.2, repeat: -1, onStart: encender, onRepeat: encender });

    return () => {
        reloj.kill();
        items.forEach((el) => el.classList.remove(claseActiva));
    };
}

// Profundidad con el ratón: cada capa se desplaza unos píxeles según su
// tamaño. Solo con ratón; en táctil no hay puntero que seguir.
function montarParalaje(q) {
    if (!window.matchMedia("(pointer: fine)").matches) return () => {};

    const capas = q("[data-profundidad]").map((el) => ({
        x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }),
        p: Number(el.dataset.profundidad),
    }));

    const mover = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        capas.forEach((c) => {
            c.x(-nx * c.p);
            c.y(-ny * c.p);
        });
    };
    window.addEventListener("pointermove", mover, { passive: true });
    return () => window.removeEventListener("pointermove", mover);
}

export default function Hero() {
    const raiz = useRef(null);
    const escenario = useRef(null);

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

                const limpiar = [
                    montarEscenario(q, escenario.current),
                    montarEtiquetas(q, s.etiquetaActiva),
                    montarParalaje(q),
                ];

                // El corte en líneas depende de la tipografía: con la de
                // respaldo cortaría por otro sitio.
                let vivo = true;
                ctx.add("titular", () => montarTitular(q));
                esperarFuente().then(() => vivo && ctx.titular());

                return () => {
                    vivo = false;
                    limpiar.forEach((f) => f());
                };
            },
            raiz
        );

        return () => mm.revert();
    }, []);

    const grupo = (copia) => (
        <ul className={s.grupo} aria-hidden={copia || undefined}>
            {ETIQUETAS.map((t, i) => (
                <li key={t} className={s.etiqueta} data-etiqueta data-indice={i} data-entra>{t}</li>
            ))}
        </ul>
    );

    return (
        <section className={s.hero} ref={raiz}>
            <h1 className={s.titular} data-titular data-entra>
                <span className={s.lineaGris} data-linea>
                    Maquetar campañas semanales cuesta 16h por diseñador.
                </span>
                <span className={s.lineaTinta} data-linea>
                    Podría costarte 3 minutos.
                </span>
            </h1>

            {/* En pantallas estrechas las etiquetas no caben y pasan a una
                cinta infinita; la segunda copia solo existe para cerrar el
                bucle sin salto. */}
            <div className={s.etiquetas}>
                <div className={s.pista}>
                    {grupo(false)}
                    {grupo(true)}
                </div>
            </div>

            <div className={s.escenario} ref={escenario}>
                {PIEZAS.map((p, i) => (
                    <div
                        key={i}
                        className={`${s.capa} ${s.pieza}`}
                        style={posicion(p)}
                        data-profundidad={Math.round(6 + (p.w / 280) * 12)}
                        aria-hidden="true"
                    >
                        <div className={s.salto} data-salto data-entra>
                            <div className={s.flota} data-flota>
                                <img
                                    className={s.imagen}
                                    src={`/landing/${p.img}.webp`}
                                    alt=""
                                    decoding="async"
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <div className={`${s.capa} ${s.capaBoton}`} style={posicion(BOTON)} data-profundidad={5}>
                    <a href="#demo" className={s.boton} data-boton>
                        Generar piezas
                        <Flecha className={s.flechaBoton} />
                        <img className={s.icono} src="/landing/icono-figma.webp" alt="" aria-hidden="true" />
                        <span className={s.onda} data-onda aria-hidden="true" />
                    </a>
                </div>

                <div className={`${s.capa} ${s.capaCursor}`} style={posicion(CURSOR)} data-profundidad={9} aria-hidden="true">
                    <img className={s.cursor} src="/landing/cursor.svg" alt="" data-cursor />
                </div>
            </div>
        </section>
    );
}
