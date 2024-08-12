import React from 'react';
import ServicesFloatButton from '../buttons/ServicesFloatButton.jsx';

function SliderServicesItem({nameService, descriptionService, link}) {

    return(
        
        <div className="index__services-container">

            <h3>{nameService}</h3>

            <p>{descriptionService}</p>

            <ServicesFloatButton
                link={link}
                title="Más info"
            />
                
        </div>



 


    );

}

export default SliderServicesItem;