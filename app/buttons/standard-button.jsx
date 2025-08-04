import React from "react";

const ArrowInButton = () => (
  <svg
    className="arrow__svg"
    width="34"
    height="23"
    viewBox="0 0 34 23"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M21.03 0L19.95 1.23L30.6 10.68H0V12.33H30.6L19.95 21.77L21.03 23L34 11.5L21.03 0Z"
    />
  </svg>
);

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
}) {
  const cssVars = {
    "--btn-bg": bg,
    "--btn-color": color,
    "--btn-bg-hover": hoverBg ?? bg,
    "--btn-color-hover": hoverColor ?? color,
    "--btn-border": borderColor,
    "--btn-border-hover": hoverBorderColor ?? borderColor,
  };

  return (
    <div className={`master_button ${style}`}>
      <a href={link} onClick={onClick}>
        <div className="button" style={cssVars}>
          <p>{title}</p>
          <ArrowInButton />
        </div>
      </a>
    </div>
  );
}

export default StandardButton;
