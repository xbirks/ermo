"use client";

import { usePathname } from 'next/navigation';
import Header from './header.jsx';
import Footer from './footer/footer.jsx';
import Cursor from '../buttons/cursor/cursor.jsx';
import Spacer from '../buttons/spacer.jsx';
import CookieConsent from './cookies/cookieConsent';

// Envoltorio del cromo de la web pública: header, footer, cursor
// personalizado y banner de cookies.
//
// Las herramientas internas no deben llevar nada de esto. El cursor, en
// particular, aplica `cursor: none` a todo el documento desde
// style.scss, y en una pantalla donde se teclean importes eso es
// inusable. El banner de cookies tampoco tiene sentido en una zona
// privada tras contraseña, y además tapaba parte del contenido.
//
// Se decide por la ruta en el cliente porque el layout raíz de Next 14
// no recibe la URL como parámetro.

const RUTAS_SIN_CROMO = ['/interno/finanzas'];

export function CabeceraPublica() {
    const ruta = usePathname();
    if (RUTAS_SIN_CROMO.some((r) => ruta?.startsWith(r))) return null;
    return (
        <>
            <Header />
            <CookieConsent />
        </>
    );
}

export function PiePublico() {
    const ruta = usePathname();
    if (RUTAS_SIN_CROMO.some((r) => ruta?.startsWith(r))) return null;
    return (
        <>
            <Spacer className="spacer-xl" />
            <Footer />
            <Spacer className="spacer-m" />
            <Cursor />
        </>
    );
}
