"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import "../landing.scss";
import StandardButton from "../../buttons/standard-button";
import ProcesoSection from "../../components/selector-procesos";
import CalculadoraWeb from "@/app/components/calculadora/calculadora";
import IntroVideo from "@/app/components/IntroVideo";
import ContactFormLanding from "@/app/components/formularios/ContactFormLanding";



export default function WebPage({municipio = "Valencia"}) {

const [playIntro, setPlayIntro] = useState(false);

    
   return (
    <main className="landing-jardineria master__body">


      <section className="intro-landing__master">
        <h1><span className="landing__destacado">Hacemos webs</span> para PYMES y emprendedores en {municipio}</h1>

        
        <div className="intro-landing__content">
          <div className="intro-landing__text">



      <div className="intro-landing-mobile__img"><IntroVideo /></div>



            <p className="intro-landing__big">¿Quieres <strong>hacer tu web en {municipio}</strong> con resultados reales? En este vídeo te cuento nuestro método y casos.</p>

            <p className="intro-landing__texto-op">Diseñamos páginas web rápidas y optimizadas, diseño UI/UX y SEO para emprendedores.</p>

             

            <StandardButton
            link="#calculadora"
            title="Calculadora precios"
            style="mt-m margin-auto"
            bg="#3F52FF"
            color="white"
            borderColor="transparent"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor=""
            aria-label="Abrir calculadora de precios para estimar tu web"
            />

            <StandardButton
            link="#contacto"
            title="Contacto"
            style="mt-xs margin-auto"
            bg="white"
            color="#3F52FF"
            borderColor="#3F52FF"
            hoverBg="#3F52FF"
            hoverColor="white"
            />




            <div className="intro-landing__line"></div>

            <div className="intro-landing__valora">
                <p><strong>Valoración excelente 5/5</strong> por nuestros clientes en <a href="https://www.google.com/maps/place/ERMO+%7C+Estudio+de+diseño+y+programación+web/@39.4953188,-0.468962,17z/data=!3m1!4b1!4m6!3m5!1s0xa037438d44ecf51d:0x2bb2886e9e8b3b1c!8m2!3d39.4953188!4d-0.4663871!16s%2Fg%2F11tdq_0qcf?entry=ttu" target="_blank" rel="noopener noreferrer">Google Reviews</a> y otros reseñadores:</p>
                <Image src="/assets/stars.png" width={90} height={18} alt="Valoración 5/5 en Google Reviews" />
            </div>


          </div>



          
          <div className="intro-landing__img"><IntroVideo /></div>

        </div>
      </section>




      <section className="grid__master">
  <h2>Casos de <span className="jardin__destacado">éxito</span></h2>


    <div className="exito__master-new">

      {/* ITEM 1 */}
      <div className="exito__item">
        <div className="exito">
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
          <div className="exito__info">

            
            <div className="exito__labels">
              <div className="exito__labels-icon">web</div>
              <div className="exito__labels-icon">branding</div>
              <div className="exito__labels-icon">seo</div>
            </div>


            <div className="exito__footer">
              <img
                src="/assets/gartalia_logo.svg"
                alt="Logo Gartalia"
                className="exito__logo"
                width="180"
                height="90"
              />
              <StandardButton
                link="https://www.gartalia.com"
                title="Ver web"
                style=""
                bg="white"
                color="#3F52FF"
                borderColor="transparent"
                hoverBg="#0E1C9D"
                hoverColor="white"
                hoverBorderColor=""
              />
            </div>
          </div>
        </div>

        {/* Texto debajo de la tarjeta */}
        <p className="exito__review">
          Gartalia pasó de no tener presencia online a estar
          <strong> posicionada como una de las mejores empresas de jardinería de {municipio}. </strong>
          Gracias a una web bien optimizada y una estrategia SEO efectiva.
        </p>
      </div>

      {/* ITEM 2 */}
      <div className="exito__item">
        <div className="exito">
          <video
            className="exito__bg"
            src="/videos/landing_web/AR_vid.mp4"
            poster="/assets/test_vid_poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Gartalia"
          />
          <div className="exito__info">

            <div className="exito__labels">
              <div className="exito__labels-icon">web</div>
              <div className="exito__labels-icon">branding</div>
            </div>
            
            <div className="exito__footer">
              <img
                src="/assets/AR_black.svg"
                alt="Logo Gartalia"
                className="exito__logo"
                width="180"
                height="90"
              />
              <StandardButton
                link="https://www.ariannyrivasagency.com"
                title="Ver web"
                style=""
                bg="white"
                color="#3F52FF"
                borderColor="transparent"
                hoverBg="#3F52FF"
                hoverColor="white"
              />
            </div>
          </div>
        </div>

        {/* Texto debajo de la tarjeta */}
        <p className="exito__review">
          Arianny Rivas necesitaba un portfolio para sus modelos que se sintiera <strong>Premium</strong>, que fuera rápida y que mostrara las fotos y videos de sus modelos a la calidad más alta. Utilizamos <strong>animación entre páginas</strong> para que la usabilidad se sintiera como una APP.
        </p>
      </div>

      {/* CTA inferior (ocupa el ancho del grid) */}
      <div className="exito__cta">
        <StandardButton
          link="#"
          title="Ver más casos de éxito"
          style="mt-xs"
          bg="#3F52FF"
          color="white"
          borderColor="#3F52FF"
          hoverBg="#0E1C9D"
          hoverColor="white"
          hoverBorderColor="#0E1C9D"
        />
      </div>

    </div>

</section>



      <section className="grid__master">
        <h2>Webs en {municipio} rápidas y optimizadas</h2>

        <div className="grid">
          <div className="grid__element" id="servicio">
            <Image src="/assets/gl01.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Más visibilidad y más clientes</h4>
            <p>Optimizamos tu web para que aparezcas en las primeras posiciones de Google y te encuentren cuando busquen tus servicios. Más llamadas, más correos y más negocio.</p>
          </div>
          <div className="grid__element">
            <Image src="/assets/gl02.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Diseño a medida 100%. Ni plantillas. Ni WordPress.</h4>
            <p>No usamos plantillas. Creamos un diseño exclusivo adaptado a tu marca que mejora la experiencia del usuario y aumenta las conversiones. Por supuesto, nada de temas de WordPress lentos y pesados.</p>
          </div>
          <div className="grid__element">
            <Image src="/assets/gl03.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Velocidad y rendimiento sin fallos</h4>
            <p>Desarrollamos sitios que cargan en segundos y funcionan siempre, incluso con mala conexión. Una web rápida retiene a tus visitantes y mejora tu posicionamiento.</p>
          </div>
          <div className="grid__element-grey">
            <p>Menos lío.</p>
            <p>Más llamadas.</p>
          </div>
          <div className="grid__element grid__element-delete">
            <Image src="/assets/gl04.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Experiencia móvil perfecta</h4>
            <p>Tu web se verá impecable en móviles, tablets y ordenadores. Nos aseguramos de que cada visitante disfrute de una navegación fluida, esté donde esté.</p>
          </div>
          <div className="grid__element grid__element-delete">
            <Image src="/assets/gl05.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Calculadora de precios gratuita</h4>
            <p>Queremos ser transparentes con nuestros clientes. Para que tengas claridad desde el inicio, usa nuestra calculadora y obtén una estimación antes de ponerte en contacto.</p>
          </div>

        </div>

        <div className="button_2">
           <StandardButton
            link="#calculadora"
            title="Precios"
            style="mt-xs "
            bg="#3F52FF"
            color="white"
            borderColor="#3F52FF"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#0E1C9D"
            aria-label="Abrir calculadora de precios para estimar tu web"
           />

           <StandardButton
            link="FALTA"
            title="conocer equipo"
            style="mt-xs "
            bg="transparent"
            color="#3F52FF"
            borderColor="#3F52FF"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#3F52FF"
           />
        </div>

   
      </section>






<section className="grid__master">
        <h2>Nuestro proceso de trabajo funciona así:</h2>

    <ProcesoSection></ProcesoSection>

</section>



<section className="grid__master calculadora">

  <h2>Calculadora de precios</h2>

  <p className="calc__description" >Aquí sabrás desde el primer momento <strong>cuánto puede costar tu web</strong>. Sin precios ocultos, sin sorpresas.
  <br></br><br></br>
Trabajo con código a medida, <strong id="calculadora">sin plantillas ni WordPress pesados</strong>, para que tengas una web rápida y adaptada a ti. 
Usa la calculadora, revisa el resultado y, si encaja con tu presupuesto, mándamelo para prepararte una propuesta final con precio y plazos cerrados.</p>


  <CalculadoraWeb ></CalculadoraWeb>
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
      <img src="/assets/escri.jpg" width="720" height="1280" alt="Andrés Ortega" className="contacto__info-img" loading="lazy" />
    </div>


  </div>

 



</section>















    </main>
  );
} 