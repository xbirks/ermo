import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import ServiciosVid from '@/app/components/servicios-vid.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';

//IMAGENES 



export default function VideoPage() {
    return (
    <Inner>
    <FotografiaLayout>
        <Servicios
            desktopwebm="https://www.ermo.es/videos/video/VIDEO_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/video/VIDEO_Mobile.webm"
            desktopmp4="https://www.ermo.es/videos/video/VIDEO_Desktop_1.mp4"
            mobilemp4="https://www.ermo.es/videos/video/VIDEO_Mobile_1.mp4"

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
            <ServiciosVid src="https://www.ermo.es/videos/video/video1.webm" link="#"></ServiciosVid>
            <ServiciosVid src="https://www.ermo.es/videos/video/video2.webm" link="#"></ServiciosVid>
            <ServiciosVid src="https://www.ermo.es/videos/video/video3.webm" link="#"></ServiciosVid>
            <ServiciosVid src="https://www.ermo.es/videos/video/video4.webm" link="#"></ServiciosVid>
            <ServiciosVid src="https://www.ermo.es/videos/video/video5.webm" link="#"></ServiciosVid>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
    </Inner>
    );
  }
  