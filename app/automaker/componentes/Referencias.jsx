"use client";

import { useRef } from "react";
import { Inter, Jaldi } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import FondoVivo from "./FondoVivo.jsx";
import Boton from "./Boton.jsx";
import { cortarEnLineas, esperarFuente, useLayoutIso, alLlegar } from "./movimiento.js";
import s from "./Referencias.module.scss";
import { CONTACTO_DEMO } from "../contacto.js";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Las tipografías del máster de ejemplo (Figma 98:649): Jaldi para los
// textos de la pieza e Inter para la fecha. Se sirven desde la propia
// web (next/font), no desde Google.
const jaldi = Jaldi({ weight: "700", subsets: ["latin"], variable: "--f-jaldi", display: "swap" });
const inter = Inter({ weight: "700", subsets: ["latin"], variable: "--f-inter", display: "swap" });

const R = "/landing/referencias";

// ---------------------------------------------------------------- Datos
//
// Todo se mide en píxeles del frame de 1728 de Figma. El escenario es la
// franja y=4680…5430; el SCSS convierte las cifras a porcentajes.

const ESCENARIO = { ancho: 1728, y0: 4680, alto: 750 };
const MASTER = { x: 614, y: 4690, w: 500.46, h: 625.57 };
const CENTRO_MASTER = { cx: MASTER.x + MASTER.w / 2, cy: MASTER.y + MASTER.h / 2 };

// Idiomas del máster, en el orden de la lista. Traducciones propias,
// salvo las que ya estaban en las variantes del Figma (fechas de
// catalán, gallego y euskera, "Superpreu", "Prezio bikaina"). `escala`
// reduce el titular de los idiomas que en dos líneas no caben.
const IDIOMAS = [
    { nombre: "Castellano", fecha: "Del lunes 15 al domingo 21 de junio", titular: ["Más refrescante que ", "un chapuzón"], producto: "Sandía rayada sin semillas", etiqueta: "Superprecio" },
    { nombre: "Inglés", fecha: "From Monday 15 to Sunday 21 June", titular: ["More refreshing than ", "a dip"], producto: "Seedless striped watermelon", etiqueta: "Super price" },
    { nombre: "Catalán", fecha: "De dilluns 15 al diumenge 21 de juny", titular: ["Més refrescant que ", "una capbussada"], producto: "Síndria ratllada sense llavors", etiqueta: "Superpreu" },
    { nombre: "Gallego", fecha: "Do luns 15 de xuño ao domingo 21 de xuño", titular: ["Máis refrescante ca ", "un chapuzón"], producto: "Sandía raiada sen sementes", etiqueta: "Superprezo" },
    { nombre: "Euskera", fecha: "Ekainaren 15eko astelehenetik ekainaren 21eko igandera", titular: ["Murgilaldi bat baino ", "freskagarriagoa"], producto: "Hazirik gabeko angurria", etiqueta: "Prezio bikaina", escala: 0.8 },
    { nombre: "Portugués", fecha: "De segunda 15 a domingo 21 de junho", titular: ["Mais refrescante que ", "um mergulho"], producto: "Melancia riscada sem sementes", etiqueta: "Superpreço" },
];

// Negocios que viven de campañas repetitivas con muchas piezas: los del
// Figma y otros que encajan igual (catálogo, precio y promo que cambian
// cada semana, red de tiendas o muchos formatos).
const SECTORES = [
    "Retail",
    "Alimentación",
    "Delivery",
    "E-Commerce",
    "Moda",
    "Farmacia y parafarmacia",
    "Electrónica",
    "Bricolaje y hogar",
    "Automoción",
    "Restauración",
    "Franquicias",
    "Cosmética",
    "Viajes y ocio",
    "Deporte",
];

const MEDIOS = ["Programático", "Rich Media", "Display", "DOOH", "In Feed", "Widgets", "Shopping", "Meta y Google Ads", "Retargeting", "GIF"];

// Descuentos (Figma 98:803–98:869). Los azules (`amarillo`) están
// pensados para fondo claro: dentro del máster, que es azul, se pintan en
// amarillo.
const DESCUENTOS = [
    { id: "2x1", img: "dto-2x1.webp", x: 231, y: 5247, w: 103.25, h: 51.75 },
    { id: "3x2", img: "dto-3x2.svg", x: 347, y: 5298, w: 75.16, h: 32.42, amarillo: true },
    { id: "50", img: "dto-50.svg", x: 458, y: 5276, w: 96.33, h: 39.74, amarillo: true },
    { id: "sin-iva", img: "dto-sin-iva.svg", x: 358, y: 5220, w: 129, h: 26.71, amarillo: true },
    { id: "10e", img: "dto-10e.svg", x: 254, y: 5340, w: 84.99, h: 63.86, amarillo: true },
    { id: "gratis", img: "dto-gratis.webp", x: 379, y: 5353, w: 157.74, h: 38.42 },
];

// Variantes. `s` es el sangrado de las que llevan desenfoque en Figma (la
// imagen exportada es algo mayor que la capa).
const VAR_IDIOMAS = [
    { img: "var-es-melon-banner.webp", alt: "Banner horizontal en castellano", x: 212, y: 4785, w: 174.38, h: 58.13, s: 2.2 },
    { img: "var-ca-sofregit.webp", alt: "Pieza apaisada en catalán", x: 266, y: 4886, w: 231.03, h: 154.02 },
    { img: "var-eu-melon.webp", alt: "Pieza cuadrada en euskera", x: 100, y: 4950, w: 115.85, h: 115.85, s: 2.1 },
    { img: "var-fr-sandia-vertical.webp", alt: "Pieza vertical en francés", x: 142, y: 5103, w: 65, h: 162.5, s: 2.1 },
    { img: "icono-webp.webp", alt: "Formato WebP", x: 425, y: 4787, w: 46, h: 46, icono: true },
];

const VAR_MEDIOS = [
    { img: "var-gl-melon.webp", alt: "Pieza cuadrada en gallego", x: 1304, y: 4701, w: 115.85, h: 115.85 },
    { img: "var-es-sandia-cuadrado.webp", alt: "Pieza cuadrada", x: 1380, y: 4784, w: 115.85, h: 115.85 },
    { img: "icono-gif.webp", alt: "Formato GIF", x: 1432, y: 4723, w: 45.04, h: 45.04, icono: true },
    { img: "var-es-sandia-banner-b.webp", alt: "Banner horizontal", x: 1641, y: 4993, w: 174.38, h: 58.13, s: 2.2 },
    { img: "var-es-sandia-banner-a.webp", alt: "Banner horizontal", x: 1491, y: 5130, w: 174.38, h: 58.13, s: 2.2 },
    { img: "var-es-sofrito-vertical.webp", alt: "Pieza vertical", x: 1561, y: 4721, w: 65, h: 162.5, s: 2.1 },
    { img: "var-eu-sofrito.webp", alt: "Pieza apaisada en euskera", x: 1333, y: 4960, w: 238, h: 158.67 },
];

const PICTOS = [
    { id: "origen", img: "picto-origen.svg", alt: "Picto Origen España", x: 1190, y: 5322, w: 82.12, h: 82.12 },
    { id: "n1", img: "picto-n1.svg", alt: "Picto Nº1 fruta y verdura", x: 1284.3, y: 5328.18, w: 67.7, h: 75.45 },
    { id: "black", img: "picto-black-days.svg", alt: "Picto Black Days", x: 1380, y: 5333, w: 154, h: 52.99 },
];

// Flechas curvas (Figma 98:1426–98:1428), rehechas como trazo para poder
// dibujarlas. Coordenadas absolutas del frame.
const FLECHAS = {
    idiomas: { o: [521, 4948], d: "M73.98 68.33C65.9 49.7 57.3 36.3 46.4 26 35.4 15.7 22.2 8.4 4.3 2.6", punta: "M0 1.1 3.8 5.5 5.7 0Z" },
    medios: { o: [1130.5, 4734.29], d: "M.71 36.1C13.8 23.9 36.4 14.7 61.2 9.07 86 3.45 112.9 1.48 134.5 2.94", punta: "M139 3.42 134.3 0 133.7 5.77Z" },
    pictos: { o: [1167, 5159], d: "M.5 44.19C19.7 44.2 53.4 38.97 87.2 30.89 121 22.8 155.1 12.34 174.96 2.37", punta: "M179 .36 173.2 0 175.8 5.19Z" },
};

// Recortes del máster en el capítulo de medios: cuadrado, banner y
// vertical. Se animan como variables sueltas (arriba, derecha, abajo,
// izquierda, radio) que lee el clip-path del SCSS. Animar el clip-path
// directamente falla: el navegador lo abrevia ("inset(10% 0%)") y la
// interpolación empareja mal los números, deformando el recorte.
const recorte = (arriba, lado, radio = 2.5) => ({
    "--r-arriba": `${arriba}%`,
    "--r-derecha": `${lado}%`,
    "--r-abajo": `${arriba}%`,
    "--r-izquierda": `${lado}%`,
    "--r-radio": `${radio}%`,
});
const REENCUADRES = [recorte(10, 0), recorte(36.7, 0), recorte(0, 25)];
const SIN_RECORTE = recorte(0, 0, 0);

// Cámara de móvil: rectángulos del frame [x1, y1, x2, y2] que se ajustan
// a la pantalla.
const ENCUADRES = {
    master: [598, 4680, 1130, 5330],
    idiomas: [90, 4690, 605, 5275],
    descuentos: [215, 5085, 610, 5415],
    medios: [1125, 4690, 1700, 5200],
    pictos: [1160, 5150, 1565, 5415],
    todo: [80, 4680, 1830, 5430],
};

const CAPITULOS = ["idiomas", "descuentos", "medios", "pictos"];

const PLATA = ["#C9D1D8", "#F2F6FA", "#DDE4EB", "#B8C7D4"];

// Posición de una capa en el escenario (variables que lee el SCSS).
const pos = (p) => ({ "--x": p.x, "--y": p.y, "--w": p.w, "--h": p.h, "--s": p.s ?? 0 });
const centro = (p) => ({ cx: p.x + p.w / 2, cy: p.y + p.h / 2 });

// ------------------------------------------------------------ Animación
//
// Arranca sola cuando el escenario se ve entero: un estallido en el que
// todas las piezas salen del máster a su sitio, y después cuatro
// capítulos en bucle. En cada uno se enciende un grupo (el resto se
// atenúa), el máster cambia dos o tres veces en esa dimensión y las
// piezas del grupo laten. Una sola idea cada vez.

function montarAnimacion({ q, escenario, visor, camara, movil }) {
    const k = () => escenario.clientWidth / ESCENARIO.ancho;

    const encuadre = ([x1, y1, x2, y2]) => {
        const e = k();
        const esc = Math.min(visor.clientWidth / ((x2 - x1) * e), visor.clientHeight / ((y2 - y1) * e));
        const cx = ((x1 + x2) / 2) * e;
        const cy = ((y1 + y2) / 2 - ESCENARIO.y0) * e;
        return { x: visor.clientWidth / 2 - cx * esc, y: visor.clientHeight / 2 - cy * esc, scale: esc };
    };
    const plano = (nombre) => ({
        x: () => encuadre(ENCUADRES[nombre]).x,
        y: () => encuadre(ENCUADRES[nombre]).y,
        scale: () => encuadre(ENCUADRES[nombre]).scale,
    });

    const piezas = q("[data-sale]");
    const extras = q("[data-rotulo], [data-lista], [data-flecha]");
    const trazos = q("[data-trazo]");
    const puntas = q("[data-punta]");
    const idiomas = q("[data-idioma]");
    const listaIdiomas = q("[data-lista='idiomas'] li");
    const listaMedios = q("[data-lista='medios'] li");
    const precios = q("[data-precio]");
    const etiquetaEs = q("[data-etiqueta-precio]")[0];
    const lienzo = q("[data-lienzo-master]")[0];
    const pictoOrigen = q("[data-ranura-picto]");
    const n1 = q("[data-n1-master]")[0];

    // En espera: solo el máster. (En el HTML todo está visible: es la
    // composición final, la que se ve sin JavaScript.)
    gsap.set([...piezas, ...extras, ...puntas], { autoAlpha: 0 });
    gsap.set(trazos, { strokeDashoffset: 1 });
    if (movil) gsap.set(camara, encuadre(ENCUADRES.master));

    // ------------------------------------------------------- Estallido
    const bucle = gsap.timeline({ paused: true, repeat: -1, repeatRefresh: true, defaults: { ease: "power2.inOut" } });

    const inicio = gsap.timeline({ paused: true, onComplete: () => bucle.play(0) });
    inicio
        .fromTo(piezas, {
            x: (i, el) => (CENTRO_MASTER.cx - +el.dataset.cx) * k(),
            y: (i, el) => (CENTRO_MASTER.cy - +el.dataset.cy) * k(),
            scale: 0.18,
            rotation: () => gsap.utils.random(-14, 14),
            autoAlpha: 0,
        }, {
            x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1,
            duration: 1.5,
            ease: "expo.out",
            stagger: { each: 0.02, from: "random" },
        }, 0.1)
        .to(extras, { autoAlpha: 1, duration: 0.8, ease: "power2.out", stagger: 0.05 }, 0.8)
        .to(trazos, { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, 1)
        .to(puntas, { autoAlpha: 1, duration: 0.3 }, 1.9);
    if (movil) inicio.to(camara, { ...plano("todo"), duration: 1.4 }, 1.2).to({}, { duration: 1.2 });

    // ------------------------------------------------------- Capítulos
    // Duración de cada capítulo y separación entre cambios del máster. En
    // móvil son más largos porque la cámara va y viene.
    const D = movil ? 6.4 : 4.6;
    const PASO = movil ? 0.95 : 1.05;

    // Sin solape: primero sale uno y luego entra el otro, para que dos
    // textos de distinto largo no se vean superpuestos.
    const fundir = (sale, entra, t, pop = false) => {
        bucle.to(sale, { autoAlpha: 0, duration: 0.3, ease: "power1.in" }, t);
        bucle.fromTo(entra,
            { autoAlpha: 0, scale: pop ? 0.85 : 1, y: pop ? 0 : 6 },
            { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: pop ? "back.out(2)" : "power2.out", immediateRender: false },
            t + 0.3);
    };
    const encender = (items, i, t) => {
        bucle.to(items, { opacity: 0.35, duration: 0.3 }, t);
        bucle.to(items[i], { opacity: 1, duration: 0.3 }, t);
    };

    const CAMBIOS = {
        // Tres idiomas y vuelta al castellano; la lista acompaña.
        idiomas: (t) => {
            const fin = 4 * PASO;
            const orden = [0, 1, 2, 4, 0];
            for (let i = 1; i < orden.length; i++) {
                const ti = t + (i - 1) * PASO;
                fundir(idiomas[orden[i - 1]], idiomas[orden[i]], ti);
                if (i < orden.length - 1) encender(listaIdiomas, orden[i], ti);
            }
            bucle.to(listaIdiomas, { opacity: 1, duration: 0.4 }, t + (orden.length - 2) * PASO);
            return fin;
        },
        // Precio → 2x1 → 3x2 → GRATIS → precio.
        descuentos: (t) => {
            const base = [precios[0], etiquetaEs];
            const capas = [base, precios[1], precios[2], precios[6], base];
            for (let i = 1; i < capas.length; i++) {
                fundir(capas[i - 1], capas[i], t + (i - 1) * PASO, i < capas.length - 1);
            }
            return 4 * PASO;
        },
        // Cuadrado, banner y vertical. Cada formato sale del máster entero
        // y vuelve a él: pasar directamente de uno a otro cruza los bordes
        // (arriba se abre mientras el lado se cierra) y la pieza "salta".
        medios: (t) => {
            const ENTRA = 0.65;
            const QUIETO = 0.75;
            const SALE = 0.55;
            const ciclo = ENTRA + QUIETO + SALE + 0.1;
            REENCUADRES.forEach((formato, i) => {
                const ti = t + i * ciclo;
                bucle.fromTo(lienzo, { ...SIN_RECORTE }, { ...formato, duration: ENTRA, ease: "power3.inOut", immediateRender: false }, ti);
                bucle.to(lienzo, { ...SIN_RECORTE, duration: SALE, ease: "power3.inOut" }, ti + ENTRA + QUIETO);
            });
            const total = REENCUADRES.length * ciclo;
            const tramo = total / MEDIOS.length;
            MEDIOS.forEach((_, i) => encender(listaMedios, i, t + i * tramo));
            bucle.to(listaMedios, { opacity: 1, duration: 0.4 }, t + total);
            return total;
        },
        // Origen → Black Days → Origen, y el Nº1 del máster late.
        pictos: (t) => {
            fundir(pictoOrigen[0], pictoOrigen[1], t, true);
            bucle.to(n1, { scale: 1.12, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "50% 50%" }, t + PASO);
            fundir(pictoOrigen[1], pictoOrigen[0], t + 2 * PASO, true);
            return 4 * PASO;
        },
    };

    // Cada capítulo dura lo que necesitan sus cambios (medios, más), con
    // un mínimo común para que el ritmo sea regular.
    gsap.set(lienzo, SIN_RECORTE);
    let t0 = 0;
    CAPITULOS.forEach((nombre) => {

        // Foco: el grupo del capítulo a pleno, el resto atenuado.
        bucle.to(q(`[data-grupo]:not([data-grupo="${nombre}"])`), { opacity: 0.22, duration: 0.6 }, t0);
        bucle.to(q(`[data-grupo="${nombre}"]`), { opacity: 1, duration: 0.6 }, t0);

        if (movil) {
            bucle.to(camara, { ...plano("master"), duration: 1 }, t0);
        }

        const fin = CAMBIOS[nombre](t0 + 0.5);
        if (movil) bucle.to(camara, { ...plano(nombre), duration: 1.1 }, t0 + 0.5 + fin);

        // Las piezas del grupo laten, una detrás de otra.
        const tLatido = movil ? t0 + 1.7 + fin : t0 + 0.4;
        bucle.to(q(`[data-sale="${nombre}"]`), {
            scale: 1.07,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            stagger: 0.07,
        }, tLatido);

        t0 += Math.max(D, 0.5 + fin + (movil ? 2.1 : 0.4));
    });

    // Respiro con todo encendido antes de volver a empezar.
    const tFin = t0;
    bucle.to(q("[data-grupo]"), { opacity: 1, duration: 0.8 }, tFin);
    if (movil) bucle.to(camara, { ...plano("todo"), duration: 1.2 }, tFin);
    bucle.to({}, { duration: 1.8 }, tFin + 0.8);

    return { inicio, bucle };
}

// Vaivén de las piezas ya colocadas: cada una con su ritmo.
function montarVaiven(q) {
    return q("[data-flota]").flatMap((el) => [
        gsap.to(el, { y: gsap.utils.random(3, 7) * (Math.random() < 0.5 ? -1 : 1), duration: gsap.utils.random(2.4, 3.8), ease: "sine.inOut", yoyo: true, repeat: -1 }),
        gsap.to(el, { rotation: gsap.utils.random(-0.8, 0.8), duration: gsap.utils.random(3.2, 5), ease: "sine.inOut", yoyo: true, repeat: -1 }),
    ]);
}

// ---------------------------------------------------------- Componentes

function Pieza({ p, grupo, className = "", children }) {
    const c = centro(p);
    return (
        <div
            className={`${s.pieza} ${className}`}
            style={pos(p)}
            data-sale={grupo}
            data-grupo={grupo}
            data-cx={c.cx}
            data-cy={c.cy}
        >
            <div className={s.flota} data-flota>{children}</div>
        </div>
    );
}

function Master() {
    return (
        <div className={s.master} style={pos(MASTER)} aria-hidden="true">
            <div className={s.lienzoMaster} data-lienzo-master>
                <img className={s.sandia} src={`${R}/master-sandia.webp`} alt="" />

                {IDIOMAS.map((l) => (
                    <div key={l.nombre} className={s.capaIdioma} data-idioma>
                        <span className={s.fecha}>{l.fecha}</span>
                        <div className={s.titulares}>
                            <p className={s.titular} style={{ "--escala": l.escala ?? 1 }}>
                                {l.titular[0]}
                                <span className={s.amarillo}>{l.titular[1]}</span>
                            </p>
                            <p className={s.producto}>{l.producto}</p>
                        </div>
                        <span className={s.etiquetaPrecio} data-etiqueta-precio>{l.etiqueta}</span>
                    </div>
                ))}

                <div className={s.ranuraPrecio}>
                    <span className={s.cifra} data-precio>0.69</span>
                    {DESCUENTOS.map((d) =>
                        d.amarillo ? (
                            <span key={d.id} className={`${s.dtoRanura} ${s.mascara}`} style={{ "--img": `url(${R}/${d.img})` }} data-precio />
                        ) : (
                            <img key={d.id} className={s.dtoRanura} src={`${R}/${d.img}`} alt="" data-precio />
                        )
                    )}
                </div>

                <div className={s.ranuraPicto}>
                    <img src={`${R}/picto-origen.svg`} alt="" data-ranura-picto />
                    <img className={s.pictoOculto} src={`${R}/picto-black-days.svg`} alt="" data-ranura-picto />
                </div>
                <img className={s.n1Master} src={`${R}/picto-n1.svg`} alt="" data-n1-master />

                <img className={s.chef} src={`${R}/master-chef.webp`} alt="" />
            </div>
        </div>
    );
}

function Flechas() {
    const { ancho, y0, alto } = ESCENARIO;
    return (
        <svg className={s.flechas} viewBox={`0 ${y0} ${ancho} ${alto}`} aria-hidden="true">
            {Object.entries(FLECHAS).map(([nombre, f]) => (
                <g key={nombre} transform={`translate(${f.o[0]} ${f.o[1]})`} data-flecha data-grupo={nombre}>
                    <path className={s.trazo} d={f.d} pathLength="1" data-trazo />
                    <path className={s.punta} d={f.punta} data-punta />
                </g>
            ))}
        </svg>
    );
}

export default function Referencias() {
    const seccion = useRef(null);
    const visor = useRef(null);
    const camara = useRef(null);
    const escenario = useRef(null);

    useLayoutIso(() => {
        const mm = gsap.matchMedia();

        mm.add(
            { animar: "(prefers-reduced-motion: no-preference)", movil: "(max-width: 899px)" },
            (ctx) => {
                const { animar, movil } = ctx.conditions;
                const q = gsap.utils.selector(seccion);
                if (!animar) {
                    gsap.set(q("[data-entra]"), { autoAlpha: 1 });
                    return undefined;
                }

                const raiz = seccion.current;
                if (movil) raiz.classList.add(s.movil);

                const { inicio, bucle } = montarAnimacion({
                    q,
                    escenario: escenario.current,
                    visor: visor.current,
                    camara: camara.current,
                    movil,
                });
                const vaiven = montarVaiven(q);

                // Empieza cuando se ve la mayor parte del escenario (el
                // máster entero) o al volver a él desde abajo, si se llegó
                // con la página ya bajada. Se mide el visor: el escenario
                // lo transforma la cámara.
                let empezado = false;
                const empezar = () => {
                    if (empezado) return;
                    empezado = true;
                    inicio.play();
                };
                ScrollTrigger.create({
                    trigger: visor.current,
                    start: "70% bottom",
                    end: "top 5%",
                    onEnter: empezar,
                    onEnterBack: empezar,
                });

                // Fuera de pantalla se pausa todo.
                const vigia = new IntersectionObserver(([e]) => {
                    const accion = e.isIntersecting ? "resume" : "pause";
                    vaiven.forEach((t) => t[accion]());
                    if (empezado) (inicio.progress() < 1 ? inicio : bucle)[accion]();
                });
                vigia.observe(visor.current);

                let vivo = true;
                ctx.add("titulo", () => {
                    const titulo = q("[data-titulo]")[0];
                    const corte = cortarEnLineas(titulo);
                    gsap.set(titulo, { autoAlpha: 1 });
                    gsap.timeline({
                        scrollTrigger: alLlegar(titulo, "top 85%"),
                        onComplete: () => corte.revert(),
                    })
                        .from(corte.lines, { yPercent: 115, duration: 1.2, ease: "expo.out", stagger: 0.09 })
                        .from(q("[data-sube]"), { autoAlpha: 0, y: 14, duration: 0.9, ease: "power3.out", stagger: 0.08 }, 0.3);
                });
                esperarFuente().then(() => vivo && ctx.titulo());

                return () => {
                    vivo = false;
                    vigia.disconnect();
                    raiz.classList.remove(s.movil);
                };
            },
            seccion
        );

        return () => mm.revert();
    }, []);

    return (
        <section
            id="referencias"
            ref={seccion}
            className={`${s.referencias} ${jaldi.variable} ${inter.variable}`}
            aria-labelledby="titulo-referencias"
        >
            <div className={s.ventana}>
                <FondoVivo colores={PLATA} className={s.fondo} />

                <header className={s.cabecera}>
                    <h2 id="titulo-referencias" className={s.titulo} data-titulo data-entra>
                        1 diseño, <span className={s.gris}>200 referencias</span>
                    </h2>
                    <p className={s.subtitulo} data-sube data-entra>
                        Cada máster que se parametriza deja de ser una pieza: es una fábrica de todas sus variantes.
                    </p>
                    {/* Cinta infinita, como las etiquetas del hero. La segunda
                        copia solo existe para cerrar el bucle sin salto. */}
                    <div className={s.sectores} data-sube data-entra>
                        <div className={s.cinta}>
                            {[false, true].map((copia) => (
                                <ul key={String(copia)} className={s.grupoSectores} aria-hidden={copia || undefined}>
                                    {SECTORES.map((t) => <li key={t}>{t}</li>)}
                                </ul>
                            ))}
                        </div>
                    </div>
                </header>

                <div className={s.visor} ref={visor}>
                    <div className={s.camara} ref={camara}>
                        <div className={s.escenario} ref={escenario}>
                            {/* Variantes: detrás del máster, salen de él. */}
                            {VAR_IDIOMAS.map((p) => (
                                <Pieza key={p.img} p={p} grupo="idiomas" className={p.icono ? s.icono : s.variante}>
                                    <img src={`${R}/${p.img}`} alt={p.alt} loading="lazy" />
                                </Pieza>
                            ))}
                            {VAR_MEDIOS.map((p) => (
                                <Pieza key={p.img + p.x} p={p} grupo="medios" className={p.icono ? s.icono : s.variante}>
                                    <img src={`${R}/${p.img}`} alt={p.alt} loading="lazy" />
                                </Pieza>
                            ))}

                            <Master />

                            {DESCUENTOS.map((d) => (
                                <Pieza key={d.id} p={d} grupo="descuentos" className={s.encima}>
                                    <img src={`${R}/${d.img}`} alt={`Descuento ${d.id}`} loading="lazy" />
                                </Pieza>
                            ))}
                            {PICTOS.map((p) => (
                                <Pieza key={p.id} p={p} grupo="pictos" className={s.encima}>
                                    <img src={`${R}/${p.img}`} alt={p.alt} loading="lazy" />
                                </Pieza>
                            ))}

                            <Flechas />

                            <p className={`${s.rotulo} ${s.derecha}`} style={pos({ x: 404, y: 4701, w: 185 })} data-rotulo data-grupo="idiomas">
                                Idiomas
                            </p>
                            <ul className={`${s.lista} ${s.derecha}`} style={pos({ x: 453, y: 4750, w: 136 })} data-lista="idiomas" data-grupo="idiomas">
                                {IDIOMAS.map((l) => <li key={l.nombre}>{l.nombre}</li>)}
                                <li aria-hidden="true">……</li>
                            </ul>

                            <p className={s.rotulo} style={pos({ x: 282, y: 5102, w: 300 })} data-rotulo data-grupo="descuentos">
                                Cualquier tipo<br />de descuento
                            </p>

                            <p className={s.rotulo} style={pos({ x: 1143, y: 4828, w: 260 })} data-rotulo data-grupo="medios">
                                Todos los<br />medios
                            </p>
                            <ul className={s.lista} style={pos({ x: 1143, y: 4923, w: 200 })} data-lista="medios" data-grupo="medios">
                                {MEDIOS.map((m) => <li key={m}>{m}</li>)}
                                <li aria-hidden="true">……</li>
                            </ul>

                            <p className={s.rotulo} style={pos({ x: 1194, y: 5215, w: 360 })} data-rotulo data-grupo="pictos">
                                Pictos<br />personalizados
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={s.cierre}>
                <h3 className={s.cierreTitulo}>1 máster = campañas ilimitadas</h3>
                <p className={s.cierreTexto}>
                    Y cuando el diseño cambia, <strong>se cambia una vez</strong>: las 200 se regeneran.
                </p>
                <Boton href={CONTACTO_DEMO} variante="vivo" className={s.cierreBoton}>
                    Quiero una demo personalizada
                </Boton>
            </div>
        </section>
    );
}
