"use client";

import { useState } from 'react';
import { hoyISO } from '@/app/lib/finanzas/formato';

// Formulario de alta. El campo de notas está siempre disponible para
// detallar un gasto cuando hace falta ("comida caja", "sofá", "mamá
// crucero"), igual que las anotaciones al margen de la libreta.

const TIPOS = [
    { valor: 'gasto', texto: 'Gasto' },
    { valor: 'ingreso', texto: 'Ingreso' },
    { valor: 'transferencia_interna', texto: 'Traspaso' },
];

export default function AltaMovimiento({ cuentas, categorias, mes, onGuardado }) {
    const [tipo, setTipo] = useState('gasto');
    const [form, setForm] = useState({
        fecha: hoyISO(),
        cuenta_id: '',
        cuenta_destino_id: '',
        categoria_id: '',
        concepto: '',
        importe: '',
        notas: '',
    });
    const [error, setError] = useState('');
    const [guardando, setGuardando] = useState(false);

    const set = (campo) => (e) =>
        setForm((f) => ({ ...f, [campo]: e.target.value }));

    const esTraspaso = tipo === 'transferencia_interna';

    async function guardar(e) {
        e.preventDefault();
        setGuardando(true);
        setError('');

        try {
            const res = await fetch('/api/finanzas/transacciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, tipo_movimiento: tipo }),
            });

            const datos = await res.json().catch(() => ({}));

            if (!res.ok) {
                setError(datos.error || 'No se ha podido guardar');
                return;
            }

            // Se conservan fecha y cuenta: al meter los recibos del mes
            // de golpe, casi siempre son los mismos.
            setForm((f) => ({
                ...f,
                categoria_id: '',
                concepto: '',
                importe: '',
                notas: '',
            }));
            onGuardado?.();
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setGuardando(false);
        }
    }

    return (
        <form onSubmit={guardar}>
            {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

            <div className="fz-form">
                <div className="fz-pildoras">
                    {TIPOS.map((t) => (
                        <button
                            key={t.valor}
                            type="button"
                            className={`fz-pildoras__item${tipo === t.valor ? ' fz-pildoras__item--activo' : ''}`}
                            onClick={() => setTipo(t.valor)}
                        >
                            {t.texto}
                        </button>
                    ))}
                </div>

                <div className="fz-form__par">
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="fecha">Fecha</label>
                        <input
                            id="fecha"
                            className="fz-input"
                            type="date"
                            value={form.fecha}
                            onChange={set('fecha')}
                            required
                        />
                    </div>

                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="importe">Importe</label>
                        <input
                            id="importe"
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
                </div>

                <div className="fz-form__campo">
                    <label className="fz-form__etiqueta" htmlFor="cuenta">
                        {esTraspaso ? 'Desde' : 'Cuenta'}
                    </label>
                    <select
                        id="cuenta"
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

                {esTraspaso && (
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="destino">Hacia</label>
                        <select
                            id="destino"
                            className="fz-select"
                            value={form.cuenta_destino_id}
                            onChange={set('cuenta_destino_id')}
                            required
                        >
                            <option value="">Elegir</option>
                            {cuentas
                                .filter((c) => c.id !== form.cuenta_id)
                                .map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                        </select>
                        <p className="fz-form__pista">
                            Sacar dinero del cajero es un traspaso, no un gasto.
                        </p>
                    </div>
                )}

                {!esTraspaso && (
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="categoria">Categoría</label>
                        <select
                            id="categoria"
                            className="fz-select"
                            value={form.categoria_id}
                            onChange={set('categoria_id')}
                        >
                            <option value="">Sin categoría</option>
                            {categorias.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.nombre}{c.es_fijo ? ' · fijo' : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="fz-form__campo">
                    <label className="fz-form__etiqueta" htmlFor="concepto">Concepto</label>
                    <input
                        id="concepto"
                        className="fz-input"
                        type="text"
                        value={form.concepto}
                        onChange={set('concepto')}
                        maxLength={120}
                        required
                    />
                </div>

                <div className="fz-form__campo">
                    <label className="fz-form__etiqueta" htmlFor="notas">
                        Notas
                    </label>
                    <textarea
                        id="notas"
                        className="fz-area"
                        value={form.notas}
                        onChange={set('notas')}
                        placeholder="Cualquier detalle que convenga recordar."
                        maxLength={600}
                    />
                </div>

                <button className="fz-boton fz-boton--ancho" type="submit" disabled={guardando}>
                    {guardando ? 'Guardando' : 'Guardar movimiento'}
                </button>
            </div>
        </form>
    );
}
