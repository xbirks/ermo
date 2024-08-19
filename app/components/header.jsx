"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ermoLogo from '../assets/logo/ERMO_blue.svg';

const HamburgerIcon = ({ menuOpen }) => (
  <svg className={`hamburger ${menuOpen ? 'open' : ''}`} width="36" height="25" viewBox="0 0 36 25">
    <path d="M0 0h36v3H0z" />
    <rect y="11" width="36" height="3" />
    <rect y="22" width="36" height="3" />
  </svg>
);

const ArrowMenu = () => (
  <svg className="arrow__svg" width="34" height="23" viewBox="0 0 34 23">
    <path d="M21.03 0L19.95 1.23L30.6 10.68H0V12.33H30.6L19.95 21.77L21.03 23L34 11.5L21.03 0Z" />
  </svg>
);

const MenuButton = ({ buttonName, buttonEnlace }) => (
  <div className="menu__slider-button">
    <Link href={buttonEnlace}>
      <div className="menu__button">
        <p>{buttonName}</p>
        <ArrowMenu />
      </div>
    </Link>
  </div>
);

const MenuSlider = ({ menuOpen }) => (
  <div className={`menu__slider ${menuOpen ? 'mostrar' : ''}`}>
    <div className="menu__slider-container">
      <MenuButton buttonName="Proyectos" buttonEnlace="#" />
      <MenuButton buttonName="Servicios" buttonEnlace="#" />
      <MenuButton buttonName="Equipo" buttonEnlace="#" />
      <MenuButton buttonName="Contacto" buttonEnlace="#" />
      <MenuButton buttonName="Idioma" buttonEnlace="#" />
      <div className="menu__button-cafe">
        <div className="button">
          <MenuButton buttonName="Te invito a un café" buttonEnlace="#" />
        </div>
      </div>
    </div>
  </div>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle('no-scroll', !menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove('no-scroll');
  };

    // Clean up effect to ensure no residual effects when navigating between pages
    useEffect(() => {
      return () => {
        document.body.classList.remove('no-scroll');
        setMenuOpen(false); // Ensure the menu is closed
      };
    }, []);

  return (
    <div className="header__master">
      <Link href="https://ermo.es" aria-label="Inicio" onClick={closeMenu}>
          <Image src={ermoLogo} alt="Logo ERMO" width={128} height={34} />
      </Link>
      <button className="menu-nav" aria-label="Menú navegación" onClick={toggleMenu}>
        <HamburgerIcon menuOpen={menuOpen} />
      </button>
      <MenuSlider menuOpen={menuOpen} />
    </div>
  );
};

export default Header;
