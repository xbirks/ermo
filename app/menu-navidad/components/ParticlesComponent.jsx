'use client';

import { useEffect, useState } from 'react';

export default function ParticlesComponent({ count = 50 }) {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Mejor generador aleatorio con semilla
        const seededRandom = (seed) => {
            const x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        };

        const generateParticles = () => {
            const particleArray = [];

            for (let i = 0; i < count; i++) {
                // Usar múltiples semillas para mejor distribución
                const seedX = i * 12.9898 + 78.233;
                const seedY = i * 43.758 + 91.547;
                const seedSize = i * 17.139 + 31.426;

                const randomX = seededRandom(seedX) * 100; // 0-100%
                const randomY = seededRandom(seedY) * 100; // 0-100%
                const randomSize = 2 + (seededRandom(seedSize) * 2); // 2-4px

                particleArray.push({
                    id: i,
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    width: `${randomSize}px`,
                    height: `${randomSize}px`,
                    animationDelay: `${seededRandom(i * 23.456) * 3}s`, // 0-3s delay
                });
            }

            return particleArray;
        };

        setParticles(generateParticles());
    }, [count]);

    return (
        <div className="particles-container">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="particle"
                    style={{
                        left: particle.left,
                        top: particle.top,
                        width: particle.width,
                        height: particle.height,
                        animationDelay: particle.animationDelay,
                    }}
                />
            ))}
        </div>
    );
}
