import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202726/BSN_Desktop_1_kbvdfp.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202727/BSN_Mobile_1_q7cyiu.mp4"


            cliente="Private Label BSN Cosmetics"
            tipo="Fotografía de producto"
            ano="2023"
            descripcion={ <>
                En este proyecto de fotografía para BSN Cosmetics, nos enfocamos en capturar la esencia de sus envases genéricos de cosméticos con un estilo minimalista y elegante. El objetivo era crear imágenes versátiles que pudieran utilizarse en diversos medios, desde sitios web hasta redes sociales y material promocional.
                <br></br><br></br>
                Nuestro enfoque resalta la forma y textura de los envases, permitiendo a los clientes visualizar cómo estos productos pueden integrarse en sus propias líneas cosméticas. El resultado es una serie de fotografías que no solo simplifican el proceso de compra, sino que también muestran el potencial de los productos una vez reetiquetados.
               </>}

            videoproyectomp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202772/BSN_Wrap_siqzqv.mp4"
            explicacion={ <>
                En este proyecto de fotografía para productos cosméticos, hemos adoptado un enfoque minimalista, enfocándonos en resaltar estos envases genéricos listos para ser reetiquetados. Unas fotografías pensadas tanto para ser usadas en web, en Instagram o en contenido promocional.
                <br></br><br></br>
                Las imágenes que hemos creado destacan la forma y textura de los envases, que, a pesar de ser genéricos, están bien pensados para ser reetiquetados por los clientes con sus propios diseños. Hemos hecho hincapié en la claridad y precisión para que los clientes puedan visualizar cómo se integrarán estos envases en sus propias líneas de productos.
                <br></br><br></br>
                El estilo de la fotografía está pensado especialmente para ser usado en redes sociales. Un código visual minimalista y sobrio pero que a su vez rezuma elegancia.
                <br></br><br></br>
                Nuestras fotografías ayudan a simplificar el proceso de compra de los clientes, mostrando de forma efectiva cómo los productos pueden ser un añadido valioso para sus ofertas de cuidado de la piel y cosméticos. Y mostrando como podrían verse representados en fotografía los productos reetiquetados finales.
                <br></br><br></br>
                Este enfoque fotográfico no solo resalta la calidad y versatilidad de los envases de BSN Cosmetics, sino que también proporciona a los clientes una visión clara de cómo estos productos pueden adaptarse a sus propias marcas. La combinación de minimalismo y elegancia en las imágenes crea un atractivo visual que se alinea perfectamente con las tendencias actuales en el mercado de cosméticos y cuidado de la piel.
            </>}

            image1mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202732/BSN_mini_1_yhb3fq.mp4"
            image2mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202751/BSN_mini_2_km1mdw.mp4"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  