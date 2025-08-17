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
        IndexIntro="Estudio de animación, diseño y web en "
        IndexIntroLocation={municipio}
        IndexDescription={ <>
          <strong>Hacemos diseño con propósito.</strong><br></br><br></br>
          Creamos webs y animaciones que trabajan por ti: captan la atención, transmiten confianza y convierten visitas en clientes.
          <br></br>
          Lo estético importa, pero lo esencial es que tu marca sea reconocida y elegida.
          <br></br><br></br>
          Estamos en {municipio}.<br></br>
         Échale un ojo a lo que ya hemos hecho <Link href="/proyectos/principal">aquí.</Link>
        </> }
      
        
    />

    </motion.div>
);
}


export default IndexIntro;