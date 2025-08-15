"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import StandardButton from "@/app/buttons/standard-button.jsx";

/* -------- Item: todo el bloque clicable, el botón no burbujea -------- */
function SliderServicesItem({ nameService, descriptionService, link, disableClick = false }) {
  const router = useRouter();

  const onContainerClick = () => {
    if (disableClick) return; // no navegar si estás arrastrando
    router.push(link);
  };

  const onKey = (e) => {
    if (disableClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(link);
    }
  };

  const onButtonClick = (e) => {
    // Permite que el botón funcione con su propio <a>, pero evita activar el contenedor
    e.stopPropagation();
  };

  return (
    <div
      className="index__services-container"
      role="link"
      tabIndex={0}
      onClick={onContainerClick}
      onKeyDown={onKey}
    >
      <h3>{nameService}</h3>
      <p>{descriptionService}</p>

      <div onClick={onButtonClick}>
        <StandardButton
          link={link}
          title="Más info"
          style="post__button post__button-services-slider"
          bg="#3F52FF"
          color="white"
          borderColor="transparent"
          hoverBg="#0E1C9D"
          hoverColor="white"
          hoverBorderColor=""
          onClick={onButtonClick}
        />
      </div>
    </div>
  );
}

/* -------- Slider con arrastre (si arrastras no navega) -------- */
function SliderServices({ municipio, enMunicipio }) {
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
    // pequeño timeout para evitar click fantasma justo al soltar
    setTimeout(() => setIsDragging(false), 0);
  };

  const handleMouseMove = (e) => {
    const slider = sliderRef.current;
    if (!slider || slider.style.cursor !== "grabbing") return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
    if (Math.abs(walk) > 5) setIsDragging(true); // umbral para considerar drag
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
          nameService={<>Diseño web, programación y SEO {enMunicipio}</>}
          descriptionService="Tu web no puede ser solo bonita. Tiene que cargar rápido, verse bien, guiar al usuario y convertir. Diseñamos y programamos webs que trabajan por ti… incluso cuando duermes."
          link="/servicios/web"
          disableClick={isDragging}
        />

        <SliderServicesItem
          nameService={<>Animación 2D y motion graphics {enMunicipio}</>}
          descriptionService="Convertimos ideas en movimiento. Nuestras animaciones no decoran: explican, emocionan y venden. Si lo que haces es complejo, lo hacemos claro. Si es aburrido, lo hacemos irresistible."
          link="/servicios/animacion"
          disableClick={isDragging}
        />

        <SliderServicesItem
          nameService={<>Generación de imágenes con IA {enMunicipio}</>}
          descriptionService="No hacemos fotos. Hacemos que te vean. Imágenes pensadas para vender, destacar y contar lo que tu marca vale sin decir una palabra."
          link="/servicios/fotografia"
          disableClick={isDragging}
        />
      </div>
    </div>
  );
}

export default SliderServices;
