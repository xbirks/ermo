import StandardButton from "./standard-button";

function Contacto(){

    return(

        <div className="proyectos__split-btn">
            <StandardButton
                link="https://wa.me/message/HJYSEK4RPLOSI1"
                title="Whatsapp"
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