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
                    descriptionService="Convertimos ideas en movimiento. Nuestras animaciones no decoran: explican, emocionan y venden. Si lo que haces es complejo, lo hacemos claro. Si es aburrido, lo hacemos irresistible."
                    link="/servicios/animacion"
                />
                <SliderServicesItem
                    nameService={<>Fotografía {enMunicipio}</>}
                    descriptionService="No hacemos fotos. Hacemos que te vean. Imágenes pensadas para vender, destacar y contar lo que tu marca vale sin decir una palabra."
                    link="/servicios/fotografia"
                />
                <SliderServicesItem
                    nameService={<>Programación web, UI/UX y SEO {enMunicipio}</>}
                    descriptionService="Tu web no puede ser solo bonita. Tiene que cargar rápido, verse bien, guiar al usuario y convertir. Diseñamos y programamos webs que trabajan por ti… incluso cuando duermes."
                    link="/servicios/web"
                />
                <SliderServicesItem
                    nameService={<>Ilustración {enMunicipio}</>}
                    descriptionService="Ilustraciones que no solo adornan. Conectan. Traducimos tu historia en imágenes que se entienden y se recuerdan."
                    link="/servicios/ilustracion"
                />
                <SliderServicesItem
                    nameService={<>Identidad corporativa {enMunicipio}</>}
                    descriptionService="La identidad de tu marca no es un logo. Es cómo te reconocen, cómo te entienden y por qué te eligen. Creamos marcas que no necesitan explicarse."
                    link="/servicios/branding"
                />
                <SliderServicesItem
                    nameService={<>Video {enMunicipio}</>}
                    descriptionService="Un buen vídeo no informa. Impacta. Hacemos piezas que atrapan desde el segundo uno y convierten visualizaciones en oportunidades reales."
                    link="/servicios/video"
                />
            </div>
        </div>
    );
}

export default SliderServices;
