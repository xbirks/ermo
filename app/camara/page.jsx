"use client";

import { useEffect, useRef, useState } from "react";

export default function CamaraPage() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState("");

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

                // NUEVO: Subimos el brillo y ajustamos el contraste para "quemar"
                // las texturas del papel y hacer que el rojo/naranja impreso desaparezca.
                // Te sugiero usar contraste > 1 (ej: 1.2 o 1.5) en vez de 0.8. 
                // Un contraste alto oscurece los grises y aclara los naranjas/blancos hacia el límite (255), 
                // garantizando que el naranja se funda con el papel.
                ctx.filter = "brightness(1.4) contrast(1.2)";

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

            {/* Aquí es donde ocurre la magia. El usuario solo ve este Canvas.
      */}
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Se encarga de llenar toda la pantalla del móvil sin deformar
                }}
            />

        </main>
    );
}