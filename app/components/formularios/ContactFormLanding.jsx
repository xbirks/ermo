'use client';
import { useState, useMemo, useEffect } from 'react';
import StandardSubmit from '@/app/buttons/standard-submit';
import { trackFormSubmit } from '../../../app/lib/ga'; 

// Ads conversion sin navegación
function reportAdsConversion() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-11336883443/i3E3CP6hlpAbEPO57J0q',
      value: 1.0,
      currency: 'EUR',
    });
  }
}

export default function ContactFormLanding() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');         
  const [message, setMessage] = useState('');   

  // tracking/meta
  const [utm, setUtm] = useState({
    utm_source: '',
    utm_medium: '',
    utm_campaign: '',
    utm_term: '',
    utm_content: '',
    gclid: '',
    page: '',
  });

  const [sending, setSending] = useState(false);
  const [okMsg, setOkMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  // Validaciones mínimas
  const isValidName  = useMemo(() => name.trim().length >= 2, [name]);
  const isValidEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), [email]);
  const isValidPhone = useMemo(() => phone.trim() === '' || /^[0-9+\-\s()]{6,}$/.test(phone), [phone]);
  const canSubmit    = isValidName && isValidEmail && isValidPhone && !sending;

  // Captura UTM/GCLID + página
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const qp = url.searchParams;

    setUtm({
      utm_source: qp.get('utm_source') || '',
      utm_medium: qp.get('utm_medium') || '',
      utm_campaign: qp.get('utm_campaign') || '',
      utm_term: qp.get('utm_term') || '',
      utm_content: qp.get('utm_content') || '',
      gclid: qp.get('gclid') || '',
      page: url.pathname + url.search || '',
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setSending(true); setOkMsg(''); setErrMsg('');
    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
        ...utm,
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok === false) {
        throw new Error(data?.error || 'Error al enviar');
      }

      setOkMsg('Enviado correctamente. Te contactaré en breve.');
      setName(''); setEmail(''); setPhone(''); setMessage('');

      // Analytics SOLO si todo OK
      trackFormSubmit('contacto_landing_web');  // GA4
      reportAdsConversion();                    // Google Ads

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
          required
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
          required
        />
      </div>

      <div className={`cf__field ${phone ? 'is-filled' : ''}`}>
        <input
          type="tel"
          name="phone"
          placeholder="Teléfono (opcional)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={phone ? !isValidPhone : undefined}
          autoComplete="tel"
        />
      </div>

      <div className={`cf__field ${message ? 'is-filled' : ''}`}>
        <textarea
          name="message"
          placeholder="Cuéntame tu proyecto (opcional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
        />
      </div>

      {/* Hidden tracking fields (útil si inspeccionas en el backend) */}
      <input type="hidden" name="utm_source" value={utm.utm_source} readOnly />
      <input type="hidden" name="utm_medium" value={utm.utm_medium} readOnly />
      <input type="hidden" name="utm_campaign" value={utm.utm_campaign} readOnly />
      <input type="hidden" name="utm_term" value={utm.utm_term} readOnly />
      <input type="hidden" name="utm_content" value={utm.utm_content} readOnly />
      <input type="hidden" name="gclid" value={utm.gclid} readOnly />
      <input type="hidden" name="page" value={utm.page} readOnly />

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
