import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746285477/Delibreads_Desktop_1_yi7kqz.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283431/Delibreads_Mobile_1_jts2av.mp4"

            cliente="Delibreads"
            tipo="Fotografía comercial"
            ano="2022"
            descripcion={ <>
                Realizamos una producción fotográfica para Delibreads, destacando la <strong>calidad y versatilidad de sus tortillas</strong> con imágenes y videos diseñados para captar la atención en redes sociales, mostrando todo tipo de recetas sobre su producto.
               </>}
            videoproyectomp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283418/Delibreads_Wrap_1_crdkym.mp4"
            explicacion={ <>
                Llevamos a cabo producción fotográfica para Delibreads, el proveedor de tortillas de trigo de <strong>Mercadona</strong>, para destacar la calidad y el atractivo visual de las tortillas de trigo, las piadinas y sus versiones integrales.
                <br></br><br></br>
                Hicimos uso de elementos de fotografía lifestyle, creando ambientes que reflejan un estilo de vida moderno y activo. Además, creamos videos cortos, perfectos para captar la atención en Reels de Instagram y TikTok, diseñados para atraer un público joven y que piensa en alimentación saludable.
                <br></br><br></br>
                Durante la sesión, se prepararon y fotografiaron diversas recetas, demostrando cómo las tortillas pueden servir como base para creaciones que van desde lo tradicional Tex-Mex hasta opciones veganas y dulces. Sin embargo, el foco siempre estuvo en capturar la esencia y la calidad de las tortillas, posicionándolas como el lienzo ideal para cualquier tipo de plato.
            </>}

            image1mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283420/Delibreads_mini_1_1_fmz5sy.mp4"
            image2mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283418/Delibreads_mini_2_1_1_lyrlhs.mp4"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  