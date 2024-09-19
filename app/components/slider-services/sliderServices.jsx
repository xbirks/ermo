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

function SliderServices({municipio, enMunicipio}) {
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
                    nameService={<>Animación 2D y motion graphics {enMunicipio}</>}
                    descriptionService="Revolucionamos tu comunicación visual. Nuestras animaciones cautivan y multiplican el engagement de tu audiencia. Convertimos conceptos complejos en experiencias visuales que mejoran tu mensaje."
                    link="/servicios/animacion"
                />
                <SliderServicesItem
                    nameService={<>Fotografía {enMunicipio}</>}
                    descriptionService="Capturamos la esencia de tu marca con imágenes que venden. Nuestras fotografías resaltan la calidad de tus productos, atrayendo clientes y disparando tus ventas."
                    link="/servicios/fotografia"
                />
                <SliderServicesItem
                    nameService={<>Programación web, UI/UX y SEO {enMunicipio}</>}
                    descriptionService="Creamos sitios web que conquistan. Combinamos diseño atractivo, experiencia de usuario intuitiva y optimización SEO para garantizar que tu presencia online destaque y convierta visitantes en ventas."
                    link="/servicios/web"
                />
                <SliderServicesItem
                    nameService={<>Ilustración {enMunicipio}</>}
                    descriptionService="Transformamos ideas en imágenes que hablan. Nuestras ilustraciones embellecen tu marca y cuentan tu historia de forma única, creando una conexión emocional instantánea con tu público."
                    link="/servicios/ilustracion"
                />
                <SliderServicesItem
                    nameService={<>Identidad corporativa {enMunicipio}</>}
                    descriptionService="Construimos identidades que perduran. Te aseguramos que cada aspecto de tu marca reflejará fielmente tus valores y visión. Creamos diseños coherentes y distintivos que fortalecen el reconocimiento y la presencia de tu marca en el mercado."
                    link="/servicios/branding"
                />
                <SliderServicesItem
                    nameService={<>Video {enMunicipio}</>}
                    descriptionService="Nuestros videos no son solo contenido, son experiencias que capturan la atención, despiertan emociones y motivan acciones, convirtiendo cada visualización en una oportunidad de crecimiento para tu negocio."
                    link="/servicios/video"
                />
            </div>
        </div>
    );
}

export default SliderServices;
