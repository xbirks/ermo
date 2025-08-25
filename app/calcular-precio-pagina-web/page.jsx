"use client";

import "./landing-calculadora.scss";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import "../servicios/landing.scss";
import StandardButton from "../buttons/standard-button";
import CalculadoraWeb from "@/app/components/calculadora/calculadora";
import ContactFormLanding from "@/app/components/formularios/ContactFormLanding";
import CasosExito from "../components/casos-exito-web";



export default function WebPage({municipio = "Valencia"}) {


    
   return (
    <main className="landing-calculadora master__body">


      <section className="intro-landing__master">
        <h1><span className="landing__destacado">Calcula el precio de tu página web</span> gratis y sin dar tus datos</h1>

         <p className="landing-calculadora__explica">¿Necesitas saber cuánto cuesta una página web para tu negocio? <br></br>En ERMO te damos esta herramienta <strong>100% gratuita y transparente</strong>: sin correos, sin teléfonos, sin registros. Calcula, compara y, si encaja contigo, contáctanos por WhatsApp, correo o teléfono.</p>

    
      </section>






<section className="grid__master calculadora">

  <CalculadoraWeb ></CalculadoraWeb>
</section>



<CasosExito></CasosExito>





<section className="grid__master factores">

  <h2 id="contacto">Factores que influyen en el precio de una página web</h2>

  <div className="contacto__info">
    <div className="contacto__info-text">

    <p className="contacto__info-description" >El <strong>precio de una página web</strong> varía según la complejidad del proyecto y las horas de trabajo que requiere. En esta sección encontrarás los factores clave que influyen en el presupuesto final. <br></br><br></br>Si quieres verlo de forma práctica, con un solo clic en el botón podrás consultar <strong>ejemplos reales de presupuestos.</strong></p>


    <StandardButton
            link="https://wa.me/message/HJYSEK4RPLOSI1"
            title="Ver presupuestos"
            style="mt-xs "
            bg="#3F52FF"
            color="white"
            borderColor="transparent"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="transparent"
           />


    </div>

    <div className="contacto__info-image">
          <video
            className="exito__bg"
            src="/videos/landing_web/garta_01.mp4"
            poster="/assets/test_vid_poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Gartalia"
          />
    </div>


  </div>



  <div className="grid">
  <div className="grid__element">
    <Image src="/assets/gl01.png" width={70} height={47} className="grid__element-img" />
    <h3>Tipo de web</h3>
    <p>
      <strong>El tipo de proyecto es la base del presupuesto</strong>. No es lo mismo una página corporativa sencilla para presentar servicios que un ecommerce (tipo Shopify) con cientos de productos o un sistema de reservas. <strong>Aquí defines el punto de partida</strong>: una web para mostrar tu negocio, un portfolio personal, un restaurante que necesita carta online, una agencia con varias secciones o un proyecto a medida. Cada elección marca la complejidad técnica y el tiempo de desarrollo.
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl02.png" width={70} height={47} className="grid__element-img" />
    <h3>Tamaño del sitio</h3>
    <p>
      El tamaño hace referencia al número aproximado de páginas internas. Una web pequeña puede resolverse con una home y 2–3 apartados, mientras que un sitio mediano ya incluye secciones como servicios, blog, contacto, etc. Un proyecto grande puede superar las diez páginas e incorporar catálogos, listados o secciones avanzadas. <strong>Cuantas más páginas, más diseño, más contenido que preparar y más programación</strong>, por lo que el coste aumenta de forma proporcional.
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl03.png" width={70} height={47} className="grid__element-img" />
    <h3>Complejidad del diseño</h3>
    <p>
      La complejidad define hasta dónde quieres llevar la personalización. <strong>Un diseño básico prioriza lo funcional</strong>: limpio, directo y efectivo. <strong>Un nivel intermedio incluye más cuidado estético</strong>, adaptaciones visuales y algunos efectos interactivos. <strong>Y en un nivel avanzado</strong> entran en juego animaciones, microinteracciones, transiciones fluidas y <strong>un acabado más exclusivo</strong>. No es solo cuestión de estética: un diseño más complejo exige más horas de desarrollo y pruebas.
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl04.png" width={70} height={47} className="grid__element-img" />
    <h3>Contenidos y recursos</h3>
    <p>
      <strong>El contenido es lo que da vida a la web</strong>. Puedes aportar tus textos e imágenes o delegar en nosotros parte del trabajo. La redacción profesional transmite mejor tu mensaje y conecta con el cliente. Las traducciones abren la puerta a mercados internacionales o de diversidad lingüística de un territorio. Un banco de imágenes o ilustraciones aporta frescura, y la fotografía propia eleva la confianza mostrando tu negocio real. <strong>Cada recurso extra implica inversión, pero también aumenta el impacto de tu página.</strong>
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl05.png" width={70} height={47} className="grid__element-img" />
    <h3>Accesibilidad y calidad</h3>
    <p>
      Una web accesible no solo cumple la normativa, también <strong>asegura que cualquier persona pueda usarla sin barreras</strong>: navegación con teclado, contraste de colores correcto, textos alternativos en imágenes, compatibilidad con lectores de pantalla. La opción básica ya incluye buenas prácticas, pero <strong>si seleccionas el objetivo AA garantizas un nivel más alto de calidad</strong>, especialmente importante en proyectos públicos o con vocación de llegar a un público amplio y diverso.
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl06.png" width={70} height={47} className="grid__element-img" />
    <h3>SEO y visibilidad</h3>
    <p>
      <strong>El SEO es clave para que tu web no se quede invisible</strong>. De base se incluyen buenas prácticas: estructura limpia, títulos optimizados y carga rápida. Con la opción de SEO técnico avanzado se optimizan aspectos más profundos como metaetiquetas, tiempos de respuesta o indexación. Y con la optimización de contenidos se trabajan los textos para que respondan a búsquedas reales de tus clientes. Cada nivel refuerza tu visibilidad y multiplica la probabilidad de recibir visitas de calidad.
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl07.png" width={70} height={47} className="grid__element-img" />
    <h3>Mantenimiento y operativa</h3>
    <p>
      Un proyecto web no termina cuando se publica. Requiere actualizaciones de seguridad, corrección de posibles errores y <strong>soporte ante imprevistos</strong>. El mantenimiento anual garantiza que todo siga funcionando sin sobresaltos. La bolsa de horas (10h) es útil si prefieres ajustes puntuales. Los servicios externos cubren integraciones o tareas que puedan surgir fuera del alcance inicial. <strong>También puedes marcar la opción de entrega urgente si necesitas la web lista en un plazo mucho más corto.</strong>
    </p>
  </div>
</div>


</section>











<section className="grid__master presupuesto">

  <h2 id="contacto">Presupuestos de ejemplo</h2>

  <div className="presupuesto__grid">

    
        <div className="presupuesto__element">
      <div className="presupuesto__element-image"><Image src="/assets/belles_pres.jpg" height="1000" width="1000" load="lazy"></Image></div>
      <h3>Gimnasio Bellés (Segorbe y Alfara)</h3>
      <p>Jesús tiene el mejor gimnasio de Segorbe, pero le faltaba mejorar su presencia digital. Le hicimos una web moderna, animada, rápida e intuitiva. Y también para el nuevo gimnasio que estaba montando al lado del CEU de Godella.
      <br></br><br></br>
      <span className="presupuesto__element-detalles">Tamaño del sitio pequeño, diseño básico, fotografía, iconografía, SEO básico y gestión de compra de hosting y dominio.</span>
      <br></br><br></br>
      <span className="presupuesto__element-total">TOTAL:</span> <span className="presupuesto__element-precio">710€</span></p>
    </div>


    <div className="presupuesto__element">
      <div className="presupuesto__element-image"><Image src="/assets/ep_pres.jpg" height="1000" width="1000" load="lazy"></Image></div>
      <h3>Entre Prendas</h3>
      <p>Nora, modista y costurera, nos pidió una web para que la encontrarar en las primeras posiciones de Google. Y también que tuviera los precios reales de sus servicios para usarlo como gancho de venta.
      <br></br><br></br>
      <span className="presupuesto__element-detalles">Tamaño del sitio pequeño, diseño básico y redacción de textos, fotografía, SEO avanzado y mantenimiento anual.</span>
      <br></br><br></br>
      <span className="presupuesto__element-total">TOTAL:</span> <span className="presupuesto__element-precio">1785€</span></p>
    </div>

        <div className="presupuesto__element">
      <div className="presupuesto__element-image"><Image src="/assets/place_pres.jpg" height="1000" width="1000" load="lazy"></Image></div>
      <h3>The Place Valencia</h3>
      <p>Esta gestora de inmuebles nos pidió una web sencilla (tipo landing page) para explicar a sus clientes su metodología de trabajo y para mostrar los inmuebles que tenían disponibles para alquiler.
      <br></br><br></br>
      <span className="presupuesto__element-detalles">Tamaño del sitio pequeño, diseño básico, SEO básico y redacción de textos e imagenes.</span>
      <br></br><br></br>
      <span className="presupuesto__element-total">TOTAL:</span> <span className="presupuesto__element-precio">950€</span></p>
    </div>

  </div>

 
 
</section>










<section className="grid__master contacto">

  <h2 id="contacto">Ponte en contacto y hagamos tu web juntos</h2>

  <div className="contacto__info">
    <div className="contacto__info-text">

    <p className="contacto__info-description" >Déjanos tus datos o habla con nosotros por <strong>WhatsApp</strong> o teléfono. En menos de 48 h te propondremos la reunión para conocer tu proyecto.</p>


    <StandardButton
            link="https://wa.me/message/HJYSEK4RPLOSI1"
            title="Whatsapp"
            style="mt-xs "
            bg="#3F52FF"
            color="white"
            borderColor="transparent"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="transparent"
           />

           <StandardButton
            link="tel:675392216"
            title="Llamar"
            style="mt-xs "
            bg="transparent"
            color="#3F52FF"
            borderColor="#3F52FF"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#3F52FF"
           />


    <p className="contacto__info-form-text">O también puedes dejar aquí tus datos y nosotros nos ponemos en contacto:</p>

    <ContactFormLanding></ContactFormLanding>

    </div>

    <div className="contacto__info-image">
      <img src="/assets/oficina_1.jpg" width="1774" height="1280" alt="Oficina y escritorio de Andrés Ortega Montoya" className="contacto__info-img" loading="lazy" />
    </div>


  </div>

 



</section>















    </main>
  );
} 