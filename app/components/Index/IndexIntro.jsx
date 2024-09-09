"use client";

import React from 'react';
import IndexIntroduction  from './IndexIntro-item.jsx';
import { motion } from "framer-motion";


function IndexIntro({municipio}){

    return(
     <motion.div
        initial={{ opacity: 0, transform: "translateY(30%)" }}
        whileInView={{ opacity: 1, transform: "translateY(0%)"}}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.1}}   
     >   
    <IndexIntroduction
        IndexIntro="Estudio de animación, diseño, web, y fotografía en "
        IndexIntroLocation={municipio}
        IndexDescription={ <>
           <strong>No somos solo diseñadores;</strong> nos vemos como narradores visuales. Ya sea creando una identidad que deje huella, unas <strong>fotografías</strong> minimlístas e impactantes o diseñando experiencias visuales y <strong>páginas web</strong> que enganchen, nos tomamos en serio cada detalle para asegurarnos de que lo que hacemos sea auténtico y diferente. <br></br><br></br>

            Sabemos que el mundo cambia rápido, y por eso <strong>ayudamos a las empresas</strong> a destacarse y adaptarse con soluciones que mezclan <strong>innovación y creatividad</strong>. Queremos darle vida a tu objetivo empresarial con un enfoque joven y dinámico, pero siempre manteniendo el enfoque profesional y que busca la eficacia. <br></br><br></br>

            Desde que empezamos en {municipio}, hemos trabajado en marcas y proyectos que no solo cumplen, sino que también inspiran y dan resultados. ¿Te animas a dar forma a tu nueva idea con nosotros?
          </>}
        
    />
    </motion.div>
);
}


export default IndexIntro;