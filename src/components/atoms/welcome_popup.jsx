import React from 'react';// Import CSS for the profile form

const WelcomePopUp = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div>
      <div style={{position:'relative' ,zIndex:'10', height:'100vh', width:'100%', alignContent:'center'}}>
        <div style={{width:'60rem', margin:'auto', background:'white', boxShadow:'0px 0px 5px', borderRadius:'10px'}}>
        <form style={{ margin:'auto', padding:'20px', width:'fit-content'}}>
          <div>
            <input type="file" placeholder="Full Name" />
          </div>
          <div>
            <input type="text" placeholder="Full Name" />
          </div>
          <div>
            <input type="email" placeholder="Email" />
          </div>
          <div>
            <input type="password" placeholder="Password" />
          </div>
          <input type="submit" value="Save" />
          <button type="button" onClick={onClose}>Close</button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopUp;
