"use client";

import '../proyectos/proyectos.scss';
import React, { useEffect, useState } from 'react';
import VideoIndex from "./video-index";

function Servicios({desktopwebm, mobilewebm, desktopmp4, mobilemp4, servicio, explicacion}) {
  
 

  return (
      <>
        <VideoIndex
          desktopwebm={desktopwebm}
          mobilewebm={mobilewebm}
          desktopmp4={desktopmp4}
          mobilemp4={mobilemp4}
        />

        <div className="master__body">
          <div className="index__introduction service__introduction">
            <div className="index__introduction-div">
              <h1>{servicio}</h1>
            </div>
          </div>



          <div className="servicios__explicacion">
            <p>{explicacion}</p>
          </div>


        </div>
      </>
  );
}

export default Servicios;
