"use client";

import { useState } from 'react';
import Cifra from './cifra';
import AltaMovimiento from './alta-movimiento';
import { euros, diaCorto } from '@/app/lib/finanzas/formato';

// Los ingresos van en verde. En una lista de treinta apuntes casi
// todos negativos, el signo por sí solo no basta para localizar de un
// vistazo el día que entró dinero.

// La nota que pone el importador a todos los apuntes que vienen del
// extracto. No aporta nada en la lista: si el apunte está ahí, es
// porque se importó.
const NOTA_DE_IMPORTACION = /^\s*Importado del extracto del banco\.?\s*$/i;

export default function ListaMovimientos({ movimientos, cuentas, categorias, onBorrar, onCambio }) {
    const [editando, setEditando] = useState(null);
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
                const enEdicion = editando?.id === m.id;
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
                                className="fz-movimientos__editar"
                                type="button"
                                onClick={() => setEditando(editando?.id === m.id ? null : m)}
                                aria-label={`Corregir ${m.concepto}`}
                                title="Corregir"
                            >
                                {editando?.id === m.id ? '×' : '⋯'}
                            </button>
                        </div>

                        {/* «Importado del extracto del banco.» lo lleva casi
                            todo apunte y no dice nada que la fila no diga ya:
                            ocupaba una línea extra en cada una y doblaba el
                            alto de la lista en el móvil. Las notas escritas a
                            mano sí se ven. */}
                        {m.notas && !NOTA_DE_IMPORTACION.test(m.notas) && !enEdicion && (
                            <p className="fz-movimientos__nota">{m.notas}</p>
                        )}

                        {/* El editor se abre bajo la fila que se corrige,
                            no al final de la lista: con treinta apuntes,
                            un formulario al pie queda fuera de pantalla. */}
                        {enEdicion && (
                            <div className="fz-movimientos__editor">
                                <AltaMovimiento
                                    cuentas={cuentas}
                                    categorias={categorias}
                                    movimiento={m}
                                    onGuardado={() => { setEditando(null); onCambio?.(); }}
                                    onBorrar={() => { setEditando(null); borrar(m); }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
