import Image from "next/image";

function ServiciosImg({src, alt}){

    return(
        <div className="servicios__img-chld">
            <a href="#">
                <Image src={src} alt={alt} width={1000} height={1000} loading='lazy'></Image>
            </a>
        </div>
    );
}

export default ServiciosImg;