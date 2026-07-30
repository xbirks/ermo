"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ermoLogo from '@/app/assets/logo/ERMO_blue.svg';

import Cifra from '@/app/components/finanzas/cifra';
import Cascada from '@/app/components/finanzas/cascada';
import TiraBancos from '@/app/components/finanzas/tira-bancos';
import AltaMovimiento from '@/app/components/finanzas/alta-movimiento';
import ListaMovimientos from '@/app/components/finanzas/lista-movimientos';
import PanelIva from '@/app/components/finanzas/panel-iva';
import PanelReservas from '@/app/components/finanzas/panel-reservas';
import Dashboard from '@/app/components/finanzas/dashboard';
import VistaAnual from '@/app/components/finanzas/vista-anual';
import NotaMes from '@/app/components/finanzas/nota-mes';
import GastosFijos from '@/app/components/finanzas/gastos-fijos';
import Plegable from '@/app/components/finanzas/plegable';
import { nombreMes } from '@/app/lib/finanzas/formato';

// Dos vistas, no cuatro pestañas: el mes que estás llevando y la
// evolución de todos. Dentro del mes, todo va en una sola columna que
// se lee de arriba abajo, como la hoja de papel.
const VISTAS = [
    { id: 'mes', texto: 'El mes' },
    { id: 'anio', texto: 'El año' },
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

    // El mes vive en la URL: así se ve cuál se está mirando, recargar
    // no devuelve a hoy, y se puede guardar el enlace de un mes
    // concreto.
    //
    // Se lee de window en lugar de con useSearchParams porque ese hook
    // obliga a envolver la página en <Suspense> y a renderizarla sólo
    // en cliente. Aquí basta con leerlo al montar.
    const [mes, setMes] = useState(() => {
        if (typeof window === 'undefined') return mesActual();
        const enUrl = new URLSearchParams(window.location.search).get('mes');
        return /^\d{4}-\d{2}-01$/.test(enUrl || '') ? enUrl : mesActual();
    });

    // Refleja el mes en la barra de direcciones sin recargar la página.
    useEffect(() => {
        const actual = new URLSearchParams(window.location.search).get('mes');
        if (actual === mes) return;
        const url = mes === mesActual()
            ? '/interno/finanzas'
            : `/interno/finanzas?mes=${mes}`;
        window.history.replaceState(null, '', url);
    }, [mes]);
    const [vista, setVista] = useState('mes');
    const [anotando, setAnotando] = useState(false);
    // Sube al cambiar para abrir la sección de fijos desde el botón.
    const [abrirFijos, setAbrirFijos] = useState(0);
    const [abrirApartado, setAbrirApartado] = useState(0);
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
        reservas, provisiones, trimestres, fijos, fijosDeBaja, nota, historico,
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
                            Este mes
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
                        {/* Lo primero: cuánto ha entrado y salido, y qué
                            hay en cada banco. Lado a lado en escritorio. */}
                        {/* Lo primero y a ancho completo: qué hay en cada
                            banco. Es la pregunta con la que se abre la
                            app. */}
                        <TiraBancos
                            cuentas={cuentas}
                            onCambio={cargar}
                            onVerApartado={() => setAbrirApartado((n) => n + 1)}
                        />


                        {/* Por qué el mes salió así, cuando hace falta
                            explicarlo. */}
                        <NotaMes mes={mes} nota={nota} onGuardado={cargar} />

                        {/* Las dos cosas que se hacen a diario, destacadas
                            sobre lo que sólo se consulta. */}
                        <div className="fz-acciones">
                            <button
                                className="fz-accion"
                                type="button"
                                onClick={() => setAnotando((v) => !v)}
                            >
                                <span className="fz-accion__texto">
                                    {anotando ? 'Cerrar' : 'Anotar movimiento'}
                                    <span className="fz-accion__pie">
                                        Un gasto, un cobro o un traspaso
                                    </span>
                                </span>
                                <span className="fz-accion__signo">{anotando ? '×' : '+'}</span>
                            </button>

                            {fijosPendientes.length > 0 ? (
                                <button
                                    className="fz-accion fz-accion--pendiente"
                                    type="button"
                                    onClick={() => setAbrirFijos((n) => n + 1)}
                                >
                                    <span className="fz-accion__texto">
                                        Apuntar los recibos del mes
                                        <span className="fz-accion__pie">
                                            Quedan {fijosPendientes.length} por apuntar
                                        </span>
                                    </span>
                                    <span className="fz-accion__signo">
                                        <Cifra valor={totalPendiente} signo={false} />
                                    </span>
                                </button>
                            ) : (
                                <div className="fz-accion fz-accion--suave" style={{ cursor: 'default' }}>
                                    <span className="fz-accion__texto">
                                        Recibos al día
                                        <span className="fz-accion__pie">
                                            Los {listaFijos.length} del mes están apuntados
                                        </span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {anotando && (
                            <div className="fz-editor" style={{ marginBottom: 30 }}>
                                <AltaMovimiento
                                    cuentas={cuentas}
                                    categorias={categorias}
                                    mes={mes}
                                    onGuardado={() => { cargar(); setAnotando(false); }}
                                />
                            </div>
                        )}

                        <Plegable
                            titulo="De dónde sale."
                            resumen="Ingresos, gastos e IVA"
                        >
                            <Cascada resumen={resumen} />
                        </Plegable>

                        <Plegable
                            titulo="Movimientos."
                            resumen={movimientos.length === 1
                                ? '1 apunte'
                                : `${movimientos.length} apuntes`}
                        >
                            <ListaMovimientos
                                movimientos={movimientos}
                                onBorrar={borrarMovimiento}
                            />
                        </Plegable>

                        <div className="fz-secciones">
                        <Plegable
                            titulo="Gastos fijos."
                            abrir={abrirFijos}
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
                            titulo="IVA."
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
                                resumen={resumen}
                                onCambio={cargar}
                            />
                        </Plegable>

                        <Plegable
                            titulo="Dinero apartado."
                            abrir={abrirApartado}
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
                        </div>
                    </>
                )}

                {vista === 'anio' && (
                    <VistaAnual
                        onIrAlMes={(m) => { setMes(m); setVista('mes'); }}
                    />
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
