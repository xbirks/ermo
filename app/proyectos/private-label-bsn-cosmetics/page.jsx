import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';



export default function BsnPage() {
    return (

    <BsnLayout>
        <Proyectos
            desktopwebm="https://www.ermo.es/videos/BSN_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/BSN_Mobile.webm"
            desktopmp4="https://www.ermo.es/videos/BSN_Desktop.mp4"
            mobilemp4="https://www.ermo.es/videos/BSN_Mobile.mp4"
            cliente="Private Label BSN Cosmetics"
            tipo="Fotografía de producto"
            ano="2023"
            descripcion={ <>
                En este proyecto de fotografía para productos cosméticos, hemos adoptado un enfoque minimalista, enfocándonos en resaltar estos envases genéricos listos para ser reetiquetados. Unas fotografías pensadas tanto para ser usadas en web, en Instagram o en contenido promocional.
               </>}
            videoproyectowebm="https://www.ermo.es/videos/BSN_Wrap.webm"
            videoproyectomp4="https://www.ermo.es/videos/BSN_Wrap.mp4"
            explicacion={ <>
                Las imágenes que hemos creado destacan la forma y textura de los envases, que, a pesar de ser genéricos, están bien pensados para ser reetiquetados por los clientes con sus propios diseños. Hemos hecho hincapié en la claridad y precisión para que los clientes puedan visualizar cómo se integrarán estos envases en sus propias líneas de productos.
                <br></br><br></br>
                El estilo de la fotografía está pensado especialmente para ser usado en redes sociales. Un código visual minimalista y sobrio pero que a su vez rezuma elegancia. 
                <br></br><br></br>
                Nuestras fotografías ayudan a simplificar el proceso de compra de los clientes, mostrando de forma efectiva cómo los productos pueden ser un añadido valioso para sus ofertas de cuidado de la piel y cosméticos. Y mostrando como podrían verse representados en fotografía los productos reetiquetados finales.
            </>}
            
            image1="https://www.ermo.es/videos/BSN_mini_1.webm"
            image2="https://www.ermo.es/videos/BSN_mini_2.webm"
        ></Proyectos>
    </BsnLayout>
      
    );
  }
  