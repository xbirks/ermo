"use client";

import { useEffect, useRef } from "react";
import s from "./FondoVivo.module.scss";

// Degradado vivo en WebGL, sin librerías: un único shader que mezcla los
// colores de la marca con ruido que se deforma muy despacio (la técnica
// de Stripe, en pequeño). Lleva un grano finísimo porque en degradados
// oscuros la pantalla dibuja "escalones" de color; el grano los disuelve.
//
// Debajo siempre hay un degradado CSS fijo: es lo que se ve si no hay
// WebGL, mientras carga, y con "reducir movimiento" (entonces se pinta
// un solo fotograma, sin animar).

const VERTICES = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAGMENTOS = `
precision highp float;
uniform vec2 uTam;
uniform float uT;
uniform vec3 uC0, uC1, uC2, uC3;

float azar(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float ruido(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(azar(i), azar(i + vec2(1.0, 0.0)), u.x),
               mix(azar(i + vec2(0.0, 1.0)), azar(i + vec2(1.0, 1.0)), u.x), u.y);
}

float capas(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * ruido(p); p *= 2.0; a *= 0.5; }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / uTam;
    vec2 p = uv * vec2(uTam.x / uTam.y, 1.0) * 1.3;
    float t = uT * 0.035;

    // Deformación del ruido por el propio ruido: da las formas blandas.
    vec2 q = vec2(capas(p + t), capas(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(capas(p + 2.0 * q + vec2(1.7, 9.2) + t * 1.3),
                  capas(p + 2.0 * q + vec2(8.3, 2.8) - t));
    float n = capas(p + 2.0 * r);

    vec3 col = mix(uC0, uC1, smoothstep(0.25, 0.85, n));
    col = mix(col, uC2, smoothstep(0.5, 1.0, length(q)) * 0.6);
    col = mix(col, uC3, smoothstep(0.62, 0.95, r.x) * 0.22);

    // Más oscuro arriba y abajo, como el degradado de Figma.
    col *= mix(0.9, 1.05, sin(uv.y * 3.14159));

    // Grano contra el escalonado.
    col += (azar(gl_FragCoord.xy + fract(uT) * 97.0) - 0.5) * (2.0 / 255.0);

    gl_FragColor = vec4(col, 1.0);
}
`;

const aRGB = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function compilar(gl, tipo, fuente) {
    const sh = gl.createShader(tipo);
    gl.shaderSource(sh, fuente);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("FondoVivo: el shader no compila", gl.getShaderInfoLog(sh));
        return null;
    }
    return sh;
}

// Paleta por defecto: la de las secciones oscuras (tinta y sus tonos).
const OSCURO = ["#14394B", "#224C60", "#2B5A70", "#3D7A8F"];

export default function FondoVivo({ colores = OSCURO, className = "" }) {
    const lienzo = useRef(null);

    useEffect(() => {
        const canvas = lienzo.current;
        const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
        if (!gl) return undefined;

        const vs = compilar(gl, gl.VERTEX_SHADER, VERTICES);
        const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTOS);
        if (!vs || !fs) return undefined;

        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        gl.useProgram(prog);

        // Un triángulo que cubre toda la pantalla.
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const pos = gl.getAttribLocation(prog, "p");
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const uTam = gl.getUniformLocation(prog, "uTam");
        const uT = gl.getUniformLocation(prog, "uT");
        ["uC0", "uC1", "uC2", "uC3"].forEach((u, i) => gl.uniform3fv(gl.getUniformLocation(prog, u), aRGB(colores[i])));

        // Un degradado no necesita resolución retina: a 1x va sobrado y
        // la tarjeta gráfica trabaja una cuarta parte.
        const ajustar = () => {
            const { width, height } = canvas.getBoundingClientRect();
            canvas.width = Math.max(1, Math.round(width));
            canvas.height = Math.max(1, Math.round(height));
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uTam, canvas.width, canvas.height);
        };

        const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const inicio = performance.now() - 40000; // arranca ya "movido"
        let marco = 0;
        let visible = false;

        const pintar = () => {
            gl.uniform1f(uT, (performance.now() - inicio) / 1000);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            canvas.dataset.listo = "";
        };
        const bucle = () => {
            pintar();
            marco = visible && !quieto ? requestAnimationFrame(bucle) : 0;
        };

        const medidor = new ResizeObserver(() => {
            ajustar();
            if (!marco) pintar();
        });
        medidor.observe(canvas);

        // Solo se anima mientras se ve.
        const vigia = new IntersectionObserver(([e]) => {
            visible = e.isIntersecting;
            if (visible && !marco && !quieto) marco = requestAnimationFrame(bucle);
        });
        vigia.observe(canvas);

        // Se borra lo creado, pero no se "pierde" el contexto: React en
        // desarrollo monta dos veces y el segundo montaje reutiliza el
        // mismo lienzo; con el contexto perdido ya no podría dibujar.
        return () => {
            cancelAnimationFrame(marco);
            medidor.disconnect();
            vigia.disconnect();
            gl.deleteBuffer(buf);
            gl.deleteProgram(prog);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
        };
    }, [colores]);

    return <canvas ref={lienzo} className={`${s.lienzo} ${className}`} aria-hidden="true" />;
}
