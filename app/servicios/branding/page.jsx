import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import ServiciosImg from '@/app/components/servicios-img.jsx';


//IMAGENES 
import foto1 from '@/app/assets/img/servicios/branding/bra1.jpg';
import foto2 from '@/app/assets/img/servicios/branding/bra2.jpg';
import foto3 from '@/app/assets/img/servicios/branding/bra3.jpg';
import foto4 from '@/app/assets/img/servicios/branding/bra4.jpg';
import foto5 from '@/app/assets/img/servicios/branding/bra5.jpg';
import foto6 from '@/app/assets/img/servicios/branding/bra6.jpg';
import foto7 from '@/app/assets/img/servicios/branding/bra7.jpg';
import foto8 from '@/app/assets/img/servicios/branding/bra8.jpg';
import foto9 from '@/app/assets/img/servicios/branding/bra9.jpg';
import foto10 from '@/app/assets/img/servicios/branding/bra10.jpg';



export default function FotografiaPage() {
    return (

    <FotografiaLayout>
        <Servicios
            desktopwebm="https://www.ermo.es/videos/branding/BRANDING_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/branding/BRANDING_Mobile.webm"
            desktopmp4="https://www.ermo.es/videos/branding/BRANDING_Desktop.mp4"
            mobilemp4="https://www.ermo.es/videos/branding/BRANDING_Mobile.mp4"

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
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
      
    );
  }
  