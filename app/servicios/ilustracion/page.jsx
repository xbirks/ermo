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
  