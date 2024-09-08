import Link from "next/link";
import StandardButton from "@/app/buttons/standard-button";


function ArticuloNav({autor, navtitle, art1link, art1title, art2link, art2title, art3link, art3title}){

    return(
        
        <div className="articulo-nav">

            <div className="articulo-nav__autor">
                <div className="articulo-nav__autor-color"></div>
                <p>Escrito por:<br></br>{autor}</p>
            </div>


            <div className="articulo-nav__articulos">

                <p className="articulo-nav__title">{navtitle}</p>

                <div className="articulo-nav__destacado"><Link href={art1link}>
                    <p>{art1title}</p>
                </Link></div>

                <div className="articulo-nav__destacado"><Link href={art2link}>
                    <p>{art2title}</p>
                </Link></div>

                <div className="articulo-nav__destacado"><Link href={art3link}>
                    <p>{art3title}</p>
                </Link></div>
            
            </div>

            <StandardButton
                link="https://www.instagram.com/ermostudio/"
                title="Instagram"
                style=""
            ></StandardButton>

        </div>

    );

}

export default ArticuloNav;