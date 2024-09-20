import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';

const ReportGrid = () => {
  const location = useLocation();
  const filteredData = location.state?.filteredData || [];

  const columns = filteredData.length > 0 ? Object.keys(filteredData[0]).map(key => ({
    field: key,
    headerName: key,
    width: 150
  })) : [];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={filteredData}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        getRowId={(row) => row._id} // Use _id as the unique identifier for each row
        disableColumnFilter
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        disableSelectionOnClick
        hideFooter
      />
    </div>
  );
};

export default ReportGrid;