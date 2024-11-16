import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://www.ermo.es/videos/Delibreads_Desktop.mp4"
            mobilemp4="https://www.ermo.es/videos/Delibreads_Mobile.mp4"
            desktopwebm="https://www.ermo.es/videos/Delibreads_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/Delibreads_Mobile.webm"

            cliente="Delibreads"
            tipo="Fotografía comercial"
            ano="2022"
            descripcion={ <>
                Realizamos una producción fotográfica para Delibreads, destacando la calidad y versatilidad de sus tortillas con imágenes y videos diseñados para captar la atención en redes sociales, mostrando todo tipo de recetas sobre su producto.
               </>}
            videoproyectowebm="https://www.ermo.es/videos/Delibreads_Wrap.webm"
            videoproyectomp4="https://www.ermo.es/videos/Delibreads_Wrap.mp4"
            explicacion={ <>
                Llevamos a cabo producción fotográfica para Delibreads, el proveedor de tortillas de trigo de Mercadona, para destacar la calidad y el atractivo visual de las tortillas de trigo, las piadinas y sus versiones integrales.
                <br></br><br></br>
                Hicimos uso de elementos de fotografía lifestyle, creando ambientes que reflejan un estilo de vida moderno y activo. Además, creamos videos cortos, perfectos para captar la atención en Reels de Instagram y TikTok, diseñados para atraer un público joven y que piensa en alimentación saludable.
                <br></br><br></br>
                Durante la sesión, se prepararon y fotografiaron diversas recetas, demostrando cómo las tortillas pueden servir como base para creaciones que van desde lo tradicional Tex-Mex hasta opciones veganas y dulces. Sin embargo, el foco siempre estuvo en capturar la esencia y la calidad de las tortillas, posicionándolas como el lienzo ideal para cualquier tipo de plato.
            </>}

            image1mp4="https://www.ermo.es/videos/Delibreads_mini_1.mp4"
            image1webm="https://www.ermo.es/videos/Delibreads_mini_1.webm"
            image2mp4="https://www.ermo.es/videos/Delibreads_mini_2.mp4"
            image2webm="https://www.ermo.es/videos/Delibreads_mini_2.webm"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  