"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import StandardButton from "@/app/buttons/standard-button.jsx";

export default function SliderServicesItem({
  nameService,
  descriptionService,
  link,
  image,
  disableClick = false,
}) {
  const router = useRouter();

  const handleContainerClick = () => {
    if (!disableClick) router.push(link);
  };

  const handleKeyDown = (e) => {
    if (disableClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      router.push(link);
    }
  };

  const alt =
    "icono del servicio " + (typeof nameService === "string" ? nameService : "");

  return (
    <div
      className="index__services-container"
      role="link"
      tabIndex={0}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
    >
      {image && (
        <Image src={image} className="index__services-container-img" alt={alt} width={70} height={47} priority />
      )}

      <h3>{nameService}</h3>
      <p>{descriptionService}</p>

      <div onClick={(e) => e.stopPropagation()}>
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
        />
      </div>
    </div>
  );
}
