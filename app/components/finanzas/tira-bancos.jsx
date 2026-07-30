"use client";

import { useState } from 'react';
import Cifra from './cifra';
import { diaCorto } from '@/app/lib/finanzas/formato';

/**
 * Los saldos de las cinco cuentas, en una línea cada uno.
 *
 * Las cuentas de ahorro e inversión llevan el saldo puesto a mano,
 * porque sumar movimientos no da el valor real:
 *
 *   · B100 guarda el dinero en la "Hucha", un producto que el extracto
 *     de la cuenta no refleja. Además sus entradas son transferencias
 *     propias, que no se importan para no inflar los ingresos: quedaban
 *     las salidas sin sus entradas y el saldo salía negativo.
 *
 *   · MyInvestor vale hoy más que lo aportado, porque los fondos se
 *     revalorizan. Eso no aparece en ningún extracto de movimientos.
 *
 * Se editan pulsando la cifra.
 */
export default function TiraBancos({ cuentas, onCambio }) {
    const [editando, setEditando] = useState(null);
    const [valor, setValor] = useState('');
    const [ocupado, setOcupado] = useState(false);

    const total = cuentas.reduce((s, c) => s + c.disponible, 0);

    async function guardar(e) {
        e.preventDefault();
        setOcupado(true);
        try {
            const res = await fetch('/api/finanzas/cuentas', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editando, saldo: valor }),
            });
            if (res.ok) {
                setEditando(null);
                onCambio?.();
            }
        } finally {
            setOcupado(false);
        }
    }

    return (
        <div className="fz-bancos">
            {cuentas.map((c) => {
                const retenido = c.iva_retenido + c.reservado;
                const enEdicion = editando === c.id;

                return (
                    <div
                        className={`fz-bancos__fila${retenido > 0 ? ' fz-bancos__fila--retenido' : ''}`}
                        key={c.id}
                    >
                        <span className="fz-bancos__nombre">{c.nombre}</span>

                        {enEdicion ? (
                            <form className="fz-bancos__editor" onSubmit={guardar}>
                                <input
                                    className="fz-input fz-input--importe"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    inputMode="decimal"
                                    value={valor}
                                    onChange={(ev) => setValor(ev.target.value)}
                                    autoFocus
                                    required
                                />
                                <button className="fz-boton" type="submit" disabled={ocupado}>
                                    {ocupado ? '…' : 'Guardar'}
                                </button>
                                <button
                                    className="fz-boton fz-boton--texto"
                                    type="button"
                                    onClick={() => setEditando(null)}
                                >
                                    Cancelar
                                </button>
                            </form>
                        ) : c.saldo_manual ? (
                            // El saldo se puso a mano: se puede corregir.
                            <button
                                className="fz-bancos__cifra fz-bancos__cifra--editable"
                                type="button"
                                onClick={() => {
                                    setEditando(c.id);
                                    setValor(String(c.saldo_actual));
                                }}
                                title="Pulsa para actualizar el saldo"
                            >
                                <Cifra valor={c.disponible} />
                            </button>
                        ) : (
                            <span className="fz-bancos__cifra">
                                <Cifra valor={c.disponible} />
                            </span>
                        )}

                        {retenido > 0 && !enEdicion && (
                            <span className="fz-bancos__nota">
                                <Cifra valor={retenido} signo="−" tono="acento" /> retenidos
                            </span>
                        )}

                        {c.saldo_manual && c.saldo_declarado_en && !enEdicion && (
                            <span className="fz-bancos__nota fz-bancos__nota--fecha">
                                puesto a mano el {diaCorto(c.saldo_declarado_en)}
                            </span>
                        )}
                    </div>
                );
            })}

            <div className="fz-bancos__total">
                <span className="fz-bancos__nombre">Disponible</span>
                <span className="fz-bancos__cifra">
                    <Cifra valor={total} />
                </span>
            </div>
        </div>
    );
}
