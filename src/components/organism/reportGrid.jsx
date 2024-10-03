import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';
import { Typography } from "@mui/material";


const ReportGrid = () => {
  const location = useLocation();
  const filteredData = location.state?.filteredData || [];

  // Utility function to convert string to Title Case
  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    });
  };

  const columns = filteredData.length > 0 ? Object.keys(filteredData[0]).map(key => ({
    field: key,
    headerName: toTitleCase(key.replace(/_/g, " ")),
    width: 150
  })) : [];

  return (
    <div style={{ height: 400, width: '100%' }}> 
    <Typography
            style={{
              color: "white",
              padding: "5px 10px",
              fontSize: "20px",
              background: " #F5BD71",
              fontWeight: "bold",
            }}
          >
            Genaate Report View
          </Typography>
          <div style={{height:'calc(100vh - 140px)'}}>
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row._id} // Use _id as the unique identifier for each row
              disableColumnFilter
              disableColumnMenu
              className="custom-data-grid-main"
              getRowHeight={() => 35}
              disableColumnSelector
              disableDensitySelector
              disableSelectionOnClick
              hideFooter
            />
          </div>
    </div>
  );
};

export default ReportGrid;