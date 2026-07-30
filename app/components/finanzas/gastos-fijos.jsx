"use client";

import { useState } from 'react';
import Cifra from './cifra';
import { nombreMes } from '@/app/lib/finanzas/formato';

/**
 * Los recibos que se repiten cada mes.
 *
 * La lista es estable: se edita de tarde en tarde, cuando sube el
 * seguro o cambia una tarifa. Lo habitual es abrir el mes y pulsar
 * "Apuntar los de este mes", que crea de una vez los que tocan y no
 * estén ya apuntados.
 */

const PERIODOS = [
    { valor: 1, texto: 'Cada mes' },
    { valor: 2, texto: 'Cada 2 meses' },
    { valor: 3, texto: 'Trimestral' },
    { valor: 6, texto: 'Semestral' },
    { valor: 12, texto: 'Anual' },
];

const nombrePeriodo = (n) =>
    PERIODOS.find((p) => p.valor === n)?.texto || `Cada ${n} meses`;

const FORM_VACIO = {
    id: null, nombre: '', importe_previsto: '', cuenta_id: '',
    dia_cobro: '', cada_meses: 1, primer_mes: '', notas: '',
};

export default function GastosFijos({ fijos, cuentas, mes, onCambio }) {
    const [editando, setEditando] = useState(null);   // null | FORM_VACIO | recibo
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);

    const set = (campo) => (e) =>
        setEditando((f) => ({ ...f, [campo]: e.target.value }));

    async function llamar(cuerpo, metodo = 'POST') {
        setOcupado(true);
        setError('');
        try {
            const res = await fetch('/api/finanzas/fijos', {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cuerpo),
            });
            const datos = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(datos.error || 'No se ha podido guardar');
                return null;
            }
            onCambio?.();
            return datos;
        } catch {
            setError('Sin conexión con el servidor');
            return null;
        } finally {
            setOcupado(false);
        }
    }

    async function guardar(e) {
        e.preventDefault();
        const datos = await llamar({
            ...editando,
            cada_meses: Number(editando.cada_meses),
        });
        if (datos) setEditando(null);
    }

    async function darDeBaja(recibo) {
        const aviso =
            `¿Dar de baja "${recibo.nombre}"? Dejará de aparecer en la lista, ` +
            `pero los movimientos ya apuntados se conservan.`;
        if (!window.confirm(aviso)) return;

        setOcupado(true);
        try {
            await fetch(`/api/finanzas/fijos?id=${recibo.id}`, { method: 'DELETE' });
            onCambio?.();
        } finally {
            setOcupado(false);
        }
    }

    async function apuntarMes() {
        const res = await llamar({ accion: 'cargar_mes', mes });
        if (res) {
            const n = res.creados;
            setError(
                n === 0
                    ? 'No había nada que apuntar: ya estaban todos.'
                    : `Apuntados ${n} ${n === 1 ? 'recibo' : 'recibos'}.`
            );
        }
    }

    // Los que tocan este mes y aún no están apuntados.
    const pendientes = fijos.filter((f) => f.toca && !f.ya_apuntado);
    const totalPendiente = pendientes.reduce((s, f) => s + (f.importe_previsto || 0), 0);
    const sinConfigurar = fijos.filter((f) => !f.cuenta_id || f.importe_previsto === null);

    return (
        <>
            {error && (
                <div className={`fz-aviso${/Apuntados|No había/.test(error) ? '' : ' fz-aviso--error'}`}>
                    {error}
                </div>
            )}

            {pendientes.length > 0 && (
                <div className="fz-aviso fz-aviso--atencion">
                    Quedan {pendientes.length} {pendientes.length === 1 ? 'recibo' : 'recibos'} por
                    apuntar en {nombreMes(mes)}: <Cifra valor={totalPendiente} signo={false} />
                </div>
            )}

            {sinConfigurar.length > 0 && (
                <div className="fz-aviso">
                    {sinConfigurar.length === 1
                        ? 'Un recibo no tiene cuenta o importe, así que no se puede apuntar solo.'
                        : `${sinConfigurar.length} recibos no tienen cuenta o importe, así que no se apuntan solos.`}
                </div>
            )}

            {fijos.map((f) => {
                const noMensual = f.cada_meses !== 1;
                return (
                    <div className="fz-fila" key={f.id}>
                        <div>
                            <p className="fz-fila__titulo">
                                {f.nombre}
                                {f.ya_apuntado && <span className="fz-tag">Apuntado</span>}
                                {f.toca && !f.ya_apuntado && (
                                    <span className="fz-tag fz-tag--acento">Toca</span>
                                )}
                                {noMensual && !f.toca && (
                                    <span className="fz-tag">{nombrePeriodo(f.cada_meses)}</span>
                                )}
                            </p>
                            <p className="fz-fila__detalle">
                                {f.cuenta || 'Sin cuenta'}
                                {f.dia_cobro && ` · día ${f.dia_cobro}`}
                                {noMensual && ` · ${nombrePeriodo(f.cada_meses).toLowerCase()}`}
                                {f.notas && ` · ${f.notas}`}
                            </p>
                        </div>
                        <div className="fz-fila__lado">
                            <span className="fz-fila__cifra">
                                <Cifra
                                    valor={f.importe_previsto ?? 0}
                                    signo={false}
                                    tono={f.toca && !f.ya_apuntado ? 'acento' : undefined}
                                />
                            </span>
                            <button
                                className="fz-boton fz-boton--suave"
                                type="button"
                                onClick={() => setEditando({
                                    id: f.id,
                                    nombre: f.nombre,
                                    importe_previsto: f.importe_previsto ?? '',
                                    cuenta_id: f.cuenta_id || '',
                                    dia_cobro: f.dia_cobro ?? '',
                                    cada_meses: f.cada_meses,
                                    primer_mes: f.primer_mes ? String(f.primer_mes).slice(0, 10) : '',
                                    notas: f.notas || '',
                                })}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                );
            })}

            {!fijos.length && (
                <p className="fz-vacio">Todavía no hay recibos fijos configurados.</p>
            )}

            <div className="fz-form__par" style={{ marginTop: 18 }}>
                <button
                    className="fz-boton fz-boton--acento"
                    type="button"
                    onClick={apuntarMes}
                    disabled={ocupado || !pendientes.length}
                >
                    {pendientes.length
                        ? `Apuntar los ${pendientes.length} de este mes`
                        : 'Nada pendiente este mes'}
                </button>
                <button
                    className="fz-boton fz-boton--suave"
                    type="button"
                    onClick={() => setEditando({ ...FORM_VACIO })}
                >
                    Añadir recibo
                </button>
            </div>

            {editando && (
                <form onSubmit={guardar} style={{ marginTop: 22 }}>
                    <p className="fz-form__etiqueta" style={{ marginBottom: 10 }}>
                        {editando.id ? `Editar ${editando.nombre}` : 'Nuevo recibo fijo'}
                    </p>

                    <div className="fz-form">
                        <div className="fz-form__par">
                            <div className="fz-form__campo">
                                <label className="fz-form__etiqueta" htmlFor="f-nombre">Nombre</label>
                                <input
                                    id="f-nombre"
                                    className="fz-input"
                                    type="text"
                                    value={editando.nombre}
                                    onChange={set('nombre')}
                                    maxLength={80}
                                    required
                                />
                            </div>
                            <div className="fz-form__campo">
                                <label className="fz-form__etiqueta" htmlFor="f-importe">Importe</label>
                                <input
                                    id="f-importe"
                                    className="fz-input fz-input--importe"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    inputMode="decimal"
                                    placeholder="0,00"
                                    value={editando.importe_previsto}
                                    onChange={set('importe_previsto')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="fz-form__par">
                            <div className="fz-form__campo">
                                <label className="fz-form__etiqueta" htmlFor="f-cuenta">
                                    Cuenta de cargo
                                </label>
                                <select
                                    id="f-cuenta"
                                    className="fz-select"
                                    value={editando.cuenta_id}
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
                                <label className="fz-form__etiqueta" htmlFor="f-dia">
                                    Día de cobro
                                </label>
                                <input
                                    id="f-dia"
                                    className="fz-input"
                                    type="number"
                                    min="1"
                                    max="31"
                                    inputMode="numeric"
                                    placeholder="1"
                                    value={editando.dia_cobro}
                                    onChange={set('dia_cobro')}
                                />
                            </div>
                        </div>

                        <div className="fz-form__par">
                            <div className="fz-form__campo">
                                <label className="fz-form__etiqueta" htmlFor="f-cada">
                                    Cada cuánto
                                </label>
                                <select
                                    id="f-cada"
                                    className="fz-select"
                                    value={editando.cada_meses}
                                    onChange={set('cada_meses')}
                                >
                                    {PERIODOS.map((p) => (
                                        <option key={p.valor} value={p.valor}>{p.texto}</option>
                                    ))}
                                </select>
                            </div>

                            {Number(editando.cada_meses) > 1 && (
                                <div className="fz-form__campo">
                                    <label className="fz-form__etiqueta" htmlFor="f-primer">
                                        Primera vez
                                    </label>
                                    <input
                                        id="f-primer"
                                        className="fz-input"
                                        type="month"
                                        value={editando.primer_mes ? editando.primer_mes.slice(0, 7) : ''}
                                        onChange={(e) =>
                                            setEditando((f) => ({
                                                ...f,
                                                primer_mes: e.target.value ? `${e.target.value}-01` : '',
                                            }))
                                        }
                                        required
                                    />
                                    <p className="fz-form__pista">
                                        Desde este mes se cuenta el ciclo.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="fz-form__campo">
                            <label className="fz-form__etiqueta" htmlFor="f-notas">Notas</label>
                            <textarea
                                id="f-notas"
                                className="fz-area"
                                value={editando.notas}
                                onChange={set('notas')}
                                placeholder="Por ejemplo: al renovar, comparar precio."
                                maxLength={300}
                            />
                        </div>

                        <div className="fz-form__par">
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
                        </div>

                        {editando.id && (
                            <button
                                className="fz-boton fz-boton--suave"
                                type="button"
                                onClick={() => {
                                    darDeBaja({ id: editando.id, nombre: editando.nombre });
                                    setEditando(null);
                                }}
                                disabled={ocupado}
                            >
                                Dar de baja este recibo
                            </button>
                        )}
                    </div>
                </form>
            )}
        </>
    );
}
