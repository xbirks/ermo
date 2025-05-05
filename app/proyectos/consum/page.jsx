import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/v1746285476/Consum_Desktop_1_qtmqak.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283409/Consum_Mobile_1_xr3phj.mp4"

            cliente="Consum Cooperativa"
            tipo="Motion Graphics / Animación"
            ano="2023"
            descripcion={ <>
                Proyecto de animación 2D y Motion Graphics para Supermercados Consum. Diseñamos y animamos una introducción y un faldón para todas las televisiones autonómicas que colaboran con Consum. Así lo utilizan en todas las secciones colaborativas dónde se habla a cerca de productos de temparada, de recetas y, en general, de alimentación saludable.
               </>}
            videoproyectomp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283414/Consum_Wrap_1_o4ffp0.mp4"
            explicacion={ <>
                
            </>}

            image1mp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283410/Consum_mini_1_1_mp4ogd.mp4"
            image2mp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283415/Consum_mini_2_1_f8iwem.mp4"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  