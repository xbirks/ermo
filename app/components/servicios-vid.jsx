import Image from "next/image";
import Link from "next/link";

function ServiciosVid({src, link}){

    return(
        <div className="servicios__vid">
            <Link href={link}>
            <figure>
                <video
                className="post__servicios-vid"
                src={src}
                width={1000}
                height={1000}
                loading="lazy"
                autoPlay loop muted playsInline type="video/mp4"
                >
                Tu navegador no soporta la etiqueta de video.
                </video>
            </figure>
            </Link>
        </div>
    );
}

export default ServiciosVid;