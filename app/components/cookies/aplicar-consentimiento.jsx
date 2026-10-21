"use client";

import { useEffect } from "react";
import { aplicarConsentimiento, borrarCookiesSinPermiso, leerConsentimiento } from "@/app/lib/consentimiento";

// Carga Google Analytics y Google Ads al entrar si la persona ya los
// aceptó en otra visita, y borra las cookies de Google que no tengan
// permiso vigente. Va aparte del banner porque el banner no se monta en
// todas las rutas (Automaker, zona interna) y la elección guardada tiene
// que respetarse igual en ellas.
export default function AplicarConsentimiento() {
  useEffect(() => {
    borrarCookiesSinPermiso();
    const eleccion = leerConsentimiento();
    if (eleccion) aplicarConsentimiento(eleccion);
  }, []);

  return null;
}
