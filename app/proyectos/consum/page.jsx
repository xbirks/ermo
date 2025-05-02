import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202766/Consum_Desktop_zzsx7i.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202765/Consum_Mobile_kvyjao.mp4"

            cliente="Consum Cooperativa"
            tipo="Motion Graphics / Animación"
            ano="2023"
            descripcion={ <>
                Proyecto de animación 2D y Motion Graphics para Supermercados Consum. Diseñamos y animamos una introducción y un faldón para todas las televisiones autonómicas que colaboran con Consum. Así lo utilizan en todas las secciones colaborativas dónde se habla a cerca de productos de temparada, de recetas y, en general, de alimentación saludable.
               </>}
            videoproyectomp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202774/Consum_Wrap_saajc9.mp4"
            explicacion={ <>
                
            </>}

            image1mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202760/Consum_mini_1_oskkqp.mp4"
            image2mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746202751/Consum_mini_2_ruijte.mp4"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  