import StandardButton from "./standard-button";

function Contacto(){

    return(

        <div className="proyectos__split-btn">
       
            <StandardButton
            link="mailto:andresortega@ermo.es"
            title="Email"
            style=""
            bg="#14394B"
            color="white"
            borderColor="transparent"
            hoverBg="#0C2735"
            hoverColor="white"
            hoverBorderColor=""
            />


            <StandardButton
            link="https://www.instagram.com/ermostudio/"
            title="Instagram"
            style=""
            bg="#393836ff"
            color="white"
            borderColor="transparent"
            hoverBg="#1f7cc8ff"
            hoverColor="white"
            hoverBorderColor=""
            />
        </div>

    );

}

export default Contacto;