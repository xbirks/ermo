"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import "../landing.scss";
import StandardButton from "../../buttons/standard-button";
import ProcesoSection from "../../components/selector-procesos";
import CalculadoraWeb from "@/app/components/calculadora/calculadora";



export default function WebPage({municipio}) {


    
   return (
    <main className="landing-jardineria master__body">


      <section className="intro-landing__master">
        <h1>Hacemos <span className="landing__destacado">diseño y programación web en valencia</span> para pymes y emprendedores</h1>

        
        <div className="intro-landing__content">
          <div className="intro-landing__text">

            <div className="intro-landing-mobile__img"><Image src="/jardineria/movil_01_1.jpg" width={1024} height={1536} alt="Vista móvil de la web de jardinería" /></div>

            <p className="intro-landing__big">En este video te cuento todo sobre nuestro método de trabajo y los buenos resultados que hemos tenido con clientes:</p>

            <p className="intro-landing__texto-op">Diseñamos páginas web rápidas y optimizadas, diseño UI/UX y SEO para emprendedores.</p>

             

            <StandardButton
            link="#precio"
            title="Calculadora precios"
            style="mt-m margin-auto"
            bg="#3F52FF"
            color="white"
            borderColor="transparent"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor=""
            />

            <StandardButton
            link="#precio"
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
                <p><strong>Valoración excelente 5/5</strong> por nuestros clientes en <a href="https://share.google/sgxK7s6x94HnnciWA">Google Reviews</a> y otros reseñadores:</p>
                <Image src="/assets/stars.png" width={90} height={18} alt="Vista móvil de la web de jardinería" />
            </div>


          </div>




          <div className="intro-landing__img"><Image src="/jardineria/movil_01_1.jpg" width={1024} height={1536} alt="Vista móvil de la web de jardinería" /></div>

        </div>
      </section>




      <section className="grid__master">
  <h2>Casos de <span className="jardin__destacado">éxito</span></h2>

  {/* <div className="exito__tarjeta">
    <div className="exito__cliente">
      <div className="exito__cliente-img">
        <video src="/assets/test_vid.mp4" width="1024" height="1324"
    poster="/assets/test_vid_poster.jpg"
    autoPlay muted loop playsInline preload="metadata" aria-label="Gartalia"
  />
      </div>
      <div className="exito__cliente-content">
        <p className="review">Gartalia pasó de no tener presencia online a estar <strong>posicionada como una de las mejores empresas de jardinería de Valencia.</strong> Gracias a una web bien optimizada y una estrategia SEO efectiva. <br></br><br></br>
Adaptamos todo el contenido a lo que Carlos necesitaba y ajustamos el diseño para que reflejara su profesionalidad como jardinero.</p>
        <div className="exito__cliente-content-logo">
          <img className="cliente__logo" src="/assets/gartalia_logo.svg" width="400" height="200" alt="Logo Acme Arquitectura" />

            <StandardButton
            link="#precio"
            title="Ver web"
            style="mt-xs margin-auto"
            bg="#535353"
            color="white"
            borderColor="#535353"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#0E1C9D"
            />

        </div>
      </div>
    </div>
    <div className="exito__datos">
      <div className="exito__datos-element">
        <p className="data_A">19K €</p>
        <p className="data_B">de ingresos brutos solo con clientes de la web.</p>
      </div>
      <div className="exito__datos-element">
        <p className="data_C">354</p>
        <p className="data_B">nuevos clientes a través de la web.</p>
      </div>
      <div className="exito__datos-element">
        <p className="data_C">21</p>
        <p className="data_B">páginas posicionadas entre las 3 primeras búsquedas en Google.</p>
      </div>
    </div>
  </div> */}
{/* 
  <div className="exito__tarjeta">
    <div className="exito__cliente">
      <div className="exito__cliente-img">
        <img src="/placeholder/cliente-2.jpg" width="1024" height="1324" alt="Cliente Nova Dental" />
      </div>
      <div className="exito__cliente-content">
        <p className="review">“Texto de ejemplo: duplicamos las citas online en poco tiempo. La web es clara y convierte.”</p>
        <div className="exito__cliente-content-logo">
          <img className="cliente__logo" src="/placeholder/nova-logo.svg" width="400" height="200" alt="Logo Nova Dental" />
          <a className="exito__enlace" href="#">Nova Dental</a>
        </div>
      </div>
    </div>
    <div className="exito__datos">
      <div className="exito__datos-element">
        <p className="data_A">980 €</p>
        <p className="data_B">de ingresos brutos solo con clientes de la web.</p>
      </div>
      <div className="exito__datos-element">
        <p className="data_C">3 <span className="data_D">Meses</span></p>
        <p className="data_B">de trabajo con la web.</p>
      </div>
      <div className="exito__datos-element">
        <p className="data_C">12</p>
        <p className="data_B">clientes conseguidos</p>
      </div>
    </div>
  </div> */}



</section>





<section className="exito__master-new">
  <div className="exito">
      {/* Vídeo a pantalla completa dentro de la tarjeta */}
      <video
        className="exito__bg"
        src="/assets/jose.mp4"
        poster="/assets/test_vid_poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Gartalia"
      />

      {/* Capa de información (el blur se aplica aquí) */}
      <div className="exito__info">
        <p className="exito__review">
          Gartalia pasó de no tener presencia online a estar{" "}
          <strong>posicionada como una de las mejores empresas de jardinería de Valencia.</strong>{" "}
          Gracias a una web bien optimizada y una estrategia SEO efectiva.
        </p>

        <div className="exito__footer">
          <img
            src="/assets/gartalia_logo.svg"
            alt="Logo Gartalia"
            className="exito__logo"
            width="180"
            height="90"
          />

            <StandardButton
            link="#precio"
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




        <div className="exito">
      {/* Vídeo a pantalla completa dentro de la tarjeta */}
      <video
        className="exito__bg"
        src="/assets/juan.mp4"
        poster="/assets/test_vid_poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Gartalia"
      />

      {/* Capa de información (el blur se aplica aquí) */}
      <div className="exito__info">
        <p className="exito__review">
          Gartalia pasó de no tener presencia online a estar{" "}
          <strong>posicionada como una de las mejores empresas de jardinería de Valencia.</strong>
        </p>

        <div className="exito__footer">
          <img
            src="/assets/gartalia_logo.svg"
            alt="Logo Gartalia"
            className="exito__logo"
            width="180"
            height="90"
          />

            <StandardButton
            link="#precio"
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








            <StandardButton
            link="#precio"
            title="Ver más casos de éxito"
            style="mt-xs"
            bg="#3F52FF"
            color="white"
            borderColor="#3F52FF"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#0E1C9D"
            />



    </section>

    






      <section className="grid__master">
        <h2>Beneficios de hacer una web con nosotros</h2>

        <div className="grid">
          <div className="grid__element" id="servicio">
            <Image src="/assets/gl01.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Más visibilidad y más clientes</h4>
            <p>Optimizamos tu web para que aparezcas en las primeras posiciones de Google y te encuentren cuando busquen tus servicios. Más llamadas, más correos y más negocio.</p>
          </div>
          <div className="grid__element">
            <Image src="/assets/gl02.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Diseño a medida 100%. Ni plantillas. Ni wordpress.</h4>
            <p>No usamos plantillas. Creamos un diseño exclusivo adaptado a tu marca que mejora la experiencia del usuario y aumenta las conversiones. Por supuesto, nada de temas de Wordpress lentos y pesados.</p>
          </div>
          <div className="grid__element">
            <Image src="/assets/gl03.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Velocidad y rendimiento sin fallos</h4>
            <p>Desarrollamos sitios que cargan en segundos y funcionan siempre, incluso con mala conexión. Una web rápida retiene a tus visitantes y mejora tu posicionamiento.</p>
          </div>
          <div className="grid__element-grey">
            <p>Menos lio.</p>
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
            link="#precio"
            title="Precios"
            style="mt-xs "
            bg="#3F52FF"
            color="white"
            borderColor="#3F52FF"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#0E1C9D"
           />

           <StandardButton
            link="#precio"
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

  <p className="calc__description">Aquí sabrás desde el primer momento <strong>cuánto puede costar tu web</strong>. Sin precios ocultos, sin sorpresas.
  <br></br><br></br>
Trabajo con código a medida, <strong>sin plantillas ni WordPress pesados</strong>, para que tengas una web rápida y adaptada a ti. 
Usa la calculadora, revisa el resultado y, si encaja con tu presupuesto, mándamelo para prepararte una propuesta final con precio y plazos cerrados.</p>


  <CalculadoraWeb></CalculadoraWeb>
</section>












    </main>
  );
} 