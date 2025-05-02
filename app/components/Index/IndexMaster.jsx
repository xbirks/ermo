"use client";

import '@/app/style.scss';

import VideoIndex from '@/app/components/video-index.jsx';
import IndexIntro from '@/app/components/Index/IndexIntro.jsx';
import Grid4 from '@/app/components/grid-4/grid-4.jsx';
import SliderServices from '@/app/components/slider-services/sliderServices.jsx';
import SwiperComponent from '@/app/components/swiper-logos/swiperLogos.jsx';

import Spacer from '@/app/buttons/spacer.jsx';
import ContactTeam from '@/app/components/contact-draws/contact-team.jsx';
import Inner from "@/app/components/Transiciones/inner.jsx";

// Marca la función `HomePage` como `async`
function IndexMaster({municipio}) {


  return (
    <Inner>
      <VideoIndex
        desktopmp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/ermo-proyectos-2024-header-desktop_cvbwx4.mp4"
        mobilemp4="https://res.cloudinary.com/ermostudio/video/upload/f_auto,q_auto,vc_auto/v1745246678/ermo-proyectos-2024-mobile-desktop_ya91m1.mp4"
      />
      <div className="master__body">
        <IndexIntro municipio={municipio} />
        <Spacer className="spacer-m" />
        <Grid4 />
        <Spacer className="spacer-xl" />
        <SliderServices municipio={municipio} enMunicipio={<>en {municipio}</>} />
        <Spacer className="spacer-xl" />
        <ContactTeam />
        <Spacer className="spacer-xl" />
        <SwiperComponent />
      </div>
    </Inner>
  );
}

export default IndexMaster;
