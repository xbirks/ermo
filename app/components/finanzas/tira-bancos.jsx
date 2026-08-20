"use client";

import { useState } from 'react';
import Cifra from './cifra';
import { diaCorto, fechaFijoDelMes, fechaLimiteIva } from '@/app/lib/finanzas/formato';

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
export default function TiraBancos({ cuentas, fijos, mes, trimestres, onCambio, onVerApartado }) {
    // Lo que aún tiene que salir de cada cuenta este mes. Sin esto, el
    // saldo de hoy engaña: el día 1 se cargan los domiciliados y baja
    // de golpe.
    const porSalir = {};
    // La cuota de autónomos es dinero para Hacienda igual que el IVA,
    // sólo que se paga desde Santander. Va aparte de los demás recibos.
    const cuotaHacienda = {};
    // Cuándo se espera el cargo de esa cuota, para poder decir "el
    // dinero hace falta el día X" en vez de sólo "hace falta".
    const cuotaHaciendaFecha = {};
    for (const f of fijos || []) {
        if (!f.toca || f.ya_apuntado || !f.cuenta) continue;
        const esCuota = /cuota aut[oó]nomo|seguridad social|tgss/i.test(f.nombre);
        const destino = esCuota ? cuotaHacienda : porSalir;
        destino[f.cuenta] = (destino[f.cuenta] || 0) + (f.importe_previsto || 0);
        if (esCuota) cuotaHaciendaFecha[f.cuenta] = fechaFijoDelMes(mes, f.dia_cobro);
    }

    // ¿Se ha traspasado ya el dinero de la cuota a Santander? No es lo
    // mismo tener que mandarlo que tenerlo ahí esperando el cargo.
    const cuotaCubierta = (fijos || []).some(
        (f) => /cuota aut[oó]nomo|seguridad social|tgss/i.test(f.nombre) && f.ya_apuntado
    );

    // El trimestre de IVA más antiguo que sigue retenido: es el que
    // toca liquidar primero. Los trimestres llegan del más reciente al
    // más antiguo, así que es el último que quede tras filtrar.
    const trimestresPendientes = (trimestres || []).filter((t) => t.pendiente > 0);
    const ivaFechaLimite = trimestresPendientes.length
        ? fechaLimiteIva(trimestresPendientes[trimestresPendientes.length - 1].trimestre_fiscal)
        : null;
    const [editando, setEditando] = useState(null);
    const [valor, setValor] = useState('');
    const [ocupado, setOcupado] = useState(false);
    const [ingresando, setIngresando] = useState(false);

    // No se suma nada. Sumar cuentas que no se mezclan —el ahorro con
    // el dinero del día a día— da una cifra que no responde a ninguna
    // pregunta y confunde sobre lo que se puede gastar.

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
            {[...cuentas]
                .sort((a, b) => {
                    const orden = { Imagin: 0, Santander: 1 };
                    return (orden[a.nombre] ?? 9) - (orden[b.nombre] ?? 9);
                })
                .map((c) => {
                // Lo comprometido: lo de Hacienda, lo apartado y los
                // recibos que ya se sabe que van a salir. Ese dinero no
                // está disponible aunque el banco aún no lo haya
                // cargado.
                const porCargar = porSalir[c.nombre] || 0;
                const cuota = cuotaHacienda[c.nombre] || 0;
                // De dónde sale la fecha prevista: si hay cuota, la
                // suya; si no, la del IVA. En esta app nunca coinciden
                // las dos en la misma cuenta.
                const fechaHacienda = cuota > 0
                    ? cuotaHaciendaFecha[c.nombre]
                    : (c.iva_retenido > 0 ? ivaFechaLimite : null);
                const retenido = c.iva_retenido + c.reservado + porCargar + cuota;
                const libre = c.saldo_actual - retenido;
                const enEdicion = editando === c.id;
                // Imagin y Santander son con las que se opera: van
                // arriba y grandes. El ahorro y el efectivo, debajo.
                const secundaria = !['Imagin', 'Santander'].includes(c.nombre);

                return (
                    <div
                        className={`fz-bancos__fila${secundaria ? ' fz-bancos__fila--secundaria' : ''}`}
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
                                <span className="fz-form__pista" style={{ width: '100%' }}>
                                    A partir de hoy, la app suma y resta lo que
                                    apuntes sobre esta cifra.
                                </span>
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
                                {/* Lo que dice el banco. Si hay dinero
                                    retenido, se detalla debajo. */}
                                <Cifra valor={c.saldo_actual} />
                            </button>
                        )}

                        {retenido > 0 && !enEdicion && (
                            <div className="fz-desglose">
                                {(c.iva_retenido > 0 || cuota > 0) && (
                                    <button
                                        className="fz-desglose__caja"
                                        type="button"
                                        onClick={() => onVerApartado?.()}
                                    >
                                        <span className="fz-desglose__etiqueta">
                                            Para Hacienda
                                            {(() => {
                                                const trozos = [];
                                                if (cuota > 0 && !c.iva_retenido) {
                                                    trozos.push(cuotaCubierta
                                                        ? 'cuota, ya traspasada'
                                                        : 'cuota, pendiente');
                                                }
                                                if (fechaHacienda) {
                                                    trozos.push(`previsto ${diaCorto(fechaHacienda)}`);
                                                }
                                                return trozos.length > 0 && (
                                                    <span className="fz-desglose__pie">
                                                        {trozos.join(' · ')}
                                                    </span>
                                                );
                                            })()}
                                        </span>
                                        <span className="fz-desglose__cifra fz-desglose__cifra--fuera">
                                            <Cifra valor={c.iva_retenido + cuota} signo={false} />
                                        </span>
                                    </button>
                                )}

                                {c.reservado > 0 && (
                                    <button
                                        className="fz-desglose__caja"
                                        type="button"
                                        onClick={() => onVerApartado?.()}
                                    >
                                        <span className="fz-desglose__etiqueta">Apartado</span>
                                        <span className="fz-desglose__cifra fz-desglose__cifra--fuera">
                                            <Cifra valor={c.reservado} signo={false} />
                                        </span>
                                    </button>
                                )}

                                {porCargar > 0 && (
                                    <div className="fz-desglose__caja">
                                        <span className="fz-desglose__etiqueta">Recibos del mes</span>
                                        <span className="fz-desglose__cifra fz-desglose__cifra--fuera">
                                            <Cifra valor={porCargar} signo={false} />
                                        </span>
                                    </div>
                                )}

                                <div className="fz-desglose__caja fz-desglose__caja--libre">
                                    <span className="fz-desglose__etiqueta">
                                        {c.nombre === 'Imagin' ? 'Puedes mover' : 'Queda libre'}
                                    </span>
                                    <span className="fz-desglose__cifra">
                                        <Cifra valor={libre} signo={false} />
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Mover el efectivo a una cuenta: se puede
                            ingresar en el banco o pasarlo a ahorro. */}
                        {c.tipo === 'efectivo' && c.saldo_actual > 0 && !enEdicion && (
                            ingresando ? (
                                <div className="fz-bancos__editor">
                                    <span className="fz-form__pista" style={{ width: '100%' }}>
                                        ¿A qué cuenta lo llevas?
                                    </span>
                                    {cuentas
                                        .filter((x) => x.id !== c.id)
                                        .map((x) => (
                                            <button
                                                key={x.id}
                                                className="fz-boton fz-boton--suave"
                                                type="button"
                                                disabled={ocupado}
                                                onClick={() => ingresarEfectivo(c, x.id, c.saldo_actual)}
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
                                </div>
                            ) : (
                                <button
                                    className="fz-boton fz-boton--texto fz-bancos__accion"
                                    type="button"
                                    onClick={() => setIngresando(true)}
                                >
                                    {/* La tarjeta de efectivo mide poco más de
                                        110 px en el móvil: «Llevarlo a una
                                        cuenta» no cabe de ninguna manera. Al
                                        pulsar se pregunta a qué cuenta, así
                                        que una palabra basta. */}
                                    Ingresar
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


        </div>
    );
}
