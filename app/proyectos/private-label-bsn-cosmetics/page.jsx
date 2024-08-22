import Proyectos from '../../components/proyectos.jsx';
import BsnLayout from './layout.jsx';



export default function BsnPage() {
    return (

        <BsnLayout>
        <Proyectos
            desktop="https://www.ermo.es/videos/BSN_Desktop.mp4"
            mobile="https://www.ermo.es/videos/BSN_Mobile.mp4"
            cliente="Private Label BSN Cosmetics"
            tipo="Fotografía de producto"
            ano="2023"
            descripcion={ <>
                Para el proyecto de comunicación de Empanadas Malvón, nos centramos en destacar la autenticidad y sabor único de sus empanadas a través de diversas plataformas de medios. Implementamos una estrategia integrada que incluyó redes sociales, publicidad en línea y colaboraciones con influencers locales para aumentar la visibilidad y atraer a una audiencia más amplia. Nuestro contenido visual, acompañado de narrativas atractivas, resaltaba la calidad y la variedad de sus productos, conectando emocionalmente con los consumidores y promoviendo la experiencia culinaria que ofrece Empanadas Malvón.
               </>}
            videoproyecto="https://www.ermo.es/videos/BSN_Wrap.mp4"
            explicacion={ <>
                Para el proyecto de comunicación de Empanadas Malvón, nos centramos en destacar la autenticidad y sabor único de sus empanadas a través de diversas plataformas de medios. Implementamos una estrategia integrada que incluyó redes sociales, publicidad en línea y colaboraciones con influencers locales para aumentar la visibilidad y atraer a una audiencia más amplia. Nuestro contenido visual, acompañado de narrativas atractivas, resaltaba la calidad y la variedad de sus productos, conectando emocionalmente con los consumidores y promoviendo la experiencia culinaria que ofrece Empanadas Malvón.
               </>}
            image1="https://www.ermo.es/videos/BSN_mini_1.mp4"
            image2="https://www.ermo.es/videos/BSN_mini_2.mp4"
        ></Proyectos>
        </BsnLayout>
      
    );
  }
  