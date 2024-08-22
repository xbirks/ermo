import StandardButton from "./standard-button";

function Contacto(){

    return(

        <div className="proyectos__split-btn">
            <StandardButton
                link="tel:+34675392216"
                title="Contacto"
                style=""
            ></StandardButton>

            <StandardButton
                link="https://www.instagram.com/ermostudio/"
                title="Instagram"
                style=""
            ></StandardButton>
        </div>

    );

}

export default Contacto;