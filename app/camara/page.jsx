"use client";

import { useEffect, useRef, useState } from "react";

export default function CamaraPage() {
    const videoRef = useRef(null);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
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

        return () => {
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

            {/* FIX 1: En lugar de display: none, lo escondemos con tamaño 0. 
          Así los navegadores móviles como Safari no lo ignoran. */}
            <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
                <defs>
                    <filter id="pure-red-matrix" colorInterpolationFilters="sRGB">
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

            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    // FIX 2: Quitamos el transform scaleX para que la cámara trasera se mueva natural
                    filter: "url(#pure-red-matrix)",
                }}
            />

        </main>
    );
}