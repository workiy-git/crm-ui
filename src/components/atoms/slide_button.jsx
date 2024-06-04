import React from 'react';


const SlideButton = ({ onScrollLeft, onScrollRight, direction }) => {
  const renderLeftArrow = direction === 'left';
  const renderRightArrow = direction === 'right';

  return (
      <div>
          {renderLeftArrow && (
            <button onClick={onScrollLeft} style={{ border: 'none', background: 'none' }}>
              <img src="https://workiy-crm-images.s3.us-east-2.amazonaws.com/Menu/arrow_left.png" alt="Left Arrow" style={{ width: '40px', height: '40px' }} />
            </button>
          )}
          {renderRightArrow && (
            <button onClick={onScrollRight} style={{ border: 'none', background: 'none' }}>
              <img src="https://workiy-crm-images.s3.us-east-2.amazonaws.com/Menu/arrow_right.png" alt="Right Arrow" style={{ width: '40px', height: '40px' }} />
            </button>
          )}
      </div>
  );
};

export default SlideButton;

