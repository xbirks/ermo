"use client";

import { CldVideoPlayer } from 'next-cloudinary';

function VideoCloudinaryResponsive({ desktopPublicId, mobilePublicId }) {
  return (
    <div className="header__video">
      <div className="header__video-desktop">
        <CldVideoPlayer
          id="video-desktop"
          src={desktopPublicId}
          width="1920"
          height="1080"
          autoPlay
          loop
          muted
          controls={false}
          className="header__video-element clean-player"
        />
      </div>

      <div className="header__video-mobile">
        <CldVideoPlayer
          id="video-mobile"
          src={mobilePublicId}
          width="1080"
          height="1920"
          autoPlay
          loop
          muted
          controls={false}
          className="header__video-element clean-player"
        />
      </div>
    </div>
  );
}

export default VideoCloudinaryResponsive;
