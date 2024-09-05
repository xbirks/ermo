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
        <h1 className="servicios__h1">Política de privacidad</h1>
    
    </motion.div>

    <div className="legal">

    <h2>Política de Privacidad</h2>
    <p>En <strong>ERMO Estudio de diseño</strong>, respetamos la privacidad de nuestros visitantes. Esta Política de Privacidad explica cómo tratamos la información que recopilamos a través de nuestro sitio web <Link href="https://www.ermo.es">https://www.ermo.es</Link>.</p>

    <Spacer className="spacer-s" />

    <h2>Uso de Cookies y Tecnologías de Seguimiento</h2>
    <p>Utilizamos cookies técnicas para recoger datos que nos ayudan a mejorar nuestro sitio web. Estas cookies son gestionadas por <strong>Google Search Console</strong> y <strong>Vercel Analytics</strong> y se usan exclusivamente para recopilar datos técnicos sobre el uso del sitio. No recopilamos información personal a través de estas cookies.</p>

    <Spacer className="spacer-s" />

    <h2>Interacción con Redes Sociales</h2>
    <p>Nuestro sitio incluye enlaces a nuestras propias redes sociales como <strong>Instagram</strong>. Estos enlaces pueden permitirte interactuar con perfiles directamente desde nuestro sitio web. Sin embargo, no compartimos tu información con estas plataformas ni permitimos que recopilen tus datos directamente a través de nuestro sitio.</p>

    <Spacer className="spacer-s" />

    <h2>Medidas de Seguridad</h2>
    <p>No recopilamos información personal de nuestros usuarios, por lo tanto, las medidas de seguridad están orientadas a proteger la integridad del sitio y asegurar que las interacciones a través de las herramientas de terceros como <strong>Google Search Console</strong> y <strong>Vercel Analytics</strong> se realicen de manera segura.</p>

    <Spacer className="spacer-s" />

    <h2>Derechos de los Usuarios</h2>
    <p>Dado que no recopilamos información personal, no hay datos que puedan ser visualizados, modificados o eliminados por los usuarios. Si deseas gestionar o eliminar las cookies, puedes hacerlo a través de las configuraciones de tu navegador.</p>

    <Spacer className="spacer-s" />

    <h2>Cambios en la Política de Privacidad</h2>
    <p>Cualquier cambio en nuestra Política de Privacidad será comunicado a través de nuestro sitio web. Te recomendamos visitar esta página periódicamente para estar informado sobre cualquier actualización.</p>

    </div>


    </div>
    </Inner>
    );
  }
  