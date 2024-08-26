import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import Image from 'next/image.js';
import ServiciosImg from '@/app/components/servicios-img.jsx';


//IMAGENES 
import foto1 from '@/app/assets/img/servicios/MANOLO-BERNABEU-1.jpg';
import foto2 from '@/app/assets/img/servicios/BSN(13).jpg';
import foto3 from '@/app/assets/img/servicios/Delibreads-1.jpg';
import foto4 from '@/app/assets/img/servicios/WAY-6.jpg';
import foto5 from '@/app/assets/img/servicios/Delgo-53.jpg';
import foto6 from '@/app/assets/img/servicios/_DSF3001.jpg';
import foto7 from '@/app/assets/img/servicios/sin-título-1-Editar.png';
import foto8 from '@/app/assets/img/servicios/Baswtones_juntos.jpg';
import foto9 from '@/app/assets/img/servicios/Agosto_Wao_post-3.jpg';
import foto10 from '@/app/assets/img/servicios/vino.jpg';
import foto11 from '@/app/assets/img/servicios/principal.jpg';
import foto12 from '@/app/assets/img/servicios/11(1).jpg';



export default function FotografiaPage() {
    return (

    <FotografiaLayout>
        <Servicios
            desktop="https://www.ermo.es/videos/fotografia/FOTO_Desktop.mp4"
            mobile="https://www.ermo.es/videos/fotografia/FOTO_Mobile.mp4"

            servicio="Video comercial, de producto y educativo"
           
            explicacion={ <>
                Te ofrecemos la grabación de videos de calidad que captarán la atención de tus potenciales clientes en cualquier plataforma. Nuestros servicios se especializan en producir videos comerciales y educativos que destacan por su claridad y enfoque, ayudando a promover tus productos y educar a tu audiencia sobre los beneficios de tus servicios. 
                <br></br><br></br>
                Ya sea para redes sociales, como Reels, Youtube Shorts y TikToks, o videos promocionales en 4K, te garantizamos un contenido visual impactante y bien editado que aumentará tu presencia digital y fortalecerá tu estrategia de marketing.
                <br></br><br></br>
                Al elegirnos, obtendrás videos que no solo capturan la esencia de tu marca, sino que también maximizan su alcance en diversas plataformas. Nuestros videos están optimizados para captar la atención rápidamente, especialmente en formatos verticales ideales para redes sociales. Esto te permitirá conectar mejor con tu público y destacar en un mercado saturado, generando mayor interés en tus productos o servicios. Te recomendamos mezclarlo con nuestro servicio de Motion Graphics para hacer unos videos todavía más atractivos.
                <br></br><br></br>
                Contacta con nosotros hoy mismo para comenzar a crear videos que harán que tu marca sobresalga.
            </>}
            
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
            <ServiciosImg src={foto11} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={foto12} alt="img1" link="#"></ServiciosImg>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
      
    );
  }
  