import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import ServiciosImg from '@/app/components/servicios-img.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';

//IMAGENES 
import foto1 from '@/app/assets/img/servicios/branding/bra1.jpg';
import foto2 from '@/app/assets/img/servicios/branding/bra2.jpg';
import foto3 from '@/app/assets/img/servicios/branding/bra3.jpg';
import foto4 from '@/app/assets/img/servicios/branding/bra4.jpg';
import foto5 from '@/app/assets/img/servicios/branding/bra5.jpg';
import foto6 from '@/app/assets/img/servicios/branding/bra6.jpg';
import foto7 from '@/app/assets/img/servicios/branding/bra7.jpg';
import foto8 from '@/app/assets/img/servicios/branding/bra8.jpg';
import foto9 from '@/app/assets/img/servicios/branding/bra9.jpg';
import foto10 from '@/app/assets/img/servicios/branding/bra10.jpg';

//ICON
import instagram from '@/app/assets/icon/destacados/instagram.png';
import amazon from '@/app/assets/icon/destacados/elevacion.png';
import arrow from '@/app/assets/icon/destacados/cohete.png';
import colab from '@/app/assets/icon/destacados/coherencia.png';



export default function BrandingPage({municipio}) {


    
    return (
    <Inner>
    <FotografiaLayout>
        <Servicios
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746286433/BRANDING_Desktop_1_lrfzqq.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746286433/BRANDING_Mobile_1_vkui3c.mp4"

            servicio={ <>Identidad corporativa y branding {municipio}</>}
           
            explicacion={ <>
                ¿Sueñas con una marca que deslumbre? En nuestro estudio no solo diseñamos logotipos impactantes, ¡creamos <strong>experiencias de marca</strong> inolvidables! Nuestro enfoque 360° abarca desde diseño gráfico hasta motion graphics, resultando en una identidad coherente y memorable que resonará en todos los canales.
                <br></br><br></br>
                ¿Necesitas renovar tu imagen o lanzar una nueva empresa al estrellato? Estamos listos para transformar tu visión en una identidad corporativa que grite &quot;¡Éxito!&quot; en cada detalle. Desde tipografías únicas hasta paletas de colores que cuentan historias, crearemos un <strong>universo visual</strong> que hará que tu competencia {municipio} se pregunte: &quot;¿Cómo lo han hecho?&quot;
                <br></br><br></br>
                No te conformes con ser uno más ni con un simple logotipo. Deja que tu marca hable por sí misma y <strong>conquiste el mercado</strong>. ¿Listo para destacar? Contáctanos hoy y da el primer paso hacia una identidad de marca extraordinaria.
            </>}

            imgcomp1={instagram}
            altcomp1="Logotipo de Instagram"
            destacado1="Mayor reconocimiento de marca"
            imgcomp2={amazon}
            altcomp2="Logotipo de Amazon"
            destacado2="Aumento de lealtad del cliente"
            imgcomp3={arrow}
            altcomp3="icono de cursor"
            destacado3="Diferenciación competitiva"
            imgcomp4={colab}
            altcomp4="icono de colaboración B2B"
            destacado4="Coherencia visual de marca"
            
        ></Servicios>

        <div className="servicios__imagenes master__body">
            <ServiciosImg src={foto1} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto2} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto3} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto4} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto5} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto6} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto7} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto8} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto9} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto10} alt="img1" link="#"></ServiciosImg>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
    </Inner>
    );
  }
  