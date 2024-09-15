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
        title="Fotografía Profesional que Impulsa tu Negocio"
        imgsrc={imgfoto}
        altimg="Portada del servicio de fotografía Profesional que Impulsa tu Negocio"
        descripcion={ <>La fotografía comercial de alta calidad se ha convertido en un elemento crucial para el éxito de las empresas en la era digital. 
        <br></br><br></br>
        Cuando se trata de productos, las <strong>imágenes profesionales</strong> tienen el poder de cautivar a los clientes potenciales y aumentar significativamente las ventas. Una fotografía de producto bien ejecutada no solo muestra los detalles y la calidad del artículo, sino que también evoca emociones y deseos en el espectador, llevándolo un paso más cerca de la decisión de compra. Más que un producto se convierten en objetos deseados.
        <br></br><br></br>
        En el ámbito digital, la fotografía comercial de calidad mejora drásticamente la presencia online de una empresa. Las imágenes profesionales de productos aumentan las <strong>tasas de conversión en tiendas online</strong>, ya que los clientes pueden apreciar claramente lo que están comprando. Además, el contenido visual de alta calidad mejora el SEO, aumentando la visibilidad de la empresa en los motores de búsqueda y atrayendo más tráfico orgánico.
        <br></br><br></br>
        La inversión en fotografía comercial profesional ya no es un lujo, sino una necesidad estratégica que puede impulsar las ventas, mejorar la imagen de marca y proporcionar una ventaja competitiva en un mercado cada vez más visual y digital.</>}

        imgcomp1={instagram}
        altcomp1="Logotipo de Instagram"
        destacado1="Mejor engagement en redes sociales"
        imgcomp2={amazon}
        altcomp2="Logotipo de Amazon"
        destacado2={ <>Aumento de ventas en <wbr />e-commerce</>}
        imgcomp3={arrow}
        altcomp3="icono de cursor"
        destacado3="Mejora de la tasa de clics (CTR)"
        imgcomp4={colab}
        altcomp4="icono de colaboración B2B"
        destacado4="Facilitación de colaboraciones B2B"

        btn1link="/servicios/fotografia"
        btn1title="ver fotos"
        btn2link="https://wa.me/message/HJYSEK4RPLOSI1"
        btn2title="contratar"
    ></ServicioComp>

<Spacer className="spacer-xl" />

<ServicioComp
        title="Ilustración personalizada que eleva la presencia de tu marca"
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

<Spacer className="spacer-xl" />

<ServicioComp
        title="Programación web y diseño ui/ux que impacta, convierte y fideliza"
        imgsrc={imgweb}
        altimg="Portada del servicio de programación web y diseño ui/ux que impacta, convierte y fideliza"
        descripcion={ <>Contar con una presencia web sólida y atractiva ya no es una opción, sino una necesidad imperativa para cualquier empresa. La programación web profesional combinada con un diseño UI/UX de calidad ofrece ventajas tangibles que pueden marcar la diferencia entre el éxito y el fracaso online.
        <br></br><br></br>
        La optimización de la experiencia del usuario a través de un diseño UI/UX intuitivo y atractivo se traduce en un aumento significativo en las tasas de conversión. Los usuarios encuentran fácilmente lo que buscan, por lo tanto, son más propensos a realizar una compra o contactar con tu empresa. 
        <br></br><br></br>
        Un diseño responsive garantiza que tu sitio se vea y funcione perfectamente en cualquier dispositivo, ampliando tu alcance y mejorando la retención de usuarios. Esta mejora en la experiencia del usuario, combinada con tiempos de carga optimizados, también favorece tu posicionamiento en los motores de búsqueda, aumentando tu visibilidad online.
        <br></br><br></br>
        Invertir en programación web y diseño UI/UX es una inversión estratégica que mejora la percepción de tu marca e impulsa tus resultados comerciales.</>}
        imgcomp1={iman}
        altcomp1="icono de aumento de la tasa de conversión"
        destacado1="Aumento de la tasa de conversión"
        imgcomp2={google}
        altcomp2="icono de mayor visibilidad en Google"
        destacado2="Mayor visibilidad en Google"
        imgcomp3={carga}
        altcomp3="icono de reducción del tiempo de carga de la web"
        destacado3="Reducción del tiempo de carga de la web"
        imgcomp4={responsive}
        altcomp4="icono de adaptabilidad a diferentes dispositivos responsive"
        destacado4="Adaptabilidad a diferentes dispositivos"

        btn1link="/servicios/web"
        btn1title="ver webs"
        btn2link="https://wa.me/message/HJYSEK4RPLOSI1"
        btn2title="contratar"
    ></ServicioComp>

<Spacer className="spacer-xl" />

<ServicioComp
        title="Movimiento que impacta:  Animación 2D y motion graphics"
        imgsrc={imganimacion}
        altimg="Portada del servicio de movimiento que impacta:  Animación 2D y motion graphics"
        descripcion={ <>Captar y mantener la atención de tu audiencia es más desafiante que nunca. Es aquí donde la animación 2D y los motion graphics entran en juego, ofreciendo una poderosa herramienta para comunicar tu mensaje de manera efectiva y memorable.
        <br></br><br></br>
        Al combinar movimiento, color y narrativa, estas técnicas mejoran drásticamente la retención del mensaje, permitiendo que tu comunicación tenga un impacto duradero. Esto se traduce directamente en un aumento en las tasas de conversión, ya que los espectadores son más propensos a actuar sobre un mensaje que comprenden y recuerdan claramente.
        <br></br><br></br>
        Una de las ventajas más notables de la animación 2D y los motion graphics es su versatilidad. Permiten explicar conceptos complejos de manera sencilla y atractiva, lo que es especialmente útil para empresas que ofrecen productos o servicios sofisticados o no tangibles. Además, este tipo de contenido visual se destaca en las redes sociales, aumentando las posibilidades de viralización y ampliando el alcance de tu marca.
        <br></br><br></br>
        En un mercado saturado de contenido estático, el movimiento capta la atención y mejora la percepción de tu marca, posicionándola como innovadora y moderna y asegura que tu mensaje sea efectivo en cualquier medio, desde redes sociales hasta presentaciones corporativas.</>}
        imgcomp1={comunicacion}
        altcomp1="icono de comunicación de conceptos complejos"
        destacado1="Comunicación de conceptos complejos"
        imgcomp2={viralidad}
        altcomp2="icono de viralidad en redes sociales"
        destacado2="Viralidad en redes sociales"
        imgcomp3={cohete}
        altcomp3="icono de diferenciación de la competencia"
        destacado3="Diferenciación de la competencia"
        imgcomp4={colab}
        altcomp4="icono de mayor engagement con la audiencia"
        destacado4="Mayor engagement con la audiencia"

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
  