"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ermoLogo from '@/app/assets/logo/ERMO_blue.svg';

import Cifra from '@/app/components/finanzas/cifra';
import Cascada from '@/app/components/finanzas/cascada';
import ResumenMes from '@/app/components/finanzas/resumen-mes';
import TiraBancos from '@/app/components/finanzas/tira-bancos';
import AltaMovimiento from '@/app/components/finanzas/alta-movimiento';
import ListaMovimientos from '@/app/components/finanzas/lista-movimientos';
import PanelIva from '@/app/components/finanzas/panel-iva';
import PanelReservas from '@/app/components/finanzas/panel-reservas';
import Dashboard from '@/app/components/finanzas/dashboard';
import GastosFijos from '@/app/components/finanzas/gastos-fijos';
import Plegable from '@/app/components/finanzas/plegable';
import { nombreMes } from '@/app/lib/finanzas/formato';

// Dos vistas, no cuatro pestañas: el mes que estás llevando y la
// evolución de todos. Dentro del mes, todo va en una sola columna que
// se lee de arriba abajo, como la hoja de papel.
const VISTAS = [
    { id: 'mes', texto: 'El mes' },
    { id: 'evolucion', texto: 'Evolución' },
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
    const [vista, setVista] = useState('mes');
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
        reservas, provisiones, trimestres, fijos, fijosDeBaja, historico,
    } = datos;

    const ivaRetenido = trimestres.reduce((s, t) => s + t.pendiente, 0);
    const disponibleTotal = cuentas.reduce((s, c) => s + c.disponible, 0);
    const listaFijos = fijos || [];
    const fijosPendientes = listaFijos.filter((f) => f.toca && !f.ya_apuntado);
    const totalPendiente = fijosPendientes.reduce((s, f) => s + (f.importe_previsto || 0), 0);
    const reservasActivas = reservas.filter((r) => r.estado === 'activa');
    const totalApartado = reservasActivas.reduce((s, r) => s + r.importe, 0);

    return (
        <div className="fz">
            <div className="fz__contenedor">
                <header className="fz-cabecera">
                    <div className="fz-cabecera__marca">
                        <Image
                            className="fz-cabecera__logo"
                            src={ermoLogo}
                            alt="ERMO"
                            height={22}
                            priority
                        />
                        <span className="fz-cabecera__seccion">Finanzas</span>
                    </div>
                    <button className="fz-boton fz-boton--suave" type="button" onClick={salir}>
                        Salir
                    </button>
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
                            className="fz-boton fz-boton--suave"
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

                <nav className="fz-pildoras">
                    {VISTAS.map((v) => (
                        <button
                            key={v.id}
                            type="button"
                            className={`fz-pildoras__item${vista === v.id ? ' fz-pildoras__item--activo' : ''}`}
                            onClick={() => setVista(v.id)}
                        >
                            {v.texto}
                        </button>
                    ))}
                </nav>

                {vista === 'mes' && (
                    <>
                        {/* Lo primero: cuánto ha entrado y salido este mes. */}
                        <ResumenMes
                            resumen={resumen}
                            historico={historico}
                            mes={mes}
                        />

                        {/* Qué hay en cada banco: se mira de reojo, pero
                            se mira. */}
                        <TiraBancos cuentas={cuentas} />

                        <Plegable
                            titulo="Anotar movimiento"
                            resumen="Gasto, ingreso o traspaso"
                        >
                            <AltaMovimiento
                                cuentas={cuentas}
                                categorias={categorias}
                                mes={mes}
                                onGuardado={cargar}
                            />
                        </Plegable>

                        <Plegable
                            titulo="De dónde sale"
                            resumen="Ingresos, gastos e IVA"
                        >
                            <Cascada resumen={resumen} />
                        </Plegable>

                        <Plegable
                            titulo="Movimientos"
                            resumen={movimientos.length === 1
                                ? '1 apunte'
                                : `${movimientos.length} apuntes`}
                        >
                            <ListaMovimientos
                                movimientos={movimientos}
                                onBorrar={borrarMovimiento}
                            />
                        </Plegable>

                        <Plegable
                            titulo="Gastos fijos"
                            etiqueta={fijosPendientes.length > 0 && (
                                <span className="fz-tag fz-tag--acento">
                                    {fijosPendientes.length} sin apuntar
                                </span>
                            )}
                            resumen={
                                fijosPendientes.length > 0
                                    ? <><Cifra valor={totalPendiente} signo={false} tono="acento" /> por apuntar</>
                                    : `${listaFijos.length} recibos, todos al día`
                            }
                        >
                            <GastosFijos
                                fijos={listaFijos}
                                deBaja={fijosDeBaja || []}
                                cuentas={cuentas}
                                mes={mes}
                                onCambio={cargar}
                            />
                        </Plegable>

                        <Plegable
                            titulo="IVA"
                            resumen={
                                ivaRetenido > 0
                                    ? <><Cifra valor={ivaRetenido} signo={false} tono="acento" /> retenidos</>
                                    : <><Cifra valor={0} signo={false} /> retenidos</>
                            }
                        >
                            <PanelIva
                                provisiones={provisiones}
                                trimestres={trimestres}
                                cuentas={cuentas}
                                mes={mes}
                                onCambio={cargar}
                            />
                        </Plegable>

                        <Plegable
                            titulo="Dinero apartado"
                            resumen={
                                totalApartado > 0
                                    ? <><Cifra valor={totalApartado} signo={false} tono="acento" /> sin tocar</>
                                    : <><Cifra valor={0} signo={false} /> apartado</>
                            }
                        >
                            <PanelReservas
                                reservas={reservas}
                                cuentas={cuentas}
                                onCambio={cargar}
                            />
                        </Plegable>
                    </>
                )}

                {vista === 'evolucion' && (
                    <Dashboard
                        historico={historico}
                        cuentas={cuentas}
                        reservas={reservas}
                        trimestres={trimestres}
                    />
                )}
            </div>
        </div>
    );
}
