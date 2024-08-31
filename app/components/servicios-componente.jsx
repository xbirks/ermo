"use client";

import '../proyectos/proyectos.scss';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

function ServicioComp({title, imgsrc, altimg, descripcion, imgcomp1, altcomp1, destacado1, imgcomp2, altcomp2, destacado2, imgcomp3, altcomp3, destacado3, imgcomp4, altcomp4, destacado4}) {
  
 

  return (
      <>

        <div className="servcomp__master">

            <div className="servcomp__principal">
                <h2>{title}</h2>
                <div className="servcomp__img">
                    <Image src={imgsrc} alt={altimg} width={400} height={100} loading="lazy"></Image>
                </div>
            </div>

            <div className="servcomp__secundario">
                <p>{descripcion}</p>
                <div className="servcomp__destacado">

                    <div className="servcomp__component">
                        <Image src={imgcomp1} alt={altcomp1} width={100} height={30} loading="lazy"></Image>
                        <h3>{destacado1}</h3>
                    </div>

                    <div className="servcomp__component">
                        <Image src={imgcomp2} alt={altcomp2} width={100} height={30} loading="lazy"></Image>
                        <h3>{destacado2}</h3>
                    </div>

                    <div className="servcomp__component">
                        <Image src={imgcomp3} alt={altcomp3} width={100} height={30} loading="lazy"></Image>
                        <h3>{destacado3}</h3>
                    </div>

                    <div className="servcomp__component">
                        <Image src={imgcomp4} alt={altcomp4} width={100} height={30} loading="lazy"></Image>
                        <h3>{destacado4}</h3>
                    </div>

                </div>
            </div>



        </div>
      </>
  );
}

export default ServicioComp;