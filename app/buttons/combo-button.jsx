"use client";

const ArrowInButton = () =>(
    <svg className="arrow__svg" width="34" height="23" viewBox="0 0 34 23"  xmlns="http://www.w3.org/2000/svg">
    <path d="M21.03 0L19.95 1.23L30.6 10.68H0V12.33H30.6L19.95 21.77L21.03 23L34 11.5L21.03 0Z"/>
  </svg>
);


function ComboStandardButton({link, title, style}) {
   
    return(
   
   <div className="master_button">
        <a href={link}>
            <div className={`button ${style}`}>
                <p>{title}</p>
                <ArrowInButton/>
            </div>
        </a>
  </div>

);
}

function ComboBlueButton({link, title, style}) {
   
    return(
   
        <div className="master_button">
        <a href={link}>
            <div className={`button ${style}`}>
                <p>{title}</p>
                <ArrowInButton/>
            </div>
        </a>
  </div>

);
}


function ComboButton ({link1, title1, style1, link2, title2, style2}){

    return(
        <div className="comboButton">
            <ComboStandardButton
            link={link1}
            title={title1}
            style={style1}
            ></ComboStandardButton>
            <ComboBlueButton
            link={link2}
            title={title2}
            style={style2}
            >
            </ComboBlueButton>
        </div>
    );
}

export default ComboButton;
