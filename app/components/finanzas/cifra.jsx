"use client";

/**
 * Una cifra en euros con los decimales atenuados.
 *
 * En las referencias de diseño, "13.310,00 €" se lee de un vistazo
 * porque el ".00 €" va en gris y el ojo va directo a los miles. Esto
 * hace lo mismo: parte entera al peso completo, decimales y símbolo
 * apagados.
 */
export default function Cifra({ valor, signo, tono, className = '' }) {
    const n = Number(valor) || 0;
    const negativo = n < 0;

    // Se formatea el absoluto: el signo se pone aparte para controlar
    // si se muestra "−" o "+" según el contexto.
    const partes = new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).formatToParts(Math.abs(n));

    const entera = partes
        .filter((p) => p.type === 'integer' || p.type === 'group')
        .map((p) => p.value)
        .join('');
    const decimal = partes.find((p) => p.type === 'fraction')?.value ?? '00';

    // El tono lo decide quien llama, salvo que sea negativo.
    const modificador = negativo ? 'negativo' : tono;
    const clases = ['fz-cifra', modificador && `fz-cifra--${modificador}`, className]
        .filter(Boolean)
        .join(' ');

    // El signo se puede forzar ('−' para una resta cuyo valor viene en
    // positivo, '+' para un ingreso) o suprimir con `false`. Sin
    // indicar nada, sólo aparece si el número es negativo. El menos es
    // el tipográfico (−), más ancho que el guion y alineado con las
    // cifras.
    let prefijo = '';
    if (signo === false) {
        prefijo = '';
    } else if (signo === '−' || signo === '-') {
        prefijo = '−';
    } else if (signo === '+') {
        prefijo = '+';
    } else if (negativo) {
        prefijo = '−';
    }

    return (
        <span className={clases}>
            {prefijo}{entera}
            <span className="fz-cifra__dec">,{decimal}</span>
            <span className="fz-cifra__eur">€</span>
        </span>
    );
}
