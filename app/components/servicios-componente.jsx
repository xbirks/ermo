"use client";

import '../proyectos/proyectos.scss';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import StandardButton from '../buttons/standard-button';
import ComboButton from '../buttons/combo-button.jsx';

function ServicioComp({title, imgsrc, altimg, descripcion, imgcomp1, altcomp1, destacado1, imgcomp2, altcomp2, destacado2, imgcomp3, altcomp3, destacado3, imgcomp4, altcomp4, destacado4, btn1link, btn1title, btn2link, btn2title}) {
  
 

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

            <ComboButton
                link1={btn1link}
                title1={btn1title}
                style1="combo__standard"
                link2={btn2link}
                title2={btn2title}
                style2="combo__blue"
            ></ComboButton>


        </div>
      </>
  );
}

export default ServicioComp;