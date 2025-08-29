// lib/ga.js
function sendGA(event, params, attempt = 0) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  } else if (attempt < 10) {
    // reintenta hasta ~2s por si gtag aún no cargó
    setTimeout(() => sendGA(event, params, attempt + 1), 200);
  }
}

/** Evento genérico para la calculadora */
export function trackCalcInteraction(action, detail, value) {
  sendGA('calc_interaction', {
    action,               // ej: 'tamano', 'complejidad'
    detail,               // ej: 'mediana', 'intermedio'
    value,                // ej: total numérico
    currency: 'EUR',
  });
}

/** Solo registra la PRIMERA interacción por pestaña/sesión */
export function trackFirstCalcInteraction(action, detail, value) {
  try {
    if (sessionStorage.getItem('calcPingSent')) return;
    sessionStorage.setItem('calcPingSent', '1');
  } catch {}
  trackCalcInteraction(action, detail, value);
}

/* ---------------- NUEVOS EVENTOS PRINCIPALES ---------------- */

/** Envío de formulario de contacto */
export function trackFormSubmit(form_name = "contacto_landing_web") {
  sendGA("form_submit", { form_name });
}

/** Clic en botón de WhatsApp */
export function trackClickWhatsapp(section = "contacto") {
  sendGA("click_whatsapp", { section });
}

/** Clic en botón de Llamada */
export function trackClickCall(section = "contacto") {
  sendGA("click_call", { section });
}

/** Descarga de PDF desde la calculadora */
export function trackCalcPDF(value = 0) {
  sendGA("calc_pdf", { value, currency: "EUR" });
}
