"use client";

import Cifra from './cifra';

/**
 * Lo primero de la pantalla: cuánto se ha ganado y gastado este mes,
 * comparado con lo normal.
 *
 * Antes esta información estaba enterrada bajo las cinco tarjetas de
 * cuentas y la cascada completa. Los saldos por banco no son lo que se
 * consulta al abrir la app, y ponerlos arriba hacía que la vista
 * empezara por lo secundario.
 *
 * La comparación con la media es lo que convierte un número en una
 * respuesta: 5.570 € no dice nada por sí solo; "un 23 % más de lo
 * normal" sí.
 */
export default function ResumenMes({ resumen, historico, mes }) {
    const { ingresos_totales, gastos_fijos, gastos_variables, total_limpio } = resumen;
    const gastos = gastos_fijos + gastos_variables;

    // Media de los meses anteriores, sin contar el actual: comparar el
    // mes en curso consigo mismo no dice nada.
    const previos = (historico || []).filter((h) => h.mes !== mes);
    const media = (campo) =>
        previos.length ? previos.reduce((s, h) => s + h[campo], 0) / previos.length : null;

    const mediaIngresos = media('ingresos_totales');
    const mediaGastos = previos.length
        ? previos.reduce((s, h) => s + h.gastos_fijos + h.gastos_variables, 0) / previos.length
        : null;

    /** Cuánto se desvía de lo normal, en porcentaje. */
    function comparar(valor, ref) {
        if (!ref || ref === 0 || previos.length < 2) return null;
        const pct = Math.round(((valor - ref) / ref) * 100);
        if (Math.abs(pct) < 8) return 'como siempre';
        return `${pct > 0 ? '+' : ''}${pct}% que de costumbre`;
    }

    const cmpIngresos = comparar(ingresos_totales, mediaIngresos);
    const cmpGastos = comparar(gastos, mediaGastos);

    return (
        <div className="fz-resumen">
            <div className="fz-resumen__par">
                <div className="fz-resumen__bloque">
                    <p className="fz-resumen__etiqueta">Ha entrado.</p>
                    <p className="fz-resumen__cifra">
                        <Cifra valor={ingresos_totales} signo={false} tono="entra" />
                    </p>
                    {cmpIngresos && (
                        <p className="fz-resumen__pie">{cmpIngresos}</p>
                    )}
                </div>

                <div className="fz-resumen__bloque">
                    <p className="fz-resumen__etiqueta">Ha salido.</p>
                    <p className="fz-resumen__cifra">
                        <Cifra valor={gastos} signo={false} />
                    </p>
                    {cmpGastos && (
                        <p className="fz-resumen__pie">{cmpGastos}</p>
                    )}
                </div>
            </div>

            <div className="fz-resumen__limpio">
                <p className="fz-resumen__etiqueta">Queda limpio.</p>
                <p className="fz-resumen__total">
                    <Cifra valor={total_limpio} />
                </p>
                <p className="fz-resumen__pie">
                    Ya descontados los gastos y el IVA del mes.
                </p>
            </div>
        </div>
    );
}
