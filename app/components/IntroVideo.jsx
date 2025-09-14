'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function IntroVideo({
  posterSrc = '/assets/miniwebdark.jpg',
  posterAlt = 'Portada del vídeo introductorio de la sección hacer web de ERMO Estudio',
  videoSrc = 'https://www.youtube-nocookie.com/embed/X3PaBPro7EA?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1',
  videoTitle = 'Presentación ERMO',
}) {
  const [play, setPlay] = useState(false);

  return (
    <div className="intro-video">
      {!play ? (
        <button
          type="button"
          className="yt-poster"
          onClick={() => setPlay(true)}
          aria-label="Reproducir vídeo"
        >
          <Image
            src={posterSrc}
            width={1280}
            height={720}
            alt={videoTitle}
            priority
          />
          <svg
            className="yt-play"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <polygon points="8,5 19,12 8,19" fill="currentColor" />
          </svg>
        </button>
      ) : (
        <div className="yt-embed">
          <iframe
            key={videoSrc}  // fuerza el montaje del iframe al reproducir
            src={videoSrc}
            title={videoTitle}
            allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
