import Servicios from '@/app/components/servicios.jsx';
import ProySimilar from '@/app/components/proyecto-similar.jsx';
import FotografiaLayout from './layout.jsx';
import Image from 'next/image.js';
import ServiciosImg from '@/app/components/servicios-img.jsx';


//IMAGENES 
import foto1 from '@/app/assets/img/servicios/web/gartalia.jpg';
import foto2 from '@/app/assets/img/servicios/web/placevlc.jpg';
import foto3 from '@/app/assets/img/servicios/web/bastones.jpg';
import foto4 from '@/app/assets/img/servicios/web/belles.jpg';
import foto5 from '@/app/assets/img/servicios/web/diveroci.jpg';
import foto6 from '@/app/assets/img/servicios/web/entreprendas.jpg';
import foto7 from '@/app/assets/img/servicios/web/sanoguera.jpg';



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
            <ServiciosImg src={foto1} alt="web de la empresa de jardinería Gartalia" link="https://www.gartalia.com/"></ServiciosImg>
            <ServiciosImg src={foto2} alt="web de la empresa Place Valencia que se dedican a la gestión de inmuebles" link="https://www.placevlc.com/"></ServiciosImg>
            <ServiciosImg src={foto3} alt="Web de la empresa de bastones de madera Segorbina de Bastones en Segorbe" link="https://www.segorbinadebastones.com/"></ServiciosImg>
            <ServiciosImg src={foto4} alt="web para el gimnasio de Segorbe y Alfara del Patriarca Gimnasio Belles" link="https://gimnasiobelles.com/segorbe/"></ServiciosImg>
            <ServiciosImg src={foto5} alt="Web de la empresa DiverOci que ofrece servicios a ayuntamientos" link="https://www.ermo.es/"></ServiciosImg>
            <ServiciosImg src={foto6} alt="Web de Entre Prendas. Empresa de arreglo de ropa y vestidos de novia" link="https://entreprendas.es/"></ServiciosImg>
            <ServiciosImg src={foto7} alt="Web de la asesoría Sanoguera" link="https://sanoguera-asesores.com/"></ServiciosImg>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
      
    );
  }
  