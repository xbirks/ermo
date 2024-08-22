"use client";

import '../proyectos/proyectos.scss';
import React, { useEffect, useState } from 'react';
import Contacto from "../buttons/contacto";
import Grid4 from "./grid-4/grid-4";
import Spacer from "../buttons/spacer";
import VideoIndex from "./video-index";

function Proyectos({desktop, mobile, cliente,tipo, ano, descripcion, videoproyecto, explicacion, image1, image2}) {
  
  // Inicializa el estado 'proyectos'
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    async function fetchProyectos() {
      try {
        const proyectosData = await import('../proyectos.json');
        const proyectos = proyectosData.proyectos.slice(0, 4);
        setProyectos(proyectos);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      }
    }
  
    fetchProyectos();
  }, []);

  return (
      <>
        <VideoIndex
          desktop={desktop}
          mobile={mobile}
        />

        <div className="master__body">
          <div className="index__introduction">
            <div className="index__introduction-div">
              <h1>{cliente}</h1>
              <p className="proyectos__tipo">{tipo}</p>
              <p className="proyectos__ano">{ano}</p>
            </div>
            <div className="index__introduction-div">
              <p>{descripcion}</p>
            </div>
          </div>

          <div className="proyectos__video">
            <video
              className="ermo"
              autoPlay
              loop
              muted
              playsInline
              type="video/mp4"
              src={videoproyecto}
            />
          </div>

          <div className="proyectos__explicacion">
            <p>{explicacion}</p>
          </div>

          <div className="proyectos__vid">
            <div className="proyectos__mini"><figure>
              <video
                className="proyectos__video-mini"
                src={image1}
                width={500}
                height={500}
                autoPlay loop muted playsInline type="video/mp4"
              >
                Tu navegador no soporta la etiqueta de video.
              </video>
            </figure></div>

            <div className="proyectos__mini"><figure>
              <video
                className="proyectos__video-mini"
                src={image2}
                width={500}
                height={500}
                autoPlay loop muted playsInline type="video/mp4"
              >
                Tu navegador no soporta la etiqueta de video.
              </video>
            </figure></div>
          </div>

          <h2 className="proyectos__similar">¿Necesitas hacer un proyecto similar?</h2>
          <Contacto />
          <Spacer className="spacer-xl" />
          
          <Grid4 proyectos={proyectos} />

        </div>
      </>
  );
}

export default Proyectos;
