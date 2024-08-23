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
            desktop="https://www.ermo.es/videos/sanoguera/SANOGUERA_Desktop.mp4"
            mobile="https://www.ermo.es/videos/sanoguera/SANOGUERA_Mobile.mp4"
            servicio="Fotografía de producto, gastronómica y corporativa"
           
            explicacion={ <>
                Las imágenes que hemos creado destacan la forma y textura de los envases, que, a pesar de ser genéricos, están bien pensados para ser reetiquetados por los clientes con sus propios diseños. Hemos hecho hincapié en la claridad y precisión para que los clientes puedan visualizar cómo se integrarán estos envases en sus propias líneas de productos.
                <br></br><br></br>
                El estilo de la fotografía está pensado especialmente para ser usado en redes sociales. Un código visual minimalista y sobrio pero que a su vez rezuma elegancia. 
                <br></br><br></br>
                Nuestras fotografías ayudan a simplificar el proceso de compra de los clientes, mostrando de forma efectiva cómo los productos pueden ser un añadido valioso para sus ofertas de cuidado de la piel y cosméticos. Y mostrando como podrían verse representados en fotografía los productos reetiquetados finales.
            </>}
            
        ></Servicios>

        <div className="servicios__imagenes master__body">
            <ServiciosImg src={foto1} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto2} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto3} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto4} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto5} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto6} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto7} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto8} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto9} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto10} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto11} alt="img1"></ServiciosImg>
            <ServiciosImg src={foto12} alt="img1"></ServiciosImg>
        </div>

        <ProySimilar></ProySimilar>

    </FotografiaLayout>
      
    );
  }
  