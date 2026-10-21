import React from "react";

// Flecha ↗ de los botones, la misma de la landing de Automaker. Lleva
// dos copias: al pasar el ratón por el botón una sale por la esquina y
// la otra entra por la opuesta (ver .button__flecha en style.scss).
export default function FlechaBoton({ rotation = 0 }) {
  const trazo = (
    <svg viewBox="0 0 10 10" aria-hidden="true">
      <path d="M9.5 10V.5H0M9.5.5 0 10" />
    </svg>
  );
  return (
    <span className="button__flecha" style={{ "--arrow-rotation": `${rotation}deg` }} aria-hidden="true">
      {trazo}
      {trazo}
    </span>
  );
}
