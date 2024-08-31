"use client";

import SliderServices from "@/app/components/slider-services/sliderServices";
import SwiperComponent from "@/app/components/swiper-logos/swiperLogos";
import Spacer from "@/app/buttons/spacer";
import ServicioComp from "@/app/components/servicios-componente";

//IMAGENES
import imgfoto from '@/app/assets/img/servicios/ilustracion/dibujo3.jpg';

//ICON
import instagram from '@/app/assets/icon/destacados/instagram-dest.svg';
import amazon from '@/app/assets/icon/destacados/amazon-dest.svg';
import arrow from '@/app/assets/icon/destacados/arrow-dest.svg';
import colab from '@/app/assets/icon/destacados/colab-dest.svg';




export default function FotografiaPage() {
    return (
    <>
    <div className="master__body servicios__master">
        <h1 className="servicios__h1">Ayudamos a las empresas a  adaptarse con soluciones que mezclan innovación y creatividad.</h1>

    <SliderServices></SliderServices>
    <Spacer className="spacer-xl" />

    <ServicioComp
        title="Fotografía Profesional que Impulsa tu Negocio"
        imgsrc={imgfoto}
        altimg="imagen de Ejemplo"
        descripcion={ <>La fotografía comercial de alta calidad se ha convertido en un elemento crucial para el éxito de las empresas en la era digital. 
        <br></br><br></br>
        Cuando se trata de productos, las <strong>imágenes profesionales</strong> tienen el poder de cautivar a los clientes potenciales y aumentar significativamente las ventas. Una fotografía de producto bien ejecutada no solo muestra los detalles y la calidad del artículo, sino que también evoca emociones y deseos en el espectador, llevándolo un paso más cerca de la decisión de compra. Más que un producto se convierten en objetos deseados.
        <br></br><br></br>
        En el ámbito digital, la fotografía comercial de calidad mejora drásticamente la presencia online de una empresa. Las imágenes profesionales de productos aumentan las <strong>tasas de conversión en tiendas online</strong>, ya que los clientes pueden apreciar claramente lo que están comprando. Además, el contenido visual de alta calidad mejora el SEO, aumentando la visibilidad de la empresa en los motores de búsqueda y atrayendo más tráfico orgánico.
        <br></br><br></br>
        La inversión en fotografía comercial profesional ya no es un lujo, sino una necesidad estratégica que puede impulsar las ventas, mejorar la imagen de marca y proporcionar una ventaja competitiva en un mercado cada vez más visual y digital.</>}
        imgcomp1={instagram}
        altcomp1="icono de ejemplo"
        destacado1="Mejor engagement en redes sociales"
        imgcomp2={amazon}
        altcomp2="icono de ejemplo"
        destacado2="Aumento de ventas en e-commerce"
        imgcomp3={arrow}
        altcomp3="icono de ejemplo"
        destacado3="Mejora de la tasa de clics (CTR)"
        imgcomp4={colab}
        altcomp4="icono de ejemplo"
        destacado4="Facilitación de colaboraciones B2B"
    ></ServicioComp>

<Spacer className="spacer-xl" />
<SwiperComponent></SwiperComponent>
    </div>
    </>
    );
  }
  