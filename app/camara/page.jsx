"use client";

import { useEffect, useRef, useState } from "react";
// Puedes importar aquí tu StandardButton si quieres añadir un botón para volver a la Home
// import StandardButton from "../buttons/standard-button";

export default function CamaraPage() {
    const videoRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        // Pedimos permisos para usar la cámara trasera del dispositivo
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" }
        })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch((error) => {
                console.error("Error al acceder a la cámara:", error);
                setErrorMsg("No se ha podido acceder a la cámara. Por favor, revisa los permisos de tu navegador.");
            });

        // Función de limpieza para apagar la cámara al salir de la URL
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    return (
        // Usamos estilos en línea para forzar que ocupe el 100% de la pantalla sin scroll
        <main style={{ width: "100vw", height: "100vh", backgroundColor: "#000", overflow: "hidden", position: "relative" }}>

            {/* Mostramos el mensaje de error si el usuario deniega los permisos */}
            {errorMsg && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", color: "white", textAlign: "center", zIndex: 10, padding: "20px" }}>
                    <p>{errorMsg}</p>
                </div>
            )}

            {/* Filtro SVG oculto: Destruye verde y azul, dejando solo rojo puro */}
            <svg style={{ display: "none" }}>
                <defs>
                    <filter id="pure-red-matrix">
                        <feColorMatrix
                            type="matrix"
                            values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
                        />
                    </filter>
                </defs>
            </svg>

            {/* Etiqueta de vídeo con el filtro aplicado directamente */}
            <video
                ref={videoRef}
                autoPlay
                playsInline // CRUCIAL para iOS, evita que se abra el reproductor nativo
                muted
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Asegura que no queden bordes negros ni se deforme
                    filter: "url(#pure-red-matrix)",
                    transform: "scaleX(-1)", // Opcional: hace efecto espejo. Quítalo si quieres ver los textos al derecho.
                }}
            />

            {/* Aquí podrías añadir un componente tuyo, como un StandardButton con position: absolute, para volver al inicio */}
        </main>
    );
}