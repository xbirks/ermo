"use client";

import Cifra from './cifra';

/**
 * La hoja de papel, en pantalla.
 *
 * Mantiene el orden de la libreta: ingresos arriba, cada resta debajo
 * de la anterior, raya, total limpio. El reparto va aparte y después,
 * porque en las hojas se decide una vez que el limpio ya está
 * calculado; restarlo antes daría un número que no coincide con la
 * forma de llevarlo a mano.
 */
export default function Cascada({ resumen }) {
    const {
        ingresos_banco, ingresos_efectivo, ingresos_totales,
        gastos_fijos, gastos_variables, iva_provisionado,
        total_limpio, a_ahorro_inversion,
    } = resumen;

    return (
        <div className="fz-cascada">
            <div className="fz-cascada__fila">
                <span className="fz-cascada__etiqueta">Ingresos en banco</span>
                <Cifra className="fz-cascada__cifra" valor={ingresos_banco} />
            </div>

            {ingresos_efectivo > 0 && (
                <div className="fz-cascada__fila">
                    <span className="fz-cascada__etiqueta">
                        Cobros en efectivo
                        <span className="fz-cascada__nota">cartera</span>
                    </span>
                    <Cifra className="fz-cascada__cifra" valor={ingresos_efectivo} />
                </div>
            )}

            <div className="fz-cascada__fila fz-cascada__fila--subtotal">
                <span className="fz-cascada__etiqueta">Total ingresos</span>
                <Cifra className="fz-cascada__cifra" valor={ingresos_totales} />
            </div>

            <div className="fz-cascada__fila">
                <span className="fz-cascada__etiqueta">
                    Gastos fijos
                    <span className="fz-cascada__nota">recibos de cada mes</span>
                </span>
                <Cifra className="fz-cascada__cifra" valor={-gastos_fijos} />
            </div>

            <div className="fz-cascada__fila">
                <span className="fz-cascada__etiqueta">Gastos variables</span>
                <Cifra className="fz-cascada__cifra" valor={-gastos_variables} />
            </div>

            {/* El IVA en naranja: está en la cuenta pero no es tuyo. */}
            <div className="fz-cascada__fila fz-cascada__fila--retenido">
                <span className="fz-cascada__etiqueta">
                    IVA del mes
                    <span className="fz-cascada__nota">retenido para Hacienda</span>
                </span>
                <Cifra
                    className="fz-cascada__cifra"
                    valor={iva_provisionado}
                    signo="−"
                    tono="acento"
                />
            </div>

            <div className="fz-cascada__limpio">
                <span className="fz-cascada__limpio-etiqueta">Total limpio</span>
                <Cifra className="fz-cascada__limpio-cifra" valor={total_limpio} />
                {a_ahorro_inversion > 0 && (
                    <p className="fz-cascada__limpio-pie">
                        Ya has repartido <Cifra valor={a_ahorro_inversion} signo={false} />
                        {' '}a ahorro e inversión.
                    </p>
                )}
            </div>
        </div>
    );
}
