'use client';

import { useEffect } from 'react';

export default function HideGlobalNav() {
    useEffect(() => {
        // Esperar a que el DOM esté completamente cargado
        const hideElements = () => {
            const selectorsToHide = [
                'header',
                'footer',
                'nav',
                '.cursor',
                '.spacer-xl',
                '.spacer-m',
                '.cookie-consent',
                '[class*="cursor"]',
                '[class*="Cursor"]',
                '[class*="header"]',
                '[class*="Header"]',
                '[class*="footer"]',
                '[class*="Footer"]'
            ];

            selectorsToHide.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(el => {
                        if (el && !el.closest('.menu-navidad-container')) {
                            el.style.setProperty('display', 'none', 'important');
                            el.style.setProperty('visibility', 'hidden', 'important');
                            el.style.setProperty('opacity', '0', 'important');
                        }
                    });
                } catch (e) {
                    // Ignorar errores de selectores
                }
            });
        };

        // Ejecutar inmediatamente
        hideElements();

        // Y también después de un pequeño delay por si acaso
        setTimeout(hideElements, 100);
        setTimeout(hideElements, 500);

        document.body.style.cursor = 'default';
        document.body.style.overflowX = 'hidden';
    }, []);

    return null;
}
