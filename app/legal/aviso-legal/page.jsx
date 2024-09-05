"use client";

import Link from "next/link";
import Spacer from "@/app/buttons/spacer";
import { motion } from "framer-motion";
import Inner from "@/app/components/Transiciones/inner";




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
        <h1 className="servicios__h1">Aviso legal</h1>
    
    </motion.div>

    <div className="legal">

    <h2>Titularidad del Sitio Web</h2>
    <p>El sitio web <strong>ERMO Estudio</strong>, incluyendo todo su contenido, es propiedad de <strong>Andrés Ortega Montoya</strong>, con NIF <strong>49570884L</strong> y domicilio en <strong>Plaza Rafael Atard 20A piso 2 puerta 3, Manises, Valencia, España, 46940</strong>. Puedes ponerte en contacto con nosotros a través del correo electrónico <strong>hola@soyandres.es</strong> o por teléfono al <strong>675392216</strong>.</p>

    <Spacer className="spacer-s" />

    <h2>Finalidad del Sitio Web</h2>
    <p><strong>ERMO Estudio</strong> es un estudio que proporciona soluciones creativas a empresas pequeñas y medianas. Ofrecemos servicios que abarcan desde diseño gráfico hasta programación web, incluyendo fotografía profesional de producto. Este sitio web tiene como finalidad informar sobre nuestros servicios y mostrar nuestro portafolio de trabajos.</p>

    <Spacer className="spacer-s" />

    <h2>Derechos de Propiedad Intelectual</h2>
    <p>Todo el contenido publicado en este sitio web, incluidos diseños, textos, gráficos, imágenes, software, y selección de los mismos, son propiedad exclusiva de <strong>Andrés Ortega Montoya</strong>. Están protegidos por las leyes de propiedad intelectual y son de uso exclusivo del titular.</p>

    <Spacer className="spacer-s" />

    <h2>Política de Privacidad</h2>
    <p>En <strong>ERMO Estudio</strong>, no recopilamos datos personales de nuestros visitantes ya que es un sitio meramente informativo. Para más detalles sobre cómo tratamos la información, puedes consultar nuestra <Link href="/legal/politica-de-privacidad">Política de Privacidad.</Link></p>

    <Spacer className="spacer-s" />
    
    <h2>Condiciones de Uso</h2>
    <p>El contenido de este sitio web no debe reproducirse sin el permiso explícito del titular. Está prohibida la descarga de cualquier material gráfico o textual sin consentimiento previo. Asimismo, se prohíbe el uso de nuestro sitio web para actividades ilegales o que puedan dañar la imagen del estudio o terceros.</p>

    <Spacer className="spacer-s" />
    
    <h2>Política de Cookies</h2>
    <p>Utilizamos cookies para optimizar la experiencia de nuestros usuarios. Estas cookies no recopilan información personal. Para más detalles sobre el uso de cookies, visita nuestra <Link href="/legal/aviso-de-cookies">Política de Cookies.</Link></p>

    <Spacer className="spacer-s" />
    
    <h2>Aviso Legal sobre Enlaces Externos</h2>
    <p>Este sitio web puede contener enlaces a sitios externos cuyos contenidos no son responsabilidad de <strong>ERMO Estudio</strong>.</p>

    <Spacer className="spacer-s" />
    
    <h2>Aviso sobre Derechos de Autor</h2>
    <p>Si crees que cualquier material en nuestro sitio infringe tus derechos de autor, por favor contacta con nosotros a través de <strong>hola@soyandres.es</strong> para abordar el asunto.</p>

    <Spacer className="spacer-s" />
    
    <h2>Jurisdicción y Leyes Aplicables</h2>
    <p>Este Aviso Legal se rige por las leyes del Reino de España. Cualquier disputa relacionada con el uso de este sitio será sometida a la jurisdicción exclusiva de los tribunales del país.</p>

    </div>


    </div>
    </Inner>
    );
  }
  