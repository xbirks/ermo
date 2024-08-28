"use client";

import { motion } from 'framer-motion';
import React from 'react';

const Transistor = (PequeTransition) => {
    return () => (
        <>
            {/* Componente principal que envuelve */}
            <PequeTransition />

            {/* Animación de entrada */}
            <motion.div
                className="transicion__entra"
                initial={{ scaleY: 0 }} // Comienza en escala 0
                animate={{ scaleY: 1 }} // Crece a escala completa
                exit={{ scaleY: 0 }}    // Disminuye a escala 0 al salir
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'blue', // Cambia según tu necesidad
                    zIndex: 9999,
                    transformOrigin: 'top'
                }}
            />

            {/* Animación de salida */}
            <motion.div
                className="transicion__sale"
                initial={{ scaleY: 1 }}  // Comienza en escala completa
                animate={{ scaleY: 0 }}  // Disminuye a escala 0
                exit={{ scaleY: 1 }}     // Vuelve a escala completa cuando desaparece
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'blue',
                    zIndex: 9998,
                    transformOrigin: 'bottom'
                }}
            />
        </>
    );
}

export default Transistor;
