import './styles.scss';

export const metadata = {
    title: 'Menú Nochebuena 2025 | Familia',
    description: 'Desliza para descubrir la cena de esta noche. ¡Feliz Navidad!',
    openGraph: {
        title: '🎄 Menú Nochebuena 2025',
        description: 'Una historia navideña y el menú de esta noche.',
        images: [{
            url: '/og-share-card.jpg',
            width: 1200,
            height: 630
        }],
        type: 'website',
    },
};

export default function MenuNavidadLayout({ children }) {
    return (
        <>
            <link rel="stylesheet" href="https://use.typekit.net/rtq7gdt.css" />
            <div className="menu-navidad-layout">
                {children}
            </div>
        </>
    );
}
