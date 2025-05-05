import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function BsnPage() {
    return (
    <Inner>
    <BsnLayout>
        <Proyectos
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/v1746202728/Delgo_Desktop_jov4cm.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283411/Delgo_Mobile_1_gvo3wn.mp4"

            cliente="Delgo"
            tipo="Fotografía de arquitectura"
            ano="2023"
            descripcion={ <>
                Hemos capturado la esencia de las renovadas oficinas de Delgo, destacando tanto su diseño moderno como la singularidad de tener un ring de boxeo para el disfrute de los empleados.
               </>}
            videoproyectomp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283417/Delgo_Wrap_1_fg6sw6.mp4"
            explicacion={ <>
                En la sesión de fotos que hemos realizado para la empresa de logística Delgo, capturamos tanto la arquitectura interna como externa de sus oficinas que recientemente han sido remodeladas. El proyecto incluyó imágenes de los espacios de trabajo y de los empleados en sus tareas, mostrando la dinámica y profesionalidad que caracteriza su ambiente laboral. Nos hemos centrado en resaltar la amplitud y funcionalidad de las áreas de trabajo, destacando el diseño moderno y las mejoras arquitectónicas que definen a las oficinas de Delgo.
                <br></br><br></br>
                Una característica única de estas oficinas es un ring de boxeo, colocado de forma estratégica en el centro, pensado para que los empleados puedan liberar tensiones y resolver disputas de manera segura. Además de fotografiar este espacio tan particular para el recreo, también hemos capturado la nueva iconografía corporativa de la empresa y la señalización que facilita la orientación de visitantes y empleados dentro del edificio. Este enfoque en la señalización y la identidad visual de Delgo es fundamental para presentar un espacio que no solo es funcional, sino que además refleja los valores y la identidad de la empresa.
            </>}

            image1mp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283416/Delgo_mini_1_1_doocvl.mp4"
            image2mp4="https://res.cloudinary.com/ermostudio/video/upload/v1746283416/Delgo_mini_2_1_akdpoj.mp4"
        ></Proyectos>
    </BsnLayout>
    </Inner>
    );
  }
  