import React from 'react';
import Image from 'next/image';
import Ermos from '../../assets/img/ermos.png';
import Cafe from '../../assets/img/cafe.png';
import StandardButton from '@/app/buttons/standard-button';
import StandardButtonWhite from '../../buttons/standard-button-white.jsx';
import Spacer from '../../buttons/spacer.jsx';

function ContactTeam() {

    return(
    <div className="index__info">

        <div className="index__team">

        <div className="index__info-container-img">
                <Image className="index__info-img" src={Ermos} decoding="async" alt="ilustración de los dos hermanos" width={927} height={989} />
            </div>

            <div className="title index__info-title">
                <h3>Cuidamos los detalles</h3>
            </div>

            <p className="index__team-txt team-txt-1">Y trabajamos con integridad, dedicación y transparencia para entregarte un trabajo de calidad.</p>

            <Spacer className="spacer-m" />

            <StandardButton
            link="https://www.instagram.com/ermostudio/"
            title="Equipo"
            style="post__button post__button-center"
            bg="transparent"
            color="white"
            borderColor="white"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor=""
            />

        </div>

        <div className="index__contact">
        

            <div className="index__info-container-img">
                <Image className="index__info-img" src={Cafe} decoding="async" alt="ilustración de Ermo bañandose en café" width={927} height={989} />
            </div>

            <div className="title index__info-title"><h3 className="">¿Tomamos un café?</h3></div>

            <p className="index__team-txt team-txt-1">Y comentamos el proyecto que tienes entre manos.</p>

        
 <Spacer className="spacer-m" />

            <StandardButton
            link="https://wa.me/message/HJYSEK4RPLOSI1"
            title="¡Café!"
            style="post__button post__button-center"
            bg="transparent"
            color="white"
            borderColor="white"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor=""
            />

<Spacer className="spacer-s" />


            <StandardButton
            link="https://wa.me/message/HJYSEK4RPLOSI1"
            title="Refresco :)"
            style="post__button post__button-center"
            bg="transparent"
            color="white"
            borderColor="white"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor=""
            />


        </div>

        
     </div>

            )
 

};

export default ContactTeam;