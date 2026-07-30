"use client";

import { useState } from 'react';
import Cifra from './cifra';
import { euros, diaCorto } from '@/app/lib/finanzas/formato';

/**
 * Reservas: dinero que está en la cuenta pero no se puede gastar.
 *
 * Nace de las notas a mano del tipo "queda un residuo de 409 €, no
 * tocar, esperar a la declaración de renta". No es un gasto (el dinero
 * sigue ahí) ni una transacción (no se ha movido): es saldo bloqueado
 * con una condición para soltarlo. Por eso el motivo es texto libre.
 *
 * Se puede crear, editar, liberar y borrar sin tocar la base de datos.
 */

const FORM_VACIO = { id: null, concepto: '', importe: '', cuenta_id: '', motivo: '' };

export default function PanelReservas({ reservas, cuentas, onCambio }) {
    const [editando, setEditando] = useState(null);
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);

    const set = (campo) => (e) =>
        setEditando((f) => ({ ...f, [campo]: e.target.value }));

    async function guardar(e) {
        e.preventDefault();
        setOcupado(true);
        setError('');
        try {
            const res = await fetch('/api/finanzas/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editando),
            });
            const datos = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(datos.error || 'No se ha podido guardar');
                return;
            }
            setEditando(null);
            onCambio?.();
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setOcupado(false);
        }
    }

    async function liberar(r) {
        const texto =
            `¿Liberar "${r.concepto}" (${euros(r.importe)})?\n\n` +
            `Ese dinero volverá a contar como disponible.`;
        if (!window.confirm(texto)) return;

        setOcupado(true);
        try {
            await fetch(`/api/finanzas/reservas?id=${r.id}`, { method: 'PATCH' });
            onCambio?.();
        } finally {
            setOcupado(false);
        }
    }

    async function borrar(r) {
        const texto =
            `¿Borrar "${r.concepto}" (${euros(r.importe)})?\n\n` +
            `Desaparece del todo. Si sólo quieres dejar de retenerlo, ` +
            `usa "Liberar" en su lugar.`;
        if (!window.confirm(texto)) return;

        setOcupado(true);
        try {
            await fetch(`/api/finanzas/reservas?id=${r.id}&borrar=1`, { method: 'DELETE' });
            setEditando(null);
            onCambio?.();
        } finally {
            setOcupado(false);
        }
    }

    const activas = reservas.filter((r) => r.estado === 'activa');
    const liberadas = reservas.filter((r) => r.estado === 'liberada');
    const total = activas.reduce((s, r) => s + r.importe, 0);

    const formulario = (
        <form className="fz-editor" onSubmit={guardar}>
            <div className="fz-form">
                <div className="fz-form__par">
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="r-concepto">Concepto</label>
                        <input
                            id="r-concepto"
                            className="fz-input"
                            type="text"
                            value={editando?.concepto ?? ''}
                            onChange={set('concepto')}
                            maxLength={120}
                            autoFocus
                            required
                        />
                    </div>
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="r-importe">Importe</label>
                        <input
                            id="r-importe"
                            className="fz-input fz-input--importe"
                            type="number"
                            step="0.01"
                            min="0.01"
                            inputMode="decimal"
                            placeholder="0,00"
                            value={editando?.importe ?? ''}
                            onChange={set('importe')}
                            required
                        />
                    </div>
                </div>

                <div className="fz-form__campo">
                    <label className="fz-form__etiqueta" htmlFor="r-cuenta">
                        En qué cuenta está
                    </label>
                    <select
                        id="r-cuenta"
                        className="fz-select"
                        value={editando?.cuenta_id ?? ''}
                        onChange={set('cuenta_id')}
                        required
                    >
                        <option value="">Elegir</option>
                        {cuentas.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="fz-form__campo">
                    <label className="fz-form__etiqueta" htmlFor="r-motivo">
                        Por qué no se toca
                    </label>
                    <textarea
                        id="r-motivo"
                        className="fz-area"
                        value={editando?.motivo ?? ''}
                        onChange={set('motivo')}
                        placeholder="Y cuándo se podrá usar."
                        maxLength={400}
                    />
                </div>

                <div className="fz-editor__acciones">
                    <button className="fz-boton" type="submit" disabled={ocupado}>
                        {ocupado ? 'Guardando' : 'Guardar'}
                    </button>
                    <button
                        className="fz-boton fz-boton--suave"
                        type="button"
                        onClick={() => { setEditando(null); setError(''); }}
                    >
                        Cancelar
                    </button>
                    {editando?.id && (
                        <button
                            className="fz-boton fz-boton--texto"
                            type="button"
                            onClick={() => borrar(editando)}
                            disabled={ocupado}
                        >
                            Borrar
                        </button>
                    )}
                </div>
            </div>
        </form>
    );

    return (
        <>
            {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

            {!activas.length && !editando && (
                <p className="fz-vacio">No hay nada apartado ahora mismo.</p>
            )}

            {activas.map((r) => {
                const enEdicion = editando?.id === r.id;
                return (
                    <div key={r.id}>
                        <div className="fz-fila">
                            <div>
                                <p className="fz-fila__titulo">{r.concepto}</p>
                                {r.motivo && <p className="fz-fila__detalle">{r.motivo}</p>}
                                <p className="fz-fila__detalle">
                                    {r.cuenta} · desde {diaCorto(r.creada_en)}
                                </p>
                            </div>
                            <div className="fz-fila__lado">
                                <span className="fz-fila__cifra">
                                    <Cifra valor={r.importe} signo={false} tono="acento" />
                                </span>
                                <button
                                    className="fz-boton fz-boton--suave"
                                    type="button"
                                    onClick={() => liberar(r)}
                                    disabled={ocupado}
                                >
                                    Liberar
                                </button>
                                <button
                                    className="fz-boton fz-boton--texto"
                                    type="button"
                                    onClick={() => setEditando(
                                        enEdicion ? null : {
                                            id: r.id,
                                            concepto: r.concepto,
                                            importe: r.importe,
                                            cuenta_id: r.cuenta_id || '',
                                            motivo: r.motivo || '',
                                        }
                                    )}
                                >
                                    {enEdicion ? 'Cerrar' : 'Editar'}
                                </button>
                            </div>
                        </div>
                        {enEdicion && formulario}
                    </div>
                );
            })}

            {editando && !editando.id && formulario}

            {!editando && (
                <div className="fz-editor__acciones" style={{ marginTop: 14 }}>
                    <button
                        className="fz-boton fz-boton--suave"
                        type="button"
                        onClick={() => setEditando({ ...FORM_VACIO })}
                    >
                        Apartar dinero
                    </button>
                    {total > 0 && (
                        <span className="fz-form__pista">
                            Hay <Cifra valor={total} signo={false} /> sin tocar.
                        </span>
                    )}
                </div>
            )}

            {liberadas.length > 0 && (
                <div className="fz-liberadas">
                    <p className="fz-form__etiqueta">Ya liberadas</p>
                    {liberadas.map((r) => (
                        <div className="fz-fila fz-fila--apagada" key={r.id}>
                            <div>
                                <p className="fz-fila__titulo">{r.concepto}</p>
                                <p className="fz-fila__detalle">
                                    {r.cuenta} · liberada el {diaCorto(r.liberada_en)}
                                </p>
                            </div>
                            <span className="fz-fila__cifra">
                                <Cifra valor={r.importe} signo={false} />
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
