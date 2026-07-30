"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ermoLogo from '@/app/assets/logo/ERMO_blue.svg';

export default function EntrarPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    async function entrar(e) {
        e.preventDefault();
        setEnviando(true);
        setError('');

        try {
            const res = await fetch('/api/finanzas/entrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                // replace y no push: el botón atrás no debe volver al login.
                router.replace('/interno/finanzas');
                return;
            }

            const datos = await res.json().catch(() => ({}));
            setError(datos.error || 'No se ha podido entrar');
            setPassword('');
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="fz fz-entrada">
            <form className="fz-entrada__caja" onSubmit={entrar}>
                <Image
                    className="fz-entrada__logo"
                    src={ermoLogo}
                    alt="ERMO"
                    height={24}
                    priority
                />
                <p className="fz-entrada__sub">Finanzas</p>

                {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

                <div className="fz-form">
                    <div className="fz-form__campo">
                        <label className="fz-form__etiqueta" htmlFor="password">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            className="fz-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            autoFocus
                            required
                        />
                    </div>

                    <button
                        className="fz-boton fz-boton--ancho"
                        type="submit"
                        disabled={enviando || !password}
                    >
                        {enviando ? 'Comprobando' : 'Entrar'}
                    </button>
                </div>
            </form>
        </div>
    );
}
