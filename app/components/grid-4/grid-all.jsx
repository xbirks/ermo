"use client";

import React from 'react';
import Grid4Item from './grid-4-item.jsx';
import StandardButton from '../../buttons/standard-button.jsx';

// Grid4 recibe los proyectos como props.
function GridAll() {
  return (
    <div className="">
      <div className="title">
        <h3>Nuestro portfolio</h3>
      </div>
      


    <div className="index__projects">
  
          <Grid4Item
              title="Private Label BSN Cosmetics"
              description="Creamos fotografías de producto minimalistas y elegantes, que resaltan la calidad y diseño de sus cosméticos. Con nuestras fotos consiguieron fortalecer su identidad de marca, ofreciendo una visualización atractiva y profesional a sus clientes."
              thumbnailSrc="https://ermo.es/videos/01_project_ERMO.webm"
              link="/proyectos/private-label-bsn-cosmetics"
              altAtribute="Fotografía minimalista de productos cosméticos de Private Label sobre fondo neutro, destacando su diseño elegante y calidad superior."
            />

          <Grid4Item
              title="Consultoría Sanoguera"
              description="Desarrollamos un nuevo sitio web y llevamos a cabo un completo rebranding para posicionar la firma como una consultoría líder en el sector primario Valenciano. Esta renovación la reforzamos también con una sesión de fotografía corprorativa."
              thumbnailSrc="https://ermo.es/videos/02_project_ERMO.webm"
              link="/proyectos/sanoguera"
              altAtribute="Sitio web de Sanoguera, mostrando un diseño moderno y funcional que refleja su enfoque en consultoría especializada. También su nueva identidad corporativa."
            />
            
          <Grid4Item
              title="Consum Supermercados"
              description="Animaciones en 2D para supermercados Consum, diseñadas para resaltar sus valores de sostenibilidad y comunidad en campañas de redes sociales y televisión. Este proyecto fue realizado en colaboración con la agencia de publicidad WAY."
              thumbnailSrc="https://ermo.es/videos/03_project_ERMO.webm"
              link="/proyectos/consum"
              altAtribute="Animación en 2D para Consum, destacando la frescura y sostenibilidad de sus productos en una campaña de redes sociales."
            />
                        
          <Grid4Item
              title="Ice Balls - Cubers"
              description="Fotografía de producto y lifestyle para los hielos de Cubers. Destacando la belleza sin adulterar de su hielo y el diseño único de sus Ice Balls. También creamos contenido animado para sus plataformas de redes sociales, con las que aumentamos su presencia digital."
              thumbnailSrc="https://ermo.es/videos/04_project_ERMO.webm"
              link="/proyectos/cubers"
              altAtribute="Imagen vibrante de los cubitos de hielo premium de Cubers, mostrando su perfecta claridad y forma única."
            />

<Grid4Item
              title="Delibreads"
              description="Sesión de fotografía de producto destacando las tortillas de trigo que venden en Mercadona, junto con imágenes gastronómicas que muestran su versatilidad en variadas recetas. Además, produjimos videos cortos para IG Reels y TikTok."
              thumbnailSrc="https://ermo.es/videos/05_project_ERMO.webm"
              link="/proyectos/delibreads"
              altAtribute="Animación en 2D para Consum, destacando la frescura y sostenibilidad de sus productos en una campaña de redes sociales."
            />
                        
            <Grid4Item
              title="Delgo"
              description="Fotografía de arquitectura interior y exterior de las nuevas oficinas de Delgo (empresa de Logística), enfocada en destacar la modernización y la funcionalidad de sus espacios."
              thumbnailSrc="https://ermo.es/videos/06_project_ERMO.webm"
              link="/proyectos/delgo"
              altAtribute="Imagen vibrante de los cubitos de hielo premium de Cubers, mostrando su perfecta claridad y forma única."
            />

            <Grid4Item
              title="Helados Estiu"
              description="Para Wao Mochi (Helados Estiu), hemos diseñado una exclusiva serie de fotografías gastronómicas que se distinguen por sus combinaciones de colores llamativas y composiciones minimalistas. Se resalta la textura cremosa y los deliciosos sabores tropicales de los mochis."
              thumbnailSrc="https://ermo.es/videos/07_project_ERMO.webm"
              link="/proyectos/estiu"
              altAtribute="Imagen vibrante de los cubitos de hielo premium de Cubers, mostrando su perfecta claridad y forma única."
            />
        
        <StandardButton
        link="https://wa.me/message/HJYSEK4RPLOSI1"
        title="Pedir presupuesto"
        style="mt-l margin-auto"
      />

    </div>

    </div>


  );
}

export default GridAll;
