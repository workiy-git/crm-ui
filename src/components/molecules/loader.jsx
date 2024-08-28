
import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        cursor: "wait",
      }}
    >
      <div>Loading...</div>
    </div>
  );
};

export default Loader;
