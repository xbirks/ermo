// components/buttons/standard-submit.jsx
import React from "react";

const ArrowInButton = ({ rotation = 0 }) => (
  <svg
    className="arrow__svg"
    width="34"
    height="23"
    viewBox="0 0 34 23"
    xmlns="http://www.w3.org/2000/svg"
    style={{ "--arrow-rotation": `${rotation}deg` }}
  >
    <path
      fill="currentColor"
      d="M21.03 0L19.95 1.23L30.6 10.68H0V12.33H30.6L19.95 21.77L21.03 23L34 11.5L21.03 0Z"
    />
  </svg>
);

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
    "--btn-bg": bg,
    "--btn-color": color,
    "--btn-bg-hover": hoverBg ?? bg,
    "--btn-color-hover": hoverColor ?? color,
    "--btn-border": borderColor,
    "--btn-border-hover": hoverBorderColor ?? borderColor,
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
        <ArrowInButton rotation={arrowRotation} />
      </button>
    </div>
  );
}
