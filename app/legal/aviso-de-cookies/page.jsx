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
        <h1 className="servicios__h1">Política de cookies</h1>
    
    </motion.div>

    <div className="legal">

    <h2>Aviso de Cookies</h2>
    <p>En <strong>ERMO Estudio de diseño</strong> utilizamos cookies propias para asegurar que nuestro sitio web funcione correctamente y para mejorar tu experiencia de navegación. Estas cookies son técnicas y se limitan a recopilar datos técnicos necesarios para el funcionamiento del sitio.</p>

    <Spacer className="spacer-s" />

    <h2>¿Qué son las cookies?</h2>
    <p>Las cookies son pequeños archivos de texto que los sitios web pueden usar para hacer más eficiente la experiencia del usuario. Las cookies técnicas permiten funcionalidades básicas como la navegación de la página y el acceso a áreas seguras del sitio web.</p>

    <Spacer className="spacer-s" />

    <h2>Cookies que utilizamos:</h2>
    <p><strong>Google Search Console y Vercel Analytics</strong>: Estas herramientas colocan cookies que recogen información de cómo los visitantes interactúan con nuestro sitio web, ayudándonos a entender y mejorar la navegación y funcionalidad del sitio.</p>

    <Spacer className="spacer-s" />

    <h2>Gestión de cookies:</h2>
    <p>Puedes ajustar la configuración de tu navegador para bloquear o alertarte sobre estas cookies, pero algunas partes del sitio pueden dejar de funcionar. Te recomendamos permitir el uso de cookies para aprovechar plenamente todas las funcionalidades de nuestro sitio.</p>

    <Spacer className="spacer-s" />

    <p>Para más información sobre cómo gestionar y borrar cookies, visita la configuración de tu navegador.</p>

    </div>


    </div>
    </Inner>
    );
  }
  