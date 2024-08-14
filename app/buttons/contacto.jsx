import StandardButton from "./standard-button";

function Contacto(){

    return(

        <div className="proyectos__split-btn">
            <StandardButton
                link="/not-found"
                title="Contacto"
                style=""
            ></StandardButton>

            <StandardButton
                link="/not-found"
                title="Instagram"
                style=""
            ></StandardButton>
        </div>

    );

}

export default Contacto;