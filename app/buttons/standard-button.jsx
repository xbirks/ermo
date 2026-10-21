import React from "react";
import FlechaBoton from "./flecha-boton";
import { traducirColor } from "./paleta";



function StandardButton({
  link,
  title,
  style = "",
  bg = "transparent",
  color = "#3F52FF",
  hoverBg,
  hoverColor,
  borderColor,
  hoverBorderColor,
  onClick,
  arrowRotation = 0,
}) {
  const cssVars = {
    "--btn-bg": traducirColor(bg),
    "--btn-color": traducirColor(color),
    "--btn-bg-hover": traducirColor(hoverBg ?? bg),
    "--btn-color-hover": traducirColor(hoverColor ?? color),
    "--btn-border": traducirColor(borderColor),
    "--btn-border-hover": traducirColor(hoverBorderColor ?? borderColor),
    "--arrow-rotation": `${arrowRotation}deg`,
  };

  return (
    <div className={`master_button ${style}`}>
      <a href={link} onClick={onClick}
  rel="noopener noreferrer">
        <div className="button" style={cssVars}>
          <p>{title}</p>
          <FlechaBoton rotation={arrowRotation} />
        </div>
      </a>
    </div>
  );
}

export default StandardButton;
