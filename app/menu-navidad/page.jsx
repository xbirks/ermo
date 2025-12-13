'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ParticlesComponent from './components/ParticlesComponent';
import Preloader from './components/Preloader';
import FloatingElement from './components/FloatingElement';
import HideGlobalNav from './components/HideGlobalNav';
import useScrollAnimation from './hooks/useScrollAnimation';
import { Assets } from './assets';

export default function MenuNavidad() {
    const { stageRef, rabbitRef, onionsRef, machineRef, bikeRef, titleRef } = useScrollAnimation();

    const [showScrollHint, setShowScrollHint] = useState(false);

    useEffect(() => {
        let scrolled = false;
        const timer = setTimeout(() => {
            if (!scrolled) {
                setShowScrollHint(true);
            }
        }, 2000);

        const handleScroll = () => {
            scrolled = true;
            setShowScrollHint(false);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <Preloader />
            <HideGlobalNav />

            <main className="menu-navidad-container">
                {/* ========================================
            LAYER 0: GLOBAL ATMOSPHERE (Fixed)
        ======================================== */}
                <ParticlesComponent count={50} />

                {/* ========================================
            LAYER 1: THE PINNED STAGE (Animation)
        ======================================== */}
                <section ref={stageRef} id="stage" className="stage">

                    {/* Floating Decorators - Estilos inline puros */}

                    {/* Bola arriba centro */}
                    <div className="floating-element" style={{ position: 'absolute', top: '8%', left: '45%', width: '40px' }}>
                        <Image src={Assets.bola} alt="" width={40} height={40} style={{ width: '100%', height: 'auto' }} />
                    </div>

                    {/* Estrella derecha arriba */}
                    <div className="floating-element delay-700" style={{ position: 'absolute', top: '12%', right: '8%', width: '32px' }}>
                        <Image src={Assets.estrella} alt="" width={32} height={32} style={{ width: '100%', height: 'auto' }} />
                    </div>

                    {/* Bola izquierda arriba */}
                    <div className="floating-element delay-1400" style={{ position: 'absolute', top: '33%', left: '5%', width: '36px' }}>
                        <Image src={Assets.bola} alt="" width={36} height={36} style={{ width: '100%', height: 'auto' }} />
                    </div>

                    {/* Estrella derecha medio */}
                    <div className="floating-element delay-2100" style={{ position: 'absolute', top: '48%', right: '6%', width: '30px' }}>
                        <Image src={Assets.estrella} alt="" width={30} height={30} style={{ width: '100%', height: 'auto' }} />
                    </div>

                    {/* Bola izquierda medio */}
                    <div className="floating-element delay-1000" style={{ position: 'absolute', top: '55%', left: '8%', width: '32px' }}>
                        <Image src={Assets.bola} alt="" width={32} height={32} style={{ width: '100%', height: 'auto' }} />
                    </div>

                    {/* Estrella izquierda abajo */}
                    <div className="floating-element delay-1800" style={{ position: 'absolute', bottom: '10%', left: '10%', width: '30px' }}>
                        <Image src={Assets.estrella} alt="" width={30} height={30} style={{ width: '100%', height: 'auto' }} />
                    </div>

                    {/* Bola derecha abajo */}
                    <div className="floating-element delay-900" style={{ position: 'absolute', bottom: '15%', right: '10%', width: '36px' }}>
                        <Image src={Assets.bola} alt="" width={36} height={36} style={{ width: '100%', height: 'auto' }} />
                    </div>

                    {/* Story Actors */}
                    <div ref={rabbitRef} className="actor actor-rabbit" style={{ width: '400px', maxWidth: '90vw' }}>
                        <Image
                            src={Assets.conejo}
                            alt="Conejo"
                            width={400}
                            height={400}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                        />
                    </div>

                    <div ref={onionsRef} className="actor actor-onions" style={{ width: '400px', maxWidth: '90vw' }}>
                        <Image
                            src={Assets.cebollas}
                            alt="Cebollas"
                            width={400}
                            height={400}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                        />
                    </div>

                    <div ref={machineRef} className="actor actor-machine" style={{ width: '400px', maxWidth: '90vw' }}>
                        <Image
                            src={Assets.maquina}
                            alt="Máquina de coser"
                            width={400}
                            height={400}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                        />
                    </div>

                    <div ref={bikeRef} className="actor actor-bike" style={{ width: '400px', maxWidth: '90vw' }}>
                        <Image
                            src={Assets.bici}
                            alt="Bicicleta"
                            width={400}
                            height={400}
                            style={{ width: '100%', height: 'auto' }}
                            priority
                        />
                    </div>

                    {/* Title Reveal */}
                    <div ref={titleRef} className="title-group">
                        <Image
                            src={Assets.titleLockup}
                            alt="Feliz Navidad 2025"
                            width={300}
                            height={150}
                            priority
                        />
                        <span className="scroll-hint">Desliza para ver</span>
                    </div>

                    {/* Scroll Hint - aparece después de 2 segundos */}
                    {showScrollHint && (
                        <div className="initial-scroll-hint">
                            Desliza para ver
                        </div>
                    )}

                </section>

                {/* ========================================
            LAYER 2: MENU CONTENT (Scroll Flow)
        ======================================== */}
                <section className="menu-content">

                    {/* Torn Edge Divider */}
                    <div className="paper-divider">
                        <Image
                            src={Assets.dividerRip}
                            alt=""
                            width={1200}
                            height={100}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>

                    {/* Paper Body with Menu Content */}
                    <div className="paper-body">

                        {/* NOCHEBUENA MENU */}
                        <h2>Nochebuena</h2>

                        <div className="menu-section">
                            <h3>Entrantes</h3>
                            <div className="menu-items">
                                <p>Vieiras a la plancha con cremoso de azafrán y teja de panceta.</p>
                                <p>Ensalada de langostinos con aguacate, tomate cherry y salsa de yogur.</p>
                                <p>Gambón a la plancha.</p>
                            </div>
                        </div>

                        <div className="menu-section">
                            <h3>Principal</h3>
                            <div className="menu-items">
                                <p>Carrilleras de cerdo con salsa PX y puré de patatas cremoso.</p>
                            </div>
                        </div>

                        <div className="menu-section">
                            <h3>Postre</h3>
                            <div className="menu-items">
                                <p>Piña asada con chips de chocolate y quenelle de helado de vainilla.</p>
                            </div>
                        </div>

                        <div className="divider-line"></div>

                        {/* NOCHEVIEJA MENU */}
                        <h2>Nochevieja</h2>

                        <div className="menu-section">
                            <h3>Entrantes</h3>
                            <div className="menu-items">
                                <p>Sepia a la plancha con salsa Mery.</p>
                                <p>Ensalada de burrata con higos, tomates confitados y miel.</p>
                                <p>Tabla de quesos y embutidos.</p>
                            </div>
                        </div>

                        <div className="menu-section">
                            <h3>Principal a elegir</h3>
                            <div className="menu-items">
                                <p>Arroz meloso de secreto ibérico, setas shitake y foie.</p>
                                <p>ó</p>
                                <p>Arroz meloso de rape y colas de gambón.</p>
                            </div>
                        </div>

                        <div className="menu-section">
                            <h3>Postre</h3>
                            <div className="menu-items">
                                <p>Pavlova con nata montada y frutos rojos.<br />Hecho por la Seba.</p>
                            </div>
                        </div>

                    </div>
                </section>

            </main>
        </>
    );
}
