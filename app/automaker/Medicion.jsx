"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { leerConsentimiento } from "@/app/lib/consentimiento";

// Medición de la landing. Las visitas las cuenta Vercel Analytics (sin
// cookies) desde el layout de ERMO, y Google Analytics solo si la persona
// aceptó la analítica en otra página de ermo.es: aquí no hay aviso de
// cookies, así que sin elección previa GA no se carga. Los eventos de
// GA4 (todos empiezan por "automaker_") siguen la misma regla:
//
//   automaker_clic_demo        botón de demo / contacto (y desde qué sección)
//   automaker_clic_ver_precio  botón "Ver precio"
//   automaker_clic_menu        enlace del menú
//   automaker_reproducir_demo  play en el vídeo
//   automaker_abrir_pregunta   pregunta frecuente abierta
//   automaker_seccion_vista    sección que llega a verse (una vez por visita)
//
// Si existe NEXT_PUBLIC_CLARITY_ID se carga además Microsoft Clarity
// (mapas de calor y grabaciones de sesión), también solo con la
// analítica aceptada.

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "yqchkq3k32";
const COLOR_TEMA = "#14394B";

function enviar(evento, datos, intento = 0) {
    if (typeof window.gtag === "function") {
        window.gtag("event", evento, { pagina: "automaker", ...datos });
    } else if (intento < 10) {
        // gtag puede tardar en cargar: reintenta durante ~2 s.
        setTimeout(() => enviar(evento, datos, intento + 1), 200);
    }
}

const seccionDe = (el) => el.closest("section")?.id || (el.closest("nav") ? "menu" : "otra");
const texto = (el) => el.textContent.trim().replace(/\s+/g, " ").slice(0, 80);

export default function Medicion() {
    const [consentimiento, setConsentimiento] = useState(null);
    useEffect(() => setConsentimiento(leerConsentimiento()), []);

    useEffect(() => {
        const raiz = document.querySelector(".landing-automaker");
        if (!raiz) return undefined;

        // Color de la barra de Safari: el del layout de ERMO se cambia por
        // el de la landing mientras se está en ella.
        const temas = [...document.querySelectorAll("meta[name='theme-color']")];
        const antes = temas.map((t) => t.content);
        temas.forEach((t) => (t.content = COLOR_TEMA));

        const alHacerClic = (e) => {
            const el = e.target.closest("a, button");
            if (!el || !raiz.contains(el)) return;
            const href = el.getAttribute("href") || "";

            if (href.startsWith("mailto:")) {
                enviar("automaker_clic_demo", { seccion: seccionDe(el), texto: texto(el) });
            } else if (href === "#precio" && el.closest("section")) {
                enviar("automaker_clic_ver_precio", { seccion: seccionDe(el) });
            } else if (href.startsWith("#") && el.closest("nav")) {
                enviar("automaker_clic_menu", { destino: href.slice(1) });
            } else if (el.matches("[aria-label^='Reproducir']")) {
                enviar("automaker_reproducir_demo", {});
            } else if (el.closest("#preguntas") && el.getAttribute("aria-expanded") === "false") {
                enviar("automaker_abrir_pregunta", { pregunta: texto(el) });
            }
        };
        raiz.addEventListener("click", alHacerClic);

        // Hasta dónde llega cada visita: una vez por sección.
        const vistas = new Set();
        const vigia = new IntersectionObserver(
            (entradas) => {
                entradas.forEach((en) => {
                    const id = en.target.id;
                    if (en.isIntersecting && id && !vistas.has(id)) {
                        vistas.add(id);
                        enviar("automaker_seccion_vista", { seccion: id });
                    }
                });
            },
            { threshold: 0.35 }
        );
        raiz.querySelectorAll("main > section[id]").forEach((s) => vigia.observe(s));

        return () => {
            raiz.removeEventListener("click", alHacerClic);
            vigia.disconnect();
            temas.forEach((t, i) => (t.content = antes[i]));
        };
    }, []);

    if (!CLARITY_ID || !consentimiento?.analitica) return null;
    // consentv2: la API de consentimiento que Clarity exige en el EEE.
    // El id no puede ser "clarity": el navegador expone los elementos con id
    // como window.<id>, y Clarity creería que ya está cargado.
    const publicidad = consentimiento.publicidad ? "granted" : "denied";
    return (
        <Script id="clarity-arranque" strategy="afterInteractive">
            {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");window.clarity("consentv2",{ad_Storage:"${publicidad}",analytics_Storage:"granted"});`}
        </Script>
    );
}
