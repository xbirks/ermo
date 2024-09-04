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


export default function IlustracionPage() {
    return (
        <Inner>
    <FotografiaLayout>
        <Servicios
            desktopwebm="https://www.ermo.es/videos/ilustracion/ILUSTRACION_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/ilustracion/ILUSTRACION_Mobile.webm"
            desktopmp4="https://www.ermo.es/videos/ilustracion/ILUSTRACION_Desktop_1.mp4"
            mobilemp4="https://www.ermo.es/videos/ilustracion/ILUSTRACION_Mobile_1.mp4"

            servicio="Ilustración"
           
            explicacion={ <>
                En nuestro estudio hacemos ilustraciones limpias y elegantes. Abarcamos desde personajes y escenarios para videojuegos hasta ilustraciones gastronómicas y portadas de libros. Dibujamos reflejando la personalidad única de cada cliente, ya sea para campañas municipales, ayuntamientos o iniciativas culturales privadas.
                <br></br><br></br>
                Nuestra pasión por el detalle se extiende a la creación de conceptos visuales en 3D, ofreciendo soluciones que luego podrán ser modeladas para impresión en 3D o para animación en 3D.
                <br></br><br></br>
                Te ayudamos a narrar tu historia visualmente con creatividad y precisión, asegurando que cada ilustración sea memorable y única.
            </>}
            
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
  