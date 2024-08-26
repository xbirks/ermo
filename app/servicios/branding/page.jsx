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

            servicio="Identidad corporativa y branding"
           
            explicacion={ <>
                No solo creamos un logotipo que destaque, sino que desarrollamos toda la identidad visual de tu negocio, desde animaciones hasta el diseño sonoro, asegurando que tu marca conecte con tu audiencia en todos los canales. 
                <br></br><br></br>
                Al contratar nuestro servicio de identidad corporativa y logotipos en Valencia, tu empresa obtendrá una imagen coherente y profesional que comunica efectivamente tus valores y visión.Además, ofrecemos fotografía profesional para capturar la esencia de tu equipo, fortaleciendo así la imagen de marca.
                <br></br><br></br>
                Si estás buscando un cambio de imagen o creando una nueva empresa, contacta con nosotros para explorar cómo podemos ayudarte a desarrollar una identidad corporativa que comunique eficazmente tus valores y visión.
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
  