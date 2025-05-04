import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import ServiciosVid from '@/app/components/servicios-vid.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';

//ICON
import elevacion from '@/app/assets/icon/destacados/elevacion.png';
import cohete from '@/app/assets/icon/destacados/cohete.png';
import retorno from '@/app/assets/icon/destacados/carga.png';
import iman from '@/app/assets/icon/destacados/iman.png';



export default function VideoPage() {

    
    return (
    <Inner>
    <FotografiaLayout>
        <Servicios
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/v1746286114/VIDEO_Desktop_1_yibphn.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/v1746286113/VIDEO_Mobile_1_vaheqd.mp4"

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

            imgcomp1={elevacion}
            altcomp1="icono de comunicación de conceptos complejos"
            destacado1="Videos que venden más"
            imgcomp2={cohete}
            altcomp2="icono de viralidad en redes sociales"
            destacado2="Engagement disparado en redes"
            imgcomp3={retorno}
            altcomp3="icono de diferenciación de la competencia"
            destacado3="Retorno de inversión maximizado"
            imgcomp4={iman}
            altcomp4="icono de mayor engagement con la audiencia"
            destacado4="Credibilidad reforzada visualmente"
            
        ></Servicios>

        <div className="servicios__imagenes master__body">
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/v1746286113/video1_1_vkgdmy.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/v1746286112/video2_1_fhhdcr.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/v1746286113/video3_1_kcbznm.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/v1746286112/video4_1_v14p8x.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/v1746286112/video5_1_n2hrfj.mp4" link="#"></ServiciosVid>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
    </Inner>
    );
  }
  