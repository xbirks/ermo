"use client";

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Campo de contraseña con botón para verla y aviso de mayúsculas.
 *
 * El bloqueo de mayúsculas es la causa más tonta de un "contraseña
 * incorrecta", y con el bloqueo por intentos fallidos sale caro.
 */
export default function CampoClave({ id, etiqueta, valor, onCambio, autoComplete, autoFocus }) {
    const [visible, setVisible] = useState(false);
    const [mayusculas, setMayusculas] = useState(false);

    const mirarMayusculas = (e) => setMayusculas(!!e.getModifierState?.('CapsLock'));

    return (
        <div className="fz-form__campo">
            <label className="fz-form__etiqueta" htmlFor={id}>{etiqueta}</label>
            <div className="fz-clave">
                <input
                    id={id}
                    className="fz-input fz-clave__input"
                    type={visible ? 'text' : 'password'}
                    value={valor}
                    onChange={(e) => onCambio(e.target.value)}
                    onKeyUp={mirarMayusculas}
                    onKeyDown={mirarMayusculas}
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    spellCheck={false}
                    autoCapitalize="none"
                    required
                />
                <button
                    type="button"
                    className="fz-clave__ver"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? 'Ocultar contraseña' : 'Ver contraseña'}
                    tabIndex={-1}
                >
                    {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            {mayusculas && <p className="fz-clave__aviso">Tienes activado el bloqueo de mayúsculas</p>}
        </div>
    );
}
