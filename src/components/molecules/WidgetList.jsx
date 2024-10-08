// export default WidgetsList;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CreateWidget from "../atoms/widgets";
import { Box } from "@material-ui/core";
import { experimentalStyled as styled } from "@mui/material/styles";
import config from "../../config/config";
import WidgetsIcon from "@mui/icons-material/WidgetsOutlined";
import "../../assets/styles/style.css";
import { headers } from '../atoms/Authorization';

const ScrollContainer = styled(Box)({
  overflowY: "auto",
});

const retrieveWidgets = async (dashboardName) => {
  try {
    const response = await axios.post(
      `${config.apiUrl}/dashboards/retrieve`,
      [
        {
          $match: {
            dashboardName: dashboardName,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ],
      {
        headers: headers,
      }
    );

    if (response.status !== 200) {
      throw new Error("Network response was not ok");
    }

    const data = response.data;
    return data && data.data && data.data.length > 0 ? data.data[0].tiles : [];
  } catch (error) {
    console.error("Error retrieving dashboard data:", error);
    return [];
  }
};

const WidgetsList = ({ dashboardName }) => {
  const [widgets, setWidgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenWidgets, setHiddenWidgets] = useState([]);
  const [showHiddenWidgets, setShowHiddenWidgets] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const hiddenWidgetsRef = useRef(null);

  // Fetch widgets and restore hidden widgets from localStorage
  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        // Fetch the widgets from the server
        const retrievedWidgets = await retrieveWidgets(dashboardName);

        // Retrieve hidden widgets from localStorage
        const storedHiddenWidgets = retrievedWidgets.filter((_, index) => {
          const isHidden = localStorage.getItem(
            `hiddenWidgets_${dashboardName}_widget-${index}`
          );
          return !!isHidden;
        });

        // Set visible widgets
        const visibleWidgets = retrievedWidgets.filter((_, index) => {
          const isHidden = localStorage.getItem(
            `hiddenWidgets_${dashboardName}_widget-${index}`
          );
          return !isHidden;
        });

        setWidgets(visibleWidgets);
        setHiddenWidgets(storedHiddenWidgets);
      } catch (error) {
        console.error("Error retrieving dashboard data:", error);
        setWidgets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWidgets();
  }, [dashboardName]);

  // Close hidden widgets pop-up when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        hiddenWidgetsRef.current &&
        !hiddenWidgetsRef.current.contains(event.target)
      ) {
        setShowHiddenWidgets(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle drag events
  const handleDragStart = (index) => {
    setDraggingIndex(index);
    setTimeout(() => {
      document.querySelector(`.widget-${index}`);
    }, 0);
  };

  const handleDragEnter = (index) => {
    if (draggingIndex !== null && draggingIndex !== index) {
      const updatedWidgets = [...widgets];
      const [draggedWidget] = updatedWidgets.splice(draggingIndex, 1);
      updatedWidgets.splice(index, 0, draggedWidget);
      setWidgets(updatedWidgets);
      setDraggingIndex(index);
    }
  };

  const handleDragEnd = (index) => {
    setDraggingIndex(null);
    document.querySelector(`.widget-${index}`);
  };

  // Hide widget and save hidden widgets to localStorage with a unique key
  const handleHideWidget = (index) => {
    const updatedHiddenWidgets = [...hiddenWidgets, widgets[index]];
    const updatedWidgets = widgets.filter((_, i) => i !== index);

    setHiddenWidgets(updatedHiddenWidgets);
    setWidgets(updatedWidgets);

    // Save hidden widget to localStorage with a unique key
    localStorage.setItem(
      `hiddenWidgets_${dashboardName}_widget-${index}`,
      JSON.stringify(widgets[index])
    );
  };

  // Toggle hidden widgets display
  const toggleShowHiddenWidgets = () => {
    setShowHiddenWidgets(!showHiddenWidgets);
  };

  // Restore hidden widget and update localStorage
  const handleRestoreWidget = (index) => {
    const restoredWidget = hiddenWidgets[index];
    const updatedWidgets = [...widgets, restoredWidget];
    const updatedHiddenWidgets = hiddenWidgets.filter((_, i) => i !== index);

    setWidgets(updatedWidgets);
    setHiddenWidgets(updatedHiddenWidgets);

    // Remove the restored widget from localStorage
    localStorage.removeItem(`hiddenWidgets_${dashboardName}_widget-${index}`);
  };

  return (
    <ScrollContainer>
      <Box sx={{ flexGrow: 1 }}>
        <div style={{ width: "100%" }}>
          <div>
            <button
              style={{
                border: "none",
                alignItems: "center",
                display: "flex",
                padding: "8px",
                borderRadius: "5px",
                marginRight: "5%",
                marginTop: "10px",
                marginLeft: "auto",
                cursor: "pointer",
              }}
              onClick={toggleShowHiddenWidgets}
            >
              <WidgetsIcon />
            </button>
          </div>
          {showHiddenWidgets && (
            <div
              ref={hiddenWidgetsRef}
              style={{
                position: "absolute",
                zIndex: "10",
                background: "white",
                padding: "20px",
                maxHeight: "30%",
                top: "32%",
                right: "2%",
                overflow: "auto",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  borderBottom: "1px dashed gray",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                Available Filters
              </div>
              {hiddenWidgets.length > 0 ? (
                hiddenWidgets.map((widget, index) => (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        background: "#212529",
                        color: "white",
                        padding: "5px",
                        borderRadius: "5px",
                        margin: "10px",
                      }}
                    >
                      <div
                        style={{ display: "flex", cursor: "pointer" }}
                        onClick={() => handleRestoreWidget(index)}
                      >
                        <div
                          style={{
                            background: "#fff6",
                            borderRadius: "100px",
                            padding: "5px",
                            margin: "auto",
                            display: "flex",
                            marginRight: "5px",
                          }}
                        >
                          <img
                            style={{
                              height: "15px",
                              width: "auto",
                              margin: "auto",
                              filter: "brightness(0) invert(1)",
                            }}
                            src={widget.icon_url || "default_icon_url"}
                            alt={widget.title}
                          />
                        </div>
                        <div style={{ marginRight: "5px" }}>{widget.title}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "gray",
                    marginTop: "10px",
                  }}
                >
                  No filters available
                </div>
              )}
            </div>
          )}
        </div>
        <div
          className="widget_main_div"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          {widgets.length > 0 ? (
            widgets.map((widget, index) => (
              <div
                className={`widget-${index} widget-main`}
                key={index}
                item
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={() => handleDragEnd(index)}
                style={{
                  width: "190px",
                  height: "auto",
                  margin: "20px 10px",
                }}
              >
                <div
                  style={{
                    textAlign: "end",
                    marginBottom: "-25px",
                    marginRight: "10px",
                  }}
                >
                  <button
                    className="widget-hide-btn"
                    style={{
                      position: "relative",
                      border: "none",
                      background: "white",
                      borderRadius: "100px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleHideWidget(index)}
                  >
                    -
                  </button>
                </div>
                <CreateWidget widget={widget} dashboardName={dashboardName} />
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </Box>
    </ScrollContainer>
  );
};

export default WidgetsList;