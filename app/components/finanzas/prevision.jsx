"use client";

import Cifra from './cifra';

/**
 * Qué queda libre de aquí a fin de mes.
 *
 * Es el cálculo que se hace a mano en la libreta, y responde a otra
 * pregunta que la cascada: la cascada mira hacia atrás —qué pasó el mes
 * pasado— y esto mira hacia delante: de lo que hay ahora mismo en la
 * cuenta, cuánto sobra cuando se paguen los recibos que vienen.
 *
 * Parte del saldo real del banco y va restando en cascada, igual que en
 * el papel:
 *
 *   2.877  en Imagin hoy
 *   − 512  gastos fijos de Imagin
 *   − 302  cuota de autónomos
 *   − 602  IVA que toca pagar
 *   − ...  el resto de recibos pendientes
 *   = lo que queda libre
 */
export default function Prevision({ cuentas, fijos, iva, reservas, mes }) {
    const enCuentas = cuentas
        .filter((c) => c.tipo === 'corriente' || c.tipo === 'efectivo')
        .reduce((s, c) => s + c.saldo_actual, 0);

    // Los recibos que aún no se han apuntado este mes: son los que
    // quedan por salir de la cuenta.
    const pendientes = (fijos || []).filter((f) => f.toca && !f.ya_apuntado);
    const totalFijos = pendientes.reduce((s, f) => s + (f.importe_previsto || 0), 0);

    // El IVA retenido: dinero que está en la cuenta pero es de Hacienda.
    const ivaPendiente = (iva || []).reduce((s, t) => s + t.pendiente, 0);

    // Lo apartado a propósito.
    const apartado = (reservas || [])
        .filter((r) => r.estado === 'activa')
        .reduce((s, r) => s + r.importe, 0);

    const libre = enCuentas - totalFijos - ivaPendiente - apartado;

    // Agrupa los recibos por cuenta, como en la libreta.
    const porCuenta = {};
    for (const f of pendientes) {
        const k = f.cuenta || 'Sin cuenta';
        porCuenta[k] = (porCuenta[k] || 0) + (f.importe_previsto || 0);
    }

    return (
        <div className="fz-prevision">
            <p className="fz-prevision__titulo">Qué queda libre.</p>

            <div className="fz-cascada">
                <div className="fz-cascada__fila fz-cascada__fila--subtotal">
                    <span className="fz-cascada__etiqueta">
                        Hay ahora en las cuentas
                        <span className="fz-cascada__nota">según el banco</span>
                    </span>
                    <Cifra className="fz-cascada__cifra" valor={enCuentas} signo={false} />
                </div>

                {Object.entries(porCuenta).map(([cuenta, importe]) => (
                    <div className="fz-cascada__fila" key={cuenta}>
                        <span className="fz-cascada__etiqueta">
                            Recibos de {cuenta}
                            <span className="fz-cascada__nota">aún sin pagar</span>
                        </span>
                        <Cifra className="fz-cascada__cifra" valor={importe} signo="−" />
                    </div>
                ))}

                {ivaPendiente > 0 && (
                    <div className="fz-cascada__fila fz-cascada__fila--retenido">
                        <span className="fz-cascada__etiqueta">
                            IVA que toca pagar
                            <span className="fz-cascada__nota">retenido para Hacienda</span>
                        </span>
                        <Cifra
                            className="fz-cascada__cifra"
                            valor={ivaPendiente}
                            signo="−"
                            tono="acento"
                        />
                    </div>
                )}

                {apartado > 0 && (
                    <div className="fz-cascada__fila fz-cascada__fila--retenido">
                        <span className="fz-cascada__etiqueta">
                            Apartado
                            <span className="fz-cascada__nota">no se toca</span>
                        </span>
                        <Cifra
                            className="fz-cascada__cifra"
                            valor={apartado}
                            signo="−"
                            tono="acento"
                        />
                    </div>
                )}

                <div className="fz-cascada__limpio">
                    <span className="fz-cascada__limpio-etiqueta">Queda libre</span>
                    <Cifra className="fz-cascada__limpio-cifra" valor={libre} />
                    <p className="fz-cascada__limpio-pie">
                        De lo que hay hoy, una vez pagados los recibos que vienen.
                    </p>
                </div>
            </div>
        </div>
    );
}
