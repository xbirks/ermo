"use client";

import React from 'react';

function VideoIndex({ desktop, mobile }) {
  
  
  return (
    <div className="header__video">
      <video
        className="header__video-desktop"
        autoPlay
        loop
        muted
        playsInline
        type="video/mp4"
        src={desktop}
      />
      <video
        className="header__video-mobile"
        autoPlay
        loop
        muted
        playsInline
        type="video/mp4"
        src={mobile}
      />
    </div>
  );
}

VideoIndex.displayName = "VideoIndex";

export default VideoIndex;
