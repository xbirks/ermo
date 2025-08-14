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
          whileInView={{ opacity: 1, transform: "translateY(0%)" }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h1 className="servicios__h1">Política de cookies</h1>
        </motion.div>

        <div className="legal">

          <h2>1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu
            dispositivo cuando visitas un sitio web. Se utilizan para que el
            sitio funcione correctamente, recordar tus preferencias o analizar
            tu navegación con el fin de mejorar nuestros servicios.
          </p>

          <Spacer className="spacer-s" />

          <h2>2. Tipos de cookies que utilizamos</h2>
        
            <p>
              <strong>Cookies técnicas o necesarias</strong> <br></br> 
              Son imprescindibles para el funcionamiento básico del sitio y no
              requieren tu consentimiento (por ejemplo, para la navegación y el
              acceso seguro).
            </p>
            <p>
              <strong>Cookies analíticas</strong> (previo consentimiento)  <br></br>
              Utilizamos herramientas como <em>Google Analytics</em> y{" "}
              <em>Vercel Analytics</em> para obtener estadísticas de uso y
              mejorar la experiencia de usuario. Estas cookies pueden implicar
              transferencias internacionales de datos a EE.UU., amparadas en
              cláusulas contractuales tipo aprobadas por la Comisión Europea.
            </p>
          

          <Spacer className="spacer-s" />

          <h2>3. Base legal</h2>
          <p>
            La instalación de cookies técnicas se basa en nuestro interés
            legítimo en garantizar el correcto funcionamiento del sitio web.
            Las cookies analíticas solo se instalan si nos otorgas tu
            consentimiento expreso a través del banner de cookies.
          </p>

          <Spacer className="spacer-s" />

          <h2>4. Conservación</h2>
          <p>
            Las cookies se conservarán durante los plazos indicados en la tabla
            de configuración del banner de cookies o hasta que retires tu
            consentimiento.
          </p>

          <Spacer className="spacer-s" />

          <h2>5. Cómo aceptar, rechazar o revocar el consentimiento</h2>
          <p>
            Puedes aceptar o rechazar las cookies en cualquier momento mediante
            nuestro banner de configuración de cookies. También puedes
            configurar tu navegador para bloquearlas o eliminarlas.
          </p>

          <Spacer className="spacer-s" />

          <p>
            Para más información sobre cómo gestionar las cookies en tu
            navegador, consulta las instrucciones de tu navegador.
          </p>

        </div>
      </div>
    </Inner>
  );
}
