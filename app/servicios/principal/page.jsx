"use client";

import SliderServices from "@/app/components/slider-services/sliderServices";
import SwiperComponent from "@/app/components/swiper-logos/swiperLogos";
import Spacer from "@/app/buttons/spacer";
import ServicioComp from "@/app/components/servicios-componente";
import { motion } from "framer-motion";
import Inner from "@/app/components/Transiciones/inner";

//IMAGENES
import imgfoto from '@/app/assets/img/servicios/fotografia/principal.jpg';
import imgilustracion from '@/app/assets/img/servicios/ilustracion/dibujo3.jpg';
import imgweb from '@/app/assets/img/servicios/web/diveroci.jpg';
import imganimacion from '@/app/assets/img/servicios/ilustracion/dibujo7.jpg';

//ICON
import instagram from '@/app/assets/icon/destacados/instagram.png';
import amazon from '@/app/assets/icon/destacados/amazon.png';
import arrow from '@/app/assets/icon/destacados/arrow.png';
import colab from '@/app/assets/icon/destacados/punos.png';
import memo from '@/app/assets/icon/destacados/pensar.png';
import coherencia from '@/app/assets/icon/destacados/coherencia.png';
import elevacion from '@/app/assets/icon/destacados/elevacion.png';
import merchan from '@/app/assets/icon/destacados/borsa.png';
import iman from '@/app/assets/icon/destacados/iman.png';
import google from '@/app/assets/icon/destacados/google.png';
import carga from '@/app/assets/icon/destacados/carga.png';
import responsive from '@/app/assets/icon/destacados/responsive.png';
import comunicacion from '@/app/assets/icon/destacados/comunicacion.png';
import viralidad from '@/app/assets/icon/destacados/viralidad.png';
import competencia from '@/app/assets/icon/destacados/competencia-dest.svg';
import cohete from '@/app/assets/icon/destacados/cohete.png';




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
        <h1 className="servicios__h1">Ayudamos a las empresas con soluciones que mezclan innovación y creatividad.</h1>
    
    </motion.div>


    <SliderServices></SliderServices>
    <Spacer className="spacer-xl" />

    <ServicioComp
        title="Imágenes creadas con Inteligencia artificial (IA)"
        imgsrc={imgfoto}
        altimg="Portada del servicio de fotografía Profesional que Impulsa tu Negocio"
        descripcion={ <>Trabajamos con flujos avanzados en ComfyUI para generar imágenes realistas o conceptuales que refuercen tu identidad visual <strong>sin los costes ni las limitaciones de una sesión fotográfica</strong> tradicional. <br></br><br></br>Partimos de un brief claro, afinamos los prompts y aplicamos retoque posterior para entregar archivos optimizados—tanto en calidad como en metadatos—listos para web, e‑commerce y redes sociales. <br></br><br></br>El proceso es ágil, escalable y coherente, lo que te permite lanzar campañas con rapidez, testar variantes de producto y mantener una presencia visual sólida que inspira confianza y, en última instancia, impulsa tus ventas.</>}

        imgcomp1={instagram}
        altcomp1="Logotipo de Instagram"
        destacado1="Mayor engagement en redes sociales"
        imgcomp2={amazon}
        altcomp2="Logotipo de Amazon"
        destacado2={ <>Aumento de ventas en <wbr />e-commerce</>}
        imgcomp3={arrow}
        altcomp3="icono de cursor"
        destacado3="Mejora de la tasa de clics (CTR)"
        imgcomp4={colab}
        altcomp4="icono de colaboración B2B"
        destacado4="A/B testing veloz y de bajo coste"

        btn1link="/servicios/fotografia"
        btn1title="ver fotos"
        btn2link="https://wa.me/message/HJYSEK4RPLOSI1"
        btn2title="contratar"
    ></ServicioComp>

<Spacer className="spacer-xl" />
{/* 
<ServicioComp
        title="Ilustramos para dar una personalidad auténtica a tu marca"
        imgsrc={imgilustracion}
        altimg="Portada del servicio de ilustración personalizada que eleva la presencia de tu marca"
        descripcion={ <>La ilustración profesional se ha convertido en una herramienta indispensable para las empresas que buscan destacar en un mercado cada vez más competitivo. Al contratar a un ilustrador se obtiene una diferenciación visual inmediata frente a la competencia. Esto no solo aumenta la memorabilidad de la marca entre los clientes, sino que también mejora significativamente la coherencia visual en todos los materiales de la empresa, desde la web hasta los productos físicos.
        <br></br><br></br>
        En el ámbito digital, la ilustración profesional ofrece ventajas tangibles que van más allá de la estética. Los iconos optimizados reducen el tiempo de carga de la web, mientras que una iconografía intuitiva mejora la navegación del usuario.
        <br></br><br></br>
        La inversión en ilustración profesional también se traduce en una elevación del valor percibido de los productos o servicios de la empresa. Las infografías ilustradas facilitan la comprensión de información compleja, mejorando la retención de información por parte de los usuarios. Asimismo, la adaptabilidad de los elementos visuales a diferentes formatos permite crear materiales de marketing únicos y merchandising más atractivo.</>}
        imgcomp1={memo}
        altcomp1="icono de aumento de memorabilidad"
        destacado1="Aumento de memorabilidad de marca"
        imgcomp2={coherencia}
        altcomp2="icono de coherencia visual significativa"
        destacado2="Coherencia visual significativa"
        imgcomp3={elevacion}
        altcomp3="icono de elevación del valor percibido"
        destacado3="Elevación del valor percibido"
        imgcomp4={merchan}
        altcomp4="icono de merchandising más atractivo y vendible"
        destacado4="Merchandising más atractivo y vendible"

        btn1link="/servicios/ilustracion"
        btn1title="ver más"
        btn2link="https://wa.me/message/HJYSEK4RPLOSI1"
        btn2title="contratar"
    ></ServicioComp>

<Spacer className="spacer-xl" /> */}

<ServicioComp
        title="Desarrollo web centrado en tus usuarios"
        imgsrc={imgweb}
        altimg="Portada del servicio de programación web y diseño ui/ux que impacta, convierte y fideliza"
        descripcion={ <>Crear una presencia online sólida empieza por un sitio que cargue rápido, se vea bien en cualquier dispositivo y guíe al visitante sin esfuerzo. <br></br><br></br>Desarrollamos tu web con código limpio y un diseño UI/UX que prioriza la claridad: el usuario encuentra lo que necesita y tú obtienes más contactos y ventas. <br></br><br></br>Al optimizar rendimiento y SEO desde la base generamos una experiencia fiable que refuerza la confianza en tu marca y te permite crecer con serenidad.</>}
        imgcomp1={iman}
        altcomp1="icono de aumento de la tasa de conversión"
        destacado1="Aumento de la tasa de conversión"
        imgcomp2={google}
        altcomp2="icono de mayor visibilidad en Google"
        destacado2="Mayor visibilidad en Google"
        imgcomp3={carga}
        altcomp3="icono de reducción del tiempo de carga de la web"
        destacado3="Tiempos de carga ultra‑rápidos"
        imgcomp4={responsive}
        altcomp4="icono de adaptabilidad a diferentes dispositivos responsive"
        destacado4="Adaptabilidad a cualquier dispositivo"

        btn1link="/servicios/web"
        btn1title="ver webs"
        btn2link="https://wa.me/message/HJYSEK4RPLOSI1"
        btn2title="contratar"
    ></ServicioComp>

<Spacer className="spacer-xl" />

<ServicioComp
        title="Animación 2D y motion graphics que comunican"
        imgsrc={imganimacion}
        altimg="Portada del servicio de movimiento que impacta:  Animación 2D y motion graphics"
        descripcion={ <>El movimiento es la forma más directa de explicar y de captar la atención. Con animación 2D y motion graphics transformamos conceptos complejos en piezas visuales claras, memorables y fáciles de compartir. Cada proyecto parte de tus objetivos: adaptamos estilo, ritmo y narrativa para que tu mensaje conecte, mejore la comprensión y refuerce la percepción de tu marca como innovadora, sin recurrir a estridencias innecesarias.</>}
        imgcomp1={comunicacion}
        altcomp1="icono de comunicación de conceptos complejos"
        destacado1="Comunicación de conceptos complejos"
        imgcomp2={viralidad}
        altcomp2="icono de viralidad en redes sociales"
        destacado2="Retención y recuerdo del mensaje"
        imgcomp3={cohete}
        altcomp3="icono de diferenciación de la competencia"
        destacado3="Diferenciación de la competencia"
        imgcomp4={colab}
        altcomp4="icono de mayor engagement con la audiencia"
        destacado4="Alcance y viralidad en redes"

        btn1link="/servicios/animacion"
        btn1title="ver más"
        btn2link="https://wa.me/message/HJYSEK4RPLOSI1"
        btn2title="contratar"
    ></ServicioComp>

<Spacer className="spacer-xl" />

<SwiperComponent></SwiperComponent>
    </div>
    </Inner>
    );
  }
  