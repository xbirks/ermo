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

            servicio="Programación web, UI/UX y SEO"
           
            explicacion={ <>
                En ERMO entendemos que un sitio web rápido y bien diseñado es crucial para el éxito de tu negocio en el competitivo mercado digital. Nuestro enfoque en programación web, UI/UX y SEO está diseñado para crear sitios que no solo sean estéticos, sino que también sean funcionales, fáciles de usar y optimizados para motores de búsqueda como Google.
                <br></br><br></br>
                Nuestra experiencia como diseñadores de interfaces y experiencia de usuario asegura que tu sitio no solo atraiga visitantes, sino que también los convierta en clientes, mejorando la interacción del usuario y la satisfacción general. Al mismo tiempo, nuestra estrategia SEO incrementa la visibilidad de tu sitio web, atrayendo más tráfico cualificado que puede traducirse en mayores ventas y un retorno de inversión significativo.
                <br></br><br></br>
                No dejes que tu negocio se quede atrás en la era digital. Contáctanos para descubrir cómo nuestra integración de programación web, UI/UX y SEO puede elevar tu presencia online, mejorar tus tasas de conversión y fortalecer el valor de tu marca en el mercado.
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
  