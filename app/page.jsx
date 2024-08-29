import './style.scss';

import VideoIndex from './components/video-index.jsx';
import IndexIntro from './components/Index-Introduction/IndexIntro.jsx';
import Grid4 from './components/grid-4/grid-4.jsx';
import SliderServices from './components/slider-services/sliderServices.jsx';
import SwiperComponent from './components/swiper-logos/swiperLogos.jsx';
import Transition from './components/transicion/transicion';

import Spacer from './buttons/spacer.jsx';
import ContactTeam from './components/contact-draws/contact-team.jsx';

// Marca la función `HomePage` como `async`
export default async function HomePage() {

  // Usa `await` para importar el JSON en un entorno asíncrono
  const proyectosData = await import('./proyectos.json');
  const proyectos = proyectosData.proyectos.slice(0, 4);

  return (
    <div>
      <VideoIndex
        desktop="https://soyandres.es/ermo/video/ermo-proyectos-2024-header-desktop.mp4"
        mobile="https://soyandres.es/ermo/video/ermo-proyectos-2024-header-desktop.mp4"
      />
      <div className="master__body">
        <IndexIntro />
        <Spacer className="spacer-l" />
        <Grid4 proyectos={proyectos} />
        <Spacer className="spacer-xl" />
        <SliderServices />
        <Spacer className="spacer-xl" />
        <ContactTeam />
        <Spacer className="spacer-xl" />
        <SwiperComponent />
      </div>
    </div>
  );
}
