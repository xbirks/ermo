"use client";

import '../proyectos/proyectos.scss';
import React from 'react';
import Grid4 from "./grid-4/grid-4";
import VideoIndex from "./video-index";
import ProySimilar from './proyecto-similar';
import { motion } from "framer-motion";

function Proyectos({desktopwebm, mobilewebm, desktopmp4, mobilemp4, cliente,tipo, ano, descripcion, videoproyectowebm, videoproyectomp4, explicacion, image1webm, image2webm, image1mp4, image2mp4}) {
  


  return (
      <>
        <VideoIndex
          desktopwebm={desktopwebm}
          mobilewebm={mobilewebm}
          desktopmp4={desktopmp4}
          mobilemp4={mobilemp4}
        />

        <div className="master__body">
          <div className="index__introduction">
            <div className="index__introduction-div">
            <motion.div
                initial={{ opacity: 0, transform: "translateY(30%)" }}
                whileInView={{ opacity: 1, transform: "translateY(0%)"}}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.1}}  
            >
              <h1>{cliente}</h1>
            </motion.div>
              <p className="proyectos__tipo">{tipo}</p>
              <p className="proyectos__ano">{ano}</p>
            </div>
            <div className="index__introduction-div">
              <p>{descripcion}</p>
            </div>
          </div>

          <div className="proyectos__video">
            <video className="ermo" autoPlay loop muted playsInline>
            <source src={videoproyectomp4} type="video/mp4" />
              <source src={videoproyectowebm} type="video/webm" />
              Tu navegador no soporta la etiqueta de video.
            </video>
          </div>


          <div className="proyectos__explicacion">
            <p>{explicacion}</p>
          </div>

          <div className="proyectos__vid">
            <div className="proyectos__mini"><figure>
              <video
                className="proyectos__video-mini"
                width={500}
                height={500}
                autoPlay loop muted playsInline 
              >
                <source src={image1mp4} type="video/mp4"></source>
                <source src={image1webm} type="video/webm"></source>
                Tu navegador no soporta la etiqueta de video.
              </video>
            </figure></div>

            <div className="proyectos__mini"><figure>
              <video
                className="proyectos__video-mini"
                width={500}
                height={500}
                autoPlay loop muted playsInline
              >
                <source src={image2mp4} type="video/mp4"></source>
                <source src={image2webm} type="video/webm"></source>
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
