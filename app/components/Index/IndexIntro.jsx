"use client";

import React from 'react';
import IndexIntroduction  from './IndexIntro-item.jsx';
import Link from 'next/link.js';
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
        IndexIntro="Estudio de fotografía, animación, diseño y web en "
        IndexIntroLocation={municipio}
        IndexDescription={ <>
           <strong>No somos solo diseñadores;</strong> nos vemos como narradores visuales. Creamos contenido gráfico que deja huella.<br></br><br></br>

          Nos tomamos en serio cada detalle para asegurarnos de que lo que hacemos sea auténtico y diferente. <br></br><br></br>

            Sabemos que el mundo cambia rápido, y por eso <strong>ayudamos a las empresas</strong> a destacarse y adaptarse con soluciones que mezclan <strong>innovación y creatividad</strong>. Queremos darle vida a tu objetivo empresarial con un enfoque joven y dinámico, pero siempre manteniendo la búsqueda de la eficacia. <br></br><br></br>

            Hemos trabajado con marcas que inspiran, han dado resultados y son auténticas y diferentes. Conoce que proyectos hemos hecho <Link href="/proyectos/principal">aquí.</Link><br></br><br></br>

            Estamos en {municipio}, ¿te animas a dar forma a tu nueva idea con nosotros? 
          </>}
        
    />
    </motion.div>
);
}


export default IndexIntro;