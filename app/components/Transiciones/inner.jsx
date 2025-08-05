"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/app/components/Transiciones/transiciones.scss';
import { Player } from '@lottiefiles/react-lottie-player';
import ermoAni from '@/app/assets/logo/ERMO_logo.json';

export default function Inner({children}){
    
  const anim = (variants) => ({
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants
  });

  const opacity = {
    initial:{
      opacity: 0,
             transition: {
          duration: 1,
          delay: 0,
          ease: [0.76, 0, 0.24, 1]
        },
    },
    animate:{
      opacity: 1,
             transition: {
          duration: 1.5,
          delay: 1,
          ease: [0.76, 0, 0.24, 1]
        },
    },
    exit:{
      opacity: 1,
             transition: {
          duration: 1,
          ease: [0.76, 0, 0.24, 1]
        },
    }
  }

  const slide = {
    initial: {
        y: "0",
                transition: {
          duration: 1,
          ease: [0.76, 0, 0.24, 1]
        },
    },
    animate: {
      y: ["100vh", "0vh", "0vh", "-100vh"], // Array de valores para la animación
      transition: {
        duration: 4, // Duración total de la animación
        times: [0, 0.175, 0.4, 0.5], // Controla cuándo suceden los cambios de valor
        ease: [0.76, 0, 0.24, 1], // Curva de animación suave
      }
    },

    exit: {
        y: "0vh",
        transition: {
          duration: 1,
          delay: 1,
          ease: [0.76, 0, 0.24, 1]
        },

    }
  }

  return (
    <div className="inner">
      {/* <AnimatePresence>
          <motion.div {...anim(slide)} className="slide">
              <div className="slide-margin"></div>
              <Player
                autoplay
                loop
                src={ermoAni}
                style={{ height: '40%', width: '40%' }}
                className="introLottie"
              />
          </motion.div>
          <motion.div {...anim(opacity)} className="motionWrapper"> */}
          {children}
          {/* </motion.div>
      </AnimatePresence> */}
    </div>
  );
};

