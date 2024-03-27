import React, { useState } from 'react';

import "../atoms/loginpage.css"
import Background from "../../assets/images/13695.jpg"
import image1 from "../../assets/images/crm 2.png"
import image2 from "../../assets/images/crm-3.png"
import image3 from "../../assets/images/crm-4.png"
import image4 from "../../assets/images/crm-5.png"
import image5 from "../../assets/images/encrypted.png"
import image6 from "../../assets/images/apartment.png"
import image7 from "../../assets/images/account_circle.png"
import eyeIcon from "../../assets/images/eyeIcon.png"
import eye from "../../assets/images/eye.png"

function Loginpage() {
  const [inputType, setInputType] = useState('password');
  const [eyeButton, setEyeButton] = useState(eyeIcon);
  const [isFocused, setIsFocused] = useState(false);


  const toggleInputType = () => {
    setInputType(inputType === 'text' ? 'password' : 'text');
    setEyeButton(inputType === 'text' ? eyeIcon : eye);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <div className='loginpage'>
      <div className='image'>
      <img src={Background} alt="loading" className='background' />
        <img src={image1} alt="loading" className='crm1' />
        <img src={image2} alt="loading" className='crm2' />
        <img src={image3} alt="loading" className='crm3' />
        <img src={image4} alt="loading" className='crm4' />
      </div>
      <button >Login</button>
      <h1 className='welcome'>Welcome Back! Login To Your Account Below</h1>
      <h1 className='login'>Login</h1>
      <div className='companyname'style={{ background: isFocused ? '#12E5E5' : 'd9d9d9' }}>
        <img src={image6} alt="loading" className='logo1' />
        <input type="text" className="details" name="companyName" placeholder="     company name"  onFocus={handleFocus}
          onBlur={handleBlur} required />
      </div>
      <div className='username'>
        <img src={image7} alt="loading" className='logo2' />
        <input type="text" className="details" name="user name" placeholder="      user name" required />
      </div>
      <div className='password'>
        <input type={inputType} className="details" name="password" placeholder="      password" required />
        <img src={image5} alt="loading" className='logo3' />
        <img src={eyeButton} alt="loading" className='logo4' onClick={toggleInputType} />
      </div>
      <h1 className='forget'>Forget Password ?</h1>
    </div>
  );
}

export default Loginpage;
