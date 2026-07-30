import './finanzas.scss';

export const metadata = {
    title: 'Finanzas · ERMO',
    // Zona privada: fuera de los buscadores en cualquier caso.
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false, noimageindex: true },
    },
};

export default function FinanzasLayout({ children }) {
    return children;
}
