"use client";

import React from 'react';

const ArrowInButton = () =>(
    <svg className="arrow__svg" width="34" height="23" viewBox="0 0 34 23"  xmlns="http://www.w3.org/2000/svg">
    <path d="M21.03 0L19.95 1.23L30.6 10.68H0V12.33H30.6L19.95 21.77L21.03 23L34 11.5L21.03 0Z"/>
  </svg>
);

function ServicesFloatButton({link, title}) {
   
    return(
   
   <div className="post__button post__button-services-slider">
        <a href={link}>
            <div className="button">
                <p>{title}</p>
                <ArrowInButton/>
            </div>
        </a>
  </div>

);
}

export default ServicesFloatButton;


