import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import Image from 'next/image.js';
import ServiciosVid from '@/app/components/servicios-vid.jsx';


//IMAGENES
import vid1 from '@/app/assets/video/animacion/vid1.mp4';
import vid2 from '@/app/assets/video/animacion/vid2.mp4';
import vid3 from '@/app/assets/video/animacion/vid3.mp4';
import vid4 from '@/app/assets/video/animacion/vid4.mp4';
import vid5 from '@/app/assets/video/animacion/vid5.mp4';
import vid6 from '@/app/assets/video/animacion/vid6.mp4';


export default function FotografiaPage() {
    return (

    <FotografiaLayout>
        <Servicios
            desktop="https://www.ermo.es/videos/animacion/ANI_Desktop.mp4"
            mobile="https://www.ermo.es/videos/animacion/ANI_Mobile.mp4"

            servicio="Animación 2D y motion graphics"
           
            explicacion={ <>
                En ERMO, utilizamos After Effects para crear animaciones que hacen que cada presentación de producto, logotipo y videocurso destaque. Nuestro contenido animado es perfecto para Reels de Instagram, vídeos de YouTube, y cualquier plataforma digital donde desees impactar y captar la atención de tu audiencia. Ofrecemos soluciones creativas para infoproductos y cursos que necesitan explicaciones visuales claras y atractivas, asegurando que tu mensaje no solo sea visto, sino también recordado.
                <br></br><br></br>
                Contacta con ERMO y descubre cómo nuestras animaciones pueden transformar la forma en que tu marca comunica visualmente, elevando tus presentaciones de producto y maximizando tu impacto en el mercado digital.
            </>}
            
        ></Servicios>

        <div className="servicios__imagenes master__body">
            <ServiciosVid src={vid1} link="#"></ServiciosVid>
            <ServiciosVid src={vid2} link="#"></ServiciosVid>
            <ServiciosVid src={vid3} link="#"></ServiciosVid>
            <ServiciosVid src={vid4} link="#"></ServiciosVid>
            <ServiciosVid src={vid5} link="#"></ServiciosVid>
            <ServiciosVid src={vid6} link="#"></ServiciosVid>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
      
    );
  }
  