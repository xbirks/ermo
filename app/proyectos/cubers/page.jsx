import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202752/Cubers_Desktop_c6dsmc.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283415/Cubers_Mobile_1_sr9idr.mp4"

            cliente="Ice Balls by Cubers"
            tipo="Fotografía de producto"
            ano="2023"
            descripcion={ <>
                En nuestro proyecto fotográfico para Cubers, destacamos los IceBalls premium con un <strong>estilo visual sofisticado y simple</strong>, ideal para diversas plataformas. Las imágenes resaltan la calidad y diseño único de los hielos, mostrando su potencial para elevar la estética de cualquier bebida, fortaleciendo así la imagen de marca de Cubers.
               </>}
            videoproyectomp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283419/Cubers_Wrap_1_ntnfy8.mp4"
            explicacion={ <>
                Para nuestra sesión con <strong>IceBalls by Cubers</strong> hemos adoptado un estilo visual que combina la simplicidad con la sofisticación. El objetivo principal es mostrar cómo estos hielos premium pueden realzar cualquier bebida, siendo ideales para un amplio rango de usos, desde eventos exclusivos hasta el disfrute diario en el hogar.
                <br></br><br></br>
                Nuestra estrategia se centró en <strong>resaltar la calidad y el diseño esférico</strong> único de los IceBalls. Las imágenes capturadas son lo suficientemente versátiles como para ser utilizadas en una variedad de plataformas, incluyendo sitios web, redes sociales y material publicitario. Esto facilita la coherencia visual de la marca en todos los canales de comunicación.
                <br></br><br></br>
                Lo más importante durante toda la sesión ha sido realzar la textura lisa y cristalina del hielo y su forma perfectamente redonda. La selección de un fondo neutro, muy luminoso y simulando el interior de un congelador ha ayudado a destacar el producto, asegurando que los detalles sean fácilmente apreciables por el público objetivo.
                <br></br><br></br>
                El resultado de este enfoque proporciona a los potenciales clientes una visión clara de cómo estos hielos pueden ser un complemento elegante y práctico para sus bebidas. Esto no solo simplifica la decisión de compra, sino que también <strong>muestra el potencial estético del producto</strong> implementado en su uso final.
                <br></br><br></br>
                En resumen, hemos creado un conjunto de fotografías que no solo son estéticamente agradables sino también altamente funcionales, alineadas con las tendencias actuales y que refuerzan la imagen de marca de Cubers como líder en su sector.
            </>}

            image1mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283415/Cubers_mini_1_1_c4oalj.mp4"
            image2mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746284441/Cubers_mini_2_1_l6ita2.mp4"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  