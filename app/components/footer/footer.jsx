"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ermoLogo from '../../assets/logo/ERMO_tinta.svg';
import { abrirPanelCookies } from '../../lib/consentimiento';
import './pie.scss';

// Pie tipo membrete: sin eslóganes, con el correo como protagonista
// (grande y seleccionable) y los datos justos debajo. Las clases
// conservan "footer" en el nombre porque menu-navidad/HideGlobalNav lo
// busca por esa subcadena.

const CORREO = 'andresortega@ermo.es';

function Footer() {
    const anio = new Date().getFullYear();

    return (
        <footer className="footer__pie">
            <div className="footer__contacto">
                <a className="footer__correo" href={`mailto:${CORREO}`}>{CORREO}</a>
                <a className="footer__telefono" href="tel:+34675392216">675 392 216</a>
            </div>

            <div className="footer__datos">
                <div className="footer__bloque">
                    <span className="footer__etiqueta">Estudio</span>
                    <p>Andrés Ortega<br />Manises, Valencia</p>
                </div>

                <div className="footer__bloque">
                    <span className="footer__etiqueta">Trabajo</span>
                    <Link href="/proyectos/principal">Proyectos</Link>
                    <Link href="/servicios/principal">Servicios</Link>
                </div>

                <div className="footer__bloque">
                    <span className="footer__etiqueta">Redes</span>
                    <a href="https://www.instagram.com/ermostudio/" rel="noopener noreferrer">Instagram</a>
                    <a href="https://www.linkedin.com/in/andres-ermo" rel="noopener noreferrer">LinkedIn</a>
                </div>

                <div className="footer__bloque">
                    <span className="footer__etiqueta">Legal</span>
                    <Link href="/legal/aviso-legal">Aviso legal</Link>
                    <Link href="/legal/politica-de-privacidad">Privacidad</Link>
                    <Link href="/legal/aviso-de-cookies">Cookies</Link>
                    {/* Retirar el consentimiento tiene que ser tan fácil
                        como darlo: siempre a mano en el pie. */}
                    <button type="button" className="footer__boton" onClick={abrirPanelCookies}>
                        Configurar cookies
                    </button>
                </div>
            </div>

            <div className="footer__base">
                <Link href="/" aria-label="Inicio" className="footer__logo">
                    <Image src={ermoLogo} alt="ERMO" width={86} height={22} />
                </Link>
                <span>© {anio}</span>
            </div>
        </footer>
    );
}

export default Footer;
