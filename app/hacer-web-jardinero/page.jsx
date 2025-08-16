"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import StandardButton from "../buttons/standard-button";
import "./jardineria.scss";
import Script from "next/script";

export default function Jardineria() {
  const sliderRef = useRef(null);

  //Desplegar precios slider
  const [exp, setExp] = useState({ web: false, google: false, gpt: false });


  // Array de clientes con datos base
  const [clientes, setClientes] = useState([
    {
      id: 1,
      name: "Carlos Correa - Zona Valencia",
      link: "https://gartalia.com",
      img: "/jardineria/gartalia_img.jpg",
      logo: "/jardineria/gartalia_header_logo.svg",
      review: '“Me hizo la página y estoy muy contento. Antes casi no me llamaba nadie y ahora <strong>tengo trabajo todas las semanas</strong>. Salgo el primero en Google cuando buscan jardineros en mi pueblo. Me explicó todo muy claro aunque yo no entiendo mucho de ordenadores. <strong>Lo recomiendo mucho porque sabe lo que hace y es muy serio con su trabajo.</strong>”',
      amount: 60000,
      months: 6,
      clients: 37,
      startDate: new Date("2025-07-08"),
    },
    {
      id: 2,
      name: "Iván García Mayans - Zona La Safor",
      link: "https://gartalia.com",
      img: "/jardineria/javea_img.jpg",
      logo: "/jardineria/safor_logo.svg",
      review: '“Yo no entendía nada de páginas ni de esas cosas de internet, pero él me hizo todo. Ahora tengo <strong>muchos clientes nuevos</strong> que me llaman porque me ven en Google. La web quedó muy bien. Muy agradecido porque gracias a esto tengo <strong>más faena</strong> que antes.”',
      amount: 9100,
      months: 2,
      clients: 16,
      startDate: new Date("2025-07-08"),
    },
  ]);

  useEffect(() => {
    if (window.innerWidth <= 768 && sliderRef.current) {
      const children = sliderRef.current.children;
      if (children[1]) {
        sliderRef.current.scrollLeft = children[1].offsetLeft;
      }
    }
  }, []);

  // Calcula datos actualizados al cargar
  useEffect(() => {
    const now = new Date();
    const updated = clientes.map((c) => {
      const diffMs = now - c.startDate;
      const weeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
      const monthsPassed = Math.floor(diffMs / (30 * 24 * 60 * 60 * 1000));

      return {
        ...c,
        amount: c.amount + (weeks > 0 ? weeks * 3000 : 0),
        clients: c.clients + (weeks > 0 ? weeks * 3 : 0),
        months: c.months + (monthsPassed > 0 ? monthsPassed : 0),
      };
    });

    setClientes(updated);
  }, []);






  //FREQUENT ANSWERED QUESTIONS

  
const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Cuánto cuesta hacer una web de jardinero?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Desde 95 €/mes (Plan Web). Para SEO local y aparecer en Google, desde 120 €/mes. Incluye diseño, alojamiento y soporte según el plan."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tarda?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Entre 7 y 15 días según materiales y plan. La entrega es más rápida si ya dispones de logo y fotografías."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué necesito darte para empezar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nombre del negocio, servicios, zona de trabajo, logo y algunas fotos. Si no tienes, te indico cómo prepararlas o uso material temporal."
        }
      },
      {
        "@type": "Question",
        "name": "Ya tengo una web, ¿me sirve?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La reviso gratis. Si no te encuentran, carga lenta o no transmite confianza, te recomiendo optimizarla o rehacerla con estructura orientada a SEO local."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo aparezco en Google y en Google Maps?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Optimizo tu Google Business Profile, preparo la web para SEO local (servicios y zonas) y trabajamos términos como 'jardinero en [tu zona]' para captar llamadas."
        }
      },
      {
        "@type": "Question",
        "name": "¿Ofreces exclusividad por zona?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, solo trabajo con un jardinero por zona para no competir contra mis propios clientes. Lo detallo en el contrato."
        }
      },
      {
        "@type": "Question",
        "name": "¿Y si no me gusta el diseño?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Trabajo con una maqueta modular probada y eficaz que adapto a tu imagen (colores, fotos, logo). El foco es la captación de clientes."
        }
      },
      {
        "@type": "Question",
        "name": "¿Puedo cambiar cosas después?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí. Cambios menores están incluidos según plan. Si el cambio es mayor, te paso presupuesto antes de hacerlo."
        }
      },
      {
        "@type": "Question",
        "name": "¿De quién es el dominio y qué derechos tienes sobre la web?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "El dominio es del cliente desde el primer día. La web funciona por suscripción: infraestructura, diseño y código son titularidad de ERMO y se concede una licencia de uso mientras el servicio esté activo. Los textos e imágenes del cliente son exportables en cualquier momento. La compra de la web en propiedad puede presupuestarse como cesión."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo se paga y cómo cancelo?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Puedes pagar por tarjeta (Stripe) o transferencia. En pago mensual, la renovación es automática. La cancelación se realiza al finalizar la permanencia del plan."
        }
      }
    ]
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Hacer web para jardineros",
    "provider": {
      "@type": "Organization",
      "name": "ERMO",
      "url": "https://www.ermo.es"
    },
    "areaServed": "España",
    "serviceType": "Diseño web y SEO local para jardineros",
    "offers": [
      { "@type": "Offer", "name": "Plan Web", "price": "95", "priceCurrency": "EUR", "url": "https://www.ermo.es/hacer-web-jardinero#precios" },
      { "@type": "Offer", "name": "Plan Google (SEO local)", "price": "120", "priceCurrency": "EUR", "url": "https://www.ermo.es/hacer-web-jardinero#precios" },
      { "@type": "Offer", "name": "Plan GPT + Google", "price": "150", "priceCurrency": "EUR", "url": "https://www.ermo.es/hacer-web-jardinero#precios" }
    ]


  }






  return (
    <main className="landing-jardineria master__body">


      <section className="intro-jardin__master">
        <h1>¿Buscas hacer una web de <span className="jardin__destacado">jardinero</span> que aparezca en <span className="jardin__destacado">Google y ChatGPT?</span></h1>
        
        <div className="intro-jardin__content">
          <div className="intro-jardin__text">
            <p className="intro-jardin__big">Si tu <strong>web</strong> es lenta, vieja o directamente no existe, estás <strong>perdiendo clientes</strong> cada semana.</p>

            <p>Lo que ofrezco NO es tener una web por gusto. Es una herramienta clara para que te encuentren, te llamen y te contraten.
            <br></br><br></br><strong>Sin promesas vacías</strong>. Solo trabajo real y resultados demostrables.</p>

            <StandardButton
            link="#precios"
            title="Precios"
            style="mt-m margin-auto"
            bg="transparent"
            color="#3F52FF"
            borderColor="#3F52FF"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor="#0E1C9D"
            aria-label="Ver precios de cada tipo de web"
            />

            <StandardButton
            link="#clientes"
            title="Ver ejemplos reales"
            style="mt-xs margin-auto"
            bg="#3F52FF"
            color="white"
            borderColor="transparent"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor=""
            aria-label="Ver ejemplos de webs que ya están consiguiendo clientes"
            />


          </div>
          <div className="intro-jardin__img"><Image src="/jardineria/movil_01_1.jpg" width={1024} height={1536} alt="Ejemplo de web para jardineros en móvil" /></div>

        </div>
      </section>





      <section >
        <div className="ventajas__master">
        <div className="ventajas__element" id="ventajas">
          <div className="ventajas__element-img"><Image src="/jardineria/GART1.jpg" width={1024} height={1536} alt="Ejemplo de página web para jardineros en Valencia (vista móvil)" /></div>
          <h3>SEO local: aparece en <strong>Google</strong> cuando busquen <strong>“jardinero en tu zona”</strong></h3>
          <p>Tu web estará bien posicionada para búsquedas reales como “jardinero en Valencia”.<br></br><br></br>No pagas por tener una página bonita, pagas para que te encuentren y te contacten.</p>
        </div>

        <div className="ventajas__element">
          <div className="ventajas__element-img" ><Image src="/jardineria/gartalia.jpg" width={1024} height={1536} alt="Diseño web para empresa de jardinería: galería de trabajos" /></div>
          <h3>No necesitas saber <strong>nada</strong> de webs</h3>
          <p>No tienes que preocuparte por dominios, hosting, DNS ni configuraciones.<br></br><br></br>
          Tú sigues con tu trabajo. Yo me encargo de que funcione, se vea bien y esté todo en orden.</p>
        </div>

        <div className="ventajas__element">
          <div className="ventajas__element-img"><Image src="/jardineria/GATI5.png" width={1024} height={1536} alt="Plantilla modular para webs de jardineros con SEO local" /></div>
          <h3>Lo que <strong>inviertes</strong>, vuelve</h3>
          <p>Una web es cara solo si no funciona.<br></br><br></br>Si te trae clientes cada mes, no es un gasto: es una inversión que se amortiza sola.</p>
        </div>
        </div>

        <div className="button__mobile">
                <StandardButton
                link="#precios"
                title="Ver precios"
                style="mt-xs margin-auto"
                bg="#3F52FF"
                color="white"
                borderColor="transparent"
                hoverBg="#0E1C9D"
                hoverColor="white"
                hoverBorderColor=""
                aria-label="Ver los precios para hacer web de jardinería"
                />
            </div>

      </section>



    
      
      <section className="precios__master">
        <h2 id="precios"><span className="jardin__destacado">Precios</span> para hacer tu web de jardinero</h2>
        <h3>Precios claros, sin letra pequeña</h3>

        <div className="precios__slider"  ref={sliderRef}>

          <div className="slide">
            <div>
              <h4>Plan<br></br><strong>web</strong></h4>
              <ul id="lista-web" className={`expandable ${exp.web ? 'expanded' : 'collapsed'}`} aria-expanded={exp.web} aria-describedby="nota-web">
                <li>Tu web pensada para conseguir nuevos clientes gracias a nuestra <br></br><strong>MAQUETA MODULAR</strong></li>
                <li>Configuración inicial del perfil de Google Business</li>
                <li>Correo para recibir solicitudes de presupuesto</li>
              </ul>
              <button
                className="expandable__btn"
                aria-controls="lista-web"
                aria-expanded={exp.web}
                onClick={() => setExp(s => ({ ...s, web: !s.web }))}
              >
                {exp.web ? "Cerrar lista" : "Leer más"}
            </button>
            </div>
            <div>
              <h5>95€<span className="little">/mes</span></h5>
              <p className="aviso">Con una permanencia de 12 meses.</p>
   
              <StandardButton
                link="https://wa.me/message/HJYSEK4RPLOSI1"
                title="Contratar"
                style="mt-m margin-auto"
                bg="#3F52FF"
                color="white"
                borderColor="transparent"
                hoverBg="#0E1C9D"
                hoverColor="white"
                hoverBorderColor=""
                aria-label="Contratar PLAN WEB"
                />

            </div>
          </div>

          <div className={`slide slide-blue ${exp.gpt ? "expanded" : ""}`}>
            <div>
              <h4>Plan<br></br><strong>Google</strong></h4>
              <ul className={`expandable ${exp.google ? 'expanded' : 'collapsed'}`} aria-expanded={exp.google} aria-describedby="nota-google">
                <li className="amarillo"><strong>APARECER EN GOOGLE</strong><br></br> en primeras posiciones</li>
                <li className="amarillo"><strong>EXCLUSIVIDAD</strong><br></br>por zona geográfica</li>
                <li>Flujo de clientes constante</li>
                <li>Adaptación de nuestra<br></br><strong>MAQUETA MODULAR</strong><br></br>a tus necesidades</li>
                <li>Informes mensuales con visitas, clics y llamadas</li>
                <li>Configuración inicial del perfil de Google Business</li>
                
              </ul>
              <button
                    className="expandable__btn"
                    aria-controls="lista-google"
                    aria-expanded={exp.google}
                    onClick={() => setExp(s => ({ ...s, google: !s.google }))}
                  >
                    {exp.google ? "Cerrar lista" : "Leer más"}
                </button>
            </div>
            <div>
              <h5 className="confi_precio" >120€<span className="little">/mes</span></h5>
              <p className="aviso confi_aviso">Con una permanencia de 3 meses.</p>
              {/* <p className="aviso confi_aviso">Si durante los primeros 3 meses no apareces en Google, trabajo GRATIS hasta que aparezcas.</p> */}

               <StandardButton
                link="https://wa.me/message/HJYSEK4RPLOSI1"
                title="Contratar"
                style="mt-m margin-auto"
                bg="white"
                color="#3F52FF"
                borderColor="transparent"
                hoverBg="#3F52FF"
                hoverColor="white"
                hoverBorderColor=""
                aria-label="Contratar PLAN GOOGLE"
                />
            </div>
          </div>

          <div className={`slide ${exp.gpt ? "expanded" : ""}`}>
            <div>
              <h4>Plan<br></br><strong>GPT</strong></h4>
              <ul id="lista-gpt"
      className={`expandable ${exp.gpt ? "expanded" : "collapsed"}`}
      aria-expanded={exp.gpt}
      aria-describedby="nota-gpt">
                <li className="rojo"><strong>APARECER EN CHATGPT</strong><br></br> cuando pregunten por jardineros en tu zona</li>
                <li className="rojo"><strong>APARECER EN GOOGLE</strong><br></br> en primeras posiciones</li>
                <li className="rojo"><strong>EXCLUSIVIDAD</strong><br></br> por zona geográfica expandida</li>
                <li>Flujo de clientes constante</li>
                <li>Adaptación de nuestra<br></br><strong>MAQUETA MODULAR</strong><br></br>a tus necesidades</li>
                <li>Informes mensuales con visitas, clics y llamadas</li>
                <li>Configuración inicial del perfil de Google Business</li>
                
              </ul>
              <button
                    className="expandable__btn"
                    aria-controls="lista-gpt"
                    aria-expanded={exp.gpt}
                    onClick={() => setExp(s => ({ ...s, gpt: !s.gpt }))}
                  >
                    {exp.gpt ? "Cerrar lista" : "Leer más"}
                </button>
            </div>
            <div className="slide__precios">
              <h5>150€<span className="little">/mes</span></h5>
              <p className="aviso">Con una permanencia de 3 meses. <br></br>Si durante los primeros 3 meses no apareces en ChatGPT, trabajo GRATIS hasta que aparezcas.</p>
                
                <StandardButton
                link="https://wa.me/message/HJYSEK4RPLOSI1"
                title="Contratar"
                style="mt-m margin-auto"
                bg="#3F52FF"
                color="white"
                borderColor="transparent"
                hoverBg="#0E1C9D"
                hoverColor="white"
                hoverBorderColor=""
                aria-label="Contratar PLAN GPT"
                />

            </div>
          </div>

        </div>

        <h3>¿Cómo se paga esto?</h3>

        <div className="pagos__master">
          <div className="pagos__text">

            <Image className="stripe" src="/jardineria/stripe.png" width={400} height={167} alt="Stripe logo" />

            <p>Cuando firmamos el contrato te mando un enlace a <strong>Stripe</strong>. Tu solamente realizas el primer pago y el resto de pagos se formalizan automáticamente cada mes.</p>
          </div>
          <div className="pagos__img"><Image src="/jardineria/tarjeta.png" width={1024} height={1536} alt="Pago con Stripe para contratar web de jardinero" /></div>
        </div>
      </section>







       <section className="grid__master">
      <h2 id="clientes">Casos de <span className="jardin__destacado">éxito</span></h2>

      {clientes.map((cliente) => (
        <div className="exito__tarjeta" key={cliente.id}>
          <div className="exito__cliente">
            <div className="exito__cliente-img">
              <Image src={cliente.img} width={1024} height={1324} alt={`Trabajo web de jardinería para ${cliente.name}`} />
            </div>
            <div className="exito__cliente-content">
              <p className="review" dangerouslySetInnerHTML={{ __html: cliente.review }} />
              <div className="exito__cliente-content-logo">
                <Image className="cliente__logo" src={cliente.logo} width={400} height={200} alt={`Logo de ${cliente.name}`} />
                <a target="_blank" rel="noopener noreferrer" className="exito__enlace" href={cliente.link}>{cliente.name}</a>
              </div>
            </div>
          </div>
          <div className="exito__datos" suppressHydrationWarning>
            <div className="exito__datos-element">
              <p className="data_A">
                {cliente.amount >= 1000
                  ? (cliente.amount / 1000).toFixed(0) + "K"
                  : cliente.amount.toString()
                } €
              </p>
              <p className="data_B">de ingresos brutos solo con clientes de la web.</p>
            </div>
            <div className="exito__datos-element">
              <p className="data_C">{cliente.months} <span className="data_D">Meses</span></p>
              <p className="data_B">de trabajo con la web.</p>
            </div>
            <div className="exito__datos-element">
              <p className="data_C">{cliente.clients}</p>
              <p className="data_B">clientes conseguidos</p>
            </div>
          </div>
        </div>
      ))}

         <p className="data_note">
          Cifras reales junto con estimadas automáticamente. Actualizado: 16/08/2025.
        </p>
      
    </section>












      <section className="grid__master">
        <h2>Si tienes un buen servicio, demuéstralo con tu web</h2>
        <h3>¿Qué incluye nuestro diseño web y SEO para jardineros?</h3>

        <div className="grid">
          <div className="grid__element" id="servicio">
            <h4>Un diseño que ya ha funcionado antes</h4>
            <p>No empiezo desde cero. Uso una estructura clara, probada y adaptada a tu imagen para que se vea profesional sin que te cueste una fortuna.</p>
          </div>
          <div className="grid__element">
            <h4>Tu web se verá bien y cargará rápido</h4>
            <p>En el móvil, en el ordenador o donde te busquen. Porque si tarda o se ve mal, el cliente se va.</p>
          </div>
          <div className="grid__element">
            <h4>Aparecerás en Google cuando busquen lo que haces</h4>
            <p>Configuro tu web para que te encuentren en tu zona. Y cuando eso pasa, empieza a sonar el teléfono y a llegar correos.</p>
          </div>
          <div className="grid__element-grey">
            <p>Menos lio.</p>
            <p>Más llamadas</p>
          </div>
          <div className="grid__element grid__disapear">
            <h4>Una sección para mostrar lo que haces</h4>
            <p>Podas, diseño, mantenimiento… Con texto claro y tus propias fotos si las tienes. Si no, te digo cómo hacerlo bien.</p>
          </div>
          <div className="grid__element grid__disapear">
            <h4>Todo lo técnico déjamelo a mí</h4>
            <p>Tú no te preocupas de renovar nada. Dominio y alojamiento incluidos. Lo técnico queda en mis manos.</p>
          </div>
          <div className="grid__element grid__disapear">
            <h4>Soporte si algo falla</h4>
            <p>Durante el tiempo acordado, puedes escribirme si hay algún problema. Y lo resolvemos.</p>
          </div>
          <div className="grid__element grid__disapear">
            <h4>Contacto directo sin rodeos</h4>
            <p>Botón de WhatsApp y formulario sencillo. El cliente llega y te escribe. Así de simple.</p>
          </div>
          <div className="grid__element-grey grid__disapear">
            <p>Muestra.</p>
            <p>Conecta.</p>
            <p>Vende.</p>
          </div>

        </div>
      </section>






<section className="dudas__master" id="faq">
  <h2>¿Te queda alguna duda?</h2>

  <div className="dudas__grid">
    <div className="duda">
      <span className="duda__num">01</span>
      <h3>¿Cuánto cuesta hacer una web de jardinero?</h3>
      <p>Desde <strong>95 €/mes</strong> (Plan Web). Si quieres <strong>SEO local</strong> para aparecer en Google, desde <strong>120 €/mes</strong>. Los precios incluyen diseño, alojamiento y soporte según plan.</p>
    </div>

    <div className="duda">
      <span className="duda__num">02</span>
      <h3>¿Cuánto tarda?</h3>
      <p>Entre <strong>7 y 15 días</strong> según materiales y plan. Si respondes rápido y tienes logo/fotos, vamos más ágiles.</p>
    </div>

    <div className="duda">
      <span className="duda__num">03</span>
      <h3>¿Qué necesito darte para empezar?</h3>
      <p>Nombre del negocio, <strong>servicios</strong>, <strong>zona de trabajo</strong>, logo (si tienes) y algunas fotos. Si no tienes, te indico cómo prepararlas o uso material temporal.</p>
    </div>

    <div className="duda">
      <span className="duda__num">04</span>
      <h3>Ya tengo una web, ¿me sirve?</h3>
      <p>Depende. Si no te encuentran, carga lenta o no transmite confianza, es como no tener nada. La <strong>reviso gratis</strong> y te digo si conviene arreglarla o empezar de cero.</p>
    </div>

    <div className="duda">
      <span className="duda__num">05</span>
      <h3>¿Cómo aparezco en Google y en Google Maps?</h3>
      <p>Optimizo tu <strong>Google Business Profile</strong>, estructura tu web para <strong>SEO local</strong> y trabajo búsquedas reales como “jardinero en [tu zona]”. Así llegan llamadas y formularios.</p>
    </div>

    <div className="duda">
      <span className="duda__num">06</span>
      <h3>¿Ofreces exclusividad por zona?</h3>
      <p>Sí. <strong>Solo trabajo con un jardinero por zona</strong> para no repartir oportunidades entre competidores. Lo fijamos en contrato.</p>
    </div>

    <div className="duda">
      <span className="duda__num">07</span>
      <h3>¿Y si no me gusta el diseño?</h3>
      <p>No es un “diseño a medida” infinito. Uso una <strong>maqueta modular probada</strong> que adapto a tu imagen (colores, fotos, logo). El objetivo es <strong>que te encuentren y te llamen</strong>.</p>
    </div>

    <div className="duda">
      <span className="duda__num">08</span>
      <h3>¿Puedo cambiar cosas después?</h3>
      <p>Sí. Cambios menores están incluidos según plan. Si es algo mayor, te doy presupuesto cerrado antes para que decidas.</p>
    </div>

    <div className="duda">
  <span className="duda__num">09</span>
  <h3>¿De quién es el dominio y qué derechos tienes sobre la web?</h3>
    <p><strong>El dominio es tuyo</strong> desde el primer día. La <strong>web funciona por suscripción</strong>: la infraestructura, el diseño y el código son titularidad de ERMO y dispones de una <strong>licencia de uso</strong> mientras el servicio esté activo. Puedes exportar tus <strong>textos e imágenes</strong> cuando quieras. Si quieres <strong>comprar la web en propiedad</strong>, puedo preparar un presupuesto de cesión.</p>
  </div>

    <div className="duda">
      <span className="duda__num">10</span>
      <h3>¿Cómo se paga y cómo cancelo?</h3>
      <p>Por <strong>tarjeta con Stripe</strong> o transferencia. Si pagas mes a mes, la renovación es automática. Puedes <strong>cancelar</strong> al terminar la permanencia del plan.</p>
    </div>
  </div>



        <StandardButton
        link="#precios"
        title="Quiero más clientes"
        style="mt-m margin-auto"
        bg="#3F52FF"
        color="white"
        borderColor="transparent"
        hoverBg="#0E1C9D"
        hoverColor="white"
        hoverBorderColor=""
        aria-label="Ver precios de los planes de contratación"
        />

        <StandardButton
        link="#ventajas"
        title="Ver ventajas"
        style="mt-xs margin-auto"
        bg="transparent"
        color="#3F52FF"
        borderColor="#3F52FF"
        hoverBg="#0E1C9D"
        hoverColor="white"
        hoverBorderColor="#0E1C9D"
        aria-label="Ver precios de los planes de contratación"
        />

        <Script
  id="faq-schema"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
/>
<Script
  id="service-schema"
  type="application/ld+json"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
/>
</section>

      <div className="plantitas"><Image src="/jardineria/plantitas.jpg" width={1346} height={738} alt="Vista móvil de la web de jardinería" /></div>

    </main>

    
  );
  
}