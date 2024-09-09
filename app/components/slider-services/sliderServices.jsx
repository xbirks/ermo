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

function SliderServices({municipio}) {
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
                    nameService={<>Animación 2D y motion graphics {municipio}</>}
                    descriptionService="Revolucionamos tu comunicación visual. Nuestras animaciones no solo cautivan, sino que multiplican el engagement de tu audiencia, convirtiendo conceptos complejos en experiencias visuales inolvidables que mejoran tu mensaje."
                    link="/servicios/animacion"
                />
                <SliderServicesItem
                    nameService={<>Fotografía {municipio}</>}
                    descriptionService="Capturamos la esencia de tu marca con imágenes que venden. Nuestras fotografías profesionales resaltan la calidad de tus productos, atrayendo clientes y disparando tus ventas."
                    link="/servicios/fotografia"
                />
                <SliderServicesItem
                    nameService={<>Programación web, UI/UX y SEO {municipio}</>}
                    descriptionService="Creamos sitios web que conquistan. Combinamos diseño atractivo, experiencia de usuario intuitiva y optimización SEO para garantizar que tu presencia online destaque y convierta visitantes en clientes."
                    link="/servicios/web"
                />
                <SliderServicesItem
                    nameService={<>Ilustración {municipio}</>}
                    descriptionService="Transformamos ideas en imágenes que hablan. Nuestras ilustraciones personalizadas no solo embellecen tu marca, sino que cuentan tu historia de forma única, creando una conexión emocional instantánea con tu público."
                    link="/servicios/ilustracion"
                />
                <SliderServicesItem
                    nameService={<>Identidad corporativa {municipio}</>}
                    descriptionService="Construimos identidades que perduran. Te aseguramos que cada aspecto de tu marca, desde el logotipo hasta la paleta de colores, refleje fielmente tus valores y visión. Creamos diseños coherentes y distintivos que fortalecen el reconocimiento y la presencia de tu marca en el mercado."
                    link="/servicios/branding"
                />
                <SliderServicesItem
                    nameService={<>Video {municipio}</>}
                    descriptionService="Nuestros videos no son solo contenido, son experiencias que capturan la atención, despiertan emociones y motivan acciones, convirtiendo cada visualización en una oportunidad de crecimiento para tu negocio."
                    link="/servicios/video"
                />
            </div>
        </div>
    );
}

export default SliderServices;
