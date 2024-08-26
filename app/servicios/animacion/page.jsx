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

            servicio="Animación 2D y motion graphics"
           
            explicacion={ <>
                En ERMO, utilizamos After Effects para crear animaciones que hacen que cada presentación de producto, logotipo y videocurso destaque. Nuestro contenido animado es perfecto para Reels de Instagram, vídeos de YouTube, y cualquier plataforma digital donde desees impactar y captar la atención de tu audiencia. Ofrecemos soluciones creativas para infoproductos y cursos que necesitan explicaciones visuales claras y atractivas, asegurando que tu mensaje no solo sea visto, sino también recordado.
                <br></br><br></br>
                Contacta con ERMO y descubre cómo nuestras animaciones pueden transformar la forma en que tu marca comunica visualmente, elevando tus presentaciones de producto y maximizando tu impacto en el mercado digital.
            </>}
            
        ></Servicios>

        <div className="servicios__imagenes master__body">
            <ServiciosImg src={foto1} alt="Manolo Bernabeu, CEO de Sanoguera Consulting. Fotografía tomada por Andrés Ortega Montoya" link="#"></ServiciosImg>
            <ServiciosImg src={foto2} alt="Bodegón de productos cosméticos de la empresa BSN Cosmetics" link="#"></ServiciosImg>
            <ServiciosImg src={foto3} alt="Wrap de trigo con arroz, tomate y vegetales de la empresa Delibreads" link="#"></ServiciosImg>
            <ServiciosImg src={foto4} alt="Tres trabajadores de la Agencia Valenciana de Publicidad WAY tomando un café" link="#"></ServiciosImg>
            <ServiciosImg src={foto5} alt="Zona de guardería de la empresa Delgo" link="#"></ServiciosImg>
            <ServiciosImg src={foto6} alt="Tratamiento de cuidado de pestañas de la empresa Lashes Duboh" link="#"></ServiciosImg>
            <ServiciosImg src={foto7} alt="Fotografía de producto para el aceite de oliva virgen extra Pagos de Guerrer" link="#"></ServiciosImg>
            <ServiciosImg src={foto8} alt="Montaje fotográfico de los bastones de Segorbina de Bastones en Segorbe" link="#"></ServiciosImg>
            <ServiciosImg src={foto9} alt="Fotografía de producto de la caja de WaoMochi hecha para la empresa Helados Estiu" link="#"></ServiciosImg>
            <ServiciosImg src={foto10} alt="Fotografía para Grupo Disber de una botella de vino sobre fondo negro" link="#"></ServiciosImg>
            <ServiciosImg src={foto11} alt="Fotografía gastronómica para el restaurante Sabora Gourmet" link="#"></ServiciosImg>
            <ServiciosImg src={foto12} alt="Fotografía publicitaria de una mujer rubia sosteniendo una copa para la empresa Cubers de Procubitos Europe" link="#"></ServiciosImg>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
      
    );
  }
  