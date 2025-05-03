import Proyectos from '../../components/proyectos.jsx';
import SanogueraLayout from './layout.jsx';
import Inner from '@/app/components/Transiciones/inner.jsx';


export default function SanogueraPage() {
    return (
    <Inner>
    <SanogueraLayout>
        <Proyectos
            desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746204066/SANOGUERA_Desktop_1_hm5oqz.mp4"
            mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283349/SANOGUERA_Mobile_ifufvy.mp4"
            cliente="Sanoguera Consultoría"
            tipo="Branding | Diseño web | Programación web | Fotografía corporativa"
            ano="2023 | 2024"
            descripcion={ <>
                Cuando una empresa de asesoría decide dar el salto a la consultoría, necesita una transformación integral de su imagen corporativa para reflejar esta nueva etapa.
                <br></br><br></br>
                Nuestro equipo llevó a cabo un rebranding completo, abarcando desde el logotipo y la paleta de colores hasta la página web y la presencia en redes sociales. El resultado fue una imagen de marca totalmente renovada, moderna y atractiva, que posiciona a la empresa como un referente innovador en la consultoría del sector primario.
               </>}
            videoproyectomp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283349/SANOGUERA_Wrap_1_a6qbzw.mp4"
            explicacion={ <>
                Llevamos a cabo una transformación integral de la imagen corporativa, impulsada por la evolución estratégica de la empresa de Asesoría a Consultoría. Nuestro equipo ejecutó un rebranding completo, reinventando la identidad visual desde sus cimientos.
                <br></br><br></br>
                Comenzamos renovando el logotipo y la paleta de colores, infundiendo modernidad y profesionalismo en cada elemento. Paralelamente, rediseñamos por completo la página web, creando una plataforma digital vanguardista que no solo cautiva visualmente, sino que también refleja a la perfección la nueva dirección de la empresa.
                <br></br><br></br>
                Este proceso de renovación 360° abarcó todos los aspectos de la marca, desde la papelería corporativa hasta la presencia en redes sociales, garantizando una coherencia impecable en todos los puntos de contacto con el cliente.
                <br></br><br></br>
                El resultado: una imagen de marca totalmente renovada, moderna y atractiva, que posiciona a la empresa como un referente innovador en el competitivo mundo de la consultoría en el sector primario.
                <br></br><br></br>
                La nueva identidad visual no solo refleja el cambio de dirección de la empresa, sino que también comunica confianza, experiencia y una comprensión profunda de las necesidades del sector primario. Cada elemento, desde el logotipo hasta la tipografía, ha sido cuidadosamente seleccionado para transmitir profesionalismo y un enfoque innovador en la resolución de problemas.
                <br></br><br></br>
                Con esta renovación, la empresa no solo ha actualizado su imagen, sino que ha sentado las bases para un crecimiento sostenido en su nuevo papel como consultora líder en el sector primario. La coherencia visual y el mensaje claro permiten a los clientes reconocer instantáneamente la marca y asociarla con servicios de consultoría de alta calidad y especializados.
            </>}
            
                image1mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283347/SANOGUERA_mini_2_1_vafygl.mp4"
                image2mp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283349/SANOGUERA_mini_3_1_m3nqsc.mp4"
        ></Proyectos>
    </SanogueraLayout>
    </Inner>
    );
  }
  