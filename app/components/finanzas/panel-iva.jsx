"use client";

import { useState } from 'react';
import Cifra from './cifra';
import { euros, nombreMes, hoyISO } from '@/app/lib/finanzas/formato';

/**
 * IVA: se devenga por mes, se paga por trimestre.
 *
 * En las hojas esto aparece como "452 + 452 + 525 = 1429€": tres meses
 * retenidos que se liquidan de una vez. Aquí se anota mes a mes y se
 * liquida el trimestre entero de un botón, que además apunta el gasto
 * real en la cuenta desde la que sale el dinero.
 */
export default function PanelIva({ provisiones, trimestres, cuentas, mes, resumen, onCambio }) {
    const [importe, setImporte] = useState('');
    const [cuentaId, setCuentaId] = useState(
        cuentas.find((c) => c.nombre === 'Imagin')?.id || ''
    );
    const [notas, setNotas] = useState('');
    const [error, setError] = useState('');
    const [ocupado, setOcupado] = useState(false);

    async function llamar(cuerpo) {
        setOcupado(true);
        setError('');
        try {
            const res = await fetch('/api/finanzas/iva', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cuerpo),
            });
            const datos = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(datos.error || 'No se ha podido guardar');
                return false;
            }
            onCambio?.();
            return true;
        } catch {
            setError('Sin conexión con el servidor');
            return false;
        } finally {
            setOcupado(false);
        }
    }

    async function anotar(e) {
        e.preventDefault();
        const ok = await llamar({
            mes_referencia: mes,
            importe_calculado: importe,
            cuenta_id: cuentaId,
            notas,
        });
        if (ok) { setImporte(''); setNotas(''); }
    }

    async function liquidar(trimestre) {
        const aviso =
            `Vas a marcar como pagado a Hacienda el ${trimestre.trimestre_fiscal}, ` +
            `$<Cifra valor={trimestre.pendiente} signo={false} />. Se apuntará también el gasto en la cuenta elegida.`;
        if (!window.confirm(aviso)) return;

        await llamar({
            accion: 'pagar_trimestre',
            trimestre_fiscal: trimestre.trimestre_fiscal,
            fecha_pago: hoyISO(),
            cuenta_id: cuentaId,
        });
    }

    const retenidoTotal = provisiones
        .filter((p) => p.estado === 'retenido')
        .reduce((s, p) => s + p.importe_calculado, 0);

    // ¿Este mes ya tiene pagada una liquidación? Anotar encima una
    // provisión del mismo trimestre lleva a contarlo dos veces: el pago
    // ya salió del banco.
    const yaPagadoEsteMes = (resumen?.iva_pagado || 0) > 0;

    return (
        <>
            {yaPagadoEsteMes && (
                <div className="fz-aviso fz-aviso--atencion">
                    Este mes ya salió del banco una liquidación de IVA. Si vas a
                    anotar lo que retienes para el próximo trimestre, ponlo en el
                    mes en que toque pagarlo, no en éste.
                </div>
            )}

            {retenidoTotal > 0 && (
                <div className="fz-aviso fz-aviso--atencion">
                    Tienes <Cifra valor={retenidoTotal} signo={false} /> de IVA retenido. Ese dinero está en la
                    cuenta pero no es tuyo.
                </div>
            )}

            <div className="fz-seccion">
                <p className="fz-seccion__titulo">Por trimestre</p>

                {!trimestres.length && (
                    <p className="fz-vacio">Todavía no hay IVA anotado.</p>
                )}

                {trimestres.map((t) => {
                    const pendiente = t.pendiente > 0;
                    return (
                        <div className="fz-fila" key={t.trimestre_fiscal}>
                            <div>
                                <p className="fz-fila__titulo">
                                    {t.trimestre_fiscal}
                                    <span className={`fz-tag fz-tag--${pendiente ? 'retenido' : 'pagado'}`}>
                                        {pendiente ? 'Retenido' : 'Pagado'}
                                    </span>
                                </p>
                                <p className="fz-fila__detalle">
                                    {t.meses} {t.meses === 1 ? 'mes' : 'meses'} · total <Cifra valor={t.total} signo={false} />
                                </p>
                            </div>

                            <div className="fz-fila__lado">
                                <span className={`fz-fila__cifra${pendiente ? ' fz-fila__cifra' : ''}`}>
                                    <Cifra valor={pendiente ? t.pendiente : t.total} signo={false} />
                                </span>
                                {pendiente && (
                                    <button
                                        className="fz-boton fz-boton--suave"
                                        type="button"
                                        onClick={() => liquidar(t)}
                                        disabled={ocupado || !cuentaId}
                                    >
                                        Liquidar
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="fz-form">
                <div className="fz-seccion">
                    <p className="fz-seccion__titulo">Mes a mes</p>

                    {!provisiones.length && <p className="fz-vacio">Sin registros.</p>}

                    {provisiones.map((p) => (
                        <div className="fz-fila" key={p.id}>
                            <div>
                                <p className="fz-fila__titulo fz-inicial">
                                    {nombreMes(p.mes_referencia)}
                                </p>
                                <p className="fz-fila__detalle">
                                    {p.trimestre_fiscal}
                                    {p.cuenta && ` · ${p.cuenta}`}
                                    {p.fecha_pago && ' · pagado'}
                                    {p.notas && ` · ${p.notas}`}
                                </p>
                            </div>
                            <span className={`fz-fila__cifra${p.estado === 'retenido' ? ' fz-fila__cifra' : ''}`}>
                                <Cifra valor={p.importe_calculado} signo={false} />
                            </span>
                        </div>
                    ))}
                </div>

                <form className="fz-seccion" onSubmit={anotar}>
                    <p className="fz-seccion__titulo">Anotar IVA del mes</p>

                    {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

                    <div className="fz-form">
                        <div className="fz-form__campo">
                            <label className="fz-form__etiqueta" htmlFor="iva-mes">Mes</label>
                            <input
                                id="iva-mes"
                                className="fz-input fz-inicial"
                                type="text"
                                value={nombreMes(mes)}
                                readOnly
                            />
                            <p className="fz-form__pista">
                                Anota el IVA en el mes en que vas a pagarlo, no
                                en el que lo has cobrado: así la app lo avisa
                                cuando toca, y el pago se resta una sola vez
                                cuando salga del banco.
                            </p>
                        </div>

                        <div className="fz-form__campo">
                            <label className="fz-form__etiqueta" htmlFor="iva-importe">Importe</label>
                            <input
                                id="iva-importe"
                                className="fz-input fz-input--importe"
                                type="number"
                                step="0.01"
                                min="0"
                                inputMode="decimal"
                                placeholder="0,00"
                                value={importe}
                                onChange={(e) => setImporte(e.target.value)}
                                required
                            />
                        </div>

                        <div className="fz-form__campo">
                            <label className="fz-form__etiqueta" htmlFor="iva-cuenta">
                                Cuenta donde se retiene
                            </label>
                            <select
                                id="iva-cuenta"
                                className="fz-select"
                                value={cuentaId}
                                onChange={(e) => setCuentaId(e.target.value)}
                                required
                            >
                                <option value="">Elegir</option>
                                {cuentas.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <div className="fz-form__campo">
                            <label className="fz-form__etiqueta" htmlFor="iva-notas">Notas</label>
                            <textarea
                                id="iva-notas"
                                className="fz-area"
                                value={notas}
                                onChange={(e) => setNotas(e.target.value)}
                                maxLength={400}
                            />
                        </div>

                        <button className="fz-boton fz-boton--ancho" type="submit" disabled={ocupado}>
                            {ocupado ? 'Guardando' : 'Anotar IVA'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
