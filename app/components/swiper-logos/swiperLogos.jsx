"use client";

import React, { useEffect, useRef } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Image from 'next/image';
import Img1 from '../../assets/img/logo_1.png';
import Img2 from '../../assets/img/logo_2.png';
import Img3 from '../../assets/img/logo_3.png';
import Img4 from '../../assets/img/logo_4.png';
import Img5 from '../../assets/img/logo_5.png';
import Img6 from '../../assets/img/logo_6.png';
import Img7 from '../../assets/img/logo_7.png';
import Img8 from '../../assets/img/logo_8.png';
import Img9 from '../../assets/img/logo_9.png';
import Img10 from '../../assets/img/logo_10.png';
import Img11 from '../../assets/img/logo_11.png';
import Img12 from '../../assets/img/logo_12.png';
import Img13 from '../../assets/img/logo_13.png';

const SwiperComponent = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    const swiperInstance = new Swiper(swiperRef.current, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 1000,
        disableOnInteraction: true,
      },
      breakpoints: {
        400: {
          slidesPerView: 1,
        },
        600: {
          slidesPerView: 2,
        },
        900: {
          slidesPerView: 3,
        },
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });

    // Cleanup function to destroy the swiper instance
    return () => {
      if (swiperInstance) swiperInstance.destroy();
    };
  }, []);

  return (
    <div>
      <div className="title">
        <h3>Han confiado en nosotros</h3>
      </div>

      {/* Slider main container */}
      <div className="swiper" ref={swiperRef}>
        {/* Additional required wrapper */}
        <div className="swiper-wrapper">
          {/* Slides */}
          <div className="swiper-slide">
            <Image src={Img1} alt="Logotipo png de Delibreads, distribuidor de Mercadona" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img2} alt="Logotipo png de Cubers, empresa de Procubitos Europe" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img3} alt="Logotipo png de Empanadas Malvón" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img4} alt="Logotipo png de Sanoguera Consulting" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img5} alt="Logotipo png del centro estético Solarium Cabinas" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img6} alt="Logotipo png de la empresa Segorbina de Bastones" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img7} alt="Logotipo png de la empresa de helados Atípico" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img8} alt="Logotipo png en blanco y negro del supermercado Consum" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img9} alt="Logotipo png de Entre Prendas" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img10} alt="Logotipo png en blanco y negro de Helados Estiu" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img11} alt="Logotipo png del gimnasio Bellés con sede en Segorbe y Alfara del Patriarca" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img12} alt="Logotipo png de la Asociación Hispanoamericana de Medicina del Fútbol gestionada por el doctor Don José Nebot" loading="eager"></Image>
          </div>
          <div className="swiper-slide">
            <Image src={Img13} alt="Logotipo png de Private Label BSN Cosmetics" loading="eager"></Image>
          </div>
        </div>

        {/* If we need pagination */}
        <div className="swiper-pagination"></div>

        {/* If we need navigation buttons */}
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>

        {/* If we need scrollbar */}
        <div className="swiper-scrollbar"></div>
      </div>
    </div>
  );
};

export default SwiperComponent;
