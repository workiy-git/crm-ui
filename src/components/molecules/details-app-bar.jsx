import React from 'react';
import Popup from '../atoms/smspopup';
import Pushapp from '../atoms/push-app';

const DetailsAppBar = () => {
    return (
        <div className="details-app-bar">
              <div style={{display:'flex',justifyContent:'end', padding: '0 30px 0 10px '}}>
          <Popup/>
          <Pushapp/>
        </div>
        </div>
    );
};

export default DetailsAppBar;
