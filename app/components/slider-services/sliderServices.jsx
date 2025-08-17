"use client";

import React, { useRef, useState } from "react";
import SliderServicesItem from "./SliderServices-item";

export default function SliderServices({ enMunicipio }) {
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const handleMouseDown = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;
    setIsDragging(false);
    setStartX(e.pageX - slider.offsetLeft);
    setScrollLeft(slider.scrollLeft);
    slider.style.cursor = "grabbing";
  };

  const handleMouseUp = () => {
    const slider = sliderRef.current;
    if (!slider) return;
    slider.style.cursor = "grab";
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleMouseMove = (e) => {
    const slider = sliderRef.current;
    if (!slider || slider.style.cursor !== "grabbing") return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
    if (Math.abs(walk) > 5) setIsDragging(true);
  };

  return (
    <div>
      <div className="title"><h3>Servicios</h3></div>

      <div
        className="index__services"
        id="slider"
        ref={sliderRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        style={{ cursor: "grab" }}
      >
        <SliderServicesItem
          image="/assets/gl04.png"
          nameService={<>Diseño web, programación y SEO {enMunicipio}</>}
          descriptionService="Tu web no puede ser solo bonita. Tiene que cargar rápido, verse bien, guiar al usuario y convertir. Diseñamos y programamos webs que trabajan por ti… incluso cuando duermes."
          link="/servicios/web"
          disableClick={isDragging}
        />

        <SliderServicesItem
          image="/assets/gl07.png"
          nameService={<>Animación 2D y motion graphics {enMunicipio}</>}
          descriptionService="Convertimos ideas en movimiento. Nuestras animaciones no decoran: explican, emocionan y venden. Si lo que haces es complejo, lo hacemos claro. Si es aburrido, lo hacemos irresistible."
          link="/servicios/animacion"
          disableClick={isDragging}
        />

        <SliderServicesItem
          image="/assets/gl06.png"
          nameService={<>Generación de imágenes con IA {enMunicipio}</>}
          descriptionService="No hacemos fotos. Hacemos que te vean. Imágenes pensadas para vender, destacar y contar lo que tu marca vale sin decir una palabra."
          link="/servicios/fotografia"
          disableClick={isDragging}
        />
      </div>
    </div>
  );
}
