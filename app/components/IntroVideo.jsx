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
          <span className="yt-play" aria-hidden="true">▶</span>
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
