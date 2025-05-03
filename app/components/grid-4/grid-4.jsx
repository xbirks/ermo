"use client";

import React from 'react';
import Grid4Item from './grid-4-item.jsx';
import StandardButton from '../../buttons/standard-button.jsx';

// Grid4 recibe los proyectos como props.
function Grid4() {
  return (
    <div className="">
      <div className="title">
        <h3>Últimos proyectos</h3>
      </div>
      


    <div className="index__projects">
  
          <Grid4Item
              title="Private Label BSN Cosmetics"
              description="Creamos fotografías de producto minimalistas y elegantes, que resaltan la calidad y diseño de sus cosméticos. Con nuestras fotos consiguieron fortalecer su identidad de marca, ofreciendo una visualización atractiva y profesional a sus clientes."
              thumbnailSrc="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283406/01_project_ERMO_1_phlphx.mp4"
              link="/proyectos/private-label-bsn-cosmetics"
              altAtribute="Fotografía minimalista de productos cosméticos de Private Label sobre fondo neutro, destacando su diseño elegante y calidad superior."
            />

          <Grid4Item
              title="Consultoría Sanoguera"
              description="Desarrollamos un nuevo sitio web y llevamos a cabo un completo rebranding para posicionar la firma como una consultoría líder en el sector primario Valenciano. Esta renovación la reforzamos también con una sesión de fotografía corprorativa."
              thumbnailSrc="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283413/02_project_ERMO_1_ctmujb.mp4"
              link="/proyectos/sanoguera"
              altAtribute="Sitio web de Sanoguera, mostrando un diseño moderno y funcional que refleja su enfoque en consultoría especializada. También su nueva identidad corporativa."
            />
            
          <Grid4Item
              title="Consum Supermercados"
              description="Animaciones en 2D para supermercados Consum, diseñadas para resaltar sus valores de sostenibilidad y comunidad en campañas de redes sociales y televisión. Este proyecto fue realizado en colaboración con la agencia de publicidad WAY."
              thumbnailSrc="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283407/03_project_ERMO_1_tylabc.mp4"
              link="/proyectos/consum"
              altAtribute="Animación en 2D para Consum, destacando la frescura y sostenibilidad de sus productos en una campaña de redes sociales."
            />
                        
          <Grid4Item
              title="Ice Balls - Cubers"
              description="Fotografía de producto y lifestyle para los hielos de Cubers. Destacando la belleza sin adulterar de su hielo y el diseño único de sus Ice Balls. También creamos contenido animado para sus plataformas de redes sociales, con las que aumentamos su presencia digital."
              thumbnailSrc="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1746283413/04_project_ERMO_1_wzhsdq.mp4"
              link="/proyectos/cubers"
              altAtribute="Imagen vibrante de los cubitos de hielo premium de Cubers, mostrando su perfecta claridad y forma única."
            />
        
        <StandardButton
        link="/proyectos/principal"
        title="Ver más proyectos"
        style="mt-l margin-auto"
      />

    </div>

    </div>


  );
}

export default Grid4;
