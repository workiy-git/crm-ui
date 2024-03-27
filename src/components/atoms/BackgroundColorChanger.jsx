import React from 'react';
import theme1 from "../../assets/images/kk.png"

const BackgroundColorChanger = ({ colors, onColorChange }) => {
  const handleClick = () => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    onColorChange(randomColor);
  };

  return (
    <div>
        <img src={theme1}   onClick={handleClick} style={{
               width:"30px", height:"auto", marginLeft:"30%",
            }} alt='img' />
           

    </div>
  );
};

export default BackgroundColorChanger;
