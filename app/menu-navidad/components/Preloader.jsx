'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Assets } from '../assets';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const imagesToPreload = [
            Assets.conejo,
            Assets.cebollas,
            Assets.maquina,
            Assets.bici,
            Assets.bola,
            Assets.estrella,
            Assets.titleLockup,
        ];

        let loadedCount = 0;
        const totalImages = imagesToPreload.length;

        const imagePromises = imagesToPreload.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new window.Image();
                img.src = src;
                img.onload = () => {
                    loadedCount++;
                    resolve();
                };
                img.onerror = reject;
            });
        });

        Promise.all(imagePromises)
            .then(() => {
                // Small delay to ensure smooth transition
                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            })
            .catch((error) => {
                console.error('Error loading images:', error);
                // Still hide preloader even if some images fail
                setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            });
    }, []);

    if (!isLoading) return null;

    return (
        <div className={`preloader ${!isLoading ? 'fade-out' : ''}`}>
            {/* Logo removido - sin pantalla de carga visible */}
        </div>
    );
}
