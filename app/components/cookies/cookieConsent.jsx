"use client";
import { useEffect } from "react";
import "./cookie.scss";

export default function CookieConsent() {
  useEffect(() => {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");

    const consent = localStorage.getItem("cookie-consent");

    if (!consent) {
      banner.classList.add("show");
    } else if (consent === "accepted") {
      loadAnalytics();
    }

    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "accepted");
      banner.classList.remove("show");
      loadAnalytics();
    });

    rejectBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "rejected");
      banner.classList.remove("show");
    });

    function loadAnalytics() {
      if (window.gtag) return; // Evita duplicados
      const script1 = document.createElement("script");
      script1.src = "https://www.googletagmanager.com/gtag/js?id=G-XHXYQ2JL9P";
      script1.async = true;
      document.head.appendChild(script1);

      const script2 = document.createElement("script");
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XHXYQ2JL9P');
      `;
      document.head.appendChild(script2);
    }
  }, []);

  return (
    <div id="cookie-banner" className="cookie-banner">
      <p>
        Usamos cookies propias y de terceros para analizar el uso de la web y personalizar la experiencia.<br></br>
        <a className="cookie__link" href="/legal/aviso-de-cookies" target="_blank"> Leer política de cookies</a>.
      </p>
      <div className="cookie-buttons">
        <button id="accept-cookies">Aceptar todas</button>
        <button id="reject-cookies">Usar solo necesarias</button>
      </div>
    </div>
  );
}
