import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
 
const ReportDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { reportName, reportData } = location.state || {};
 
    if (!reportData || reportData.length === 0) {
        return <p>No data available</p>;
    }
 
    // 1. Get all unique lead_status values across the data
    const statusSet = new Set();
    reportData.forEach((item) => {
        item.lead_statuses.forEach((ls) => {
            statusSet.add(ls.lead_status);
        });
    });
    const allStatuses = Array.from(statusSet);
 
    // 2. Map and flatten each record
    const reshapedData = reportData.map((item, index) => {
        const statusCounts = {};
 
        allStatuses.forEach((status) => {
            statusCounts[status] = 0;
        });
 
        item.lead_statuses.forEach((statusObj) => {
            statusCounts[statusObj.lead_status] = statusObj.count;
        });
 
        const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
 
        return {
            id: index + 1,
            assigned_to: item.assigned_to.trim(),
            ...statusCounts,
            total,
        };
    });
 
    // 3. Calculate column totals
    const columnTotals = {
        assigned_to: "Total",
        total: reshapedData.reduce((sum, row) => sum + row.total, 0),
    };
 
    allStatuses.forEach((status) => {
        columnTotals[status] = reshapedData.reduce((sum, row) => sum + row[status], 0);
    });
 
    const reshapedDataWithTotals = [...reshapedData, { id: reshapedData.length + 1, ...columnTotals }];
 
    // 4. Define columns
    const columns = [
        {
            field: "assigned_to",
            headerName: "Assigned To",
            width: 130,
            // flex: 1,
            renderCell: (params) => <strong>{params.value}</strong>,
        },
        ...allStatuses.map((status) => ({
            field: status,
            headerName: status,
            width: 130,
            type: "number",
        })),
        {
            field: "total",
            headerName: "Total",
            width: 130,
            type: "number",
        },
    ];
 
    return (
        <Box sx={{ height: 600, width: "100%" }}>
            <h2>{reportName}</h2>
            <Button
                onClick={() => navigate(-1)}
                variant="contained"
                sx={{ mb: 2 }}
            >
                Back
            </Button>
 
            <Box sx={{ width: "100%", overflowX: "auto", overflowY: "auto" }}>
                <div style={{ minWidth: 800, height: 600 }}>
                    <DataGrid
                        rows={reshapedDataWithTotals}
                        columns={columns}
                        pageSize={reshapedDataWithTotals.length}
                        autoHeight
                        disableRowSelectionOnClick
                        getRowClassName={(params) =>
                            params.row.assigned_to === "Total" ? "MuiDataGrid-row--footer" : ""
                        }
                    />
                </div>
            </Box>
        </Box>
    );
};
 
export default ReportDetails;