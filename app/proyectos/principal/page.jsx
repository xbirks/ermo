"use client";

import SliderServices from "@/app/components/slider-services/sliderServices";
import GridAll from "@/app/components/grid-4/grid-all";
import Spacer from "@/app/buttons/spacer";
import { motion } from "framer-motion";
import Inner from "@/app/components/Transiciones/inner";





export default function ProyectosPrincipalPage() {
    return (
    <Inner>

    <div className="master__body servicios__master">

    <motion.div
        initial={{ opacity: 0, transform: "translateY(30%)" }}
        whileInView={{ opacity: 1, transform: "translateY(0%)"}}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, amount: 0.1}}  
     > 
        <h1 className="servicios__h1">Transformamos ideas en soluciones creativas que impulsan tus ventas.</h1>
    
    </motion.div>


    <GridAll></GridAll>
    
    <Spacer className="spacer-l"></Spacer>

    <SliderServices></SliderServices>



    </div>
    </Inner>
    );
  }
  