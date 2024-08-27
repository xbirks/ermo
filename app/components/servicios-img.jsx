import Image from "next/image";
import Link from "next/link";

function ServiciosImg({src, alt, link}){

    return(
        <div className="servicios__img-chld">
            <Link href={link}>
                <Image src={src} alt={alt} width={1000} height={1000} loading='lazy'></Image>
            </Link>
        </div>
    );
}

export default ServiciosImg;