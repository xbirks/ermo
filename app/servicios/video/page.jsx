import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import ServiciosVid from '@/app/components/servicios-vid.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';

//ICON
import cohete from '@/app/assets/icon/destacados/cohete.png';



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
                Mira, te cuento: <strong>hacemos videos que enamoran</strong> a primera vista. 
                <br></br><br></br>
                ¿Sabes esos videos que no puedes dejar de ver en redes? Así de atrapantes. Ya sea para <strong>Instagram</strong>, <strong>TikTok</strong> o un anuncio súper pro en <strong>4K</strong>, te aseguro que tu mensaje llegará fuerte y claro.
                <br></br><br></br>
                Imagina tener contenido que no solo se ve increíble, sino que además hace que la gente diga &quot;¡Guau, quiero saber más!&quot;. Eso es lo que logramos. Tus productos brillarán y tu audiencia aprenderá sobre tus servicios sin aburrirse ni un segundo.
                <br></br><br></br>
                Y ojo, si le añadimos un toque de <strong>Motion Graphics</strong>, ¡la cosa se pone aún mejor! Es como ponerle la cereza al pastel.
                <br></br><br></br>
                ¿Qué dices? ¿Listo para que tu marca se robe todas las miradas? Llámanos y empecemos a crear magia juntos.
            </>}

            imgcomp1={cohete}
            altcomp1="icono de comunicación de conceptos complejos"
            destacado1="Videos que venden más"
            imgcomp2={cohete}
            altcomp2="icono de viralidad en redes sociales"
            destacado2="Engagement disparado en redes"
            imgcomp3={cohete}
            altcomp3="icono de diferenciación de la competencia"
            destacado3="Retorno de inversión maximizado"
            imgcomp4={cohete}
            altcomp4="icono de mayor engagement con la audiencia"
            destacado4="Credibilidad reforzada visualmente"
            
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
  