// /lib/adsConversion.js
export function reportAdsConversionAndGo(e, url) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const go = () => { window.location.href = url; };

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-11336883443/i3E3CP6hlpAbEPO57J0q',
      value: 1.0,
      currency: 'EUR',
      event_callback: go,
      event_timeout: 2000,
    });
    setTimeout(go, 1600);
  } else {
    go();
  }
}
