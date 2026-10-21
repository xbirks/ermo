"use client";

import Link from "next/link";
import Spacer from "@/app/buttons/spacer";
import { motion } from "framer-motion";
import Inner from "@/app/components/Transiciones/inner";

// Segunda capa de información del RGPD (art. 13 y 14) y la LOPDGDD. La
// primera está bajo el formulario (ContactFormLanding.jsx) y la cláusula
// de la firma de correo enlaza aquí (ermo.es/privacidad): si cambia una
// finalidad, un plazo o un proveedor, revisar las tres.

const CORREO = "andresortega@ermo.es";

function Ficha({ datos, para, base, tiempo }) {
    return (
        <dl className="legal__ficha">
            <dt>Qué datos</dt>
            <dd>{datos}</dd>
            <dt>Para qué</dt>
            <dd>{para}</dd>
            <dt>Base jurídica</dt>
            <dd>{base}</dd>
            <dt>Cuánto tiempo</dt>
            <dd>{tiempo}</dd>
        </dl>
    );
}

const Correo = () => <a href={`mailto:${CORREO}`}>{CORREO}</a>;

export default function ServiciosPrincipalPage() {
    return (
    <Inner>

    <div className="master__body servicios__master">

    <motion.div
        initial={{ opacity: 0, transform: "translateY(30%)" }}
        whileInView={{ opacity: 1, transform: "translateY(0%)"}}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.1}}
     >
        <h1 className="servicios__h1">Política de privacidad</h1>

    </motion.div>

    <div className="legal">

    <p className="legal__fecha">Última actualización: 28 de septiembre de 2026.</p>

    <p>Aquí te contamos qué datos personales tratamos cuando visitas ermo.es, nos escribes o trabajas con nosotros: para qué los usamos, con qué base legal, cuánto tiempo los guardamos, con quién los compartimos y qué puedes hacer tú. Lo hacemos conforme al Reglamento (UE) 2016/679, General de Protección de Datos (RGPD), y a la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).</p>

    <Spacer className="spacer-s" />

    <h2>1. Quién trata tus datos</h2>
    <ul>
        <li><strong>Responsable:</strong> Andrés Ortega Montoya, que trabaja con el nombre comercial ERMO.</li>
        <li><strong>NIF:</strong> 49570884L</li>
        <li><strong>Dirección:</strong> Plaza Rafael Atard 20A, piso 2, puerta 3, 46940 Manises (Valencia)</li>
        <li><strong>Correo:</strong> <Correo /></li>
        <li><strong>Teléfono:</strong> 675 392 216</li>
    </ul>
    <p>No tenemos delegado de protección de datos: por nuestro tamaño y nuestra actividad la ley no lo exige (artículo 37 del RGPD y artículo 34 de la LOPDGDD). Para cualquier cuestión sobre tus datos, escríbenos directamente a <Correo />.</p>

    <Spacer className="spacer-s" />

    <h2>2. Para qué usamos tus datos</h2>

    <h3>2.1 Cuando nos contactas por el formulario, por correo o por WhatsApp</h3>
    <Ficha
        datos={<>En el formulario, tu nombre y tu correo electrónico. Por correo o por WhatsApp, los que tú decidas enviarnos: normalmente tu nombre, tu correo o tu teléfono y lo que nos cuentes de tu proyecto. Si nos escribes en nombre de una empresa, también tu cargo y tus datos de contacto profesional.</>}
        para={<>Responderte, darte la información que nos pides y, si quieres, prepararte un presupuesto.</>}
        base={<>Si nos pides información o presupuesto sobre un servicio, la aplicación de medidas precontractuales a petición tuya (artículo 6.1.b del RGPD). Para cualquier otra consulta, nuestro interés legítimo en contestar a quien se dirige a nosotros (artículo 6.1.f del RGPD). Si nos escribes en nombre de una empresa o como profesional, nuestro interés legítimo en mantener esa relación profesional (artículo 19 de la LOPDGDD).</>}
        tiempo={<>Mientras dure la conversación o la relación profesional y ninguna de las dos partes se oponga. Si no llegas a ser cliente, los borramos como máximo dos años después del último contacto, o antes si nos lo pides.</>}
    />

    <h3>2.2 Si eres cliente</h3>
    <Ficha
        datos={<>Nombre o razón social, NIF, dirección, datos de contacto, datos de facturación y de pago, y la información y los materiales del proyecto que nos facilites.</>}
        para={<>Prestarte el servicio que has contratado, gestionar el proyecto contigo, facturar, cobrar y cumplir nuestras obligaciones contables y fiscales.</>}
        base={<>La ejecución del contrato que tenemos contigo (artículo 6.1.b del RGPD) y el cumplimiento de obligaciones legales, sobre todo contables y tributarias (artículo 6.1.c del RGPD).</>}
        tiempo={<>Mientras dure la relación y, después, durante los plazos que marca la ley: seis años para las facturas y la documentación contable (artículo 30 del Código de Comercio) y cinco años para atender posibles reclamaciones derivadas del contrato (artículo 1964 del Código Civil). Pasados esos plazos, los borramos.</>}
    />

    <h3>2.3 Comunicaciones sobre nuestros productos y servicios</h3>
    <Ficha
        datos={<>Tu nombre y tu correo electrónico.</>}
        para={<>Enviarte de vez en cuando información sobre nuestros productos y servicios.</>}
        base={<>Si eres cliente, nuestro interés legítimo en contarte productos y servicios parecidos a los que ya nos contrataste (artículo 6.1.f del RGPD y artículo 21.2 de la Ley 34/2002, de Servicios de la Sociedad de la Información, LSSI). En los demás casos, tu consentimiento (artículo 6.1.a del RGPD): si solo nos has hecho una consulta, no te enviaremos comunicaciones comerciales salvo que nos digas que quieres recibirlas.</>}
        tiempo={<>Hasta que te opongas o retires tu consentimiento. Para dejar de recibirlas, responde a cualquiera de nuestros correos pidiéndolo o escríbenos a <Correo />; en cada comunicación te recordamos cómo hacerlo. Después guardamos solo tu correo en una lista de exclusión, para asegurarnos de no volver a escribirte.</>}
    />

    <h3>2.4 Funcionamiento y seguridad de la web</h3>
    <Ficha
        datos={<>Tu dirección IP y los datos técnicos de cada petición: navegador, página solicitada, fecha y hora.</>}
        para={<>Servir la web, protegerla de abusos y resolver errores. Lo hace nuestro proveedor de alojamiento, Vercel.</>}
        base={<>Nuestro interés legítimo en que la web funcione y sea segura (artículo 6.1.f del RGPD).</>}
        tiempo={<>Los registros del servidor se borran automáticamente en pocos días.</>}
    />

    <h3>2.5 Estadísticas de la web sin cookies</h3>
    <Ficha
        datos={<>Datos técnicos de la visita: página vista, web de procedencia, país, tipo de dispositivo, sistema operativo, navegador y tiempos de carga.</>}
        para={<>Saber cuántas visitas recibe cada página y comprobar que la web carga rápido. Usamos Vercel Web Analytics y Vercel Speed Insights, que no instalan cookies ni guardan nada en tu dispositivo. Para contar visitas únicas, Vercel calcula un identificador temporal a partir de la petición y lo descarta a las 24 horas; nosotros solo vemos cifras agregadas.</>}
        base={<>Nuestro interés legítimo en conocer de forma agregada cómo se usa la web y en mantenerla en buen estado (artículo 6.1.f del RGPD). Puedes oponerte escribiéndonos.</>}
        tiempo={<>El identificador de la visita se descarta a las 24 horas. Las estadísticas agregadas no te identifican.</>}
    />

    <h3>2.6 Analítica y publicidad con cookies, solo si las aceptas</h3>
    <Ficha
        datos={<>Identificadores de las cookies, páginas que visitas, cómo has llegado a la web (por ejemplo, desde un anuncio), lo que haces en ella (clics en los botones de contacto, uso de la calculadora o envío del formulario, pero no su contenido), dispositivo, navegador y ubicación aproximada.</>}
        para={<>Con las cookies de análisis, Google Analytics nos dice qué páginas se visitan y cómo se usa la web; en la página de Automaker, Microsoft Clarity puede además generar mapas de calor y grabaciones de la sesión (movimientos, clics y desplazamiento), que no recogen lo que escribes en los campos. Con las cookies de publicidad, Google Ads mide qué anuncios nuestros acaban en un contacto y permite mostrar anuncios de ERMO a personas que ya han visitado la web.</>}
        base={<>Tu consentimiento (artículo 6.1.a del RGPD y artículo 22.2 de la LSSI), que das o niegas en el aviso de cookies y puedes retirar cuando quieras desde «Configurar cookies», al pie de cada página. Si no las aceptas, estas herramientas no llegan a cargarse.</>}
        tiempo={<>Las cookies duran lo que indica la <Link href="/legal/aviso-de-cookies">política de cookies</Link>, como mucho dos años. Google conserva los datos de Analytics durante el plazo configurado en nuestra cuenta, que nunca supera los 14 meses.</>}
    />

    <h3>2.7 La calculadora de presupuesto</h3>
    <p>Cuando usas la calculadora nos llega un aviso interno, a través de Discord, con la configuración que eliges (tipo de web, tamaño, complejidad y precio estimado), la hora y un código aleatorio que cambia en cada visita. No incluye tu nombre, tu correo ni tu IP, así que no te identifica. Además, la calculadora guarda tu configuración en tu propio navegador para que no la pierdas si vuelves; esos datos no salen de tu dispositivo.</p>

    <Spacer className="spacer-s" />

    <h2>3. Qué pasa si no nos das tus datos</h2>
    <p>El nombre y el correo del formulario son necesarios para poder contestarte. Si eres cliente, los datos fiscales son obligatorios para emitir la factura. Recibir comunicaciones comerciales es voluntario, y aceptar las cookies de análisis y de publicidad también: si las rechazas, la web funciona igual.</p>

    <Spacer className="spacer-s" />

    <h2>4. Con quién compartimos tus datos</h2>
    <p>No cedemos tus datos a terceros, salvo obligación legal: por ejemplo, a la Agencia Tributaria o a jueces y tribunales cuando nos lo requieran.</p>
    <p>Para funcionar sí nos apoyamos en proveedores que tratan datos por cuenta nuestra, solo para prestarnos su servicio y con las garantías que exige el RGPD (encargados del tratamiento):</p>
    <ul>
        <li><strong>Vercel Inc.</strong> (EE. UU.): alojamiento de la web, envío del formulario y estadísticas sin cookies.</li>
        <li><strong>Google</strong> (Gmail): los mensajes del formulario se envían desde una cuenta de Gmail y llegan también a ella.</li>
        <li><strong>DonDominio</strong> (Soluciones Corporativas IP, S.L.U., España): el correo electrónico de ermo.es.</li>
        <li><strong>Google Ireland Limited</strong> (Google Analytics), solo si aceptas las cookies de análisis.</li>
    </ul>
    <p>Además, hay terceros que reciben datos porque tú eliges usar su servicio o lo aceptas, y que los tratan por su cuenta, según su propia política de privacidad:</p>
    <ul>
        <li><strong>Google</strong> (Google Ads), si aceptas las cookies de publicidad. Google usa también esos datos para sus propios fines publicitarios (<a href="https://policies.google.com/privacy?hl=es" rel="noopener noreferrer">policies.google.com/privacy</a>).</li>
        <li><strong>Microsoft</strong> (Clarity), si aceptas las cookies de análisis y visitas la página de Automaker mientras Clarity está activo.</li>
        <li><strong>WhatsApp Ireland Limited</strong>, si nos escribes por WhatsApp.</li>
        <li><strong>YouTube</strong> (Google) y <strong>Bunny Stream</strong> (BunnyWay d.o.o., Eslovenia), solo cuando pulsas para reproducir un vídeo incrustado.</li>
        <li>Tu banco y las entidades bancarias o de pago con las que cobramos, cuando nos pagas.</li>
    </ul>

    <Spacer className="spacer-s" />

    <h2>5. Transferencias fuera de la Unión Europea</h2>
    <p>Vercel, Google, Microsoft y Meta (dueña de WhatsApp) son empresas estadounidenses o pertenecen a grupos estadounidenses, así que algunos datos pueden tratarse en EE. UU. Estas transferencias se amparan en el Marco de Privacidad de Datos UE-EE. UU., que la Comisión Europea declaró adecuado el 10 de julio de 2023, para las empresas adheridas a él, y en las cláusulas contractuales tipo aprobadas por la Comisión (artículos 45 y 46 del RGPD). Puedes pedirnos más información sobre estas garantías en <Correo />.</p>

    <Spacer className="spacer-s" />

    <h2>6. Tus derechos</h2>
    <p>Puedes ejercer gratis, en cualquier momento, estos derechos:</p>
    <ul>
        <li><strong>Acceso:</strong> saber si tratamos datos tuyos y obtener una copia.</li>
        <li><strong>Rectificación:</strong> corregir los que sean inexactos o estén incompletos.</li>
        <li><strong>Supresión:</strong> pedir que los borremos.</li>
        <li><strong>Oposición:</strong> pedir que dejemos de tratarlos, en particular para comunicaciones comerciales o cuando nos basamos en el interés legítimo.</li>
        <li><strong>Limitación:</strong> pedir que los conservemos sin usarlos, por ejemplo mientras comprobamos una reclamación tuya.</li>
        <li><strong>Portabilidad:</strong> recibir los datos que nos diste en un formato de uso común, o que se los pasemos a otro responsable.</li>
        <li><strong>Retirar tu consentimiento</strong> cuando quieras, sin que afecte a lo que hicimos antes con él. Para las cookies, desde «Configurar cookies», al pie de cada página.</li>
        <li><strong>No ser objeto de decisiones automatizadas:</strong> no tomamos decisiones basadas solo en tratamientos automatizados ni hacemos perfiles que tengan efectos sobre ti.</li>
    </ul>
    <p>Para ejercerlos, escríbenos a <Correo /> o por carta a Plaza Rafael Atard 20A, piso 2, puerta 3, 46940 Manises (Valencia), indicando qué derecho quieres ejercer. Si tenemos dudas razonables sobre tu identidad, podemos pedirte algún dato más para confirmarla. Te responderemos en un mes como máximo; si la petición es compleja, ese plazo puede ampliarse dos meses más, y te avisaremos dentro del primer mes.</p>

    <Spacer className="spacer-s" />

    <h2>7. Reclamación ante la AEPD</h2>
    <p>Si crees que no hemos tratado bien tus datos, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" rel="noopener noreferrer">www.aepd.es</a>, C/ Jorge Juan 6, 28001 Madrid). Antes, si quieres, escríbenos e intentaremos resolverlo.</p>

    <Spacer className="spacer-s" />

    <h2>8. De dónde obtenemos tus datos</h2>
    <p>Casi siempre, de ti: del formulario, de tus correos o mensajes y de lo que nos das al contratar. A veces nos llegan de otra persona, como la empresa para la que trabajas, un compañero que te incluye en un correo o alguien que nos recomienda. En esos casos solo tratamos datos de contacto profesional (nombre, cargo, correo y teléfono de trabajo), y te lo contaremos en nuestra primera comunicación contigo o, como tarde, en un mes.</p>

    <Spacer className="spacer-s" />

    <h2>9. Menores de edad</h2>
    <p>Nuestros servicios se dirigen a profesionales y empresas. No tratamos a sabiendas datos de menores de 14 años: por debajo de esa edad, el consentimiento tiene que darlo quien tenga la patria potestad o la tutela (artículo 7 de la LOPDGDD). Si eres menor de 14 años, no nos envíes tus datos. Si descubrimos que los hemos recibido, los borraremos.</p>

    <Spacer className="spacer-s" />

    <h2>10. Seguridad</h2>
    <p>Aplicamos medidas técnicas y organizativas adecuadas al riesgo: la web va siempre cifrada (HTTPS), solo acceden a los datos las personas que los necesitan para su trabajo, con deber de confidencialidad, y trabajamos con proveedores que ofrecen garantías suficientes.</p>

    <Spacer className="spacer-s" />

    <h2>11. Cambios en esta política</h2>
    <p>Podemos actualizar esta política cuando cambie la ley o la forma en que tratamos los datos. Publicaremos aquí la nueva versión con su fecha y, si el cambio es importante y tenemos tu correo, te avisaremos.</p>

    </div>


    </div>
    </Inner>
    );
  }
