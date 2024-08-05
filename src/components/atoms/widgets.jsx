import React, { useState, useEffect } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import "../../assets/styles/style.css";

const CreateWidgetItem = styled(Paper)(({ theme }) => ({
  backgroundColor: "#4BB7D3 !important",
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: "100%",
  height: 100,
  borderRadius: "10px !important",
  boxShadow: "0px 3px 5px 1px rgba(0,0,0,0.3)",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  padding: "0",
  justifyContent: "space-between",
}));

const Icon = styled("div")({
  height: "100%",
  display: "flex",
  alignItems: "center",
  color: "white",
  width: "40%",
  borderRadius: "10px",
});

const Title = styled("div")({
  color: "black",
  fontSize: "16px",
});

const Count = styled("div")({
  marginTop: "8px",
  fontWeight: "bold",
  color: "black",
  fontSize: "22px",
});

const retrieveWidgetCount = async (
  apiEndpoint,
  apiEndpointFilter,
  dashboardName
) => {
  try {
    const response = await axios.post(apiEndpoint, apiEndpointFilter, {
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        dashboardName: dashboardName,
      },
    });

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    const data = response.data;

    if (
      data &&
      data.status === "success" &&
      data.data &&
      data.data.length > 0 &&
      data.data[0][dashboardName] !== undefined
    ) {
      return data.data[0][dashboardName];
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error retrieving count data:", error);
    return 0;
  }
};

const WidgetItem = ({ widget, dashboardName }) => {
  const [count, setCount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCount = async () => {
      const count = await retrieveWidgetCount(
        widget.apiEndpoint,
        JSON.parse(widget.apiEndpointFilter),
        dashboardName
      );
      setCount(count);
    };

    fetchCount();
  }, [widget, dashboardName]);

  // const handleWidgetClick = () => {
  //   navigate(widget.apiRedirectEndpoint, {
  //     state: { filter: widget.apiRedirectEndpointFilter }
  //   });
  // };

  const handleWidgetClick = ({ widget, dashboardName }) => {
    // Log the entire apiRedirectEndpointFilter object for debugging
    console.log("apiRedirectEndpointFilter:", widget.apiRedirectEndpointFilter);

    // Log the type of apiRedirectEndpointFilter
    console.log(
      "Type of apiRedirectEndpointFilter:",
      typeof widget.apiRedirectEndpointFilter
    );

    // Parse apiRedirectEndpointFilter if it's a string
    let apiRedirectEndpointFilter = widget.apiRedirectEndpointFilter;
    if (typeof apiRedirectEndpointFilter === "string") {
      try {
        apiRedirectEndpointFilter = JSON.parse(apiRedirectEndpointFilter);
      } catch (error) {
        console.error("Failed to parse apiRedirectEndpointFilter:", error);
        return;
      }
    }

    // Check if apiRedirectEndpointFilter is an array
    if (Array.isArray(apiRedirectEndpointFilter)) {
      apiRedirectEndpointFilter.forEach((filter, index) => {
        console.log(`Filter ${index}:`, filter);

        // Extract $match object
        const matchObj = filter?.$match;
        if (matchObj) {
          // Extract the value of the filter key that is not 'pageName'
          const filterKey = Object.keys(matchObj).find(
            (key) => key !== "pageName"
          );
          const filterValue = matchObj[filterKey];
          const pageNameFilter = matchObj.pageName;
          // console.log('pageName:', pageNameFilter);
          // console.log('Filter value:', filterValue);

          // Check if filterValue is not empty before storing it in localStorage
          if (filterValue) {
            // Store the filter value in localStorage with the appropriate key
            localStorage.setItem(
              "widgetFilter",
              JSON.stringify({ [filterKey]: filterValue })
            );
            localStorage.setItem(
              "pageNameFilter",
              JSON.stringify({ pageName: pageNameFilter })
            );
            // console.log('Stored filter value in localStorage:', { [filterKey]: filterValue });
          } else {
            console.warn("No relevant filter value found in filter");
          }
        }
      });
    } else {
      console.warn("apiRedirectEndpointFilter is not an array");
    }

    // Navigate to the endpoint
    navigate(widget.apiRedirectEndpoint, { state: widget.title });
  };

  return (
    <div
      style={{ width: "250px", height: "auto", margin: "20px", float: "left" }}
    >
      <CreateWidgetItem
        onClick={() => handleWidgetClick({ widget, dashboardName })}
      >
        <Icon>
          <div
            style={{
              background: "#fff6",
              borderRadius: "100px",
              padding: "20px",
              margin: "auto",
              display: "flex",
            }}
          >
            <img
              style={{
                height: "30px",
                width: "auto",
                margin: "auto",
                filter: "brightness(0) invert(1)",
              }}
              src={widget.icon_url || "default_icon_url"}
              alt={widget.title}
            />
          </div>
        </Icon>
        <div
          style={{
            width: "60%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Title>{widget.title}</Title>
          <Count>
            {count === null ? <CircularProgress size={22} /> : count}
          </Count>
        </div>
      </CreateWidgetItem>
    </div>
  );
};

export default WidgetItem;
