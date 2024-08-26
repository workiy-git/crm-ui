import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import Gridn from "../organism/gridn";

const Container = () => {
  const { pageName } = useParams();

  const [backgroundColor] = useState(() => {
    return sessionStorage.getItem("backgroundColor") || "#d9d9d9";
  });

  // const [rows, setRows] = useState([]);
  // const [webformSchema, setWebformSchema] = useState([]);
  // const [errors, setErrors] = useState("");
  // const [loading, setLoading] = useState(true); // Manage loading state

  // const fetchData = async (filter = {}) => {
  //   setLoading(true); // Set loading to true before fetching data
  //   try {
  //     const postData = [
  //       {
  //         $match: {
  //           pageName: pageName,
  //           ...filter,
  //         },
  //       },
  //     ];

  //     const appdataResponse = await axios.post(
  //       `${config.apiUrl.replace(/\/$/, "")}${endpoint}`,
  //       postData,
  //       {
  //         headers: { "Content-Type": "application/json" },
  //       }
  //     );

    //     const webformResponse = await axios.get(
    //       `${config.apiUrl.replace(/\/$/, "")}/webforms`
  //     );

  //     const appdata = appdataResponse.data.data;
  //     const webform = webformResponse.data.data;

  //     setRows(appdata);
  //     const schemaForPage = webform.find((page) => page.pageName === pageName);
  //     setWebformSchema(schemaForPage?.fields || []);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setErrors("Error fetching data");
  //   } finally {
  //     setLoading(false); // Set loading to false after data is fetched
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, [endpoint, pageName]);

  // const handleFilterChange = (filter) => {
  //   fetchData(filter);
  // };

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
              background:
                "linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)",
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
