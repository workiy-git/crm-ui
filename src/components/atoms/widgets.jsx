import React, { useState, useEffect } from "react";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Box } from "@material-ui/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import WidgetsIcon from "@mui/icons-material/WidgetsOutlined";
import config from "../../config/config";
import {headers} from "../atoms/Authorization";

const CreateWidgetItem = styled(Paper)(({ theme }) => ({
  backgroundColor: "#EAEAEA !important",
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: "100%",
  borderRadius: "25px !important",
  boxShadow: "0px 3px 5px 1px rgba(0,0,0,0.3)",
  cursor: "pointer",
  padding: "0",
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
      headers: {headers},
      data: {
        dashboardName: dashboardName,
      },
    });

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    const data = response.data;
    return data &&
      data.status === "success" &&
      data.data &&
      data.data.length > 0
      ? data.data[0][dashboardName] || 0
      : 0;
  } catch (error) {
    console.error("Error retrieving count data:", error);
    return 0;
  }
};

const CreateWidget = ({ widget, dashboardName }) => {
  const [count, setCount] = useState(null); // Initialize count as null to indicate loading
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCount = async () => {
      const countData = await retrieveWidgetCount(
        widget.apiEndpoint,
        JSON.parse(widget.apiEndpointFilter),
        dashboardName
      );
      setCount(countData);
    };

    fetchCount();
  }, [widget, dashboardName]);

  const handleWidgetClick = () => {
    let apiRedirectEndpointFilter = widget.apiRedirectEndpointFilter;

    if (typeof apiRedirectEndpointFilter === "string") {
      try {
        apiRedirectEndpointFilter = JSON.parse(apiRedirectEndpointFilter);
      } catch (error) {
        console.error("Failed to parse apiRedirectEndpointFilter:", error);
        return;
      }
    }

    if (Array.isArray(apiRedirectEndpointFilter)) {
      apiRedirectEndpointFilter.forEach((filter) => {
        const matchObj = filter?.$match;
        if (matchObj) {
          const filterKey = Object.keys(matchObj).find(
            (key) => key !== "pageName"
          );
          const filterValue = matchObj[filterKey];
          const pageNameFilter = matchObj.pageName;

          if (filterValue) {
            sessionStorage.setItem(
              "widgetFilter",
              JSON.stringify({ [filterKey]: filterValue })
            );
            sessionStorage.setItem(
              "pageNameFilter",
              JSON.stringify({ pageName: pageNameFilter })
            );
          }
        }
      });
    }

    navigate(widget.apiRedirectEndpoint, { state: widget.title });
  };

  return (
    <Box style={{ width: "190px", height: "auto", float: "left" }}>
      <CreateWidgetItem onClick={handleWidgetClick}>
        <div
          style={{
            padding: "20px 10px",
            backgroundColor: "rgba(245, 189, 113, 0.25)",
            borderRadius: "25px",
          }}
        >
          <Title style={{ fontSize: "12px" }}>{widget.title}</Title>
          <div
            style={{
              borderBottom: "1px solid black",
              margin: "5px auto 10px auto",
              width: "60px",
            }}
          ></div>
          <Icon sx={{ margin: "auto" }}>
            <div
              style={{
                background: "#fff6",
                borderRadius: "100px",
                padding: "10px",
                margin: "auto",
                display: "flex",
              }}
            >
              <img
                style={{ height: "20px", width: "auto", margin: "auto" }}
                src={widget.icon_url || "default_icon_url"}
                alt={widget.title}
                draggable="false"
              />
            </div>
          </Icon>
        </div>
        <div style={{ textAlign: "center", padding: "3px 0" }}>
          {count === null ? ( // If count is null, show CircularProgress
            <CircularProgress size={24} />
          ) : (
            <Count>{count}</Count>
          )}
        </div>
      </CreateWidgetItem>
    </Box>
  );
};

export default CreateWidget;