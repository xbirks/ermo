import Proyectos from '../../components/proyectos.jsx';
import SanogueraLayout from './layout.jsx';



export default function SanogueraPage() {
    return (

    <SanogueraLayout>
        <Proyectos
            desktopwebm="https://www.ermo.es/videos/sanoguera/SANOGUERA_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/sanoguera/SANOGUERA_Mobile.webm"
            desktopmp4="https://www.ermo.es/videos/sanoguera/SANOGUERA_Desktop_1.mp4"
            mobilemp4="https://www.ermo.es/videos/sanoguera/SANOGUERA_Mobile_1.mp4"
            cliente="Sanoguera Consultoría"
            tipo="Branding | Diseño web | Programación web | Fotografía corporativa"
            ano="2023 | 2024"
            descripcion={ <>
                Renovación 360 de toda la imagen de marca de la empresa motivada por un a transición de Asesoría hacia Consultoría. Hicimos desde el rebranding de la antigua marca hasta el rediseño de una nueva web más atractiva y modernizada.
               </>}
            videoproyectowebm="https://www.ermo.es/videos/sanoguera/SANOGUERA_Wrap.webm"
            videoproyectomp4="https://www.ermo.es/videos/sanoguera/SANOGUERA_Wrap.mp4"
            explicacion={ <>
                Las imágenes que hemos creado destacan la forma y textura de los envases, que, a pesar de ser genéricos, están bien pensados para ser reetiquetados por los clientes con sus propios diseños. Hemos hecho hincapié en la claridad y precisión para que los clientes puedan visualizar cómo se integrarán estos envases en sus propias líneas de productos.
                <br></br><br></br>
                El estilo de la fotografía está pensado especialmente para ser usado en redes sociales. Un código visual minimalista y sobrio pero que a su vez rezuma elegancia. 
                <br></br><br></br>
                Nuestras fotografías ayudan a simplificar el proceso de compra de los clientes, mostrando de forma efectiva cómo los productos pueden ser un añadido valioso para sus ofertas de cuidado de la piel y cosméticos. Y mostrando como podrían verse representados en fotografía los productos reetiquetados finales.
            </>}
            
            image1webm="https://www.ermo.es/videos/sanoguera/SANOGUERA_mini_2.webm"
                image1mp4="https://www.ermo.es/videos/sanoguera/SANOGUERA_mini_2.mp4"
            image2webm="https://www.ermo.es/videos/sanoguera/SANOGUERA_mini_3.webm"
                image2mp4="https://www.ermo.es/videos/sanoguera/SANOGUERA_mini_3.mp4"
        ></Proyectos>
    </SanogueraLayout>
      
    );
  }
  