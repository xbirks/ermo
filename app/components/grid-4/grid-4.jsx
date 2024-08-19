"use client";

import React from 'react';
import Grid4Item from './grid-4-item.jsx';
import StandardButton from '../../buttons/standard-button.jsx';

// Grid4 recibe los proyectos como props.
function Grid4({ proyectos = [] }) {
  return (
    <div className="">
      <div className="title">
        <h3>Últimos proyectos</h3>
      </div>
      
      <div className="index__projects">
        {proyectos.length > 0 ? (
          proyectos.map((item, index) => (
            <Grid4Item
              key={item.ID}
              title={item.TITULO_PROYECTO}
              description={item.DESCRIPCION}
              thumbnailSrc={item.IMG_CARATULA}
              link={item.ENLACE}
              altAtribute={item.IMG_ALT}
            />
          ))
        ) : (
          <p>Cargando proyectos...</p>
        )}
      </div>

      <StandardButton
        link="/not-found"
        title="Ver más proyectos"
        style="mt-l margin-auto"
      />

    </div>
  );
}

export default Grid4;
