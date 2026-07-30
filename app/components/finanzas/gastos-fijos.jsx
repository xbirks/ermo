"use client";

import { useState } from 'react';
import Cifra from './cifra';
import { nombreMes } from '@/app/lib/finanzas/formato';

/**
 * Los recibos que se repiten cada mes.
 *
 * La lista es estable: se edita de tarde en tarde, cuando sube el
 * seguro o se da de baja una suscripción. Lo habitual es abrir el mes
 * y pulsar "Apuntar", que crea de una vez los que faltan.
 *
 * El formulario de edición se abre justo debajo de la fila que se
 * está editando, no al final de la lista: con once recibos, un
 * formulario al pie queda fuera de la pantalla y parece que el botón
 * no ha hecho nada.
 */

const PERIODOS = [
    { valor: 1, texto: 'Cada mes' },
    { valor: 2, texto: 'Cada 2 meses' },
    { valor: 3, texto: 'Cada 3 meses' },
    { valor: 6, texto: 'Cada 6 meses' },
    { valor: 12, texto: 'Una vez al año' },
];

const nombrePeriodo = (n) =>
    PERIODOS.find((p) => p.valor === n)?.texto || `Cada ${n} meses`;

const FORM_VACIO = {
    id: null, nombre: '', importe_previsto: '', cuenta_id: '',
    dia_cobro: '', cada_meses: 1, primer_mes: '', notas: '',
};

export default function GastosFijos({ fijos, deBaja = [], cuentas, mes, onCambio }) {
    const [verBajas, setVerBajas] = useState(false);
    const [editando, setEditando] = useState(null);
    const [error, setError] = useState('');
    const [aviso, setAviso] = useState('');
    const [ocupado, setOcupado] = useState(false);

    const set = (campo) => (e) =>
        setEditando((f) => ({ ...f, [campo]: e.target.value }));

    async function llamar(cuerpo, metodo = 'POST') {
        setOcupado(true);
        setError('');
        setAviso('');
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
        const texto =
            `¿Dar de baja "${recibo.nombre}"?\n\n` +
            `Dejará de aparecer en la lista y de apuntarse cada mes. ` +
            `Los movimientos ya registrados se conservan.`;
        if (!window.confirm(texto)) return;

        setOcupado(true);
        try {
            await fetch(`/api/finanzas/fijos?id=${recibo.id}`, { method: 'DELETE' });
            setEditando(null);
            setAviso(`${recibo.nombre} dado de baja.`);
            onCambio?.();
        } finally {
            setOcupado(false);
        }
    }

    async function apuntar(ids) {
        const res = await llamar({ accion: 'cargar_mes', mes, seleccion: ids });
        if (res) {
            setAviso(
                res.creados === 0
                    ? 'Ya estaban todos apuntados.'
                    : `Apuntado${res.creados === 1 ? '' : 's'} ${res.creados}.`
            );
        }
    }

    const pendientes = fijos.filter((f) => f.toca && !f.ya_apuntado);
    const totalPendiente = pendientes.reduce((s, f) => s + (f.importe_previsto || 0), 0);

    // El formulario, para reutilizarlo en la fila que se edita y al
    // dar de alta uno nuevo.
    const formulario = (
        <form className="fz-editor" onSubmit={guardar}>
            <div className="fz-form">
                <div className="fz-form__par">
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="f-nombre">Nombre</label>
                        <input
                            id="f-nombre"
                            className="fz-input"
                            type="text"
                            value={editando?.nombre ?? ''}
                            onChange={set('nombre')}
                            maxLength={80}
                            autoFocus
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
                            value={editando?.importe_previsto ?? ''}
                            onChange={set('importe_previsto')}
                            required
                        />
                    </div>
                </div>

                <div className="fz-form__par">
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="f-cuenta">
                            Se paga desde
                        </label>
                        <select
                            id="f-cuenta"
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
                        <label className="fz-form__etiqueta" htmlFor="f-dia">
                            Día del mes
                        </label>
                        <input
                            id="f-dia"
                            className="fz-input"
                            type="number"
                            min="1"
                            max="31"
                            inputMode="numeric"
                            placeholder="1"
                            value={editando?.dia_cobro ?? ''}
                            onChange={set('dia_cobro')}
                        />
                    </div>
                </div>

                <div className="fz-form__par">
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="f-cada">
                            Cada cuánto llega
                        </label>
                        <select
                            id="f-cada"
                            className="fz-select"
                            value={editando?.cada_meses ?? 1}
                            onChange={set('cada_meses')}
                        >
                            {PERIODOS.map((p) => (
                                <option key={p.valor} value={p.valor}>{p.texto}</option>
                            ))}
                        </select>
                    </div>

                    {Number(editando?.cada_meses) > 1 && (
                        <div className="fz-form__campo">
                            <label className="fz-form__etiqueta" htmlFor="f-primer">
                                Un mes en que llegó
                            </label>
                            <input
                                id="f-primer"
                                className="fz-input"
                                type="month"
                                value={editando?.primer_mes ? editando.primer_mes.slice(0, 7) : ''}
                                onChange={(e) =>
                                    setEditando((f) => ({
                                        ...f,
                                        primer_mes: e.target.value ? `${e.target.value}-01` : '',
                                    }))
                                }
                                required
                            />
                        </div>
                    )}
                </div>

                <div className="fz-form__campo">
                    <label className="fz-form__etiqueta" htmlFor="f-notas">Notas</label>
                    <textarea
                        id="f-notas"
                        className="fz-area"
                        value={editando?.notas ?? ''}
                        onChange={set('notas')}
                        placeholder="Por ejemplo: al renovar, comparar precio."
                        maxLength={300}
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
                            onClick={() => darDeBaja(editando)}
                            disabled={ocupado}
                        >
                            Dar de baja
                        </button>
                    )}
                </div>
            </div>
        </form>
    );

    return (
        <>
            {error && <div className="fz-aviso fz-aviso--error">{error}</div>}
            {aviso && <div className="fz-aviso">{aviso}</div>}

            {!fijos.length && (
                <div className="fz-aviso">
                    No hay recibos fijos configurados. Si acabas de actualizar la
                    app, puede que falte ejecutar{' '}
                    <code>db/migraciones/001-gastos-fijos.sql</code> en Supabase.
                </div>
            )}

            {fijos.map((f) => {
                const enEdicion = editando?.id === f.id;
                const pendiente = f.toca && !f.ya_apuntado;

                return (
                    <div key={f.id}>
                        <div className="fz-fila">
                            <div>
                                <p className="fz-fila__titulo">
                                    {f.nombre}
                                    {f.ya_apuntado && (
                                        <span className="fz-tag">Ya está</span>
                                    )}
                                    {!f.toca && f.cada_meses !== 1 && (
                                        <span className="fz-tag">
                                            {nombrePeriodo(f.cada_meses)}
                                        </span>
                                    )}
                                </p>
                                <p className="fz-fila__detalle">
                                    {f.cuenta || 'Sin cuenta'}
                                    {f.dia_cobro && ` · día ${f.dia_cobro}`}
                                    {f.notas && ` · ${f.notas}`}
                                </p>
                            </div>
                            <div className="fz-fila__lado">
                                <span className="fz-fila__cifra">
                                    <Cifra valor={f.importe_previsto ?? 0} signo={false} />
                                </span>
                                {/* Apuntar este recibo suelto, en un clic. */}
                                {pendiente && (
                                    <button
                                        className="fz-boton fz-boton--suave"
                                        type="button"
                                        onClick={() => apuntar([f.id])}
                                        disabled={ocupado}
                                    >
                                        Apuntar
                                    </button>
                                )}
                                <button
                                    className="fz-boton fz-boton--texto"
                                    type="button"
                                    onClick={() => setEditando(
                                        enEdicion ? null : {
                                            id: f.id,
                                            nombre: f.nombre,
                                            importe_previsto: f.importe_previsto ?? '',
                                            cuenta_id: f.cuenta_id || '',
                                            dia_cobro: f.dia_cobro ?? '',
                                            cada_meses: f.cada_meses,
                                            primer_mes: f.primer_mes
                                                ? String(f.primer_mes).slice(0, 10) : '',
                                            notas: f.notas || '',
                                        }
                                    )}
                                >
                                    {enEdicion ? 'Cerrar' : 'Editar'}
                                </button>
                            </div>
                        </div>

                        {/* Justo debajo de su fila, no al final de la lista. */}
                        {enEdicion && formulario}
                    </div>
                );
            })}

            {editando && !editando.id && formulario}

            <div className="fz-editor__acciones" style={{ marginTop: 16 }}>
                {pendientes.length > 0 && (
                    <button
                        className="fz-boton"
                        type="button"
                        onClick={() => apuntar(pendientes.map((f) => f.id))}
                        disabled={ocupado}
                    >
                        Apuntar {pendientes.length === 1 ? 'el que falta' : `los ${pendientes.length} que faltan`}
                        {' · '}
                        <Cifra valor={totalPendiente} signo={false} />
                    </button>
                )}
                {!editando && (
                    <button
                        className="fz-boton fz-boton--suave"
                        type="button"
                        onClick={() => setEditando({ ...FORM_VACIO })}
                    >
                        Añadir recibo
                    </button>
                )}
            </div>

            {/* Los dados de baja siguen accesibles: si se vuelve a
                contratar algo, se reactiva en lugar de crearlo otra vez
                (el nombre es único, así que duplicarlo fallaría). */}
            {deBaja.length > 0 && (
                <div className="fz-bajas">
                    <button
                        className="fz-boton fz-boton--texto"
                        type="button"
                        onClick={() => setVerBajas((v) => !v)}
                    >
                        {verBajas
                            ? 'Ocultar los dados de baja'
                            : `Ver ${deBaja.length} dado${deBaja.length === 1 ? '' : 's'} de baja`}
                    </button>

                    {verBajas && deBaja.map((r) => (
                        <div className="fz-fila fz-fila--apagada" key={r.id}>
                            <div>
                                <p className="fz-fila__titulo">{r.nombre}</p>
                                <p className="fz-fila__detalle">
                                    {r.cuenta || 'Sin cuenta'}
                                    {r.notas && ` · ${r.notas}`}
                                </p>
                            </div>
                            <div className="fz-fila__lado">
                                <span className="fz-fila__cifra">
                                    <Cifra valor={r.importe_previsto ?? 0} signo={false} />
                                </span>
                                <button
                                    className="fz-boton fz-boton--suave"
                                    type="button"
                                    onClick={async () => {
                                        await llamar({ accion: 'reactivar', id: r.id });
                                        setAviso(`${r.nombre} vuelve a la lista.`);
                                    }}
                                    disabled={ocupado}
                                >
                                    Reactivar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
