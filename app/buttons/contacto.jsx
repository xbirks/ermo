import StandardButton from "./standard-button";

function Contacto(){

    return(

        <div className="proyectos__split-btn">
       
            <StandardButton
            link="https://wa.me/message/HJYSEK4RPLOSI1"
            title="Whatsapp"
            style=""
            bg="#25d366"
            color="white"
            borderColor="transparent"
            hoverBg="#075e54"
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