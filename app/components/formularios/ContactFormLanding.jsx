'use client';
import { useState, useMemo } from 'react';
import StandardSubmit from '@/app/buttons/standard-submit';

export default function ContactFormLanding() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [okMsg, setOkMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const isValidName  = useMemo(() => name.trim().length >= 2, [name]);
  const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const canSubmit    = isValidName && isValidEmail && !sending;

async function handleSubmit(e) {
  e.preventDefault();
  if (!canSubmit) return;
  setSending(true); setOkMsg(''); setErrMsg('');
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim() })
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data?.ok === false) {
      throw new Error(data?.error || 'Error al enviar');
    }

    setOkMsg('Enviado correctamente. Te contactaré en breve.');
    setName(''); setEmail('');
  } catch (err) {
    setErrMsg(err.message || 'No se ha podido enviar. Inténtalo de nuevo.');
  } finally {
    setSending(false);
  }
}


  return (
    <form className="cf" onSubmit={handleSubmit} noValidate aria-busy={sending}>
      <div className={`cf__field ${name ? 'is-filled' : ''}`}>
        <input
          type="text"
          name="name"
          placeholder="Nombre y apellidos"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={name ? !isValidName : undefined}
          autoComplete="name"
        />
      </div>

      <div className={`cf__field ${email ? 'is-filled' : ''}`}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={email ? !isValidEmail : undefined}
          autoComplete="email"
        />
      </div>

      <StandardSubmit
        title={sending ? 'ENVIANDO…' : 'ENVIAR'}
        style="mt-xs"
        bg={canSubmit ? '#3F52FF' : '#B3B3B3'}
        color="white"
        borderColor={canSubmit ? '#3F52FF' : 'transparent'}
        hoverBg="#0E1C9D"
        hoverColor="white"
        hoverBorderColor="#3F52FF"
        disabled={!canSubmit}
      />

      {okMsg && <p className="cf__msg ok">{okMsg}</p>}
      {errMsg && <p className="cf__msg err">{errMsg}</p>}
    </form>
  );
}
