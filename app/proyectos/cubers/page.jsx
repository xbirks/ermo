import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://www.ermo.es/videos/Cubers_Desktop.mp4"
            mobilemp4="https://www.ermo.es/videos/Cubers_Mobile.mp4"
            desktopwebm="https://www.ermo.es/videos/Cubers_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/Cubers_Mobile.webm"

            cliente="Ice Balls by Cubers"
            tipo="Fotografía de producto"
            ano="2023"
            descripcion={ <>
                En nuestro proyecto fotográfico para Cubers, destacamos los IceBalls premium con un estilo visual sofisticado y simple, ideal para diversas plataformas. Las imágenes resaltan la calidad y diseño único de los hielos, mostrando su potencial para elevar la estética de cualquier bebida, fortaleciendo así la imagen de marca de Cubers.
               </>}
            videoproyectowebm="https://www.ermo.es/videos/Cubers_Wrap.webm"
            videoproyectomp4="https://www.ermo.es/videos/Cubers_Wrap.mp4"
            explicacion={ <>
                Para nuestra sesión con IceBalls by Cubers hemos adoptado un estilo visual que combina la simplicidad con la sofisticación. El objetivo principal es mostrar cómo estos hielos premium pueden realzar cualquier bebida, siendo ideales para un amplio rango de usos, desde eventos exclusivos hasta el disfrute diario en el hogar.
                <br></br><br></br>
                Nuestra estrategia se centró en resaltar la calidad y el diseño esférico único de los IceBalls. Las imágenes capturadas son lo suficientemente versátiles como para ser utilizadas en una variedad de plataformas, incluyendo sitios web, redes sociales y material publicitario. Esto facilita la coherencia visual de la marca en todos los canales de comunicación.
                <br></br><br></br>
                Lo más importante durante toda la sesión ha sido realzar la textura lisa y cristalina del hielo y su forma perfectamente redonda. La selección de un fondo neutro, muy luminoso y simulando el interior de un congelador ha ayudado a destacar el producto, asegurando que los detalles sean fácilmente apreciables por el público objetivo.
                <br></br><br></br>
                El resultado de este enfoque proporciona a los potenciales clientes una visión clara de cómo estos hielos pueden ser un complemento elegante y práctico para sus bebidas. Esto no solo simplifica la decisión de compra, sino que también muestra el potencial estético del producto implementado en su uso final.
                <br></br><br></br>
                En resumen, hemos creado un conjunto de fotografías que no solo son estéticamente agradables sino también altamente funcionales, alineadas con las tendencias actuales y que refuerzan la imagen de marca de Cubers como líder en su sector.
            </>}

            image1mp4="https://www.ermo.es/videos/Cubers_mini_1.mp4"
            image1webm="https://www.ermo.es/videos/Cubers_mini_1.webm"
            image2mp4="https://www.ermo.es/videos/Cubers_mini_2.mp4"
            image2webm="https://www.ermo.es/videos/Cubers_mini_2.webm"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  