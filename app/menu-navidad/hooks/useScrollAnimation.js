'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimation() {
    const stageRef = useRef(null);
    const rabbitRef = useRef(null);
    const onionsRef = useRef(null);
    const machineRef = useRef(null);
    const bikeRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Configurar todos los actores para que se centren correctamente
            gsap.set([rabbitRef.current, onionsRef.current, machineRef.current, bikeRef.current], {
                opacity: 0,
                xPercent: -50, // Centrar horizontalmente
                yPercent: -50, // Centrar verticalmente
                left: '50%',
                top: '50%',
            });

            gsap.set(titleRef.current, {
                opacity: 0,
                scale: 0.9,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: stageRef.current,
                    start: 'top top',
                    end: '+=7000',
                    pin: true, // Pin para mantener stage visible
                    scrub: 1.5,
                    markers: false,
                },
            });

            // ============================================
            // CONEJO: Entra abajo-izq → Centro → Sale derecha
            // ============================================
            tl.fromTo(
                rabbitRef.current,
                {
                    opacity: 0,
                    scale: 0.3,
                    left: '-10%', // Fuera por izquierda
                    top: '110%',  // Fuera por abajo
                },
                {
                    opacity: 1,
                    scale: 1.8, // Grande en el centro
                    left: '50%',
                    top: '50%',
                    duration: 1.5,
                    ease: 'power2.out'
                },
                0
            )
                // Sale por la derecha
                .to(
                    rabbitRef.current,
                    {
                        opacity: 0,
                        scale: 0.3,
                        left: '110%', // Fuera por derecha
                        top: '50%',
                        duration: 1.5,
                        ease: 'power2.in'
                    },
                    1.5
                );

            // ============================================
            // CEBOLLAS: Entra derecha → Centro → Sale izquierda
            // ============================================
            tl.fromTo(
                onionsRef.current,
                {
                    opacity: 0,
                    scale: 0.3,
                    left: '110%', // Fuera por derecha
                    top: '50%',
                },
                {
                    opacity: 1,
                    scale: 1.8,
                    left: '50%',
                    top: '50%',
                    duration: 1.5,
                    ease: 'power2.out'
                },
                2.5
            )
                // Sale por la izquierda
                .to(
                    onionsRef.current,
                    {
                        opacity: 0,
                        scale: 0.3,
                        left: '-10%', // Fuera por izquierda
                        top: '50%',
                        duration: 1.5,
                        ease: 'power2.in'
                    },
                    4
                );

            // ============================================
            // MÁQUINA: Entra arriba → Centro → Sale abajo
            // ============================================
            tl.fromTo(
                machineRef.current,
                {
                    opacity: 0,
                    scale: 0.3,
                    left: '50%',
                    top: '-10%', // Fuera por arriba
                },
                {
                    opacity: 1,
                    scale: 1.8,
                    left: '50%',
                    top: '50%',
                    duration: 1.5,
                    ease: 'power2.out'
                },
                5
            )
                // Sale por abajo
                .to(
                    machineRef.current,
                    {
                        opacity: 0,
                        scale: 0.3,
                        left: '50%',
                        top: '110%', // Fuera por abajo
                        duration: 1.5,
                        ease: 'power2.in'
                    },
                    6.5
                );

            // ============================================
            // BICI: Entra izquierda → Centro → Sale arriba
            // ============================================
            tl.fromTo(
                bikeRef.current,
                {
                    opacity: 0,
                    scale: 0.3,
                    left: '-10%', // Fuera por izquierda
                    top: '50%',
                },
                {
                    opacity: 1,
                    scale: 1.8,
                    left: '50%',
                    top: '50%',
                    duration: 1.5,
                    ease: 'power2.out'
                },
                7.5
            )
                // Sale por arriba
                .to(
                    bikeRef.current,
                    {
                        opacity: 0,
                        scale: 0.3,
                        left: '50%',
                        top: '-10%', // Fuera por arriba
                        duration: 1.5,
                        ease: 'power2.in'
                    },
                    9
                );

            // ============================================
            // TODOS vuelven a posiciones finales PEQUEÑOS
            // ============================================
            tl.to(
                rabbitRef.current,
                {
                    opacity: 1,
                    scale: 0.40,
                    left: '20%',  // Izquierda arriba
                    top: '25%',
                    duration: 1.5,
                    ease: 'power2.out'
                },
                10.5
            )
                .to(
                    onionsRef.current,
                    {
                        opacity: 1,
                        scale: 0.40,
                        left: '80%',   // Derecha arriba
                        top: '25%',
                        duration: 1.5,
                        ease: 'power2.out'
                    },
                    10.5
                )
                .to(
                    bikeRef.current,
                    {
                        opacity: 1,
                        scale: 0.40,
                        left: '20%',  // Izquierda abajo
                        top: '75%',
                        duration: 1.5,
                        ease: 'power2.out'
                    },
                    10.5
                )
                .to(
                    machineRef.current,
                    {
                        opacity: 1,
                        scale: 0.40,
                        left: '80%',   // Derecha abajo
                        top: '75%',
                        duration: 1.5,
                        ease: 'power2.out'
                    },
                    10.5
                );

            // ============================================
            // Título "Feliz Navidad" aparece
            // ============================================
            tl.to(
                titleRef.current,
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.5,
                    ease: 'back.out(1.7)'
                },
                12
            );

            // Hold final
            tl.to({}, { duration: 1 });

        }, stageRef);

        return () => ctx.revert();
    }, []);

    return {
        stageRef,
        rabbitRef,
        onionsRef,
        machineRef,
        bikeRef,
        titleRef,
    };
}
