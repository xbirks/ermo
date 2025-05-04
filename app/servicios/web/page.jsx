import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import Image from 'next/image.js';
import ServiciosImg from '@/app/components/servicios-img.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';

//IMAGENES 
import foto1 from '@/app/assets/img/servicios/web/gartalia.jpg';
import foto2 from '@/app/assets/img/servicios/web/placevlc.jpg';
import foto3 from '@/app/assets/img/servicios/web/bastones.jpg';
import foto4 from '@/app/assets/img/servicios/web/belles.jpg';
import foto5 from '@/app/assets/img/servicios/web/diveroci.jpg';
import foto6 from '@/app/assets/img/servicios/web/entreprendas.jpg';
import foto7 from '@/app/assets/img/servicios/web/sanoguera.jpg';

//ICON
import iman from '@/app/assets/icon/destacados/iman.png';
import google from '@/app/assets/icon/destacados/google.png';
import carga from '@/app/assets/icon/destacados/carga.png';
import responsive from '@/app/assets/icon/destacados/responsive.png';



export default function WebPage({municipio}) {


    
    return (
    <Inner>
    <FotografiaLayout>
        <Servicios
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746287911/WEB_Desktop_1_1_jd2btn.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746287911/WEB_Mobile_1_1_m1e0qy.mp4"

            servicio={<>Programación web, UI/UX y SEO en {municipio}</>}
           
            explicacion={ <>
                ¿Sabías que tu sitio web puede ser tu mejor vendedor 24/7? En ERMO, no solo creamos webs bonitas, ¡las hacemos imparables! Imagina un sitio tan <strong>rápido</strong> que tus visitantes no tengan tiempo ni de pestañear, tan <strong>intuitivo</strong> que hasta tu tío tecnófobo pueda usarlo, y tan <strong>optimizado</strong> que Google lo quiera poner en primera fila.
                <br></br><br></br>
                Nuestro equipo combinará <strong>diseño seductor</strong>, <strong>usabilidad</strong> inteligente y <strong>SEO</strong> ninja para crear tu arma secreta online. No solo atraemos visitas, las convertimos en fans de tu marca que no pueden evitar comprar.
                <br></br><br></br>
                ¿Cansado de ser invisible en internet? Deja de esconderte. Con ERMO, tu negocio brillará tanto que necesitarás gafas de sol.
            </>}

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
            
        ></Servicios>

        <div className="servicios__imagenes master__body">
            <ServiciosImg src={foto1} alt="web de la empresa de jardinería Gartalia" link="https://www.gartalia.com/"></ServiciosImg>
            <ServiciosImg src={foto2} alt="web de la empresa Place Valencia que se dedican a la gestión de inmuebles" link="https://www.placevlc.com/"></ServiciosImg>
            <ServiciosImg src={foto3} alt="Web de la empresa de bastones de madera Segorbina de Bastones en Segorbe" link="https://www.segorbinadebastones.com/"></ServiciosImg>
            <ServiciosImg src={foto4} alt="web para el gimnasio de Segorbe y Alfara del Patriarca Gimnasio Belles" link="https://gimnasiobelles.com/segorbe/"></ServiciosImg>
            <ServiciosImg src={foto5} alt="Web de la empresa DiverOci que ofrece servicios a ayuntamientos" link="https://www.ermo.es/"></ServiciosImg>
            <ServiciosImg src={foto6} alt="Web de Entre Prendas. Empresa de arreglo de ropa y vestidos de novia" link="https://entreprendas.es/"></ServiciosImg>
            <ServiciosImg src={foto7} alt="Web de la asesoría Sanoguera" link="https://sanoguera-asesores.com/"></ServiciosImg>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
    </Inner>
    );
  }
  