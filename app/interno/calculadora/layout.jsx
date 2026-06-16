import "@/app/style.scss";

export const metadata = {
  title: "Calculadora interna · ERMO",
  description: "Herramienta interna de presupuestos. No indexar.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function InternoCalculadoraLayout({ children }) {
  return children;
}
