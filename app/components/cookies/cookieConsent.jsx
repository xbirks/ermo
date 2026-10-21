"use client";
import { useEffect, useRef, useState } from "react";
import { EVENTO_ABRIR, guardarConsentimiento, leerConsentimiento } from "@/app/lib/consentimiento";
import "./cookie.scss";

// Aviso de cookies en dos capas, como pide la guía de cookies de la AEPD:
// primero aceptar, rechazar o configurar, y aceptar y rechazar con el
// mismo peso visual; en "Configurar", una casilla por finalidad, sin nada
// marcado de antemano. El pie de página y la política de cookies lo
// reabren con abrirPanelCookies() para cambiar o retirar el permiso.

export default function CookieConsent() {
  const [vista, setVista] = useState(null); // null | "aviso" | "panel"
  const [analitica, setAnalitica] = useState(false);
  const [publicidad, setPublicidad] = useState(false);
  const caja = useRef(null);

  useEffect(() => {
    if (!leerConsentimiento()) setVista("aviso");

    const abrir = () => {
      const actual = leerConsentimiento();
      setAnalitica(actual?.analitica === true);
      setPublicidad(actual?.publicidad === true);
      setVista("panel");
    };
    window.addEventListener(EVENTO_ABRIR, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR, abrir);
  }, []);

  // Al abrir el panel desde el pie, el foco salta a él para que se pueda
  // usar con teclado sin recorrer toda la página.
  useEffect(() => {
    if (vista === "panel") caja.current?.focus();
  }, [vista]);

  const elegir = (eleccion) => {
    setVista(null);
    guardarConsentimiento(eleccion);
  };

  if (!vista) return null;

  return (
    <div
      id="cookie-banner"
      ref={caja}
      tabIndex={-1}
      className={`cookie-banner show ${vista === "panel" ? "is-panel" : ""}`}
      role="region"
      aria-label="Aviso de cookies"
    >
      {vista === "aviso" ? (
        <>
          <p>
            Usamos cookies necesarias para que la web funcione y, solo si
            aceptas, cookies de Google para medir las visitas y nuestros
            anuncios y para mostrarte publicidad de ERMO en otras webs.
            Puedes aceptarlas, rechazarlas o elegir cuáles.{" "}
            <a className="cookie__link" href="/legal/aviso-de-cookies">Política de cookies</a>.
          </p>
          <div className="cookie-buttons">
            <button type="button" className="cookie__boton" onClick={() => elegir({ analitica: true, publicidad: true })}>
              Aceptar todas
            </button>
            <button type="button" className="cookie__boton" onClick={() => elegir({ analitica: false, publicidad: false })}>
              Rechazar
            </button>
            <button type="button" className="cookie__boton cookie__boton--secundario" onClick={() => setVista("panel")}>
              Configurar
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="cookie__titulo">Elige qué cookies aceptas</p>

          <div className="cookie__opciones">
            <label className="cookie__opcion">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Necesarias</strong> (siempre activas). Recuerdan tu
                elección sobre cookies y lo que configuras en la calculadora.
              </span>
            </label>
            <label className="cookie__opcion">
              <input type="checkbox" checked={analitica} onChange={(e) => setAnalitica(e.target.checked)} />
              <span>
                <strong>Análisis</strong>. Google Analytics, y Microsoft
                Clarity en la página de Automaker, para saber qué páginas se
                visitan y cómo se usa la web.
              </span>
            </label>
            <label className="cookie__opcion">
              <input type="checkbox" checked={publicidad} onChange={(e) => setPublicidad(e.target.checked)} />
              <span>
                <strong>Publicidad</strong>. Google Ads, para medir qué
                anuncios acaban en un contacto y mostrar anuncios de ERMO a
                quien ya ha visitado la web.
              </span>
            </label>
          </div>

          <p className="cookie__nota">
            Puedes cambiarlo cuando quieras desde «Configurar cookies», al pie
            de la página.{" "}
            <a className="cookie__link" href="/legal/aviso-de-cookies">Política de cookies</a>.
          </p>

          <div className="cookie-buttons">
            <button type="button" className="cookie__boton" onClick={() => elegir({ analitica, publicidad })}>
              Guardar selección
            </button>
            <button type="button" className="cookie__boton cookie__boton--secundario" onClick={() => elegir({ analitica: true, publicidad: true })}>
              Aceptar todas
            </button>
            <button type="button" className="cookie__boton cookie__boton--secundario" onClick={() => elegir({ analitica: false, publicidad: false })}>
              Rechazar todas
            </button>
          </div>
        </>
      )}
    </div>
  );
}
