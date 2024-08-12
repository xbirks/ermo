"use client";

import React, { useState, useEffect } from 'react';
import Grid4Item from './grid-4-item.jsx';
import StandardButton from '../../buttons/standard-button.jsx';
import proyectosData from '../../proyectos.json'; // Importa el archivo JSON

function Grid4() {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    // Simulamos una carga asíncrona de datos
    const fetchData = () => {
      // Aquí podrías filtrar o limitar los proyectos según tu necesidad
      const proyectos = proyectosData.proyectos.slice(0, 4);
      setDatos(proyectos);
    };

    // Simulamos un tiempo de carga para mostrar el mensaje de carga
    const timeout = setTimeout(() => {
      fetchData();
    }, 1000); // Simula 1 segundo de carga

    return () => clearTimeout(timeout); // Limpiamos el timeout si el componente se desmonta
  }, []);

  return (
    <div className="">
      <div className="title">
        <h3>Últimos proyectos</h3>
      </div>
      
      <div className="index__projects">
        {datos.length > 0 ? (
          datos.map((item, index) => (
            <Grid4Item
              key={index}
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
        title="Más info"
        style="mt-l margin-auto"
      />

    </div>
  );
}

export default Grid4;
