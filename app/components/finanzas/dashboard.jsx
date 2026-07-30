"use client";

import { euros, nombreMes } from '@/app/lib/finanzas/formato';

/**
 * Dashboard de control.
 *
 * Las barras son divs con un ancho en porcentaje, sin librería de
 * gráficos: para doce meses de datos no hace falta, y así no hay 200 KB
 * de JavaScript ni un tema de colores que pelearse con la escala de
 * grises.
 */
export default function Dashboard({ historico, cuentas, reservas, trimestres }) {
    if (!historico.length) {
        return (
            <div className="fz-seccion">
                <p className="fz-vacio">
                    Cuando anotes el primer mes aparecerán aquí las comparaciones.
                </p>
            </div>
        );
    }

    // El histórico llega del mes más reciente al más antiguo.
    const ultimo = historico[0];
    const meses = historico.length;

    const mediaLimpio = historico.reduce((s, h) => s + h.total_limpio, 0) / meses;
    const mediaIngresos = historico.reduce((s, h) => s + h.ingresos_totales, 0) / meses;
    const mediaFijos = historico.reduce((s, h) => s + h.gastos_fijos, 0) / meses;

    const ivaPendiente = trimestres.reduce((s, t) => s + t.pendiente, 0);
    const reservado = reservas
        .filter((r) => r.estado === 'activa')
        .reduce((s, r) => s + r.importe, 0);
    const disponibleTotal = cuentas.reduce((s, c) => s + c.disponible, 0);

    // Escala común para que las barras sean comparables entre sí.
    const techo = Math.max(...historico.map((h) => Math.abs(h.total_limpio)), 1);
    const ancho = (v) => `${Math.min(100, (Math.abs(v) / techo) * 100)}%`;

    const kpi = (v) => (v < 0 ? ' fz-kpi__valor--negativo' : '');

    return (
        <>
            <div className="fz-kpis">
                <div className="fz-kpi">
                    <p className="fz-kpi__etiqueta">Disponible real</p>
                    <p className={`fz-kpi__valor${kpi(disponibleTotal)}`}>
                        {euros(disponibleTotal)}
                    </p>
                    <p className="fz-kpi__pie">Sumando las cinco cuentas</p>
                </div>

                <div className="fz-kpi">
                    <p className="fz-kpi__etiqueta">IVA pendiente</p>
                    <p className="fz-kpi__valor fz-kpi__valor--retenido">
                        {euros(ivaPendiente)}
                    </p>
                    <p className="fz-kpi__pie">Retenido para Hacienda</p>
                </div>

                <div className="fz-kpi">
                    <p className="fz-kpi__etiqueta">Apartado</p>
                    <p className="fz-kpi__valor fz-kpi__valor--retenido">{euros(reservado)}</p>
                    <p className="fz-kpi__pie">Reservas activas</p>
                </div>

                <div className="fz-kpi">
                    <p className="fz-kpi__etiqueta">Limpio medio</p>
                    <p className={`fz-kpi__valor${kpi(mediaLimpio)}`}>{euros(mediaLimpio)}</p>
                    <p className="fz-kpi__pie">
                        Media de {meses} {meses === 1 ? 'mes' : 'meses'}
                    </p>
                </div>
            </div>

            <div className="fz-seccion">
                <p className="fz-seccion__titulo">
                    <span>Total limpio por mes</span>
                    <span style={{ letterSpacing: 0, textTransform: 'none' }}>
                        media {euros(mediaLimpio)}
                    </span>
                </p>

                <div className="fz-barras">
                    {/* Del más antiguo al más reciente: se lee como una línea de tiempo. */}
                    {[...historico].reverse().map((h) => (
                        <div className="fz-barras__fila" key={h.mes}>
                            <span className="fz-barras__mes">{nombreMes(h.mes)}</span>
                            <div className="fz-barras__pista">
                                <div
                                    className={`fz-barras__valor${h.total_limpio < 0 ? ' fz-barras__valor--negativo' : ''}`}
                                    style={{ width: ancho(h.total_limpio) }}
                                />
                            </div>
                            <span className="fz-barras__cifra">{euros(h.total_limpio)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fz-form">
                <div className="fz-seccion">
                    <p className="fz-seccion__titulo">Ingresos por mes</p>
                    <div className="fz-barras">
                        {[...historico].reverse().map((h) => {
                            const max = Math.max(...historico.map((x) => x.ingresos_totales), 1);
                            return (
                                <div className="fz-barras__fila" key={h.mes}>
                                    <span className="fz-barras__mes">{nombreMes(h.mes)}</span>
                                    <div className="fz-barras__pista">
                                        <div
                                            className="fz-barras__valor"
                                            style={{ width: `${(h.ingresos_totales / max) * 100}%` }}
                                        />
                                    </div>
                                    <span className="fz-barras__cifra">
                                        {euros(h.ingresos_totales)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="fz-seccion">
                    <p className="fz-seccion__titulo">Promedios</p>
                    <div className="fz-cascada">
                        <div className="fz-cascada__fila">
                            <span className="fz-cascada__etiqueta">Ingresos al mes</span>
                            <span className="fz-cascada__cifra">{euros(mediaIngresos)}</span>
                        </div>
                        <div className="fz-cascada__fila">
                            <span className="fz-cascada__etiqueta">
                                Gastos fijos
                                <span className="fz-cascada__nota">recibos que no cambian</span>
                            </span>
                            <span className="fz-cascada__cifra">{euros(mediaFijos)}</span>
                        </div>
                        <div className="fz-cascada__fila fz-cascada__fila--subtotal">
                            <span className="fz-cascada__etiqueta">Último mes limpio</span>
                            <span className="fz-cascada__cifra">{euros(ultimo.total_limpio)}</span>
                        </div>
                    </div>

                    {mediaIngresos > 0 && (
                        <p className="fz-kpi__pie" style={{ marginTop: 14 }}>
                            Los gastos fijos se llevan{' '}
                            {Math.round((mediaFijos / mediaIngresos) * 100)}% de lo que entra.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
