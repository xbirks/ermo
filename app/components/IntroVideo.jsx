'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function IntroVideo() {
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
            src="/assets/juan.png"
            width={1280}
            height={720}
            alt="Portada del vídeo"
            priority
          />
          {/* Reemplazo del emoji por SVG vectorial */}
          <svg
            className="yt-play"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <polygon
              points="8,5 19,12 8,19"
              fill="currentColor"
            />
          </svg>
        </button>
      ) : (
        <div className="yt-embed">
          <iframe
            src="https://www.youtube-nocookie.com/embed/UkC9qKS7c0Y?autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1"
            title="Presentación"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}
