import React from 'react';

function IndexIntroduction({IndexIntro, IndexDescription, IndexIntroLocation}) {
  return (
    <div className="index__introduction">
      <div className="index__introduction-div">
        <h1>{IndexIntro}{IndexIntroLocation}</h1>
      </div>
      <div className="index__introduction-div">
        <p>{IndexDescription}</p>
      </div>
    </div>
  );
};

export default IndexIntroduction;
