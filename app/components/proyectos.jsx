"use client";

import '../proyectos/proyectos.scss';
import React from 'react';
import Contacto from "../buttons/contacto";
import Grid4 from "./grid-4/grid-4";
import Spacer from "../buttons/spacer";
import VideoIndex from "./video-index";
import ProySimilar from './proyecto-similar';

function Proyectos({desktop, mobile, cliente,tipo, ano, descripcion, videoproyecto, explicacion, image1, image2}) {
  


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

          <ProySimilar></ProySimilar>
          
          <Grid4 />

        </div>
      </>
  );
}

export default Proyectos;
