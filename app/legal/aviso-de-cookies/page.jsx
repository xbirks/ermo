"use client";

import Link from "next/link";
import Spacer from "@/app/buttons/spacer";
import { motion } from "framer-motion";
import Inner from "@/app/components/Transiciones/inner";
import { abrirPanelCookies } from "@/app/lib/consentimiento";

// Las tablas tienen que coincidir con lo que la web guarda de verdad:
// app/lib/consentimiento.js (Google), app/automaker/Medicion.jsx
// (Clarity), la calculadora (localStorage) y la sesión de /interno. Si se
// añade una herramienta que guarde algo en el navegador, va aquí.

const NECESARIAS = [
  ["cookie-consent", "ERMO, en el almacenamiento local del navegador", "Recuerda lo que has elegido en el aviso de cookies.", "12 meses"],
  ["calc-web-v1", "ERMO, en el almacenamiento local del navegador", "Guarda la configuración de la calculadora para que no la pierdas si vuelves.", "Hasta que borres los datos del navegador"],
  ["ermo_finanzas_sesion", "ERMO, cookie de ermo.es", "Mantiene abierta la sesión de la zona privada de gestión. Solo se instala al entrar en ella con contraseña, algo que solo hace el titular de la web.", "30 días"],
];

const ANALISIS = [
  ["_ga", "Google Analytics, cookie de ermo.es", "Distingue a los visitantes para contar usuarios.", "2 años"],
  ["_ga_XHXYQ2JL9P", "Google Analytics, cookie de ermo.es", "Mantiene el estado de la visita.", "2 años"],
  ["_clck", "Microsoft Clarity, cookie de ermo.es (solo en la página de Automaker)", "Reconoce al visitante entre visitas.", "1 año"],
  ["_clsk", "Microsoft Clarity, cookie de ermo.es (solo en la página de Automaker)", "Une las páginas vistas en una misma sesión.", "1 día"],
  ["CLID, MUID y otras", "Microsoft, en clarity.ms y bing.com", "Identifican al visitante y hacen funcionar Clarity.", "Hasta 1 año"],
];

const PUBLICIDAD = [
  ["_gcl_au", "Google Ads, cookie de ermo.es", "Relaciona tus visitas con los anuncios de Google en los que has hecho clic, para medir conversiones.", "90 días"],
  ["_gcl_aw", "Google Ads, cookie de ermo.es", "Guarda el identificador del clic en el anuncio con el que llegaste.", "90 días"],
  ["IDE, test_cookie y otras", "Google, en doubleclick.net y otros dominios de Google", "Muestran y miden anuncios, y permiten enseñar anuncios de ERMO a quien ya ha visitado la web.", "IDE, hasta 13 meses; test_cookie, 15 minutos"],
];

function Tabla({ filas }) {
  return (
    <div className="legal__tabla">
      <table>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Quién la pone y dónde</th>
            <th scope="col">Para qué</th>
            <th scope="col">Duración</th>
          </tr>
        </thead>
        <tbody>
          {filas.map(([nombre, quien, para, duracion]) => (
            <tr key={nombre}>
              <td><code>{nombre}</code></td>
              <td>{quien}</td>
              <td>{para}</td>
              <td>{duracion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ServiciosPrincipalPage() {
  return (
    <Inner>
      <div className="master__body servicios__master">
        <motion.div
          initial={{ opacity: 0, transform: "translateY(30%)" }}
          whileInView={{ opacity: 1, transform: "translateY(0%)" }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h1 className="servicios__h1">Política de cookies</h1>
        </motion.div>

        <div className="legal">

          <p className="legal__fecha">Última actualización: 28 de septiembre de 2026.</p>

          <h2>1. Qué son las cookies</h2>
          <p>
            Las cookies son pequeños archivos que una web guarda en tu
            navegador para recordar información de una página a otra o entre
            visitas. Aquí llamamos también cookies a las tecnologías
            parecidas, como el almacenamiento local del navegador. Esta
            política explica cuáles usa ermo.es y cómo decidir sobre ellas.
            El responsable es Andrés Ortega Montoya (ERMO); todo lo demás
            sobre tus datos está en la{" "}
            <Link href="/legal/politica-de-privacidad">política de privacidad</Link>.
          </p>

          <Spacer className="spacer-s" />

          <h2>2. Las cookies que usamos</h2>

          <h3>2.1 Necesarias</h3>
          <p>
            Hacen que la web funcione o guardan algo que tú has pedido. La ley
            no exige tu consentimiento para ellas (artículo 22.2 de la Ley
            34/2002, de Servicios de la Sociedad de la Información, LSSI).
          </p>
          <Tabla filas={NECESARIAS} />

          <h3>2.2 Análisis, solo si las aceptas</h3>
          <p>
            Nos dicen qué páginas se visitan y cómo se usa la web. Microsoft
            Clarity solo funciona en la página de Automaker y únicamente
            cuando lo tenemos activado; además de medir, genera mapas de calor
            y grabaciones de la sesión que no recogen lo que escribes en los
            campos.
          </p>
          <Tabla filas={ANALISIS} />

          <h3>2.3 Publicidad, solo si las aceptas</h3>
          <p>
            Miden qué anuncios nuestros en Google acaban en un contacto y
            permiten mostrar anuncios de ERMO a quien ya ha visitado la web.
            Google usa también estos datos para sus propios fines, según su{" "}
            <a href="https://policies.google.com/privacy?hl=es" rel="noopener noreferrer">política de privacidad</a>.
          </p>
          <Tabla filas={PUBLICIDAD} />

          <h3>2.4 Vídeos incrustados, solo si pulsas reproducir</h3>
          <p>
            Algunos vídeos son de YouTube, en su modo de privacidad mejorada
            (youtube-nocookie.com), y la demo de Automaker está alojada en
            Bunny Stream. No se carga nada de estos servicios hasta que pulsas
            el botón de reproducir. A partir de ese momento, el proveedor
            recibe tu IP y puede guardar datos en tu navegador según su propia
            política: la de{" "}
            <a href="https://policies.google.com/privacy?hl=es" rel="noopener noreferrer">Google</a> y la de{" "}
            <a href="https://bunny.net/privacy/" rel="noopener noreferrer">Bunny</a>.
          </p>

          <h3>2.5 Estadísticas sin cookies</h3>
          <p>
            Vercel Web Analytics y Vercel Speed Insights cuentan las visitas y
            miden la velocidad de la web sin cookies y sin guardar nada en tu
            navegador, por eso no aparecen en las tablas. Te lo explicamos en
            la política de privacidad.
          </p>

          <Spacer className="spacer-s" />

          <h2>3. Cómo aceptarlas, rechazarlas o cambiar de opinión</h2>
          <p>
            La primera vez que entras, el aviso te deja aceptarlas todas,
            rechazarlas o elegir por separado las de análisis y las de
            publicidad. No hay nada marcado de antemano y, si las rechazas, la
            web funciona igual.
          </p>
          <p>
            Puedes cambiar tu elección cuando quieras desde «Configurar
            cookies», al pie de cada página, o con este botón:
          </p>
          <button type="button" className="legal__boton" onClick={abrirPanelCookies}>
            Cambiar mi elección de cookies
          </button>
          <p>
            Guardamos tu elección 12 meses; pasado ese tiempo te la volveremos
            a pedir. Si retiras un permiso, borramos las cookies que habíamos
            puesto en ermo.es y recargamos la página. Las que Google o
            Microsoft guardan en sus propios dominios tienes que borrarlas
            desde tu navegador:{" "}
            <a href="https://support.google.com/chrome/answer/95647?hl=es" rel="noopener noreferrer">Chrome</a>,{" "}
            <a href="https://support.mozilla.org/es/kb/clear-cookies-and-site-data-firefox" rel="noopener noreferrer">Firefox</a>,{" "}
            <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" rel="noopener noreferrer">Safari</a> y{" "}
            <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" rel="noopener noreferrer">Edge</a>.
            También puedes gestionar los anuncios personalizados de Google en{" "}
            <a href="https://myadcenter.google.com/" rel="noopener noreferrer">myadcenter.google.com</a>.
          </p>
          <p>
            La página de Automaker no muestra el aviso de cookies. Allí Google
            Analytics y Clarity solo se activan si ya los habías aceptado en
            otra página de ermo.es; si no, solo funcionan las estadísticas sin
            cookies.
          </p>

          <Spacer className="spacer-s" />

          <h2>4. Transferencias fuera de la Unión Europea</h2>
          <p>
            Google y Microsoft pueden tratar en EE. UU. los datos de sus
            cookies. Esas transferencias se amparan en el Marco de Privacidad
            de Datos UE-EE. UU., al que ambas están adheridas, y en las
            cláusulas contractuales tipo aprobadas por la Comisión Europea.
          </p>

          <Spacer className="spacer-s" />

          <h2>5. Más información</h2>
          <p>
            Si tienes cualquier duda sobre las cookies o sobre tus datos,
            escríbenos a{" "}
            <a href="mailto:andresortega@ermo.es">andresortega@ermo.es</a>.
          </p>

        </div>
      </div>
    </Inner>
  );
}
