"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check } from 'lucide-react';
import ermoLogo from '@/app/assets/logo/ERMO_blue.svg';
import CampoClave from '@/app/components/finanzas/campo-clave';

// Los mismos requisitos que comprueba el servidor (fallosPassword).
const REQUISITOS = [
    { texto: 'Al menos 12 caracteres', ok: (p) => p.length >= 12 },
    { texto: 'Una mayúscula', ok: (p) => /[A-Z]/.test(p) },
    { texto: 'Una minúscula', ok: (p) => /[a-z]/.test(p) },
    { texto: 'Un número', ok: (p) => /[0-9]/.test(p) },
    { texto: 'Un símbolo', ok: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function ContrasenaPage() {
    const router = useRouter();
    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [repetida, setRepetida] = useState('');
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);

    const cumple = REQUISITOS.every((r) => r.ok(nueva));
    const coinciden = nueva.length > 0 && nueva === repetida;

    async function guardar(e) {
        e.preventDefault();
        setEnviando(true);
        setError('');
        try {
            const res = await fetch('/api/finanzas/contrasena', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actual, nueva }),
            });
            const datos = await res.json().catch(() => ({}));
            if (res.ok) {
                router.replace('/interno/finanzas');
                return;
            }
            if (res.status === 401) {
                router.replace('/interno/finanzas/entrar');
                return;
            }
            setError(datos.error || 'No se ha podido cambiar la contraseña');
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setEnviando(false);
        }
    }

    async function salir() {
        await fetch('/api/finanzas/entrar', { method: 'DELETE' });
        router.replace('/interno/finanzas/entrar');
    }

    return (
        <div className="fz fz-acceso">
            <main className="fz-acceso__panel">
                <div className="fz-acceso__marca">
                    <Image className="fz-acceso__logo" src={ermoLogo} alt="ERMO" height={20} priority />
                    <span className="fz-acceso__seccion">Finanzas</span>
                </div>

                <h1 className="fz-acceso__titulo">Nueva contraseña</h1>
                <p className="fz-acceso__texto">
                    Elige una contraseña tuya para sustituir la temporal. Al guardarla se cierran las demás sesiones abiertas.
                </p>

                {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

                <form className="fz-form" onSubmit={guardar}>
                    <CampoClave id="actual" etiqueta="Contraseña actual" valor={actual} onCambio={setActual}
                        autoComplete="current-password" autoFocus />
                    <CampoClave id="nueva" etiqueta="Contraseña nueva" valor={nueva} onCambio={setNueva}
                        autoComplete="new-password" />

                    <ul className="fz-requisitos">
                        {REQUISITOS.map((r) => (
                            <li key={r.texto} className={r.ok(nueva) ? 'fz-requisitos__ok' : ''}>
                                <Check size={14} /> {r.texto}
                            </li>
                        ))}
                    </ul>

                    <CampoClave id="repetida" etiqueta="Repite la contraseña nueva" valor={repetida} onCambio={setRepetida}
                        autoComplete="new-password" />
                    {repetida && !coinciden && <p className="fz-clave__aviso">No coinciden</p>}

                    <button className="fz-boton fz-boton--ancho" type="submit"
                        disabled={enviando || !actual || !cumple || !coinciden}>
                        {enviando ? 'Guardando' : 'Guardar contraseña'}
                    </button>
                </form>

                <button className="fz-acceso__volver" type="button" onClick={salir}>Salir</button>
            </main>
        </div>
    );
}
