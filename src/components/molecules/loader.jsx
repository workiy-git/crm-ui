import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


const Loader = () => {

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{display:'block', textAlign:'center'}}>
      <CircularProgress />
      <div>Loading...</div>
      </div>
    </div>
  );
};

export default Loader;
