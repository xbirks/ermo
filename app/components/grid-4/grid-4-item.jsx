import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PropTypes from 'prop-types';

const ArrowMenu = () => (
  <svg className="arrow__svg" width="34" height="23" viewBox="0 0 34 23">
    <path d="M21.03 0L19.95 1.23L30.6 10.68H0V12.33H30.6L19.95 21.77L21.03 23L34 11.5L21.03 0Z" />
  </svg>
);

function Grid4Item({ title, description, thumbnailSrc, link, altAtribute }) {
  return (
    <div className="post__container">
      <Link href={link}>
        <div className="post__thumbnail">
           <figure>
            <video
              className="post__thumbnail-img"
              src={thumbnailSrc}
              width={1000}
              height={1000}
              autoPlay loop muted playsInline type="video/mp4"
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          </figure>
        </div>
      </Link>
      <Link href={link} className="post__thumbnail-anchor">
    
          <div className="post__thumbnail-title">
            <h2>{title}</h2>
            <ArrowMenu/>
          </div>
    
      </Link>
      <div className="post__thumbnail-description">
        <h3>{description}</h3>
      </div>
    </div>
  );
}

Grid4Item.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  thumbnailSrc: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  altAtribute: PropTypes.string.isRequired,
};

export default Grid4Item;
