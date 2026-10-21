// components/buttons/standard-submit.jsx
import React from "react";
import FlechaBoton from "./flecha-boton";
import { traducirColor } from "./paleta";

export default function StandardSubmit({
  title,
  style = "",
  bg = "transparent",
  color = "#3F52FF",
  hoverBg,
  hoverColor,
  borderColor,
  hoverBorderColor,
  arrowRotation = 0,
  disabled = false
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
      <button
        type="submit"
        style={cssVars}
        className="button"
        disabled={disabled}
      >
        <p>{title}</p>
        <FlechaBoton rotation={arrowRotation} />
      </button>
    </div>
  );
}
