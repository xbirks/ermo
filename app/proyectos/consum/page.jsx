import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://www.ermo.es/videos/Consum_Desktop.mp4"
            mobilemp4="https://www.ermo.es/videos/Consum_Mobile.mp4"
            desktopwebm="https://www.ermo.es/videos/Consum_Desktop.webm"
            mobilewebm="https://www.ermo.es/videos/Consum_Mobile.webm"

            cliente="Supermercados Consum"
            tipo="Motion Graphics / Animación"
            ano="2023"
            descripcion={ <>
                Proyecto de animación 2D y Motion Graphics para Supermercados Consum. Diseñamos y animamos una introducción y un faldón para todas las televisiones autonómicas que colaboran con Consum. Así lo utilizan en todas las secciones colaborativas dónde se habla a cerca de productos de temparada, de recetas y, en general, de alimentación saludable.
               </>}
            videoproyectowebm="https://www.ermo.es/videos/Consum_Wrap.webm"
            videoproyectomp4="https://www.ermo.es/videos/Consum_Wrap.mp4"
            explicacion={ <>
                
            </>}

            image1mp4="https://www.ermo.es/videos/Consum_mini_1.mp4"
            image1webm="https://www.ermo.es/videos/Consum_mini_1.webm"
            image2mp4="https://www.ermo.es/videos/Consum_mini_2.mp4"
            image2webm="https://www.ermo.es/videos/Consum_mini_2.webm"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  