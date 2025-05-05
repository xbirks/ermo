"use client";

import React from 'react';
import IndexIntroduction  from './IndexIntro-item.jsx';
import Link from 'next/link.js';
import { motion } from "framer-motion";
import { useEffect } from 'react';


function IndexIntro({municipio}){


  useEffect(() => {
    const timeout = setTimeout(() => {
      window.scrollBy({ top: 500, behavior: 'smooth' });
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
          <strong>Diseñamos para que te elijan.</strong> No solo para hacer algo bonito.<br></br><br></br>
        
          Aquí no vas a encontrar fuegos artificiales ni palabreo barato. Vas a encontrar diseño, animación y webs que hacen su trabajo: <strong>captar atención, generar confianza y mover a la acción. </strong> 
        
          Porque tu marca no puede quedarse en “bonita”. Tiene que ser <strong>recordada, comprendida y elegida</strong>.<br></br><br></br>
        
          ¿Quieres algo diferente? Empieza por trabajar con gente que no se conforma con lo de siempre.<br></br><br></br>
        
          Estamos en {municipio}.<br></br>
          Si buscas resultados, escríbenos.<br></br><br></br>
        
          👉 Échale un ojo a lo que ya hemos hecho <Link href="/proyectos/principal">aquí.</Link>
        </> }
        
        
    />
    </motion.div>
);
}


export default IndexIntro;