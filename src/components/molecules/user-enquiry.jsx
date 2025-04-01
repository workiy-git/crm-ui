import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config/config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { headers } from "../atoms/Authorization";
import LaunchIcon from '@mui/icons-material/Launch';

const Enquiry = ({ mode, mobile }) => {
  const [enquiries, setEnquiries] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const gridEndpoint = "appdata/retrieve";
  const currentPageNumber = 1;
  const currentNumberofRow = 100;
  const pageName = "enquiry";
  const [dynamicFields, setDynamicFields] = useState([]);

  const filter = [
    {
      $match: {
        pageName: pageName,
        mobile_phone: mobile,
      },
    },
  ];

  const fetchEnquiries = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/${gridEndpoint}?page=${currentPageNumber}&pageSize=${currentNumberofRow}`,
        filter,
        {
          headers: headers,
        }
      );

      const data = response.data.data;
      console.log("Enquiries data:", data);
      setEnquiries(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDataWithRetry = useCallback(
    async (url, retryCount = 3) => {
      try {
        const response = await axios.get(url, { headers });
        return response.data;
      } catch (error) {
        if (retryCount > 0) {
          console.warn("Retrying request, attempts left:", retryCount);
          return fetchDataWithRetry(url, retryCount - 1);
        } else {
          throw error;
        }
      }
    },
    []
  );

  useEffect(() => {
    const fetchWebformsData = async () => {
      try {
        const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/webforms`;
        const response = await fetchDataWithRetry(apiUrl);
        const fetchedWebformsData = response.data || [];
        const currentPage = fetchedWebformsData.find(
          (page) => page.pageName === pageName
        );
        setDynamicFields(currentPage.fields);
        console.log("Dynamic Fields:", currentPage.fields);
      } catch (error) {
        console.error("Error fetching Webform data:", error);
      }
    };
    fetchWebformsData();
  }, [fetchDataWithRetry]);

  useEffect(() => {
    if (mode !== "add") {
      fetchEnquiries();
    }
  }, [id, mode]);

  const handleEditClick = (enquiry) => {
    const params = { row: enquiry };
    const mode = "view";
    navigate(`/${pageName}/${mode}/${params.row._id}`, {
      state: { rowData: params.row, pageName, mode },
    });
  };

  return (
    <Box sx={{ margin: "auto", padding: 2 }}>
      {mode === "add" ? (
        <Typography variant="body1" color="textSecondary">
          Enquiries for this new record will appear here after being added.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
                {dynamicFields.length > 0 &&
                  dynamicFields.map((field) => (
                    <TableCell key={field.fieldName} style={{ whiteSpace: "nowrap" }}>
                      <strong>{field.label}</strong>
                    </TableCell>
                  ))}
                <TableCell style={{ whiteSpace: "nowrap" }}></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {enquiries.length > 0 ? (
                enquiries.map((enquiry, index) => (
                  <TableRow onDoubleClick={() => handleEditClick(enquiry)} key={index}>
                    <TableCell>
                      <LaunchIcon style={{cursor:'pointer'}} onClick={() => handleEditClick(enquiry)} />
                    </TableCell>
                    {dynamicFields.map((field, idx) => {
                      const fieldValue = enquiry[field.fieldName];
                      let displayValue = fieldValue;

                      // Handle date formatting for created_time if it exists in the dynamic fields
                      if ((field.fieldName === "created_time" || field.fieldName === "Modified_at") && fieldValue) {
                        const dateObj = new Date(fieldValue);
                        displayValue = dateObj.toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        });
                      }

                      return (
                        <TableCell key={idx} style={{ whiteSpace: "nowrap" }}>
                          {displayValue !== null && displayValue !== undefined
                            ? displayValue.toString()
                            : "N/A"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={100} align="center">
                    No enquiries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Enquiry;
