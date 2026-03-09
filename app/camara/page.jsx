"use client";

import { useEffect, useRef, useState } from "react";

export default function CamaraPage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState("");

    // Usamos useRef para no tener que reiniciar la cámara cada vez que movamos un slider
    const settingsRef = useRef({ brightness: 1.5, contrast: 2.5, saturate: 2.0 });
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

                // 1. SATURAR: Hace que el naranja impreso saque a relucir su canal rojo.
                // 2. BRILLO + CONTRASTE: Fuerza al papel blanco y al naranja a llegar al límite de luz (255)
                // de modo que ambos sean idénticamente blancos antes de ser pintados de rojo profundo.
                ctx.filter = `saturate(${saturate}) brightness(${brightness}) contrast(${contrast})`;

                // A. Pintamos el fotograma real del vídeo (ahora procesado)
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // NUEVO: Reseteamos el filtro para que no afecte al rectángulo rojo que vamos a pintar a continuación
                ctx.filter = "none";

                // B. Aplicamos el modo fusión y pintamos un rectángulo rojo puro encima
                ctx.globalCompositeOperation = "multiply";

                // TRUCO: Si #FF0000 sigue siendo muy fuerte y quieres ver un poco más del fondo, 
                // puedes usar "rgba(255, 0, 0, 0.9)"
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // C. Restauramos el modo normal para el siguiente ciclo
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

            {/* Aquí es donde ocurre la magia. El usuario solo ve este Canvas. */}
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* PANEL DE CONTROL EN VIVO PARA ENCONTRAR EL PUNTO PERFECTO */}
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

        </main>
    );
}