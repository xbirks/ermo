import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import Image from 'next/image.js';
import ServiciosVid from '@/app/components/servicios-vid.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';

//ICON
import comunicacion from '@/app/assets/icon/destacados/comunicacion.png';
import viralidad from '@/app/assets/icon/destacados/viralidad.png';
import cohete from '@/app/assets/icon/destacados/cohete.png';
import colab from '@/app/assets/icon/destacados/comentario.png';



export default function AnimacionPage() {
    return (
    <Inner>
    <FotografiaLayout>
        <Servicios 
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285801/ANI_Desktop_1_fjgjdy.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285800/ANI_Mobile_1_fhqsxo.mp4"

            servicio="Animación 2D y motion graphics"
           
            explicacion={ <>
                ¿Te imaginas tus productos <strong>cobrando vida</strong> en la pantalla? En ERMO, eso es exactamente lo que hacemos. Nuestras animaciones con After Effects no son solo bonitas, son pura magia visual que hace que tu marca brille.
                <br></br><br></br>
                Ya sea en Instagram, YouTube o donde quieras arrasar, creamos contenido que hace que la gente se detenga, mire y diga &quot;¡Guau!&quot;. <strong>¿Tienes un curso online o un producto complejo?</strong> Lo convertimos en algo tan claro y atractivo que hasta tu abuela lo entenderá (y le encantará).
                <br></br><br></br>
                No te quedes atrás. Hablemos y descubre cómo podemos hacer que tu marca no solo se vea, sino que se recuerde. Con ERMO, tu mensaje no solo llega, impacta. ¿Listo para revolucionar tu presencia digital?
            </>}

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
            
        ></Servicios>

        <div className="servicios__imagenes master__body">
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285799/vid3_1_qkqmzg.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285797/vid7_1_pstdpc.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285799/vid1_1_whsitz.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285798/vid2_1_gnntoy.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285798/vid4_1_zrry02.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285799/vid5_1_kpey6u.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285799/vid6_1_soetng.mp4" link="#"></ServiciosVid>
            <ServiciosVid src="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285799/vid8_1_zzwoud.mp4" link="#"></ServiciosVid>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
    </Inner>
    );
  }
  