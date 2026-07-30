"use client";

import Cifra from './cifra';

/**
 * Los saldos de las cinco cuentas, en una línea cada uno.
 *
 * Antes eran cinco tarjetas grandes que ocupaban media pantalla para un
 * dato que se consulta de reojo. Aquí se ve lo mismo en una fracción
 * del espacio, y sigue arriba: saber cuánto hay en cada banco es de lo
 * primero que se mira al entrar.
 *
 * La cifra que se muestra es la disponible, no la del extracto: el
 * dinero retenido para Hacienda está en la cuenta pero no es gastable.
 * Cuando las dos no coinciden, se explica al lado.
 */
export default function TiraBancos({ cuentas }) {
    const total = cuentas.reduce((s, c) => s + c.disponible, 0);

    return (
        <div className="fz-bancos">
            {cuentas.map((c) => {
                const retenido = c.iva_retenido + c.reservado;
                return (
                    <div
                        className={`fz-bancos__fila${retenido > 0 ? ' fz-bancos__fila--retenido' : ''}`}
                        key={c.id}
                    >
                        <span className="fz-bancos__nombre">{c.nombre}</span>
                        <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                            {retenido > 0 && (
                                <span className="fz-bancos__nota">
                                    <Cifra valor={retenido} signo="−" tono="acento" /> retenidos
                                </span>
                            )}
                            <span className="fz-bancos__cifra">
                                <Cifra valor={c.disponible} />
                            </span>
                        </span>
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
