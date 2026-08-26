"use client";

import { useState } from 'react';

// Pegar el extracto del banco y guardar en un par de minutos, sin
// pasar por SQL: se analiza, se revisa la tabla (la categoría ya
// viene sugerida) y se guarda sólo lo que se deja marcado.

const BANCOS = ['Imagin', 'Santander'];

export default function ImportarExtracto({ categorias, onGuardado }) {
    const [banco, setBanco] = useState('Imagin');
    const [anio, setAnio] = useState(String(new Date().getFullYear()));
    const [texto, setTexto] = useState('');
    const [analizando, setAnalizando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState('');
    const [resultado, setResultado] = useState(null); // { cuenta_id, cuenta_nombre, filas }

    async function analizar() {
        setError('');
        setAnalizando(true);
        try {
            const res = await fetch('/api/finanzas/importar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cuenta: banco, texto, anio: Number(anio) }),
            });
            const datos = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(datos.error || 'No se ha podido analizar el texto');
                return;
            }
            setResultado({
                ...datos,
                filas: datos.filas.map((f, i) => ({
                    ...f,
                    clave: i,
                    incluir: Boolean(f.tipo_movimiento) && !f.ya_apuntado && !f.traspaso_propio,
                })),
            });
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setAnalizando(false);
        }
    }

    function actualizarFila(clave, cambios) {
        setResultado((r) => ({
            ...r,
            filas: r.filas.map((f) => (f.clave === clave ? { ...f, ...cambios } : f)),
        }));
    }

    async function guardar() {
        const filas = resultado.filas.filter((f) => f.incluir);
        if (!filas.length) return;

        setError('');
        setGuardando(true);
        try {
            const res = await fetch('/api/finanzas/importar', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cuenta_id: resultado.cuenta_id,
                    filas: filas.map((f) => ({
                        fecha: f.fecha,
                        concepto: f.concepto,
                        importe: f.importe,
                        tipo_movimiento: f.tipo_movimiento,
                        categoria_id: f.categoria_id || null,
                    })),
                }),
            });
            const datos = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(datos.error || 'No se ha podido guardar');
                return;
            }
            setTexto('');
            setResultado(null);
            onGuardado?.(datos.guardados);
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setGuardando(false);
        }
    }

    const incluidas = resultado?.filas.filter((f) => f.incluir) || [];

    return (
        <div className="fz-importar">
            {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

            {!resultado && (
                <div className="fz-form">
                    <div className="fz-form__par">
                        <div className="fz-pildoras">
                            {BANCOS.map((b) => (
                                <button
                                    key={b}
                                    type="button"
                                    className={`fz-pildoras__item${banco === b ? ' fz-pildoras__item--activo' : ''}`}
                                    onClick={() => setBanco(b)}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>

                        {banco === 'Santander' && (
                            <div className="fz-form__campo" style={{ maxWidth: 110 }}>
                                <label className="fz-form__etiqueta" htmlFor="anio-extracto">Año</label>
                                <input
                                    id="anio-extracto"
                                    className="fz-input"
                                    type="number"
                                    value={anio}
                                    onChange={(e) => setAnio(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="texto-extracto">
                            Pega aquí los movimientos, tal cual los copias del banco
                        </label>
                        <textarea
                            id="texto-extracto"
                            className="fz-area"
                            style={{ minHeight: 220, fontFamily: 'monospace', fontSize: 13 }}
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            placeholder={banco === 'Imagin'
                                ? 'TRANSFER INMEDIATA\n26 Ago 2026\nWeaddyou S.L.\n2.650,00 €\n+ 9.342,46 €\n...'
                                : 'Miércoles, 26 Agosto\n\nPago Movil En...\n\n-6,00\nEUR\n494,86 EUR\n...'}
                        />
                    </div>

                    <button
                        className="fz-boton"
                        type="button"
                        onClick={analizar}
                        disabled={analizando || !texto.trim()}
                    >
                        {analizando ? 'Analizando' : 'Analizar'}
                    </button>
                </div>
            )}

            {resultado && (
                <>
                    <p className="fz-importar__resumen">
                        {resultado.cuenta_nombre} · {resultado.filas.length} movimientos encontrados,{' '}
                        {incluidas.length} marcados para guardar
                    </p>

                    <div className="fz-importar__tabla">
                        {resultado.filas.map((f) => (
                            <div
                                key={f.clave}
                                className={`fz-importar__fila${f.incluir ? '' : ' fz-importar__fila--fuera'}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={f.incluir}
                                    onChange={(e) => actualizarFila(f.clave, { incluir: e.target.checked })}
                                    aria-label="Incluir este movimiento"
                                />

                                <input
                                    className="fz-input fz-importar__fecha"
                                    type="date"
                                    value={f.fecha}
                                    onChange={(e) => actualizarFila(f.clave, { fecha: e.target.value })}
                                />

                                <input
                                    className="fz-input fz-importar__concepto"
                                    type="text"
                                    value={f.concepto}
                                    onChange={(e) => actualizarFila(f.clave, { concepto: e.target.value })}
                                />

                                <input
                                    className="fz-input fz-importar__importe"
                                    type="number"
                                    step="0.01"
                                    value={f.importe}
                                    onChange={(e) => actualizarFila(f.clave, { importe: Number(e.target.value) })}
                                />

                                <select
                                    className="fz-select fz-importar__tipo"
                                    value={f.tipo_movimiento || ''}
                                    onChange={(e) => actualizarFila(f.clave, { tipo_movimiento: e.target.value || null })}
                                >
                                    <option value="">Elegir</option>
                                    <option value="gasto">Gasto</option>
                                    <option value="ingreso">Ingreso</option>
                                </select>

                                <select
                                    className="fz-select fz-importar__categoria"
                                    value={f.categoria_id || ''}
                                    onChange={(e) => actualizarFila(f.clave, { categoria_id: e.target.value || null })}
                                >
                                    <option value="">Sin categoría</option>
                                    {categorias.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>

                                {(f.ya_apuntado || f.traspaso_propio || !f.tipo_movimiento) && (
                                    <p className="fz-importar__pista">
                                        {f.ya_apuntado && 'Ya podría estar apuntado. '}
                                        {f.traspaso_propio && 'Podría ser un traspaso entre tus propias cuentas: revisa antes de incluirlo. '}
                                        {!f.tipo_movimiento && 'No he podido saber si es ingreso o gasto: elígelo para poder incluirlo.'}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="fz-editor__acciones">
                        <button
                            className="fz-boton"
                            type="button"
                            onClick={guardar}
                            disabled={guardando || !incluidas.length}
                        >
                            {guardando
                                ? 'Guardando'
                                : `Guardar ${incluidas.length} movimiento${incluidas.length === 1 ? '' : 's'}`}
                        </button>
                        <button
                            className="fz-boton fz-boton--texto"
                            type="button"
                            onClick={() => setResultado(null)}
                            disabled={guardando}
                        >
                            Volver a pegar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
