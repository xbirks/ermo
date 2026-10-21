"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import ermoLogo from '@/app/assets/logo/ERMO_blue.svg';
import CampoClave from '@/app/components/finanzas/campo-clave';

const DIGITOS = 6;

/** a••••@gmail.com: confirma a qué correo ha ido sin enseñarlo entero. */
function emailOculto(email) {
    const [nombre, dominio] = email.split('@');
    if (!dominio) return email;
    return `${nombre.slice(0, 1)}${'•'.repeat(Math.max(3, nombre.length - 1))}@${dominio}`;
}

export default function EntrarPage() {
    const router = useRouter();
    const [paso, setPaso] = useState('clave');          // clave · codigo
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [codigo, setCodigo] = useState(Array(DIGITOS).fill(''));
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const cajas = useRef([]);

    useEffect(() => {
        if (paso === 'codigo') cajas.current[0]?.focus();
    }, [paso]);

    async function pedir(url, cuerpo) {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpo),
        });
        const datos = await res.json().catch(() => ({}));
        return { ok: res.ok, datos };
    }

    async function enviarClave(e) {
        e.preventDefault();
        setEnviando(true);
        setError('');
        try {
            const { ok, datos } = await pedir('/api/finanzas/entrar', { email, password });
            if (ok) {
                setPaso('codigo');
                setPassword('');
                return;
            }
            setError(datos.error || 'No se ha podido entrar');
            setPassword('');
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setEnviando(false);
        }
    }

    async function enviarCodigo(valor) {
        setEnviando(true);
        setError('');
        try {
            const { ok, datos } = await pedir('/api/finanzas/entrar/codigo', { codigo: valor });
            if (ok) {
                // replace y no push: el botón atrás no debe volver al login.
                router.replace(datos.cambiarPassword ? '/interno/finanzas/contrasena' : '/interno/finanzas');
                return;
            }
            setError(datos.error || 'Código incorrecto');
            setCodigo(Array(DIGITOS).fill(''));
            if (datos.reiniciar) {
                setPaso('clave');
            } else {
                cajas.current[0]?.focus();
            }
        } catch {
            setError('Sin conexión con el servidor');
        } finally {
            setEnviando(false);
        }
    }

    function escribirDigito(i, texto) {
        const limpio = texto.replace(/\D/g, '');
        if (!limpio) {
            const nuevo = [...codigo];
            nuevo[i] = '';
            setCodigo(nuevo);
            return;
        }
        // Pegar el código entero, o que el móvil lo rellene de golpe.
        const nuevo = [...codigo];
        for (let k = 0; k < limpio.length && i + k < DIGITOS; k++) nuevo[i + k] = limpio[k];
        setCodigo(nuevo);
        const siguiente = Math.min(i + limpio.length, DIGITOS - 1);
        cajas.current[siguiente]?.focus();
        if (nuevo.every(Boolean)) enviarCodigo(nuevo.join(''));
    }

    function teclaDigito(i, e) {
        if (e.key === 'Backspace' && !codigo[i] && i > 0) cajas.current[i - 1]?.focus();
        if (e.key === 'ArrowLeft' && i > 0) cajas.current[i - 1]?.focus();
        if (e.key === 'ArrowRight' && i < DIGITOS - 1) cajas.current[i + 1]?.focus();
    }

    function volver() {
        setPaso('clave');
        setCodigo(Array(DIGITOS).fill(''));
        setError('');
    }

    return (
        <div className="fz fz-acceso">
            <main className="fz-acceso__panel">
                <div className="fz-acceso__marca">
                    <Image className="fz-acceso__logo" src={ermoLogo} alt="ERMO" height={20} priority />
                    <span className="fz-acceso__seccion">Finanzas</span>
                </div>

                <div className="fz-acceso__pasos" aria-label={`Paso ${paso === 'clave' ? 1 : 2} de 2`}>
                    <span className="fz-acceso__paso fz-acceso__paso--hecho" />
                    <span className={`fz-acceso__paso ${paso === 'codigo' ? 'fz-acceso__paso--hecho' : ''}`} />
                </div>

                {paso === 'clave' ? (
                    <>
                        <h1 className="fz-acceso__titulo">Entrar</h1>
                        <p className="fz-acceso__texto">Zona privada. Después de la contraseña te mandaremos un código al correo.</p>

                        {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

                        <form className="fz-form" onSubmit={enviarClave}>
                            <div className="fz-form__campo">
                                <label className="fz-form__etiqueta" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    className="fz-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="username"
                                    autoCapitalize="none"
                                    spellCheck={false}
                                    autoFocus
                                    required
                                />
                            </div>

                            <CampoClave
                                id="password"
                                etiqueta="Contraseña"
                                valor={password}
                                onCambio={setPassword}
                                autoComplete="current-password"
                            />

                            <button className="fz-boton fz-boton--ancho" type="submit" disabled={enviando || !email || !password}>
                                {enviando ? 'Comprobando' : 'Continuar'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="fz-acceso__titulo">Revisa tu correo</h1>
                        <p className="fz-acceso__texto">
                            Hemos enviado un código de 6 dígitos a <strong>{emailOculto(email)}</strong>.
                            Caduca en 10 minutos.
                        </p>

                        {error && <div className="fz-aviso fz-aviso--error">{error}</div>}

                        <div className="fz-codigo" role="group" aria-label="Código de 6 dígitos">
                            {codigo.map((d, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { cajas.current[i] = el; }}
                                    className="fz-codigo__caja"
                                    value={d}
                                    onChange={(e) => escribirDigito(i, e.target.value)}
                                    onKeyDown={(e) => teclaDigito(i, e)}
                                    onFocus={(e) => e.target.select()}
                                    inputMode="numeric"
                                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                    maxLength={DIGITOS}
                                    disabled={enviando}
                                    aria-label={`Dígito ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button className="fz-acceso__volver" type="button" onClick={volver}>
                            <ArrowLeft size={16} /> No me ha llegado, volver a empezar
                        </button>
                    </>
                )}

                <p className="fz-acceso__pie">
                    <ShieldCheck size={15} /> Cada acceso queda registrado y se avisa al instante.
                </p>
            </main>
        </div>
    );
}
