"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ermoLogo from '../assets/logo/ERMO_tinta.svg';
import FlechaBoton from '../buttons/flecha-boton';
import './cabecera.scss';

// Tirita de estilo (septiembre 2026): cabecera en pastilla, como la de
// la landing de Automaker. Las clases conservan "header" en el nombre
// porque menu-navidad/HideGlobalNav la busca por esa subcadena.

const CONTACTO = 'mailto:andresortega@ermo.es';

const ENLACES = [
  { texto: 'Proyectos', href: '/proyectos/principal' },
  { texto: 'Servicios', href: '/servicios/principal' },
  { texto: 'Contacto', href: CONTACTO },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [oculta, setOculta] = useState(false);
  const [arriba, setArriba] = useState(true);
  const ultimoScroll = useRef(0);

  const cerrarMenu = () => setMenuOpen(false);

  // Con el menú de móvil abierto la página de debajo no se desplaza.
  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  // Se esconde al bajar y reaparece al subir.
  useEffect(() => {
    const alDesplazar = () => {
      const y = window.scrollY;
      setArriba(y <= 10);
      setOculta(y > ultimoScroll.current && y > 120);
      ultimoScroll.current = y;
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  const clases = [
    'header__pill',
    oculta && !menuOpen ? 'header__pill--oculta' : '',
    arriba ? '' : 'header__pill--flotando',
    menuOpen ? 'header__pill--abierta' : '',
  ].join(' ');

  return (
    <div className={clases}>
      <div className="header__barra">
        <Link href="/" aria-label="Inicio" onClick={cerrarMenu} className="header__logo">
          <Image src={ermoLogo} alt="ERMO" width={106} height={27} priority />
        </Link>

        <nav className="header__enlaces" aria-label="Principal">
          {ENLACES.map((e) => (
            <Link key={e.texto} href={e.href} className="header__enlace">{e.texto}</Link>
          ))}
        </nav>

        <div className="header__acciones">
          <a href={CONTACTO} className="header__cta" rel="noopener noreferrer">
            Hablemos
            <FlechaBoton />
          </a>
          <button
            type="button"
            className="header__hamburguesa"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="header__panel">
        <nav className="header__panel-enlaces" aria-label="Menú">
          {ENLACES.map((e) => (
            <Link key={e.texto} href={e.href} className="header__panel-enlace" onClick={cerrarMenu}>
              {e.texto}
              <FlechaBoton />
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Header;
