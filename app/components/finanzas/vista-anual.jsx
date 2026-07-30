"use client";

import { useState, useEffect } from 'react';
import Cifra from './cifra';
import { nombreMes } from '@/app/lib/finanzas/formato';

/**
 * Un año completo, mes a mes.
 *
 * Con tres años de histórico importado, la navegación mes a mes no
 * basta para ver la evolución: hay que poder mirar un año entero y
 * compararlo con otro.
 *
 * Los meses sin movimientos aparecen igualmente, apagados: así se ve
 * que ese mes estuvo vacío en lugar de parecer que falta.
 */
export default function VistaAnual({ onIrAlMes }) {
    const [anio, setAnio] = useState(() => new Date().getFullYear());
    const [datos, setDatos] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let vigente = true;
        setCargando(true);
        fetch(`/api/finanzas/anual?anio=${anio}`, { cache: 'no-store' })
            .then((r) => r.json())
            .then((j) => { if (vigente) setDatos(j); })
            .finally(() => { if (vigente) setCargando(false); });
        return () => { vigente = false; };
    }, [anio]);

    if (cargando && !datos) {
        return <p className="fz-vacio">Cargando el año</p>;
    }
    if (!datos || datos.error) {
        return <p className="fz-vacio">{datos?.error || 'No se ha podido cargar'}</p>;
    }

    const { meses, anios, deudas } = datos;
    const conDatos = meses.filter((m) => m.tiene_datos);

    const total = (campo) => conDatos.reduce((s, m) => s + m[campo], 0);
    const totalIngresos = total('ingresos');
    const totalGastos = total('gastos');
    const totalLimpio = total('limpio');

    // Escala común para las barras: comparables entre sí.
    const techo = Math.max(...meses.map((m) => Math.max(m.ingresos, m.gastos)), 1);
    const ancho = (v) => `${Math.min(100, (v / techo) * 100)}%`;

    return (
        <>
            {/* Selector de año */}
            <div className="fz-anios">
                {(anios || []).map((a) => (
                    <button
                        key={a}
                        type="button"
                        className={`fz-anios__item${a === anio ? ' fz-anios__item--activo' : ''}`}
                        onClick={() => setAnio(a)}
                    >
                        {a}
                    </button>
                ))}
            </div>

            <div className="fz-resumen__par" style={{ marginBottom: 28 }}>
                <div className="fz-resumen__bloque">
                    <p className="fz-resumen__etiqueta">Entró en {anio}.</p>
                    <p className="fz-resumen__cifra">
                        <Cifra valor={totalIngresos} signo={false} tono="entra" />
                    </p>
                </div>
                <div className="fz-resumen__bloque">
                    <p className="fz-resumen__etiqueta">Salió en {anio}.</p>
                    <p className="fz-resumen__cifra">
                        <Cifra valor={totalGastos} signo={false} />
                    </p>
                </div>
            </div>

            <div className="fz-resumen__limpio" style={{ marginBottom: 32 }}>
                <p className="fz-resumen__etiqueta">Quedó limpio en el año.</p>
                <p className="fz-resumen__total">
                    <Cifra valor={totalLimpio} />
                </p>
                <p className="fz-resumen__pie">
                    Sumando los {conDatos.length}{' '}
                    {conDatos.length === 1 ? 'mes con datos' : 'meses con datos'}.
                </p>
            </div>

            {/* Los doce meses */}
            <div className="fz-anual">
                {meses.map((m) => (
                    <button
                        key={m.mes}
                        type="button"
                        className={`fz-anual__mes${m.tiene_datos ? '' : ' fz-anual__mes--vacio'}`}
                        onClick={() => m.tiene_datos && onIrAlMes?.(String(m.mes).slice(0, 10))}
                        disabled={!m.tiene_datos}
                    >
                        <span className="fz-anual__nombre">{nombreMes(m.mes).split(' ')[0]}</span>

                        {m.tiene_datos ? (
                            <>
                                <span className="fz-anual__barras">
                                    <span
                                        className="fz-anual__barra fz-anual__barra--entra"
                                        style={{ width: ancho(m.ingresos) }}
                                    />
                                    <span
                                        className="fz-anual__barra fz-anual__barra--sale"
                                        style={{ width: ancho(m.gastos) }}
                                    />
                                </span>
                                <span className="fz-anual__cifra">
                                    <Cifra valor={m.limpio} />
                                </span>
                            </>
                        ) : (
                            <span className="fz-anual__sin">Sin movimientos</span>
                        )}
                    </button>
                ))}
            </div>

            {deudas?.length > 0 && (
                <div className="fz-seccion" style={{ marginTop: 36 }}>
                    <p className="fz-seccion__titulo">Lo que se debe</p>
                    {deudas.map((d) => (
                        <div className="fz-fila" key={d.id}>
                            <div>
                                <p className="fz-fila__titulo">{d.concepto}</p>
                                <p className="fz-fila__detalle">
                                    {d.cuota && `${d.cuota} € el día ${d.dia_cobro}`}
                                    {d.cuenta && ` · desde ${d.cuenta}`}
                                    {d.cuota > 0 &&
                                        ` · quedan ${Math.ceil(d.pendiente / d.cuota)} cuotas`}
                                </p>
                            </div>
                            <span className="fz-fila__cifra">
                                <Cifra valor={d.pendiente} signo={false} />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
