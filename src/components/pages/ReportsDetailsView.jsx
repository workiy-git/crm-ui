import React from "react";
import axios from "axios";
import config from "../../config/config";
import { headers } from "../atoms/Authorization";

import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";

const ReportDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { reportName, reportData } = location.state || {};
    const gridEndpoint = "appdata/retrieve";

    if (!reportData) {
        return <p>No data available</p>;
    }

    const fetchData = async (filter) => {
        try {
            const queryParams = new URLSearchParams({
                page: 1,
                pageSize: 25,
            });
            // Log the received filter for debugging purposes.
            console.log("Using filter:", filter);

            const response = await axios.post(
                `${config.apiUrl.replace(/\/$/, "")}/${gridEndpoint}?${queryParams.toString()}`,
                filter, // Pass the specific filter to the API
                { headers: headers } // Include headers for authorization
            );
            
            console.log("Response Grid data:", response.data.data);
        } catch (error) {
            console.error("Error fetching grid data:", error);
        }
    };

    
    const filter = [
      {
        $match: {
          pageName: "users",
        },
      },
    ];
    fetchData(filter);


    // Auto-generate columns based on object keys
    const columns = Object.keys(reportData[0] || {}).map((key) => ({
        field: key,
        headerName: key.replace(/_/g, " ").toUpperCase(),
        width: 150,
        flex: 1,
    }));

    const FirstColumn =[
        "Col1",
        "Col2",
        "Col3",
        "Col4",
        "Col5",
        "Col6",
        "Col7",
    ]

    return (
        <div style={{ height: 600, width: "100%" }}>
            <h2>{reportName}</h2>
            <Button
                onClick={() => navigate(-1)}
                variant="contained"
                sx={{ mb: 2 }}
            >
                Back
            </Button>
            <DataGrid
                rows={reportData.map((item, index) => ({ id: index + 1, ...item }))}
                columns={columns}
                pageSize={10}
                autoHeight
            />
        </div>
    );
};

export default ReportDetails;
