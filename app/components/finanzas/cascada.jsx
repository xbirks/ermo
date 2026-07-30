"use client";

import { euros } from '@/app/lib/finanzas/formato';

/**
 * La hoja de papel, en pantalla.
 *
 * Mantiene el orden de la libreta: ingresos arriba, cada resta debajo
 * de la anterior, raya, total limpio. El reparto a ahorro e inversión
 * va aparte y después, porque en las hojas se decide una vez que el
 * limpio ya está calculado. Restarlo antes daría un número que no
 * coincide con la forma de llevarlo a mano.
 */
export default function Cascada({ resumen }) {
    const {
        ingresos_banco, ingresos_efectivo, ingresos_totales,
        gastos_fijos, gastos_variables, iva_provisionado,
        total_limpio, a_ahorro_inversion,
    } = resumen;

    const negativo = total_limpio < 0;

    return (
        <div className="fz-cascada">
            <div className="fz-cascada__fila">
                <span className="fz-cascada__etiqueta">Ingresos en banco</span>
                <span className="fz-cascada__cifra">{euros(ingresos_banco)}</span>
            </div>

            {ingresos_efectivo > 0 && (
                <div className="fz-cascada__fila">
                    <span className="fz-cascada__etiqueta">
                        Cobros en efectivo
                        <span className="fz-cascada__nota">cartera</span>
                    </span>
                    <span className="fz-cascada__cifra">{euros(ingresos_efectivo)}</span>
                </div>
            )}

            <div className="fz-cascada__fila fz-cascada__fila--subtotal">
                <span className="fz-cascada__etiqueta">Total ingresos</span>
                <span className="fz-cascada__cifra">{euros(ingresos_totales)}</span>
            </div>

            <div className="fz-cascada__fila fz-cascada__fila--resta">
                <span className="fz-cascada__etiqueta">
                    Gastos fijos
                    <span className="fz-cascada__nota">recibos de cada mes</span>
                </span>
                <span className="fz-cascada__cifra">−{euros(gastos_fijos)}</span>
            </div>

            <div className="fz-cascada__fila fz-cascada__fila--resta">
                <span className="fz-cascada__etiqueta">Gastos variables</span>
                <span className="fz-cascada__cifra">−{euros(gastos_variables)}</span>
            </div>

            {/* El IVA en ámbar: está en la cuenta pero no es tuyo. */}
            <div className="fz-cascada__fila fz-cascada__fila--resta fz-cascada__fila--retenido">
                <span className="fz-cascada__etiqueta">
                    IVA del mes
                    <span className="fz-cascada__nota">retenido para Hacienda</span>
                </span>
                <span className="fz-cascada__cifra">−{euros(iva_provisionado)}</span>
            </div>

            <div className={`fz-cascada__fila fz-cascada__fila--limpio${negativo ? ' fz-cascada__fila--negativo' : ''}`}>
                <span className="fz-cascada__etiqueta">Total limpio</span>
                <span className="fz-cascada__cifra">{euros(total_limpio)}</span>
            </div>

            {a_ahorro_inversion > 0 && (
                <div className="fz-reparto">
                    <p className="fz-reparto__titulo">Reparto</p>
                    <div className="fz-cascada__fila">
                        <span className="fz-cascada__etiqueta">
                            A ahorro e inversión
                            <span className="fz-cascada__nota">ya con el limpio en mano</span>
                        </span>
                        <span className="fz-cascada__cifra">{euros(a_ahorro_inversion)}</span>
                    </div>
                    <div className="fz-cascada__fila fz-cascada__fila--subtotal">
                        <span className="fz-cascada__etiqueta">Queda libre</span>
                        <span className="fz-cascada__cifra">
                            {euros(total_limpio - a_ahorro_inversion)}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
