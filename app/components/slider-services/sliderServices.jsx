"use client";

import React, { useRef, useState } from 'react';
import ServicesFloatButton from '../../buttons/ServicesFloatButton.jsx';

function SliderServicesItem({ nameService, descriptionService, link }) {
    return (
        <div className="index__services-container">
            <h3>{nameService}</h3>
            <p>{descriptionService}</p>
            <ServicesFloatButton link={link} title="Más info" />
        </div>
    );
}

function SliderServices() {
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const sliderRef = useRef(null);

    const handleMouseDown = (e) => {
        setStartX(e.pageX - sliderRef.current.offsetLeft);
        setScrollLeft(sliderRef.current.scrollLeft);
        sliderRef.current.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
        sliderRef.current.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
        if (sliderRef.current.style.cursor === 'grabbing') {
            const x = e.pageX - sliderRef.current.offsetLeft;
            const walk = (x - startX) * 2;
            sliderRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    return (
        <div className="">
            <div className="title"><h3>Servicios</h3></div>
            <div
                className="index__services"
                id="slider"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <SliderServicesItem
                    nameService="Motion graphics y animación 2D"
                    descriptionService="Damos vida a tus ideas mediante técnicas avanzadas de animación, asegurando que cada detalle refleje la identidad única de tu marca. Confía en nosotros para impulsar tu mensaje con impacto visual y una ejecución impecable."
                    link="/not-found"
                />
                <SliderServicesItem
                    nameService="Fotografía"
                    descriptionService="Damos vida a tus productos a través de imágenes impactantes y detalladas. Cada fotografía está diseñada para resaltar la calidad y singularidad de tus artículos, capturando su esencia de manera impecable. Nos enfocamos en crear composiciones atractivas que atraen y mantienen la atención de tu audiencia, ayudando a tus productos a destacar en un mercado competitivo. "
                    link="/not-found"
                />
                <SliderServicesItem
                    nameService="Maquetación web y diseño UI/UX"
                    descriptionService="Creamos experiencias digitales que conectan. Nuestro enfoque en diseño web y UI/UX está centrado en la creación de interfaces intuitivas y atractivas que mejoran la interacción del usuario con tu marca. Y te garantizamos una navegación fluida y una estética visual que capte y mantenga la atención."
                    link="/not-found"
                />
                <SliderServicesItem
                    nameService="Ilustración"
                    descriptionService="Nuestra pasión por la ilustración se traduce en obras únicas que capturan la esencia de tu marca y la presentan de una manera vibrante y atractiva. Nos enfocamos en crear arte visual que no solo embellece, sino que también fortalece la identidad de tu marca."
                    link="/not-found"
                />
                <SliderServicesItem
                    nameService="Identidad corporativa"
                    descriptionService="Construimos identidades que perduran. Nuestra dedicación a la identidad visual corporativa asegura que cada aspecto de tu marca, desde el logotipo hasta la paleta de colores, refleje fielmente tus valores y visión. Creamos diseños coherentes y distintivos que fortalecen el reconocimiento y la presencia de tu marca en el mercado."
                    link="/not-found"
                />
                <SliderServicesItem
                    nameService="Video"
                    descriptionService="Contamos historias que resuenan. Nuestra especialidad en producción de video nos permite crear contenido visual dinámico y atractivo que comunica tu mensaje de manera efectiva. Capturamos momentos y emociones que conecten profundamente con tu audiencia."
                    link="/not-found"
                />
            </div>
        </div>
    );
}

export default SliderServices;
