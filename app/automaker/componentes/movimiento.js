import { useEffect, useLayoutEffect } from "react";
import { SplitText } from "gsap/SplitText";

// Piezas de movimiento compartidas por las secciones de la landing.

// useLayoutEffect en el navegador (prepara las animaciones antes de
// pintar, sin parpadeo) y useEffect en el servidor, donde no existe.
export const useLayoutIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

// Mete una línea de SplitText en una máscara para que suba "desde debajo"
// de sí misma. El margen extra deja sitio a acentos y descendentes (ñ,
// p, g) mientras dura la animación.
function enmascarar(linea) {
    const mascara = document.createElement("div");
    mascara.style.cssText = "overflow:clip;padding:.08em 0 .16em;margin:-.08em 0 -.16em";
    linea.parentNode.insertBefore(mascara, linea);
    mascara.appendChild(linea);
}

// Parte un texto en líneas enmascaradas. Hay que deshacerlo (revert) al
// terminar la animación: si no, las líneas quedan fijas y el texto no se
// recoloca al cambiar el ancho de la ventana.
export function cortarEnLineas(el) {
    const corte = SplitText.create(el, { type: "lines" });
    corte.lines.forEach(enmascarar);
    return corte;
}

// El corte en líneas depende de la tipografía: con la de respaldo
// cortaría por otro sitio. Se espera a Aktiv Grotesk, con tope de 2 s.
export function esperarFuente() {
    const espera = new Promise((r) => setTimeout(r, 2000));
    const fuente = document.fonts
        .load('400 1em "aktiv-grotesk"')
        .then(() => document.fonts.ready)
        .catch(() => {});
    return Promise.race([fuente, espera]);
}

// Configuración de scrollTrigger para "reproducir una vez al llegar".
// Sustituye a `once: true`, que en GSAP 3.15 revienta si al cargar la
// página el disparador ya ha quedado atrás: se destruye a sí mismo
// mientras se está creando ("Cannot read properties of undefined (reading
// 'end')"). Con `end: "max"` el disparador sigue activo desde que se
// cruza hasta el final de la página, así que la animación se reproduce
// una sola vez (también si se carga la página ya por debajo) y nunca se
// rebobina.
export function alLlegar(trigger, start) {
    return { trigger, start, end: "max", toggleActions: "play none none none" };
}
