"use client";

import React from 'react';
import IndexIntroduction  from './IndexIntro-item.jsx';
import Link from 'next/link.js';
import { motion } from "framer-motion";
import { useEffect } from 'react';


function IndexIntro({municipio}){


  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollBy({ top: 300, behavior: 'smooth' });
    }, 6000); // 6 segundos

    return () => clearTimeout(timeout);
  }, []);




    return(
     <motion.div
        initial={{ opacity: 0, transform: "translateY(30%)" }}
        whileInView={{ opacity: 1, transform: "translateY(0%)"}}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.1}}   
     >   
    <IndexIntroduction
        IndexIntro="Estudio de diseño, web y automatización en "
        IndexIntroLocation={municipio}
        IndexDescription={ <>
          <strong>Diseño que trabaja, no que decora.</strong><br></br><br></br>
          Hacemos webs rápidas y a medida que convierten visitas en clientes, y sistemas que quitan de en medio el trabajo repetitivo de diseño.
          <br></br>
          Como Automaker: entra el brief semanal de una marca y salen todas sus piezas de campaña, maquetadas en minutos.
          <br></br><br></br>
          Estamos en {municipio}.<br></br>
         Échale un ojo a lo que ya hemos hecho <Link href="/proyectos/principal">aquí.</Link>
        </> }
      
        
    />

    </motion.div>
);
}


export default IndexIntro;