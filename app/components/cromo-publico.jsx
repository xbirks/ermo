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

// La landing de Automaker trae su propia cabecera y su propio diseño: sin
// la cabecera, el pie, el cursor ni el aviso de cookies de ERMO (decisión
// del propietario). Google Analytics sigue midiendo: lo carga el layout.
const RUTAS_CROMO_PROPIO = ['/automaker'];

const empiezaPor = (ruta, lista) => lista.some((r) => ruta?.startsWith(r));

export function CabeceraPublica() {
    const ruta = usePathname();
    if (empiezaPor(ruta, RUTAS_SIN_CROMO)) return null;
    if (empiezaPor(ruta, RUTAS_CROMO_PROPIO)) return null;
    return (
        <>
            <Header />
            <CookieConsent />
        </>
    );
}

export function PiePublico() {
    const ruta = usePathname();
    if (empiezaPor(ruta, RUTAS_SIN_CROMO) || empiezaPor(ruta, RUTAS_CROMO_PROPIO)) return null;
    return (
        <>
            <Spacer className="spacer-xl" />
            <Footer />
            <Spacer className="spacer-m" />
            <Cursor />
        </>
    );
}
