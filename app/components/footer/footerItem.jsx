"use client";

import React from 'react';

function FooterItem({title, link, textButton}){


    return(
    <div className="footer__info-datos">
        <h4>{title}</h4>
        <a href={link}>{textButton}</a>
      </div>


    );


}

export default FooterItem;