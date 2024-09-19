import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import Image from 'next/image.js';
import ServiciosImg from '@/app/components/servicios-img.jsx';
import ServiciosVid from '@/app/components/servicios-vid.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


//IMAGENES 
import dibujo2 from '@/app/assets/img/servicios/ilustracion/dibujo2.jpg';
import dibujo3 from '@/app/assets/img/servicios/ilustracion/dibujo3.jpg';
import dibujo6 from '@/app/assets/img/servicios/ilustracion/dibujo6.jpg';
import dibujo7 from '@/app/assets/img/servicios/ilustracion/dibujo7.jpg';

//ICON
import memo from '@/app/assets/icon/destacados/pensar.png';
import coherencia from '@/app/assets/icon/destacados/comunicacion.png';
import elevacion from '@/app/assets/icon/destacados/elevacion.png';
import merchan from '@/app/assets/icon/destacados/bolsa-top.png';


export default function IlustracionPage({municipio}) {
    return (
        <Inner>
    <FotografiaLayout>
        <Servicios
            desktopwebm="https://www.ermo.es/videos/ilustracion/ILUSTRACION_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/ilustracion/ILUSTRACION_Mobile.webm"
            desktopmp4="https://www.ermo.es/videos/ilustracion/ILUSTRACION_Desktop_1.mp4"
            mobilemp4="https://www.ermo.es/videos/ilustracion/ILUSTRACION_Mobile_1.mp4"

            servicio={<>Ilustración creativa en {municipio}</>}
           
            explicacion={ <>
                <strong>¿Buscas ilustraciones que impacten?</strong> ¡En nuestro estudio creamos magia visual! Desde <strong>personajes</strong> de videojuegos que cobran vida hasta <strong>portadas de libros</strong> irresistibles, nuestras creaciones cautivan a primera vista. Ya sea para ayuntamientos innovadores, empresas o iniciativas culturales, capturamos la esencia única de cada proyecto en cada trazo.
                <br></br><br></br>
                ¿Y el mundo del <strong>3D</strong>? ¡Lo dominamos! Ofrecemos conceptos tan realistas que querrás tocarlos, perfectos animaciones que dejarán a todos boquiabiertos.
                <br></br><br></br>
                No te conformes con lo ordinario. Deja que nuestros artistas, narren tu historia de forma inolvidable. Desde escenarios fantásticos hasta campañas municipales impactantes, cada ilustración es una obra maestra única.
            </>}
            
            imgcomp1={memo}
            altcomp1="icono de aumento de memorabilidad"
            destacado1="Aumento de memorabilidad de la marca"
            imgcomp2={coherencia}
            altcomp2="icono de coherencia visual significativa"
            destacado2="Coherencia visual significativa"
            imgcomp3={elevacion}
            altcomp3="icono de elevación del valor percibido"
            destacado3="Elevación del valor percibido"
            imgcomp4={merchan}
            altcomp4="icono de merchandising más atractivo y vendible"
            destacado4="Merchandising más atractivo y vendible"

        ></Servicios>

        <div className="servicios__imagenes master__body">
            <ServiciosVid src="https://www.ermo.es/videos/ilustracion/dibujo1.webm" link="#"></ServiciosVid>
            <ServiciosImg src={dibujo2} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={dibujo3} alt="img1" link="#"></ServiciosImg>
            <ServiciosVid src="https://www.ermo.es/videos/ilustracion/dibujo4.webm" link="#"></ServiciosVid>
            <ServiciosVid src="https://www.ermo.es/videos/ilustracion/dibujo5.webm" link="#"></ServiciosVid>
            <ServiciosImg src={dibujo6} alt="img1" link="#"></ServiciosImg>
            <ServiciosImg src={dibujo7} alt="img1" link="#"></ServiciosImg>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
    </Inner>
    );
  }
  