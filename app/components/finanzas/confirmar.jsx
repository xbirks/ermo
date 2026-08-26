"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

/**
 * Sustituye a `window.confirm()`: mismo lenguaje visual que el resto
 * de fz-*, y en el móvil se puede leer y pulsar sin el diálogo del
 * sistema, que ahí no se puede ni estilizar ni controlar el salto de
 * línea.
 *
 * Se usa igual que `window.confirm`: `if (!(await confirmar(texto))) return;`
 */
const ConfirmarContext = createContext(null);

export function ConfirmarProvider({ children }) {
    const [estado, setEstado] = useState(null);
    const resolver = useRef(null);

    const confirmar = useCallback((mensaje, opciones = {}) => {
        return new Promise((resolve) => {
            resolver.current = resolve;
            setEstado({ mensaje, ...opciones });
        });
    }, []);

    function responder(valor) {
        setEstado(null);
        resolver.current?.(valor);
        resolver.current = null;
    }

    // Como en window.confirm(): Escape cancela.
    useEffect(() => {
        if (!estado) return;
        const alTeclear = (e) => { if (e.key === 'Escape') responder(false); };
        window.addEventListener('keydown', alTeclear);
        return () => window.removeEventListener('keydown', alTeclear);
    }, [estado]);

    return (
        <ConfirmarContext.Provider value={confirmar}>
            {children}

            {estado && (
                <div className="fz-confirmar__fondo" onClick={() => responder(false)}>
                    <div
                        className="fz-confirmar__caja"
                        role="alertdialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="fz-confirmar__texto">{estado.mensaje}</p>
                        <div className="fz-confirmar__acciones">
                            <button
                                className="fz-boton fz-boton--suave"
                                type="button"
                                onClick={() => responder(false)}
                            >
                                {estado.textoCancelar || 'Cancelar'}
                            </button>
                            <button
                                className={`fz-boton${estado.peligroso ? ' fz-boton--peligro-lleno' : ''}`}
                                type="button"
                                onClick={() => responder(true)}
                                autoFocus
                            >
                                {estado.textoAceptar || 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ConfirmarContext.Provider>
    );
}

/** `const confirmar = useConfirmar(); await confirmar('¿Seguro?')` → true/false. */
export function useConfirmar() {
    return useContext(ConfirmarContext);
}
