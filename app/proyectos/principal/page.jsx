"use client";

import SliderServices from "@/app/components/slider-services/sliderServices";
import GridAll from "@/app/components/grid-4/grid-all";
import Spacer from "@/app/buttons/spacer";
import { motion } from "framer-motion";
import Inner from "@/app/components/Transiciones/inner";

//IMAGENES
import imgfoto from '@/app/assets/img/servicios/principal.jpg';
import imgilustracion from '@/app/assets/img/servicios/ilustracion/dibujo3.jpg';
import imgweb from '@/app/assets/img/servicios/web/diveroci.jpg';
import imganimacion from '@/app/assets/img/servicios/ilustracion/dibujo7.jpg';

//ICON
import instagram from '@/app/assets/icon/destacados/instagram-dest.svg';
import amazon from '@/app/assets/icon/destacados/amazon-dest.svg';
import arrow from '@/app/assets/icon/destacados/arrow-dest.svg';
import colab from '@/app/assets/icon/destacados/colab-dest.svg';
import memo from '@/app/assets/icon/destacados/memo-dest.svg';
import coherencia from '@/app/assets/icon/destacados/coherencia-dest.svg';
import elevacion from '@/app/assets/icon/destacados/elevacion-dest.svg';
import merchan from '@/app/assets/icon/destacados/borsa.png';
import iman from '@/app/assets/icon/destacados/iman.png';
import google from '@/app/assets/icon/destacados/google-dest.svg';
import carga from '@/app/assets/icon/destacados/carga.png';
import responsive from '@/app/assets/icon/destacados/responsive-dest.svg';
import comunicacion from '@/app/assets/icon/destacados/comunicacion-dest.svg';
import viralidad from '@/app/assets/icon/destacados/viralidad-dest.svg';
import competencia from '@/app/assets/icon/destacados/competencia-dest.svg';
import cohete from '@/app/assets/icon/destacados/cohete.png';




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
  