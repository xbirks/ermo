import Image from "next/image";
import Link from 'next/link';

import Proyectos from '../../components/proyectos.jsx';



export default function HomePage() {
    return (
      <div>

        <Proyectos
            desktop="https://soyandres.es/ermo/video/ermo-proyectos-2024-header-desktop.mp4"
            mobile="https://soyandres.es/ermo/video/ermo-proyectos-2024-header-desktop.mp4"
            cliente="Private Label BSN Cosmetics"
            tipo="Fotografía de producto"
            ano="2023"
            descripcion={ <>
                Para el proyecto de comunicación de Empanadas Malvón, nos centramos en destacar la autenticidad y sabor único de sus empanadas a través de diversas plataformas de medios. Implementamos una estrategia integrada que incluyó redes sociales, publicidad en línea y colaboraciones con influencers locales para aumentar la visibilidad y atraer a una audiencia más amplia. Nuestro contenido visual, acompañado de narrativas atractivas, resaltaba la calidad y la variedad de sus productos, conectando emocionalmente con los consumidores y promoviendo la experiencia culinaria que ofrece Empanadas Malvón.
               </>}
            videoproyecto="https://soyandres.es/ermo/video/ermo-proyectos-2024-header-desktop.mp4"
            explicacion={ <>
                Para el proyecto de comunicación de Empanadas Malvón, nos centramos en destacar la autenticidad y sabor único de sus empanadas a través de diversas plataformas de medios. Implementamos una estrategia integrada que incluyó redes sociales, publicidad en línea y colaboraciones con influencers locales para aumentar la visibilidad y atraer a una audiencia más amplia. Nuestro contenido visual, acompañado de narrativas atractivas, resaltaba la calidad y la variedad de sus productos, conectando emocionalmente con los consumidores y promoviendo la experiencia culinaria que ofrece Empanadas Malvón.
               </>}
            image1="https://soyandres.es/ermo/video/ermo-proyectos-2024-header-desktop.mp4"
            image2="https://soyandres.es/ermo/video/ermo-proyectos-2024-header-desktop.mp4"
        ></Proyectos>
      

      </div>
      
    );
  }
  