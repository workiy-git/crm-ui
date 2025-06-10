import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import config from "../../config/config";
import { headers } from "../atoms/Authorization";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const ReportsPage = () => {
    const endpoint = "controls/retrive";
    const gridEndpoint = "appdata/retrieve";
    const pageName = "reports";
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);

    // Fetch the dropdown options, including the filter details.
    const fetchSelectOptions = async () => {
        try {
            const response = await axios.post(
                `${config.apiUrl.replace(/\/$/, "")}/${endpoint}`,
                {
                    pageName: pageName,
                    control_type: "dropdown",
                },
                { headers: headers }
            );

            const rawOptions = response.data.data[0].value;
            console.log("Raw options:", rawOptions);
            // Transform the options for DataGrid: include id and filter details
            const transformedRows = rawOptions.map((item, index) => ({
                id: index + 1, // DataGrid requires an id field
                name: item.name,
                filter: item.filter, // include the specific filter from the option
            }));

            setRows(transformedRows);
        } catch (error) {
            console.error("Error fetching select options:", error);
        }
    };

    // Modify fetchData to accept a filter parameter.
    const fetchData = async (filterParam) => {
        try {
            const queryParams = new URLSearchParams({
                page: 1,
                pageSize: 25,
            });
            // Log the received filter for debugging purposes.
            console.log("Using filter:", filterParam);

            const response = await axios.post(
                `${config.apiUrl.replace(/\/$/, "")}/${gridEndpoint}?${queryParams.toString()}`,
                filterParam, // Pass the specific filter to the API
                { headers: headers } // Include headers for authorization
            );
            console.log("Response Grid data:", response.data);
        } catch (error) {
            console.error("Error fetching grid data:", error);
        }
    };

    // When the component mounts, fetch the dropdown options.
    useEffect(() => {
        fetchSelectOptions();
        // Optionally, you might want to fetch initial data with a default filter here
        // fetchData(defaultFilter); 
    }, [pageName]);

    // Event handler for double-click on a row.
const handleRowDoubleClick = async (params) => {
    const { filter, name } = params.row;
    try {
        const queryParams = new URLSearchParams({
            page: 1,
            pageSize: 25,
        });

        const response = await axios.post(
            `${config.apiUrl.replace(/\/$/, "")}/${gridEndpoint}?${queryParams.toString()}`,
            filter,
            { headers: headers }
        );

        const reportData = response.data.data;

        // Navigate to the new page and pass the data
        navigate(`/${pageName}/detailsview`, {
            state: {
                reportName: name,
                reportData: reportData
            }
        });

    } catch (error) {
        console.error("Error fetching filtered report data:", error);
    }
};


    const handleGenerateReportClick = () => {
        navigate(`/${pageName}/customdropdown`, { state: { pageName: pageName } });
    };

    // Define the columns for the DataGrid.
    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "name", headerName: "Report Name", width: 300 },
    ];

    return (
        <div style={{ height: 500, width: "100%" }}>
            <div>
                <h1>Reports</h1>
                <Button
                    onClick={handleGenerateReportClick}
                    className='Action-btn'
                    sx={{ color: 'white', background: '#212529' }}
                >
                    Generate Reports
                </Button>
            </div>

            {/* Attach onRowDoubleClick to the DataGrid */}
            <DataGrid 
                rows={rows} 
                columns={columns} 
                pageSize={5} 
                onRowDoubleClick={handleRowDoubleClick}
            />
        </div>
    );
};

export default ReportsPage;
