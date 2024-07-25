import React from 'react';


const Refresh = ({ onClick }) => {
  return (
    <div>
      <button onClick={onClick}>Click to reload!</button>
    </div>
  );
};

export default Refresh;
