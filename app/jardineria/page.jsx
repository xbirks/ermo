'use client';

import "./jardineria.scss";
import Image from "next/image";
import { useRef, useEffect } from "react";
import StandardButton from "../buttons/standard-button";

function Jardineria() {

  const sliderRef = useRef(null);

useEffect(() => {
  if (window.innerWidth <= 768 && sliderRef.current) {
    const children = sliderRef.current.children;
    if (children[1]) {
      sliderRef.current.scrollLeft = children[1].offsetLeft;

    }
  }
}, []);




  return (
    <main className="landing-jardineria master__body">


      <section className="intro-jardin__master">
        <h1>¿Tienes una buena empresa de <span className="jardin__destacado">jardinería</span> pero nadie te encuentra en Google ni <span className="jardin__destacado">ChatGPT</span>?</h1>
        
        <div className="intro-jardin__content">
          <div className="intro-jardin__text">
            <p className="intro-jardin__big">Si tu <strong>web</strong> es lenta, vieja o directamente no existe, estás <strong>perdiendo clientes</strong> cada semana.</p>

            <p>Lo que ofrezco NO es tener una web por gusto. Es una herramienta clara para que te encuentren, te llamen y te contraten.
            <br></br><br></br><strong>Sin promesas vacías</strong>. Solo trabajo real y resultados demostrables.</p>

            <StandardButton
              link="#precio"
              title="Quiero más clientes"
              style="mt-l margin-auto"
            />

             <StandardButton
              link="#ventajas"
              title="Ventajas"
              style="mt-l margin-auto btn_jardin"
            />
          </div>
          <div className="intro-jardin__img"><Image src="/jardineria/movil_01.jpg" width={1024} height={1536} alt="Vista móvil de la web de jardinería" /></div>

        </div>
      </section>





      <section >
        <div className="ventajas__master">
        <div className="ventajas__element" id="ventajas">
          <div className="ventajas__element-img"><Image src="/jardineria/GART1.jpg" width={1024} height={1536} alt="Vista móvil de la web de jardinería" /></div>
          <h3>Te encontrarán en <strong>Google y ChatGPT</strong></h3>
          <p>Tu web estará bien posicionada para búsquedas reales como “jardinero en Valencia”.<br></br><br></br>No pagas por tener una página bonita, pagas para que te encuentren y te contacten.</p>
        </div>

        <div className="ventajas__element">
          <div className="ventajas__element-img" ><Image src="/jardineria/gartalia.jpg" width={1024} height={1536} alt="Vista móvil de la web de jardinería" /></div>
          <h3>No necesitas saber <strong>nada</strong> de webs</h3>
          <p>No tienes que preocuparte por dominios, hosting, DNS ni configuraciones.<br></br><br></br>
          Tú sigues con tu trabajo. Yo me encargo de que funcione, se vea bien y esté todo en orden.</p>
        </div>

        <div className="ventajas__element">
          <div className="ventajas__element-img"><Image src="/jardineria/GATI5.png" width={1024} height={1536} alt="Vista móvil de la web de jardinería" /></div>
          <h3>Lo que <strong>inviertes</strong>, vuelve</h3>
          <p>Una web es cara solo si no funciona.<br></br><br></br>Si te trae clientes cada mes, no es un gasto: es una inversión que se amortiza sola.</p>
        </div>
        </div>

        <div className="button__mobile"><StandardButton
              link="#precio"
              title="Precios"
              style="mt-l margin-auto btn_jardin"
            /></div>

      </section>







      <section className="grid__master">
        <h2>Si tienes un buen servicio, demuéstralo con tu web</h2>
        <h3>¿Qué conseguirás conmigo?</h3>

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
          <div className="grid__element">
            <h4>Una sección para mostrar lo que haces</h4>
            <p>Podas, diseño, mantenimiento… Con texto claro y tus propias fotos si las tienes. Si no, te digo cómo hacerlo bien.</p>
          </div>
          <div className="grid__element">
            <h4>Todo lo técnico déjamelo a mi</h4>
            <p>Tú no te preocupas de renovar nada. Dominio y alojamiento incluidos. Lo técnico queda en mis manos.</p>
          </div>
          <div className="grid__element">
            <h4>Soporte si algo falla</h4>
            <p>Durante el tiempo acordado, puedes escribirme si hay algún problema. Y lo resolvemos.</p>
          </div>
          <div className="grid__element">
            <h4>Contacto directo sin rodeos</h4>
            <p>Botón de WhatsApp y formulario sencillo. El cliente llega y te escribe. Así de simple.</p>
          </div>
          <div className="grid__element-grey">
            <p>Muestra.</p>
            <p>Conecta.</p>
            <p>Vende.</p>
          </div>

        </div>
      </section>




      <section className="precios__master">
        <h2>Esto cuesta que empiecen a <span className="jardin__destacado">llamarte</span></h2>
        <h3>Precios claros, sin letra pequeña</h3>

        <div className="precios__slider" id="precio" ref={sliderRef}>

          <div className="slide">
            <div>
              <h4>Plan <strong>Básico</strong></h4>
              <ul>
                <li>Web adaptada a la imagen de tu empresa</li>
                <li>Optimización para todos los dispositivos</li>
                <li>Posicionamiento SEO local básico</li>
                <li>Dominio y alojamiento durante 1 año</li>
                <li>Soporte técnico durante 1 mes</li>
              </ul>
            </div>
            <div>
              <h5>1990€</h5>
              <p className="aviso">Pago único</p>
              <StandardButton
              link="https://wa.me/message/HJYSEK4RPLOSI1"
              title="Contratar"
              style=" margin-auto"
            />
            </div>
          </div>

          <div className="slide slide-blue" >
            <div>
              <h4>Plan <strong>Demanda</strong></h4>
              <ul>
                <li><strong>TODO</strong> lo incluido en el Plan Básico</li>
                <li>Cambios menores incluidos durante todo el año</li>
                <li>Informes mensuales con visitas, clics y llamadas</li>
                <li>Posicionamiento SEO local activo</li>
                <li className="amarillo"><strong>EXCLUSIVIDAD</strong><br></br>por zona geográfica</li>
              </ul>
            </div>
            <div>
              <h5 className="confi_precio" >120€<span className="little">/mes</span></h5>
              <p className="aviso confi_aviso">Con una permanencia de 12 meses. <br></br>Si durante los primeros 3 meses no apareces en Google, trabajo GRATIS hasta que aparezcas.</p>
              <StandardButton
              link="https://wa.me/message/HJYSEK4RPLOSI1"
              title="Contratar"
              style="margin-auto btn_jardin btn_confi"
            />
            </div>
          </div>

          <div className="slide">
            <div>
              <h4>Plan <strong>Total</strong></h4>
              <ul>
                <li>TODO lo incluido en el Plan Confianza</li>
                <li>Plantilla personalizada para solicitar reseñas a tus clientes</li>
                <li>Configuración inicial del perfil de Google Business</li>
                <li className="rojo"><strong>APARECER EN CHATGPT</strong><br></br> cuando un cliente pida una recomendación de jardineros en tu zona</li>
              </ul>
            </div>
            <div>
              <h5>150€<span className="little">/mes</span></h5>
              <p className="aviso">Con una permanencia de 12 meses. <br></br>Si durante los primeros 6 meses no apareces en ChatGPT, trabajo GRATIS hasta que aparezcas.</p>
              <StandardButton
              link="https://wa.me/message/HJYSEK4RPLOSI1"
              title="Contratar"
              style=" margin-auto"
            />
            </div>
          </div>

        </div>

        <h3>¿Cómo se paga esto?</h3>

        <div className="pagos__master">
          <div className="pagos__text">
            {/* <h4>Pago único</h4>
            <p>Se hace una sola transferencia antes de empezar. Fácil.</p> */}

            <h4>Pago mes a mes</h4>
            <p>Se hace por tarjeta con un sistema automático <strong>(Stripe)</strong>. Tú solo pones la tarjeta y no tienes que preocuparte más. Cada mes se te cobra de forma automática y con factura legal incluida.<br></br><br></br>
            En los planes mensuales, hay una <strong>permanencia mínima</strong> (de 12 meses en el Plan Confianza o de 24 meses en el Plan Demanda), <strong>porque el trabajo se planifica a largo plazo</strong>. Si decides cancelar antes de tiempo, deberás pagar lo que falte hasta completar el periodo.<br></br><br></br>
            Esto es para trabajar bien, sin presiones y con compromiso real por ambas partes.</p>
          </div>
          <div className="pagos__img"><Image src="/jardineria/invoice.jpg" width={1024} height={1536} alt="Vista móvil de la web de jardinería" /></div>
        </div>
      </section>




      <section className="dudas__master">
        <h2>¿Te queda alguna duda?</h2>

        <div className="dudas__grid">

          <div className="duda">

            <span className="duda__num">01</span>
            <h3>Ya tengo una web, ¿me sirve?</h3>
            <p>Depende. Si nadie la ve, si carga lenta, si parece hecha en 2008 o no transmite confianza, es como no tener nada. La reviso gratis y te digo si merece la pena arreglarla o empezar de cero.</p>
          </div>

          <div className="duda">
            <span className="duda__num">02</span>
            <h3>¿Qué necesito darte para empezar?</h3>
            <p>El nombre de tu negocio, una lista de los servicios que ofreces, tu zona de trabajo, el logo (si tienes) y si puedes, algunas fotos tuyas o de trabajos. Si no tienes casi nada, también podemos apañarlo.</p>
          </div>
          
          <div className="duda">
            <span className="duda__num">03</span>
            <h3>¿Cuánto tarda?</h3>
            <p>Depende del plan, pero en general entre 7 y 15 días. Si tú respondes rápido, va rápido.</p>
          </div>

          <div className="duda">
            <span className="duda__num">04</span>
            <h3>¿Cómo se paga?</h3>
            <p>Por transferencia o por tarjeta. Si eliges pagar mes a mes, se hace de forma automática para que no tengas que estar pendiente. Siempre con factura y sin líos.</p>
          </div>

          <div className="duda">
            <span className="duda__num">05</span>
            <h3>¿Y si no me gusta el diseño?</h3>
            <p>No es un diseño a medida. Es una estructura que ya he probado y sé que funciona. Lo adapto a tu imagen: tus fotos, tus colores, tu logo. Pero no cambio cómo está montada la web. Esto no va de gustos, va de que te encuentren y te llamen.</p>
          </div>

          <div className="duda">
            <span className="duda__num">06</span>
            <h3>¿Y si luego quiero cambiar algo?</h3>
            <p>Depende del plan. Si es un cambio menor y tienes soporte incluido, lo hago sin problema. Si es algo grande o no está incluido, te doy precio antes y decides si lo hacemos.</p>
          </div>

        </div>

            <StandardButton
              link="#precio"
              title="Quiero más clientes"
              style="mt-l margin-auto"
            />

             <StandardButton
              link="#ventajas"
              title="Ventajas"
              style="mt-l margin-auto btn_jardin"
            />
      </section>

      <div className="plantitas"><Image src="/jardineria/plantitas.jpg" width={1346} height={738} alt="Vista móvil de la web de jardinería" /></div>

    </main>
  );
}

export default Jardineria;
