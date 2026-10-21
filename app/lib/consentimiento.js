// Consentimiento de cookies con Consent Mode v2 de Google, en modo básico:
// todo empieza denegado y gtag.js no se descarga hasta que alguien acepta
// la analítica o la publicidad. Sin permiso no sale ninguna petición a
// Google, ni siquiera los avisos sin cookies del modo avanzado.
//
// window.gtag solo existe cuando hay algún permiso, así que los
// `typeof window.gtag === 'function'` repartidos por la web (ga.js, la
// calculadora, Medicion.jsx...) siguen sirviendo de interruptor.
//
// La elección se guarda en localStorage 12 meses; pasado ese plazo, o si
// cambia VERSION, el banner vuelve a preguntar. Los valores antiguos
// ("accepted" / "rejected") se tratan como si no hubiera elección: se
// dieron con un aviso que no hablaba de publicidad.

const CLAVE = 'cookie-consent';
const VERSION = 2;
const VALIDEZ_MS = 365 * 24 * 60 * 60 * 1000;

export const GA4_ID = 'G-XHXYQ2JL9P';
export const ADS_ID = 'AW-11336883443';

// El banner escucha EVENTO_ABRIR para mostrarse de nuevo (pie de página y
// política de cookies). EVENTO_CAMBIO avisa de una elección nueva.
export const EVENTO_ABRIR = 'ermo:abrir-cookies';
export const EVENTO_CAMBIO = 'ermo:consentimiento';

export function abrirPanelCookies() {
  window.dispatchEvent(new Event(EVENTO_ABRIR));
}

export function leerConsentimiento() {
  if (typeof window === 'undefined') return null;
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (guardado?.v !== VERSION) return null;
    if (!(Date.now() - guardado.fecha < VALIDEZ_MS)) return null;
    return { analitica: guardado.analitica === true, publicidad: guardado.publicidad === true };
  } catch {
    return null;
  }
}

export const permiteAnalitica = () => leerConsentimiento()?.analitica === true;
export const permitePublicidad = () => leerConsentimiento()?.publicidad === true;

export function guardarConsentimiento({ analitica, publicidad }) {
  const antes = leerConsentimiento();
  const eleccion = { analitica: analitica === true, publicidad: publicidad === true };
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ v: VERSION, fecha: Date.now(), ...eleccion }));
  } catch {}

  // Retirar un permiso ya dado: se borran las cookies de ermo.es y se
  // recarga, para que no quede nada de Google corriendo en la página.
  const retira = antes && ((antes.analitica && !eleccion.analitica) || (antes.publicidad && !eleccion.publicidad));
  if (retira) {
    gtag('consent', 'update', permisos(eleccion));
    borrarCookies(eleccion);
    window.location.reload();
    return;
  }

  aplicarConsentimiento(eleccion);
  window.dispatchEvent(new CustomEvent(EVENTO_CAMBIO, { detail: eleccion }));
}

function gtag() {
  window.dataLayer = window.dataLayer || [];
  // gtag.js solo entiende el objeto `arguments`, no un array.
  window.dataLayer.push(arguments);
}

const permisos = ({ analitica, publicidad }) => ({
  analytics_storage: analitica ? 'granted' : 'denied',
  ad_storage: publicidad ? 'granted' : 'denied',
  ad_user_data: publicidad ? 'granted' : 'denied',
  ad_personalization: publicidad ? 'granted' : 'denied',
});

let iniciado = false;
const configurados = new Set();

export function aplicarConsentimiento({ analitica, publicidad }) {
  if (typeof window === 'undefined') return;
  if (!analitica && !publicidad) return;

  if (!iniciado) {
    iniciado = true;
    gtag('consent', 'default', permisos({ analitica: false, publicidad: false }));
    gtag('consent', 'update', permisos({ analitica, publicidad }));
    // La etiqueta G-XHXYQ2JL9P lleva Google Ads unido como destino en el
    // panel de Google: con solo la analítica aceptada, Ads manda igualmente
    // un aviso sin cookies. Esto quita de ese aviso el identificador del
    // clic en el anuncio (gclid). Arreglarlo del todo es separar los
    // destinos en la configuración de la etiqueta, no aquí.
    gtag('set', 'ads_data_redaction', true);
    gtag('js', new Date());
    window.gtag = gtag;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
    document.head.appendChild(script);
  } else {
    gtag('consent', 'update', permisos({ analitica, publicidad }));
  }

  // Cada etiqueta solo se configura con su propio permiso: GA4 sin
  // analítica mandaría avisos sin cookies, y eso ya es medir.
  if (analitica && !configurados.has(GA4_ID)) {
    configurados.add(GA4_ID);
    gtag('config', GA4_ID);
  }
  if (publicidad && !configurados.has(ADS_ID)) {
    configurados.add(ADS_ID);
    gtag('config', ADS_ID);
  }
}

// Quien visitó la web antes de este cambio ya trae _ga y _gcl_au: se
// cargaba Google sin preguntar. Sin permiso vigente, se borran al entrar.
export function borrarCookiesSinPermiso() {
  if (typeof window === 'undefined') return;
  borrarCookies(leerConsentimiento() ?? { analitica: false, publicidad: false });
}

// Solo las cookies de ermo.es: las que Google o Microsoft ponen en sus
// propios dominios no se pueden borrar desde aquí (lo explica la política
// de cookies).
function borrarCookies({ analitica, publicidad }) {
  const patrones = [];
  if (!analitica) patrones.push(/^_ga/, /^_gid$/, /^_clck$/, /^_clsk$/);
  if (!publicidad) patrones.push(/^_gcl_/);

  const dominio = window.location.hostname.replace(/^www\./, '');
  const caducada = 'expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

  document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((nombre) => patrones.some((p) => p.test(nombre)))
    .forEach((nombre) => {
      document.cookie = `${nombre}=; ${caducada}`;
      document.cookie = `${nombre}=; ${caducada}; domain=${dominio}`;
      document.cookie = `${nombre}=; ${caducada}; domain=.${dominio}`;
    });
}
