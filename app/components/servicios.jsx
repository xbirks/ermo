"use client";

import '../proyectos/proyectos.scss';
import React, { useEffect, useState } from 'react';
import VideoIndex from "./video-index";
import Image from 'next/image';
import ServicioComp from './servicios-componente';

function Servicios({desktopwebm, mobilewebm, desktopmp4, mobilemp4, servicio, explicacion, imgcomp1, altcomp1, destacado1, imgcomp2, altcomp2, destacado2, imgcomp3, altcomp3, destacado3, imgcomp4, altcomp4, destacado4}) {
  
 

  return (
      <>
        <VideoIndex
          desktopmp4={desktopmp4}
          mobilemp4={mobilemp4}
          desktopwebm={desktopwebm}
          mobilewebm={mobilewebm}
        />

        <div className="master__body">
          <div className="servcomp__master">
          <div className="index__introduction service__introduction">
            <div className="index__introduction-div">
              <h1>{servicio}</h1>
            </div>
          </div>


          <div className="servcomp__secundario">
                <p>{explicacion}</p>
                <div className="servcomp__destacado">

                    <div className="servcomp__component">
                        <div className="servcomp__img-container"><Image src={imgcomp1} alt={altcomp1} width={100} height={30} loading="lazy"></Image></div>
                        <h3>{destacado1}</h3>
                    </div>

                    <div className="servcomp__component">
                        <div className="servcomp__img-container"><Image src={imgcomp2} alt={altcomp2} width={100} height={30} loading="lazy"></Image></div>
                        <h3>{destacado2}</h3>
                    </div>

                    <div className="servcomp__component">
                        <div className="servcomp__img-container"><Image src={imgcomp3} alt={altcomp3} width={100} height={30} loading="lazy"></Image></div>
                        <h3>{destacado3}</h3>
                    </div>

                    <div className="servcomp__component">
                        <div className="servcomp__img-container"><Image src={imgcomp4} alt={altcomp4} width={100} height={30} loading="lazy"></Image></div>
                        <h3>{destacado4}</h3>
                    </div>

                </div>
            </div>

          </div>
        </div>
      </>
  );
}

export default Servicios;
