"use client";

import SliderServices from "@/app/components/slider-services/sliderServices";
import SwiperComponent from "@/app/components/swiper-logos/swiperLogos";
import Spacer from "@/app/buttons/spacer";





export default function FotografiaPage() {
    return (
    <>
    <div className="master__body servicios__master">
        <h1 className="servicios__h1">Ayudamos a las empresas a  adaptarse con soluciones que mezclan innovación y creatividad.</h1>

    <SliderServices></SliderServices>
    <Spacer className="spacer-xl" />
    <SwiperComponent></SwiperComponent>
    </div>
    </>
    );
  }
  