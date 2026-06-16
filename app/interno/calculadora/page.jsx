"use client";

import "../../calcular-precio-pagina-web/landing-calculadora.scss";
import CalculadoraWeb from "@/app/components/calculadora/calculadora";

export default function CalculadoraInternaPage() {
  return (
    <main className="landing-calculadora master__body" style={{ paddingTop: '140px' }}>
      <section className="grid__master calculadora">
        <CalculadoraWeb modo="interno" />
      </section>
    </main>
  );
}
