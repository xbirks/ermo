import Image from "next/image";
import Link from 'next/link';

import '../proyectos/proyectos.scss';
import Contacto from "../buttons/contacto";
import Grid4 from "./grid-4/grid-4";
import Spacer from "../buttons/spacer";

import HeaderVideo from './video-index.jsx';



function Proyectos({desktop, mobile, cliente,tipo, ano, descripcion, videoproyecto, explicacion, image1, image2}) {
    return (
      <div>
      <HeaderVideo
      desktop={desktop}
      mobile={mobile}
      ></HeaderVideo>

        <div className="master__body">

          <div className="index__introduction">
            <div className="index__introduction-div">
              <h1>{cliente}</h1>
              <p className="proyectos__tipo">{tipo}</p>
              <p className="proyectos__ano">{ano}</p>
            </div>
            <div className="index__introduction-div">
              <p>{descripcion}</p>
            </div>
          </div>

          <div className="proyectos__video">
            <video
              className="header__video-desktop"
              autoPlay
              loop
              muted
              playsInline
              type="video/mp4"
              src={videoproyecto}
            />
          </div>

          <div className="proyectos__explicacion">
            <p>{explicacion}
            </p>
          </div>

          <div className="proyectos__vid">

          <figure>
            <video
              className="#"
              src={image1}
              width={500}
              height={500}
              autoPlay loop muted playsInline type="video/mp4"
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          </figure>

          <figure>
            <video
              className="#"
              src={image2}
              width={500}
              height={500}
              autoPlay loop muted playsInline type="video/mp4"
            >
              Tu navegador no soporta la etiqueta de video.
            </video>
          </figure>

          </div>


          <h2 className="proyectos__similar">¿Necesitas hacer un proyecto similar?</h2>
          <Contacto></Contacto>
          <Spacer className="spacer-xl" />
          <Grid4></Grid4>

        </div>

      </div>
      
    );
  }

  export default Proyectos;
  