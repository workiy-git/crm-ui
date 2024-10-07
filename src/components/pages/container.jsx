import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import Gridn from "../organism/gridn";

const Container = () => {
  const { pageName } = useParams();

  const [backgroundColor] = useState(() => {
    return sessionStorage.getItem("backgroundColor") || "#d9d9d9";
  });

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "-webkit-fill-available",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: backgroundColor,
            overflow: "hidden",
          }}
        >
          <Typography
            style={{
              color: "white",
              padding: "5px 10px",
              fontSize: "20px",
              background: " #F5BD71",
              fontWeight: "bold",
            }}
          >
            {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
          </Typography>
          <Gridn pageName={pageName} />
          {/* <Grid
            rows={rows}
            webformSchema={webformSchema}
            onFilterChange={handleFilterChange}
            pageName={pageName}
            loading={loading}
            data={filteredData}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Container;
