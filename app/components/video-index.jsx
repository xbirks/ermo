"use client";

import React from 'react';

function VideoIndex({ desktopwebm, desktopmp4, mobilewebm, mobilemp4 }) {
  
  
  return (
    <div className="header__video">
      <video
        className="header__video-desktop"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={desktopmp4} type="video/mp4" />
        <source src={desktopwebm} type="video/webm" />
      </video>
      <video
        className="header__video-mobile"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={mobilemp4} type="video/mp4" />
        <source src={mobilewebm} type="video/webm" />
      </video>
    </div>
  );
}

VideoIndex.displayName = "VideoIndex";

export default VideoIndex;
