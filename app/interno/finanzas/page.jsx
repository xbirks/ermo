"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ermoLogo from '@/app/assets/logo/ERMO_blue.svg';

import Cascada from '@/app/components/finanzas/cascada';
import AltaMovimiento from '@/app/components/finanzas/alta-movimiento';
import ListaMovimientos from '@/app/components/finanzas/lista-movimientos';
import PanelIva from '@/app/components/finanzas/panel-iva';
import PanelReservas from '@/app/components/finanzas/panel-reservas';
import Dashboard from '@/app/components/finanzas/dashboard';
import { euros, nombreMes } from '@/app/lib/finanzas/formato';

const PESTANAS = [
    { id: 'mes', texto: 'El mes' },
    { id: 'panel', texto: 'Control' },
    { id: 'iva', texto: 'IVA' },
    { id: 'reservas', texto: 'Apartado' },
];

/** Primer día del mes actual, en formato YYYY-MM-DD y hora local. */
function mesActual() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

/** Suma o resta meses sin salirse del día 1. */
function desplazarMes(mes, salto) {
    const [a, m] = mes.split('-').map(Number);
    const d = new Date(a, m - 1 + salto, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export default function FinanzasPage() {
    const router = useRouter();
    const [mes, setMes] = useState(mesActual);
    const [pestana, setPestana] = useState('mes');
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(true);

    const cargar = useCallback(async () => {
        setError('');
        try {
            const res = await fetch(`/api/finanzas/panel?mes=${mes}`, { cache: 'no-store' });

            // El middleware devuelve 401 si la sesión ha caducado.
            if (res.status === 401) {
                router.replace('/interno/finanzas/entrar');
                return;
            }

            const json = await res.json();
            if (!res.ok) {
                setError(json.error || 'No se han podido cargar los datos');
                return;
            }
            setDatos(json);
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setCargando(false);
        }
    }, [mes, router]);

    useEffect(() => { cargar(); }, [cargar]);

    async function borrarMovimiento(id) {
        await fetch(`/api/finanzas/transacciones?id=${id}`, { method: 'DELETE' });
        cargar();
    }

    async function salir() {
        await fetch('/api/finanzas/entrar', { method: 'DELETE' });
        router.replace('/interno/finanzas/entrar');
    }

    if (cargando && !datos) {
        return (
            <div className="fz">
                <div className="fz__contenedor">
                    <p className="fz-vacio">Cargando</p>
                </div>
            </div>
        );
    }

    if (error && !datos) {
        return (
            <div className="fz">
                <div className="fz__contenedor">
                    <div className="fz-aviso fz-aviso--error">{error}</div>
                    <button className="fz-boton" type="button" onClick={cargar}>
                        Volver a intentar
                    </button>
                </div>
            </div>
        );
    }

    const {
        cuentas, categorias, resumen, movimientos,
        reservas, provisiones, trimestres, historico,
    } = datos;

    return (
        <div className="fz">
            <div className="fz__contenedor">
                <header className="fz-cabecera">
                    <div className="fz-cabecera__marca">
                        <Image
                            className="fz-cabecera__logo"
                            src={ermoLogo}
                            alt="ERMO"
                            height={26}
                            priority
                        />
                        <span className="fz-cabecera__sep" />
                        <span className="fz-cabecera__seccion">Finanzas</span>
                    </div>
                    <div className="fz-cabecera__acciones">
                        <button className="fz-boton fz-boton--fantasma" type="button" onClick={salir}>
                            Salir
                        </button>
                    </div>
                </header>

                {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

                <div className="fz-mes">
                    <h1 className="fz-mes__nombre">{nombreMes(mes)}</h1>
                    <div className="fz-mes__nav">
                        <button
                            className="fz-boton fz-boton--icono"
                            type="button"
                            onClick={() => setMes((m) => desplazarMes(m, -1))}
                            aria-label="Mes anterior"
                        >
                            ‹
                        </button>
                        <button
                            className="fz-boton fz-boton--fantasma"
                            type="button"
                            onClick={() => setMes(mesActual())}
                        >
                            Hoy
                        </button>
                        <button
                            className="fz-boton fz-boton--icono"
                            type="button"
                            onClick={() => setMes((m) => desplazarMes(m, 1))}
                            aria-label="Mes siguiente"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* Saldos: lo que hay frente a lo que se puede gastar. */}
                <div className="fz-cuentas">
                    {cuentas.map((c) => {
                        const hayMerma = c.iva_retenido > 0 || c.reservado > 0;
                        return (
                            <div className="fz-cuenta" key={c.id}>
                                <p className="fz-cuenta__nombre">
                                    <span>{c.nombre}</span>
                                </p>
                                <p className={`fz-cuenta__disponible${c.disponible < 0 ? ' fz-cuenta__disponible--negativo' : ''}`}>
                                    {euros(c.disponible)}
                                </p>
                                {hayMerma && (
                                    <div className="fz-cuenta__merma fz-cuenta__merma--retenido">
                                        <span>
                                            En el banco <b>{euros(c.saldo_actual)}</b>
                                        </span>
                                        {c.iva_retenido > 0 && (
                                            <span>IVA retenido <b>−{euros(c.iva_retenido)}</b></span>
                                        )}
                                        {c.reservado > 0 && (
                                            <span>Apartado <b>−{euros(c.reservado)}</b></span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <nav className="fz-pestanas">
                    {PESTANAS.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            className={`fz-pestanas__item${pestana === p.id ? ' fz-pestanas__item--activo' : ''}`}
                            onClick={() => setPestana(p.id)}
                        >
                            {p.texto}
                        </button>
                    ))}
                </nav>

                {pestana === 'mes' && (
                    <div className="fz-rejilla">
                        <div>
                            <div className="fz-panel">
                                <p className="fz-panel__titulo">Cascada del mes</p>
                                <Cascada resumen={resumen} />
                            </div>

                            <div className="fz-panel">
                                <p className="fz-panel__titulo">
                                    <span>Movimientos</span>
                                    <span style={{ letterSpacing: 0, textTransform: 'none' }}>
                                        {movimientos.length}
                                    </span>
                                </p>
                                <ListaMovimientos
                                    movimientos={movimientos}
                                    onBorrar={borrarMovimiento}
                                />
                            </div>
                        </div>

                        <AltaMovimiento
                            cuentas={cuentas}
                            categorias={categorias}
                            mes={mes}
                            onGuardado={cargar}
                        />
                    </div>
                )}

                {pestana === 'panel' && (
                    <Dashboard
                        historico={historico}
                        cuentas={cuentas}
                        reservas={reservas}
                        trimestres={trimestres}
                    />
                )}

                {pestana === 'iva' && (
                    <PanelIva
                        provisiones={provisiones}
                        trimestres={trimestres}
                        cuentas={cuentas}
                        mes={mes}
                        onCambio={cargar}
                    />
                )}

                {pestana === 'reservas' && (
                    <PanelReservas
                        reservas={reservas}
                        cuentas={cuentas}
                        onCambio={cargar}
                    />
                )}
            </div>
        </div>
    );
}
