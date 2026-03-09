"use client";

import { useEffect, useRef, useState } from "react";

export default function CamaraPage() {
    const videoRef = useRef(null);
    // Usamos useRef para mantener los valores activos del filtro
    // Valores guardados: saturación 1.3, brillo 1, contraste 1
    const settingsRef = useRef({ brightness: 1, contrast: 1, saturate: 1.3 });
    const [uiSettings, setUiSettings] = useState(settingsRef.current);

    const updateSetting = (key, val) => {
        settingsRef.current[key] = parseFloat(val);
        setUiSettings({ ...settingsRef.current });
    };

    useEffect(() => {
        let animationFrameId;

        // 1. Pedimos permisos
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    // Forzamos el play por si el móvil bloquea el autoplay
                    videoRef.current.play().catch(e => console.error(e));
                }
            })
            .catch((error) => {
                console.error("Error al acceder a la cámara:", error);
                setErrorMsg("No se ha podido acceder a la cámara. Por favor, revisa los permisos.");
            });

        // 2. El motor de renderizado del Canvas
        const drawToCanvas = () => {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Solo pintamos si el vídeo está listo y emitiendo
            if (video && canvas && video.readyState >= video.HAVE_CURRENT_DATA) {
                // Ajustamos la resolución interna del canvas a la de la cámara
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }

                const ctx = canvas.getContext("2d");

                // Obtenemos los valores en tiempo real del panel de depuración
                const { brightness, contrast, saturate } = settingsRef.current;

                // A. Pintamos el fotograma real del vídeo normal
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // --- MANIPULACIÓN DE PÍXELES EN BRUTO PARA SAFARI (iOS) ---
                // Leemos los píxeles (esto es más pesado pero 100% compatible con todos los navegadores)
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const len = data.length;

                // Precalculamos las fórmulas para ir rápido
                // Constantes matemáticas de luminiscencia
                const rw = 0.3086, gw = 0.6094, bw = 0.0820;

                for (let i = 0; i < len; i += 4) {
                    let r = data[i];
                    let g = data[i + 1];
                    let b = data[i + 2];

                    // 1. SATURACIÓN
                    if (saturate !== 1) {
                        const gray = r * rw + g * gw + b * bw;
                        r = Math.round(gray + saturate * (r - gray));
                        g = Math.round(gray + saturate * (g - gray));
                        b = Math.round(gray + saturate * (b - gray));
                    }

                    // 2. CONTRASTE
                    if (contrast !== 1) {
                        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
                        r = factor * (r - 128) + 128;
                        g = factor * (g - 128) + 128;
                        b = factor * (b - 128) + 128;
                    }

                    // 3. BRILLO
                    if (brightness !== 1) {
                        r = r * brightness;
                        g = g * brightness;
                        b = b * brightness;
                    }

                    // Aseguramos límites [0..255]
                    data[i] = Math.max(0, Math.min(255, r));
                    data[i + 1] = Math.max(0, Math.min(255, g));
                    data[i + 2] = Math.max(0, Math.min(255, b));
                }

                // Guardamos los nuevos píxeles en el canvas
                ctx.putImageData(imageData, 0, 0);

                // --- CAPA ROJA (MULTIPLY) ---
                ctx.globalCompositeOperation = "multiply";
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Restaurar para el siguiente frame
                ctx.globalCompositeOperation = "source-over";
            }

            // Repetimos el proceso en el siguiente fotograma (bucle a 60fps)
            animationFrameId = requestAnimationFrame(drawToCanvas);
        };

        drawToCanvas();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        <main style={{ width: "100vw", height: "100vh", backgroundColor: "#000", overflow: "hidden", position: "relative" }}>

            {errorMsg && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", textAlign: "center", zIndex: 10, padding: "20px" }}>
                    <p>{errorMsg}</p>
                </div>
            )}

            {/* El vídeo original sigue aquí, pero lo escondemos.
        OJO: No usamos display: "none" porque iOS pausaría la cámara. 
        Lo hacemos invisible con opacidad casi cero.
      */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ position: "absolute", width: "1px", height: "1px", opacity: 0.001, pointerEvents: "none" }}
            />

            {/* Capa de vídeo procesada nativamente */}
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* Capa roja (Acetato): Multiplica sobre la imagen filtrada usando CSS en lugar de JS */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#FF0000",
                    mixBlendMode: "multiply",
                    pointerEvents: "none", // Deja pasar los toques a los sliders
                }}
            />

            {/* PANEL DE CONTROL EN VIVO PARA ENCONTRAR EL PUNTO PERFECTO (Oculto en produccion) */}
            {/*
            <div style={{
                position: "absolute", bottom: 20, left: 20, right: 20,
                background: "rgba(0,0,0,0.8)", padding: 20, borderRadius: 15,
                color: "white", zIndex: 100, fontFamily: "sans-serif"
            }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Ajuste de Filtro</h3>
                <p style={{ margin: "0 0 15px 0", fontSize: "12px", color: "#aaa" }}>
                    Mueve estos controles hasta que la palabra naranja desaparezca y la gris se lea.
                </p>

                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "5px" }}>
                        <span>Saturación (Destaca el rojo)</span>
                        <span>{uiSettings.saturate}</span>
                    </label>
                    <input type="range" min="1" max="5" step="0.1" value={uiSettings.saturate}
                        onChange={e => updateSetting('saturate', e.target.value)}
                        style={{ width: "100%" }} />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "5px" }}>
                        <span>Brillo (Aclara todo)</span>
                        <span>{uiSettings.brightness}</span>
                    </label>
                    <input type="range" min="0.5" max="4" step="0.1" value={uiSettings.brightness}
                        onChange={e => updateSetting('brightness', e.target.value)}
                        style={{ width: "100%" }} />
                </div>

                <div style={{ marginBottom: 5 }}>
                    <label style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "5px" }}>
                        <span>Contraste (Quema los claros)</span>
                        <span>{uiSettings.contrast}</span>
                    </label>
                    <input type="range" min="1" max="10" step="0.1" value={uiSettings.contrast}
                        onChange={e => updateSetting('contrast', e.target.value)}
                        style={{ width: "100%" }} />
                </div>
            </div>
            */}

        </main>
    );
}