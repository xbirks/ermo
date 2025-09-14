"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import "../../../landing.scss";
import "../articulos.scss"
import "@/app/calcular-precio-pagina-web/landing-calculadora.scss"
import StandardButton from "../../../../buttons/standard-button";
import IntroVideo from "@/app/components/IntroVideo";
import ContactFormLanding from "@/app/components/formularios/ContactFormLanding";



export default function WebPage() {

const [playIntro, setPlayIntro] = useState(false);




const faqs = [
  {
    id: "faq1",
    q: "¿Cuál es el precio medio de una página web en España?",
    a: "Mira, depende muchísimo. Hay gente que te cobra 100 €, pero eso es literalmente una plantilla de WordPress mal montada. Si quieres algo bien hecho, profesional, y que represente de verdad a tu negocio, estás hablando de entre 500 y 1 500 € como base, dependiendo del tipo de web y lo que necesites. Si es una tienda online o un sistema de reservas, eso sube más, claro.",
  },
  {
    id: "faq2",
    q: "¿Qué incluye el coste de una web?",
    a: "En mi caso, lo que cobro incluye todo el desarrollo técnico, el diseño visual personalizado, integración básica con SEO, velocidad optimizada y una estructura bien pensada para tu negocio. Ahora, hay cosas que pueden subir el precio: redacción de textos, fotografía profesional, traducciones, mantenimiento... eso lo ajustamos según tu proyecto.",
  },
  {
    id: "faq3",
    q: "¿Cuánto cuesta una web para un restaurante / tienda online / hotel?",
    a: "Yo tengo precios base claros y públicos. Por ejemplo: Restaurante: desde 400 € Tienda online: desde 800 € Web con reservas (tipo hotel o estudio): desde 950 €. Todo esto lo puedes ver tú mismo en mi calculadora online gratuita, que te da un precio estimado según lo que necesitas. Así de claro.",
  },
  {
    id: "faq4",
    q: "¿Qué factores influyen en el precio final?",
    a: "Te lo digo sin rodeos: el número de páginas, la cantidad y calidad del contenido, si necesitas varios idiomas, si tienes textos listos o hay que escribirlos, si hay que buscar imágenes, si quieres un diseño visual personalizado o uno genérico... Todo eso suma o resta.",
  },
  {
    id: "faq5",
    q: "¿Es mejor contratar una agencia o un freelance?",
    a: "Depende de lo que busques. Una agencia te puede cobrar más (2 000 €, 3 000 €, 5 000 €...) y normalmente va todo más lento. Yo como freelance te doy un trato más directo, más rápido, y el mismo o mejor resultado si hablamos de diseño y desarrollo. Yo soy quien hace tu web de principio a fin, sin intermediarios.",
  },
  {
    id: "faq6",
    q: "¿Qué diferencia hay entre WordPress y una web a medida?",
    a: "Un mundo. Una web con WordPress muchas veces es una plantilla mal tuneada, hecha por alguien que aprendió a instalar tres plugins. Lo que yo hago es desarrollo de verdad, con React o Next.js, que son tecnologías actuales, rápidas y mucho más seguras. Tu web no va a parecer igual a otras 500. Es tuya, única, bien hecha y optimizada.",
  },
  {
    id: "faq7",
    q: "¿Cuánto cuesta mantener una página web al mes?",
    a: "Pues mira, depende de si tú te encargas o si lo dejas en mis manos. Puedes tener solo hosting y dominio (unos 50–100 € al año), o puedes contratarme un plan de mantenimiento mensual, donde yo me encargo de actualizaciones, seguridad, copias de seguridad y todo eso. Y ahí hablamos de 80-120 € al mes según lo que necesites.",
  },
  {
    id: "faq8",
    q: "¿Cuánto se tarda en hacer una web?",
    a: "Si el cliente tiene claro lo que quiere y me da el contenido rápido, en 2 a 4 semanas puede estar lista. Si hay que esperar textos, fotos, o revisar muchas cosas, se puede alargar. Yo soy rápido, pero necesito que tú también pongas de tu parte.",
  },
  {
    id: "faq9",
    q: "¿Puedo hacer una web barata pero profesional?",
    a: "Puedes, pero no esperes milagros por 200 €. Una web profesional mínima, con todo bien hecho, cuesta mínimo 450–500 €, y eso ya es un precio muy contenido. Lo barato al final sale caro, créeme, he rehecho muchas webs que venían de ese tipo de trabajos.",
  },
  {
    id: "faq10",
    q: "¿Cuánto cuesta el SEO o la redacción web?",
    a: "No está incluido en el precio base, pero se puede añadir. Si necesitas textos bien escritos, pensados para posicionar, eso se tiene que presupuestar aparte. Yo colaboro con redactores que saben de esto, y te puedo dar opciones. Pero te lo digo claro: si el contenido es flojo, tu web no va a rendir bien por muy bonita que sea.",
  },
];


   const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };



    
   return (
    <main className="landing-jardineria master__body">


      <section className="intro-landing__master">
        <h1><span className="landing__destacado">¿Cuánto cuesta hacer una página web conmigo? </span>(Y cómo evitar tirar tu dinero)</h1>

        
        <div className="intro-landing__content">
          <div className="intro-landing__text">



      <div className="intro-landing-mobile__img"><IntroVideo /></div>


            <p className="intro-landing__texto-op">Muchos artículos te van a hablar de rangos genéricos: que si una web cuesta <strong>entre 100 € y 10 000 €</strong>, que si depende de mil cosas. Y sí, depende. Pero yo quiero ser claro contigo: aquí te cuento cuánto cuesta hacer una web <strong>conmigo</strong>, qué factores influyen en el precio, y por qué lo barato puede salir caro. Además, te dejo una <strong>calculadora online gratuita</strong> para que tú mismo veas cuánto te costaría tu web ideal.</p>

             

            <StandardButton
            link="https://www.ermo.es/calcular-precio-pagina-web"
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



          
          <IntroVideo
            posterSrc="/assets/miniwebdark.jpg"
            posterAlt="Portada del vídeo introductorio"
            videoSrc="https://www.youtube-nocookie.com/embed/X3PaBPro7EA?autoplay=1&mute=0"
            videoTitle="Presentación ERMO"
          />


        </div>
      </section>







      <section className="grid__master">
        <h2>Precios base según el tipo de web</h2>

        <p>Cuando alguien me pide presupuesto, lo primero que hago es <strong>partir de precios base según el tipo de proyecto</strong>. A partir de ahí, se ajusta según lo que necesites (contenido, idiomas, diseño, funcionalidades extra…). No es lo mismo una web de restaurante sencilla que una tienda online con 200 productos o una plataforma con reservas, ¿verdad?. Por eso me gusta ser claro desde el inicio: <strong>partimos de una base y, juntos, afinamos el presupuesto</strong> para que encaje de verdad con lo que buscas y no te lleves sorpresas.</p>

        <div className="grid">
          <div className="grid__element" id="servicio">
            <Image src="/assets/gla.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Web corporativa</h4>
            <p>desde 500 €</p>
          </div>
          <div className="grid__element">
            <Image src="/assets/glb.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Carta online para restaurante o bar + QR</h4>
            <p>desde 400 €</p>
          </div>
            <div className="grid__element grid__element-delete">
            <Image src="/assets/glc.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>E-commerce o tienda online</h4>
            <p>desde 800 €</p>
          </div>
          <div className="grid__element">
            <Image src="/assets/gld.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Portfolio personal/profesional</h4>
            <p>desde 450 €</p>
          </div>
          <div className="grid__element">
            <Image src="/assets/gle.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Carta online para restaurante o bar + QR</h4>
            <p>desde 400 €</p>
          </div>
          <div className="grid__element grid__element-delete">
            <Image src="/assets/glf.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Agencia o estudio creativo</h4>
            <p>desde 600 €</p>
          </div>
          <div className="grid__element grid__element-delete">
            <Image src="/assets/glf.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Web con reservas (hotel, estudio de fotografía…)</h4>
            <p>desde 950 €</p>
          </div>
          <div className="grid__element grid__element-delete">
            <Image src="/assets/glg.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Landing page</h4>
            <p>desde 450 €</p>
          </div>
          <div className="grid__element grid__element-delete">
            <Image src="/assets/glh.png" width={70} height={47} className="grid__element-img"></Image>
            <h4>Otros tipos de webs</h4>
            <p>desde 700 € (según necesidades específicas)</p>
          </div>

        </div>

        <div className="button_2">
           <StandardButton
            link="https://www.ermo.es/servicios/web"
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

        </div>

   
      </section>






<section className="grid__master factores">

  <h2>¿Qué hace que una web cueste más o menos?</h2>

  <div className="contacto__info">
    <div className="contacto__info-text">

    <p className="contacto__info-description" >La diferencia de precio entre una web de 400 € y otra de 2 000 € <strong>no es aleatoria</strong>. Hay factores que influyen muchísimo en el presupuesto final: <br></br><br></br>desde el tiempo y la dedicación que se invierten en el diseño hasta la calidad del desarrollo y la personalización real que se le da al proyecto. Al final, <strong>lo barato puede salir caro,</strong> y lo caro suele reflejar el valor y el cuidado puestos en cada detalle.</p>


    <StandardButton
            link="https://www.ermo.es/calcular-precio-pagina-web"
            title="Usar calculadora gratis"
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
            src="/videos/landing_web/AR_vid.mp4"
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



  <div className="grid__couple">
  

  <div className="grid__element">
    <Image src="/assets/gl15.png" width={70} height={47} className="grid__element-img" />
    <h3>El tipo de contenido</h3>
    <ul>
      <li><strong>Solo texto →</strong> más económico, aunque necesitas un buen redactor SEO.</li>
      <li><strong>Fotos profesionales →</strong> inversión en fotografía o stock premium.</li>
      <li><strong>Vídeo →</strong> producción más compleja y cara.</li>
    </ul>
    <p>
      El contenido es clave, y marca la diferencia entre una web “normalita” y una web que vende.
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl13.png" width={70} height={47} className="grid__element-img" />
    <h3>Traducciones y versiones multilingües</h3>
    <p>
      Si quieres la web en catalán, valenciano, gallego, euskera o inglés, ten en cuenta que no basta con traducir los textos: hay que duplicar menús, páginas, descripciones de fotos, SEO, etc. Puedes tirar de traductor automático, pero lo profesional es hacerlo con un traductor humano.
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl14.png" width={70} height={47} className="grid__element-img" />
    <h3>Diseño a medida vs. plantilla</h3>
    <p>
      Aquí no me corto: el diseño es lo más importante. Es como cómo te vistes: habla de quién eres, de tu personalidad, de tu negocio. Una web con un diseño cutre transmite desconfianza. Una web con un diseño pensado para ti transmite profesionalidad, orden, confianza. Eso es lo que yo hago.
    </p>
  </div>

  <div className="grid__element">
    <Image src="/assets/gl11.png" width={70} height={47} className="grid__element-img" />
    <h3>Mantenimiento y evolución de la web</h3>
    <p>
      Mucha gente piensa: “Pago una vez y ya está.” Error. Una web es como un coche: necesita revisiones, gasolina y actualizaciones. Lo caro no es solo hacer la web, lo caro es no mantenerla y que al año esté rota, lenta o hackeada.
    </p>
  </div>
  <div className="grid__element">
    <Image src="/assets/gl10.png" width={70} height={47} className="grid__element-img" />
    <h3>El número de páginas</h3>
    <p>
      No es lo mismo una web pequeña (1–5 páginas) que una mediana (5–10) o una grande (+10). Más páginas = más contenido, más diseño, más desarrollo.
    </p>
  </div>

</div>


</section>










<section className="grid__master factores">

  <h2>¿Por qué el diseño no es un extra sino lo más importante?</h2>

  <div className="contacto__info">
    <div className="contacto__info-text">

    <p className="contacto__info-description" ><strong>El diseño no es solo “que sea bonita”.</strong> Es experiencia de usuario, es confianza, es estética y es funcionalidad.<br></br><br></br>
Una web con un diseño trabajado consigue que la gente navegue cómoda, que se quede más tiempo y que confíe en ti.
<br></br><br></br>
Y no, no es lo mismo descargarte una plantilla de WordPress que tener un diseño hecho a medida. La diferencia es abismal. <strong>Y aunque tu no lo creas, se nota.</strong> ¿O tu no eres capaz de diferenciar una web que se nota cara a una que se nota barata? O te lo pongo más fácil, ¿no has notado que algunas webs son más fáciles de usar que otras? <strong>Todo esto es por tener un buen diseño.</strong></p>


    <StandardButton
            link="https://www.ermo.es/servicios/web"
            title="Ver casos de éxito"
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
          <img
            className="exito__bg"
            src="/assets/belles_pres.jpg"
            aria-label="Gartalia"
          />
    </div>

  </div>

</section>










<section className="grid__master factores">

  <h2>WordPress vs Web hecha a medida: lo que no te cuentan</h2>

  <div className="contacto__info">
    <div className="contacto__info-text">

    <p className="contacto__info-description" >Voy a ser sincero: el 80% de las webs baratas que veo están hechas con WordPress + Elementor + 3 plugins básicos. <strong>Eso no es hacer una web.</strong> Eso es poner parches.
<br></br><br></br>
¿El problema? Que al final todas esas webs <strong>se parecen, son lentas, inseguras y nada optimizadas para SEO.</strong>
<br></br><br></br>
Yo trabajo con React y Next.js, tecnologías modernas que hacen que tu web sea rápida, segura, personalizada y única. Es un salto de calidad brutal frente a las plantillas de siempre. Es el camino laborioso y necesita más dedicación. Pero <strong>los resultados están a años luz</strong>, sobre todo a nivel de personalización, de cualquier plantilla gratuita de Wordpress.</p>


    <StandardButton
            link="https://www.ermo.es/servicios/web"
            title="Hacer web"
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
            src="/assets/code_1.mp4"
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

</section>









<section className="grid__master factores">

  <h2>Calculadora de precios online</h2>

  <div className="contacto__info">

    <p className="contacto__info-description" >No tienes que adivinar cuánto costaría tu proyecto. <strong>He creado una calculadora de precios gratuita</strong> donde puedes marcar lo que quieres (tipo de web, número de páginas, idiomas, mantenimiento, etc.) y te da un precio orientativo en segundos. Así no dependes de promesas ni presupuestos escondidos: ves al momento qué rango de inversión necesitas y decides si te encaja. <strong>Transparente, directo y sin pedirte ni un dato personal.</strong></p>



  </div>

  
    <StandardButton
            link="https://www.ermo.es/calcular-precio-pagina-web"
            title="Calculadora gratuita"
            style="mt-xs "
            bg="#3F52FF"
            color="white"
            borderColor="transparent"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="transparent"
           />


</section>










<section className="grid__master faq">
      <h2 className="faq__title">Preguntas frecuentes</h2>

      {/* Acordeón sin JS: inputs tipo radio con mismo name */}
      <div className="faq__list">
        {faqs.map((item, idx) => (
          <div className="faq__item" key={item.id}>
            <input
              type="radio"
              name="faq"
              id={item.id}
              className="faq__toggle"
              // Ninguno marcado por defecto → todos cerrados al cargar
            />
            <label className="faq__question" htmlFor={item.id}>
              {item.q}
              <span className="faq__icon" aria-hidden="true" />
            </label>
            <div className="faq__answer">
              <p>{item.a}</p>
            </div>
          </div>
        ))}

        {/* Opción “cerrar todos” accesible: un radio oculto que desmarca los demás */}
        <div className="faq__item faq__item--reset">
          <input type="radio" name="faq" id="faq-reset" className="faq__toggle" />
          <label htmlFor="faq-reset" className="faq__reset">Cerrar todas</label>
        </div>
      </div>

      <script
        type="application/ld+json"
        // JSON minificado para rendimiento
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
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
            onClick={(e)=>reportAdsConversionAndGo(e, waUrl)}
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
            onClick={(e)=>reportAdsConversionAndGo(e, telUrl)}
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