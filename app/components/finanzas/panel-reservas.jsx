"use client";

import { useState } from 'react';
import { euros, diaCorto } from '@/app/lib/finanzas/formato';

/**
 * Reservas: dinero que está en la cuenta pero no se puede gastar.
 *
 * Nace de las notas a mano del tipo "queda un residuo de 409€, no
 * tocar, esperar a la declaración de renta". No es un gasto (el dinero
 * sigue ahí) ni una transacción (no se ha movido): es saldo bloqueado
 * con una condición para soltarlo. Por eso el motivo es texto libre.
 */
export default function PanelReservas({ reservas, cuentas, onCambio }) {
    const [form, setForm] = useState({
        concepto: '', importe: '', cuenta_id: '', motivo: '',
    });
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);

    const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }));

    async function crear(e) {
        e.preventDefault();
        setOcupado(true);
        setError('');
        try {
            const res = await fetch('/api/finanzas/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const datos = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(datos.error || 'No se ha podido guardar');
                return;
            }
            setForm({ concepto: '', importe: '', cuenta_id: '', motivo: '' });
            onCambio?.();
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setOcupado(false);
        }
    }

    async function liberar(r) {
        const aviso =
            `¿Liberar "${r.concepto}" (${euros(r.importe)})? ` +
            `Ese dinero volverá a contar como disponible.`;
        if (!window.confirm(aviso)) return;

        setOcupado(true);
        try {
            await fetch(`/api/finanzas/reservas?id=${r.id}`, { method: 'PATCH' });
            onCambio?.();
        } finally {
            setOcupado(false);
        }
    }

    const activas = reservas.filter((r) => r.estado === 'activa');
    const liberadas = reservas.filter((r) => r.estado === 'liberada');
    const totalActivo = activas.reduce((s, r) => s + r.importe, 0);

    return (
        <div className="fz-form">
            <div>
                {totalActivo > 0 && (
                    <div className="fz-aviso fz-aviso--atencion">
                        {euros(totalActivo)} apartados y sin tocar.
                    </div>
                )}

                <div>
                    {!activas.length && (
                        <p className="fz-vacio">No hay nada reservado ahora mismo.</p>
                    )}

                    {activas.map((r) => (
                        <div className="fz-fila" key={r.id}>
                            <div>
                                <p className="fz-fila__titulo">{r.concepto}</p>
                                {r.motivo && <p className="fz-fila__detalle">{r.motivo}</p>}
                                <p className="fz-fila__detalle">
                                    {r.cuenta} · desde {diaCorto(r.creada_en)}
                                </p>
                            </div>
                            <div className="fz-fila__lado">
                                <span className="fz-fila__cifra">{euros(r.importe)}</span>
                                <button
                                    className="fz-boton fz-boton--suave"
                                    type="button"
                                    onClick={() => liberar(r)}
                                    disabled={ocupado}
                                >
                                    Liberar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {liberadas.length > 0 && (
                    <div className="fz-seccion">
                        <p className="fz-seccion__titulo">Ya liberadas</p>
                        {liberadas.map((r) => (
                            <div className="fz-fila fz-fila--apagada" key={r.id}>
                                <div>
                                    <p className="fz-fila__titulo">{r.concepto}</p>
                                    <p className="fz-fila__detalle">
                                        {r.cuenta} · liberada el {diaCorto(r.liberada_en)}
                                    </p>
                                </div>
                                <span className="fz-fila__cifra">{euros(r.importe)}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <form onSubmit={crear} style={{ marginTop: 18 }}>
                <p className="fz-form__etiqueta" style={{ marginBottom: 10 }}>Apartar dinero</p>

                {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

                <div className="fz-form">
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="r-concepto">Concepto</label>
                        <input
                            id="r-concepto"
                            className="fz-input"
                            type="text"
                            value={form.concepto}
                            onChange={set('concepto')}
                            maxLength={120}
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
                            value={form.importe}
                            onChange={set('importe')}
                            required
                        />
                    </div>

                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="r-cuenta">Cuenta</label>
                        <select
                            id="r-cuenta"
                            className="fz-select"
                            value={form.cuenta_id}
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
                            value={form.motivo}
                            onChange={set('motivo')}
                            placeholder="Y cuándo se podrá usar."
                            maxLength={400}
                        />
                    </div>

                    <button className="fz-boton fz-boton--ancho" type="submit" disabled={ocupado}>
                        {ocupado ? 'Guardando' : 'Apartar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
