"use client";

import { useState, useEffect } from 'react';

/**
 * Por qué el mes salió como salió.
 *
 * Un mes puede aparecer en rojo por algo que no se ve en los
 * movimientos: marzo de 2026 está en −1.158 € porque el cobro se
 * retrasó a abril, no porque se gastara de más. Sin la nota, dentro de
 * un año ese número no se puede interpretar.
 *
 * Es lo mismo que en las hojas de papel se escribía al margen.
 */
export default function NotaMes({ mes, nota, onGuardado }) {
    const [editando, setEditando] = useState(false);
    const [texto, setTexto] = useState('');
    const [ocupado, setOcupado] = useState(false);

    // Al cambiar de mes, el editor vuelve a cerrarse.
    useEffect(() => {
        setEditando(false);
        setTexto(nota?.texto || '');
    }, [mes, nota?.texto]);

    async function guardar(e) {
        e.preventDefault();
        setOcupado(true);
        try {
            const res = await fetch('/api/finanzas/nota-mes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mes, texto }),
            });
            if (res.ok) {
                setEditando(false);
                onGuardado?.();
            }
        } finally {
            setOcupado(false);
        }
    }

    if (editando) {
        return (
            <form className="fz-nota fz-nota--editando" onSubmit={guardar}>
                <textarea
                    className="fz-area"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    placeholder="Por qué este mes salió así. Por ejemplo: el cobro se retrasó al mes siguiente."
                    maxLength={600}
                    autoFocus
                />
                <div className="fz-nota__acciones">
                    <button className="fz-boton" type="submit" disabled={ocupado}>
                        {ocupado ? 'Guardando' : 'Guardar nota'}
                    </button>
                    <button
                        className="fz-boton fz-boton--texto"
                        type="button"
                        onClick={() => { setEditando(false); setTexto(nota?.texto || ''); }}
                    >
                        Cancelar
                    </button>
                    {nota?.texto && (
                        <button
                            className="fz-boton fz-boton--texto"
                            type="button"
                            onClick={() => { setTexto(''); }}
                        >
                            Vaciar
                        </button>
                    )}
                </div>
            </form>
        );
    }

    if (!nota?.texto) {
        return (
            <button
                className="fz-nota fz-nota--vacia"
                type="button"
                onClick={() => setEditando(true)}
            >
                Añadir una nota a este mes
            </button>
        );
    }

    return (
        <button className="fz-nota" type="button" onClick={() => setEditando(true)}>
            {nota.texto}
        </button>
    );
}
