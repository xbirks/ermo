import React from 'react';
import ServicesFloatButton from '../buttons/ServicesFloatButton.jsx';
import StandardButton from '@/app/buttons/standard-button.jsx';

function SliderServicesItem({nameService, descriptionService, link}) {

    return(
        
        <div className="index__services-container">

            <h3>{nameService}</h3>

            <p>{descriptionService}</p>


            <StandardButton
            link={link}
            title="Más info"
            style=""
            bg="#3F52FF"
            color="white"
            borderColor="transparent"
            hoverBg="#0E1C9D"
            hoverColor="white"
            hoverBorderColor=""
            />
                
        </div>



 


    );

}

export default SliderServicesItem;