import React from 'react';
import StandardButton from '@/app/buttons/standard-button';

function IndexIntroduction({IndexIntro, IndexDescription, IndexIntroLocation}) {
  return (
    <div className="index__introduction">
      <div className="index__introduction-div">
        <h1>{IndexIntro}{IndexIntroLocation}</h1>
      </div>
      <div className="index__introduction-div">
        <p>{IndexDescription}</p>
              <StandardButton
                link="/servicios/principal"
                title="Nuestros servicios"
                style="mt-m"
                bg="#3F52FF"
                color="white"
                borderColor="transparent"
                hoverBg="#0E1C9D"
                hoverColor="white"
                hoverBorderColor=""
                aria-label="Ver los servicios de ERMO"
                />
      </div>
    </div>
  );
};

export default IndexIntroduction;
