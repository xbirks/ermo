"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ermoLogo from '../../assets/logo/ERMO_blue.svg'; 
import FooterItem from '../../components/footer/footerItem.jsx';
import StandardButton from '../../buttons/standard-button.jsx';


function Footer(){



return(

    <div className="footer__container">

        <div className="footer__info">
            <Link href="/" aria-label="Inicio">
                <Image src={ermoLogo} alt="Logo ERMO" width={128} height={34} />
            </Link>
        </div>


        <div className="footer__info">

            <StandardButton
                link="/not-found"
                title="Servicios"
                style=""
            />

            <StandardButton
            link="/not-found"
            title="Proyectos"
            style="mt-xs"
            />

        </div>

        <div className="footer__info">

            <FooterItem
                title="Mándanos un mail"
                link="hola@ermo.es"
                textButton="hola@ermo.es"
            />

            <FooterItem
                title="Danos un toque"
                link="675392216"
                textButton="675 392 216"
            />

            <FooterItem
                title="Síguenos en Instagram"
                link="https://www.instagram.com/ermostudio/"
                textButton="@ermostudio"
            />


        </div>



        <div className="footer__info">

            <FooterItem
                title=""
                link="/not-found"
                textButton="FAQ"
            />

            <FooterItem
                title=""
                link="/not-found"
                textButton="Sobre nosotros"
            />

            <FooterItem
                title=""
                link="/not-found"
                textButton="Política de privacidad"
            />

            <FooterItem
                title=""
                link="/not-found"
                textButton="Política de cookies"
            />

<FooterItem
                title=""
                link="/not-found"
                textButton="Aviso legal"
            />

        </div>


    </div>
);

}

export default Footer;