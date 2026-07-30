"use client";

import Cifra from './cifra';
import { euros, diaCorto } from '@/app/lib/finanzas/formato';

// Los ingresos van en verde. En una lista de treinta apuntes casi
// todos negativos, el signo por sí solo no basta para localizar de un
// vistazo el día que entró dinero.

export default function ListaMovimientos({ movimientos, onBorrar }) {
    if (!movimientos.length) {
        return <p className="fz-vacio">Todavía no hay movimientos en este mes.</p>;
    }

    async function borrar(m) {
        const aviso = `¿Borrar "${m.concepto}" de ${euros(m.importe)}?`;
        if (!window.confirm(aviso)) return;
        onBorrar(m.id);
    }

    return (
        <div className="fz-movimientos">
            {movimientos.map((m) => {
                const clase = m.tipo_movimiento === 'ingreso'
                    ? 'ingreso'
                    : m.tipo_movimiento === 'gasto' ? 'gasto' : 'interna';

                return (
                    <div className="fz-movimientos__fila" key={m.id}>
                        <span className="fz-movimientos__fecha">{diaCorto(m.fecha)}</span>

                        <div className="fz-movimientos__concepto">
                            <p className="fz-movimientos__texto">{m.concepto}</p>
                            <p className="fz-movimientos__meta">
                                {m.tipo_movimiento === 'transferencia_interna'
                                    ? `${m.cuenta} → ${m.cuenta_destino}`
                                    : m.cuenta}
                                {m.categoria && ` · ${m.categoria}`}
                            </p>
                        </div>

                        <span className={`fz-movimientos__importe fz-movimientos__importe--${clase}`}>
                            <Cifra
                                valor={m.importe}
                                signo={m.tipo_movimiento === 'ingreso' ? '+' : m.tipo_movimiento === 'gasto' ? '−' : false}
                                tono={m.tipo_movimiento === 'ingreso' ? 'entra' : undefined}
                            />
                        </span>

                        <div className="fz-movimientos__acciones">
                            <button
                                className="fz-movimientos__borrar"
                                type="button"
                                onClick={() => borrar(m)}
                                aria-label={`Borrar ${m.concepto}`}
                                title="Borrar"
                            >
                                ×
                            </button>
                        </div>

                        {m.notas && <p className="fz-movimientos__nota">{m.notas}</p>}
                    </div>
                );
            })}
        </div>
    );
}
