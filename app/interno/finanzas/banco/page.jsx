"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import ermoLogo from '@/app/assets/logo/ERMO_blue.svg';

// Conexión con los bancos (sólo lectura).
//
// Esta misma página es la dirección de vuelta que Enable Banking tiene
// registrada: el banco devuelve aquí con ?code=…&state=…. El middleware
// la deja cargar sin sesión, porque la cookie es sameSite=strict y no
// viaja en una navegación que viene de otra web; pero los datos los pide
// por la API, que sí exige sesión.

const fecha = (v) => (v ? new Date(v).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }) : '');
const fechaHora = (v) => (v ? new Date(v).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
const euros = (n) => (n === null || n === undefined ? '' : n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }));

export default function BancoPage() {
    const router = useRouter();
    const [bancos, setBancos] = useState(null);
    const [rol, setRol] = useState(null);
    const [aviso, setAviso] = useState(null);       // { tipo: 'ok' | 'error', texto }
    const [ocupado, setOcupado] = useState('');
    const vueltaHecha = useRef(false);

    const cargar = useCallback(async () => {
        const res = await fetch('/api/finanzas/banco', { cache: 'no-store' });
        if (res.status === 401) { router.replace('/interno/finanzas/entrar'); return; }
        const datos = await res.json().catch(() => ({}));
        if (res.status === 403 && datos.cambiarPassword) { router.replace('/interno/finanzas/contrasena'); return; }
        if (!res.ok) { setAviso({ tipo: 'error', texto: datos.error || 'No se ha podido cargar' }); return; }
        setBancos(datos.bancos);
        setRol(datos.rol);
    }, [router]);

    // Vuelta del banco: canjea el código y limpia la dirección.
    useEffect(() => {
        if (vueltaHecha.current) return;
        vueltaHecha.current = true;
        const q = new URLSearchParams(window.location.search);
        const code = q.get('code');
        const state = q.get('state');
        const errorBanco = q.get('error');
        if (code || errorBanco) window.history.replaceState(null, '', '/interno/finanzas/banco');

        if (errorBanco) {
            setAviso({ tipo: 'error', texto: 'El banco no ha completado la autorización. Puedes volver a intentarlo.' });
            cargar();
            return;
        }
        if (!code) { cargar(); return; }

        (async () => {
            setOcupado('vuelta');
            try {
                const res = await fetch('/api/finanzas/banco/sesion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, state }),
                });
                if (res.status === 401) { router.replace('/interno/finanzas/entrar'); return; }
                const datos = await res.json().catch(() => ({}));
                if (!res.ok) {
                    setAviso({ tipo: 'error', texto: datos.error || 'No se ha podido conectar' });
                } else if (datos.lectura?.error) {
                    setAviso({ tipo: 'error', texto: `${datos.cuenta} conectado, pero la primera lectura ha fallado: ${datos.lectura.error}` });
                } else {
                    setAviso({
                        tipo: 'ok',
                        texto: `${datos.cuenta} conectado. ${datos.lectura.nuevas} movimientos nuevos y ${datos.lectura.enlazadas} que ya tenías apuntados.`,
                    });
                }
            } finally {
                setOcupado('');
                cargar();
            }
        })();
    }, [cargar, router]);

    async function conectar(cuenta) {
        setOcupado(cuenta);
        setAviso(null);
        const res = await fetch('/api/finanzas/banco/conectar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cuenta }),
        });
        const datos = await res.json().catch(() => ({}));
        if (res.ok && datos.url) {
            window.location.href = datos.url;
            return;
        }
        setOcupado('');
        setAviso({ tipo: 'error', texto: datos.error || 'No se ha podido iniciar la conexión' });
    }

    async function actualizar() {
        setOcupado('actualizar');
        setAviso(null);
        try {
            const res = await fetch('/api/finanzas/banco/actualizar', { method: 'POST' });
            const datos = await res.json().catch(() => ({}));
            if (!res.ok) { setAviso({ tipo: 'error', texto: datos.error || 'No se ha podido leer' }); return; }
            const partes = (datos.resultados || []).map((r) => (r.ok ? `${r.cuenta}: ${r.nuevas} nuevos` : `${r.cuenta}: ${r.error}`));
            setAviso({ tipo: (datos.resultados || []).every((r) => r.ok) ? 'ok' : 'error', texto: partes.join(' · ') || 'No hay bancos conectados' });
        } finally {
            setOcupado('');
            cargar();
        }
    }

    const propietario = rol === 'propietario';
    const algunoConectado = bancos?.some((b) => b.conectada);

    return (
        <div className="fz">
            <div className="fz__contenedor fz-bancos-conexion">
                <header className="fz-cabecera">
                    <div className="fz-cabecera__marca">
                        <Image className="fz-cabecera__logo" src={ermoLogo} alt="ERMO" height={22} priority />
                        <span className="fz-cabecera__seccion">Finanzas · Bancos</span>
                    </div>
                    <button className="fz-boton fz-boton--suave" type="button" onClick={() => router.push('/interno/finanzas')}>
                        <ArrowLeft size={16} /> Volver
                    </button>
                </header>

                <h1 className="fz-acceso__titulo">Conexión con los bancos</h1>
                <p className="fz-acceso__texto">
                    Solo lectura: saldos y movimientos, nunca pagos ni transferencias. Se leen cada mañana y cuando pulsas Actualizar.
                </p>

                {aviso && <div className={`fz-aviso ${aviso.tipo === 'error' ? 'fz-aviso--error' : ''}`}>{aviso.texto}</div>}
                {ocupado === 'vuelta' && <div className="fz-aviso">Conectando con el banco y leyendo los movimientos</div>}

                {propietario && algunoConectado && (
                    <button className="fz-boton" type="button" onClick={actualizar} disabled={!!ocupado}>
                        <RefreshCw size={16} /> {ocupado === 'actualizar' ? 'Leyendo' : 'Actualizar ahora'}
                    </button>
                )}

                <div className="fz-conexiones">
                    {!bancos && <p className="fz-vacio">Cargando</p>}
                    {bancos?.map((b) => {
                        const caduca = b.valida_hasta ? Math.ceil((new Date(b.valida_hasta) - Date.now()) / 86400000) : null;
                        return (
                            <section key={b.cuenta} className="fz-conexion">
                                <div className="fz-conexion__cabeza">
                                    <h2 className="fz-conexion__nombre">{b.cuenta}</h2>
                                    <span className={`fz-conexion__estado ${b.conectada ? 'fz-conexion__estado--ok' : ''}`}>
                                        {b.conectada ? 'Conectado' : b.valida_hasta ? 'Caducado' : 'Sin conectar'}
                                    </span>
                                </div>

                                {b.conectada && (
                                    <dl className="fz-conexion__datos">
                                        <div><dt>Cuenta</dt><dd>{b.iban}</dd></div>
                                        <div><dt>Saldo en el banco</dt><dd>{euros(b.saldo_banco)}</dd></div>
                                        <div><dt>Última lectura</dt><dd>{fechaHora(b.ultima_lectura) || 'Todavía no'}</dd></div>
                                        <div>
                                            <dt>Autorizado hasta</dt>
                                            <dd className={caduca !== null && caduca <= 14 ? 'fz-conexion__alerta' : ''}>
                                                {fecha(b.valida_hasta)}{caduca !== null && caduca <= 14 ? ` · quedan ${caduca} días` : ''}
                                            </dd>
                                        </div>
                                    </dl>
                                )}
                                {b.ultimo_error && <p className="fz-conexion__error">Último error: {b.ultimo_error}</p>}

                                {propietario && (
                                    <button
                                        className={`fz-boton ${b.conectada ? 'fz-boton--suave' : ''}`}
                                        type="button"
                                        onClick={() => conectar(b.cuenta)}
                                        disabled={!!ocupado}
                                    >
                                        {ocupado === b.cuenta ? 'Abriendo el banco' : b.conectada ? 'Renovar autorización' : 'Conectar'}
                                    </button>
                                )}
                            </section>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
