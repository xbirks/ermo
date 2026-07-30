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
        gastos_fijos, gastos_variables, iva_provisionado, iva_pagado,
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

            {/* El IVA pagado a Hacienda, cuando el mes tiene una
                liquidación. Ya está dentro de los gastos del extracto,
                así que se muestra para que se vea, sin restar otra vez. */}
            {iva_pagado > 0 && (
                <div className="fz-cascada__fila fz-cascada__fila--retenido">
                    <span className="fz-cascada__etiqueta">
                        IVA pagado a Hacienda
                        <span className="fz-cascada__nota">liquidación del trimestre</span>
                    </span>
                    <Cifra
                        className="fz-cascada__cifra"
                        valor={iva_pagado}
                        signo={false}
                        tono="acento"
                    />
                </div>
            )}

            <div className="fz-cascada__limpio">
                <span className="fz-cascada__limpio-etiqueta">Total limpio</span>
                <Cifra className="fz-cascada__limpio-cifra" valor={total_limpio} />
                {iva_provisionado > 0 && (
                    <p className="fz-cascada__limpio-pie">
                        Guarda <Cifra valor={iva_provisionado} signo={false} tono="acento" />
                        {' '}para el IVA del próximo trimestre.
                    </p>
                )}
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
