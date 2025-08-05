"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ermoLogo from '../assets/logo/ERMO_blue.svg';
import StandardButton from '../buttons/standard-button';

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

const MenuButton = ({ buttonName, buttonEnlace, closeMenu }) => (
  <div className="menu__slider-button">
    <Link href={buttonEnlace} onClick={closeMenu}>
      <div className="menu__button">
        <p>{buttonName}</p>
        <ArrowMenu />
      </div>
    </Link>
  </div> 
);

const MenuSlider = ({ menuOpen, closeMenu }) => (
  <div className={`menu__slider ${menuOpen ? 'mostrar' : ''}`}>
    <div className="menu__slider-container">
      <MenuButton buttonName="Proyectos" buttonEnlace="/proyectos/principal" closeMenu={closeMenu} />
      <MenuButton buttonName="Servicios" buttonEnlace="/servicios/principal" closeMenu={closeMenu} />
      <MenuButton buttonName="Equipo" buttonEnlace="#" closeMenu={closeMenu} />
      <MenuButton buttonName="Contacto" buttonEnlace="https://wa.me/message/HJYSEK4RPLOSI1" closeMenu={closeMenu} />
      <div className="menu__button-cafe">
        <div className="button">
          <MenuButton buttonName="Te invito a un café" buttonEnlace="https://wa.me/message/HJYSEK4RPLOSI1" closeMenu={closeMenu} />
        </div>
      </div>
    </div>
  </div>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true); // Controlar visibilidad del header
  const [scrollPosition, setScrollPosition] = useState(0); // Guardar posición previa de scroll
  const [isAtTop, setIsAtTop] = useState(true); // Controlar si estamos en la parte superior

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.classList.toggle('no-scroll', !menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove('no-scroll');
  };

  // Controlar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      // Mostrar el header si estamos subiendo
      if (currentScrollPos < scrollPosition && currentScrollPos > 0) {
        setShowHeader(true);
        setIsAtTop(false); // No estamos en la parte superior
      } else if (currentScrollPos === 0) {
        setIsAtTop(true); // Volvemos a la parte superior
        setShowHeader(true);
      } else {
        setShowHeader(false); // Si estamos bajando, esconder el header
      }

      setScrollPosition(currentScrollPos); // Guardar posición actual de scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('no-scroll');
      setMenuOpen(false); 
    };
  }, []);

  return (
    <div 
      className={`header__master ${showHeader ? 'show' : 'hide'} ${isAtTop ? 'no-bg' : 'with-bg'}`}
    >
      <Link href="/" aria-label="Inicio" onClick={closeMenu}>
        <Image className="logoErmo" src={ermoLogo} alt="Logo ERMO" width={128} height={34} />
      </Link>
      <button className="menu-nav" aria-label="Menú navegación" onClick={toggleMenu}>
        <HamburgerIcon menuOpen={menuOpen} />
      </button>
      <MenuSlider menuOpen={menuOpen} closeMenu={closeMenu} />
    </div>
  );
};

export default Header;
