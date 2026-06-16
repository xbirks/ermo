"use client";

import "../../calcular-precio-pagina-web/landing-calculadora.scss";
import CalculadoraWeb from "@/app/components/calculadora/calculadora";

export default function CalculadoraInternaPage() {
  return (
    <main className="landing-calculadora master__body">
      <section className="intro-landing__master">
        <h1>
          <span className="landing__destacado">Calculadora interna</span> · presupuestos
        </h1>
        <p className="landing-calculadora__explica">
          Herramienta de uso interno. Selecciona <strong>“Web restaurante”</strong> para ver las
          opciones específicas de hostelería e ir activándolas una a una en reunión. No indexada.
        </p>
      </section>

      <section className="grid__master calculadora">
        <CalculadoraWeb modo="interno" />
      </section>
    </main>
  );
}
