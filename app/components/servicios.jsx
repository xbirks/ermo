"use client";

import '../proyectos/proyectos.scss';
import React, { useEffect, useState } from 'react';
import Contacto from "../buttons/contacto";
import Grid4 from "./grid-4/grid-4";
import Spacer from "../buttons/spacer";
import VideoIndex from "./video-index";

function Servicios({desktop, mobile, servicio, explicacion}) {
  
 

  return (
      <>
        <VideoIndex
          desktop={desktop}
          mobile={mobile}
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
