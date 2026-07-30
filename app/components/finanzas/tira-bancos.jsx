"use client";

import { useState } from 'react';
import Cifra from './cifra';

/**
 * Cuántos días hace que se puso el saldo a mano.
 *
 * Una cifra escrita hace tres meses ya no dice la verdad, sobre todo en
 * inversión, donde el valor cambia solo. Sin este aviso, un saldo viejo
 * se lee igual que uno recién comprobado.
 */
function diasDesde(fecha) {
    if (!fecha) return null;
    const dif = (Date.now() - new Date(fecha).getTime()) / 86400000;
    return Math.floor(dif);
}

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
    const [ingresando, setIngresando] = useState(false);

    // Sumar las cinco cuentas y llamarlo "disponible" engaña: mezcla el
    // dinero del día a día con el ahorro y la inversión, que no se
    // tocan. Se separan en dos cifras con nombres honestos.
    const CORRIENTES = ['corriente', 'efectivo'];
    const gastable = cuentas
        .filter((c) => CORRIENTES.includes(c.tipo))
        .reduce((s, c) => s + c.disponible, 0);
    const guardado = cuentas
        .filter((c) => !CORRIENTES.includes(c.tipo))
        .reduce((s, c) => s + c.disponible, 0);

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

    /**
     * Ingresar el efectivo en una cuenta.
     *
     * Se registra como traspaso y se pone la cartera a cero: el dinero
     * no entra de fuera, sólo cambia de sitio. Contarlo como ingreso
     * inflaría el mes con dinero que ya estaba contado al cobrarlo.
     */
    async function ingresarEfectivo(cartera, destinoId, importe) {
        setOcupado(true);
        try {
            const hoy = new Date();
            const fecha = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

            const res = await fetch('/api/finanzas/transacciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fecha,
                    cuenta_id: cartera.id,
                    cuenta_destino_id: destinoId,
                    concepto: 'Ingreso de efectivo',
                    importe,
                    tipo_movimiento: 'transferencia_interna',
                    notas: 'Dinero en mano ingresado en el banco.',
                }),
            });
            if (!res.ok) return;

            // La cartera queda a cero y la cuenta destino sube.
            await fetch('/api/finanzas/cuentas', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: cartera.id, saldo: 0 }),
            });
            const destino = cuentas.find((c) => c.id === destinoId);
            if (destino?.saldo_manual) {
                await fetch('/api/finanzas/cuentas', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: destinoId,
                        saldo: destino.saldo_actual + importe,
                    }),
                });
            }
            setIngresando(false);
            onCambio?.();
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
                        ) : (
                            // Cualquier cuenta se corrige pulsando su
                            // cifra: obligar a escribir SQL para cambiar
                            // un saldo no tiene sentido.
                            <button
                                className="fz-bancos__cifra fz-bancos__cifra--editable"
                                type="button"
                                onClick={() => {
                                    setEditando(c.id);
                                    setValor(String(c.saldo_actual));
                                }}
                                title="Pulsa para corregir el saldo"
                            >
                                <Cifra valor={c.disponible} />
                            </button>
                        )}

                        {retenido > 0 && !enEdicion && (
                            <span className="fz-bancos__nota">
                                <Cifra valor={retenido} signo="−" tono="acento" /> retenidos
                            </span>
                        )}

                        {/* Ingresar el efectivo en el banco es un
                            traspaso, no un ingreso: es lo que se hace al
                            volver del cajero al revés. */}
                        {c.tipo === 'efectivo' && c.disponible > 0 && !enEdicion && (
                            ingresando ? (
                                <span className="fz-bancos__editor">
                                    <span className="fz-form__pista" style={{ flex: 1 }}>
                                        ¿En qué cuenta lo has ingresado?
                                    </span>
                                    {cuentas
                                        .filter((x) => x.tipo === 'corriente')
                                        .map((x) => (
                                            <button
                                                key={x.id}
                                                className="fz-boton"
                                                type="button"
                                                disabled={ocupado}
                                                onClick={() => ingresarEfectivo(c, x.id, c.disponible)}
                                            >
                                                {x.nombre}
                                            </button>
                                        ))}
                                    <button
                                        className="fz-boton fz-boton--texto"
                                        type="button"
                                        onClick={() => setIngresando(false)}
                                    >
                                        Cancelar
                                    </button>
                                </span>
                            ) : (
                                <button
                                    className="fz-boton fz-boton--texto fz-bancos__accion"
                                    type="button"
                                    onClick={() => setIngresando(true)}
                                >
                                    Ingresarlo en el banco
                                </button>
                            )
                        )}

                        {c.saldo_manual && c.saldo_declarado_en && !enEdicion && (() => {
                            const dias = diasDesde(c.saldo_declarado_en);
                            // Más de un mes sin comprobar: deja de ser un
                            // dato de contexto y pasa a ser un aviso.
                            const viejo = dias !== null && dias > 30;
                            return (
                                <span className={`fz-bancos__nota fz-bancos__nota--${viejo ? 'viejo' : 'fecha'}`}>
                                    {dias === 0
                                        ? 'comprobado hoy'
                                        : dias === 1
                                            ? 'comprobado ayer'
                                            : viejo
                                                ? `sin comprobar desde hace ${dias} días`
                                                : `comprobado hace ${dias} días`}
                                </span>
                            );
                        })()}
                    </div>
                );
            })}

            <div className="fz-bancos__total">
                <span className="fz-bancos__nombre">Para gastar.</span>
                <span className="fz-bancos__cifra">
                    <Cifra valor={gastable} />
                </span>
                <span className="fz-bancos__nota fz-bancos__nota--fecha">
                    en las cuentas del día a día
                </span>
            </div>

            <div className="fz-bancos__total">
                <span className="fz-bancos__nombre">Ahorrado.</span>
                <span className="fz-bancos__cifra">
                    <Cifra valor={guardado} />
                </span>
                <span className="fz-bancos__nota fz-bancos__nota--fecha">
                    B100 y MyInvestor, que no se tocan
                </span>
            </div>
        </div>
    );
}
