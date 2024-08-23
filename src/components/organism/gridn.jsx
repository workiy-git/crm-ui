import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config/config";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmationDialog from '../molecules/confirmation-dialog';
import "../../assets/styles/callsgrid.css";
import GridMenu from "../molecules/gridmenu";

import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Checkbox,
  Button,
  TextField,
  IconButton,
  Menu,
  Modal,
  Typography,
  Stack,
  Alert
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loader from "../molecules/loader";
import Pagination from "@mui/material/Pagination";

const endpoint = "/controls/retrive";
const gridEndpoint = "/appdata/retrieve";

const GridComponent = ({ pageName }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Adjust this value as needed
  const [totalRows, setTotalRows] = useState(0);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [gridData, setGridData] = useState([]);
  const location = useLocation();
  const [widget, setWidget] = useState(location.state);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [tempVisibleColumns, setTempVisibleColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // const [filteredRows, setFilteredRows] = useState(gridData);
  //not confirmed
  const navigate = useNavigate();
  const closeColumnModal = () => setShowColumnModal(false);
  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const handleSelectAll = () => {
    setTempVisibleColumns(availableColumns);
  };

  const handleDeselectAll = () => {
    setTempVisibleColumns([]);
  };

  const handleApplyColumns = () => {
    setColumns(tempVisibleColumns);
    closeColumnModal();
  };
  const handleDeleteClick = (row) => {
    setRowToDelete(row); // Set the row to be deleted
    setDeleteDialogOpen(true); // Open the confirmation dialog
  };
  
  const handleConfirmDelete = async () => {
    if (rowToDelete) {
      const id = rowToDelete._id; // Assuming `_id` is the unique identifier for the row
      try {
        await axios.delete(`${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`);
        setGridData((prevData) => prevData.filter((row) => row._id !== id));
        setDeleteDialogOpen(false); // Close the dialog
        setRowToDelete(null); // Clear the selected row
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    }
  };
  
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false); // Close the dialog
    setRowToDelete(null); // Clear the selected row
  };
  
  // Fetch select options
  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const response = await axios.post(
          `${config.apiUrl.replace(/\/$/, "")}${endpoint}`,
          {
            pageName: pageName,
            control_type: "dropdown",
          }
        );
        const options = response.data.data[0].value.map((option) => ({
          name: option.name,
          filter: option.filter,
        }));
        setSelectOptions(options); // Assuming the API returns an object with an 'options' array
        console.log("widget", widget);
      setKey(prevKey => prevKey + 1);
        if (options.length > 0) {
          if (widget) {
            const selectedOption = options.find(
              (option) => option.name === widget
            );
            if (selectedOption) {
              setSelectedValue(JSON.stringify(selectedOption.filter));
            } else {
              setSelectedValue(JSON.stringify(options[0].filter)); // Fallback to the first option if no match is found
            }
            setWidget(""); // Clear the widget value after initial use
          } else {
            setSelectedValue(JSON.stringify(options[0].filter)); // Set default value to the first option
          }
        }
        // if (options.length > 0) {
        //   setSelectedValue(JSON.stringify(options[0].filter)); // Set default value to the first option
        // }
      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    };
    fetchSelectOptions();
  }, [pageName]);

  // Handle page change
  const [key, setKey] = useState(0);
  const handlePageChange = (event, value) => {
    setKey(prevKey => prevKey + 1);
    setPage(value);
  };

  // Fetch grid data based on the selected filter
  useEffect(() => {
    if (selectedValue) {
      handleChange({ target: { value: selectedValue } });
    }
  }, [selectedValue]);

  //Drop Down Change
  const handleChange = (event) => {
    const filter = JSON.parse(event.target.value);
    setSelectedValue(event.target.value);
    // console.log("filter", filter);
    fetchGridData(filter); // Fetch grid data for the selected option
  };
  // Fetch grid data based on the selected filter
const fetchGridData = async (filter) => {
  try {
    const response = await axios.post(
      `${config.apiUrl.replace(/\/$/, "")}${gridEndpoint}`,
      filter
    );
    const dataWithIds = response.data.data.map((item, index) => ({
      ...item,
      id: item._id || index,
    }));
    setGridData(dataWithIds);
    setTotalRows(dataWithIds.length);

    if (response.data.data.length > 0) {
      const dynamicColumns = Object.keys(dataWithIds[0]).map((key) => ({
        field: key,
        headerName: key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        width: 150,
      }));
      setIsLoading(false);
      setColumns(dynamicColumns);
      setAvailableColumns(dynamicColumns); // Set available columns here
    }
  } catch (error) {
    console.error("Error fetching grid data:", error);
  }
};


  // Filter grid data based on the search text
  // useEffect(() => {
  //   setFilteredRows(
  //     gridData.filter((row) =>
  //       Object.values(row).some((value) =>
  //         String(value).toLowerCase().includes(filterText.toLowerCase())
  //       )
  //     )
  //   );
  // }, [filterText, gridData]);

  const handleFilterChange = (field, value) => {
    setFilterText((prev) => ({ ...prev, [field]: value }));
  };

  const filteredRows = gridData.filter((row) =>
    columns.every((column) => {
      const value = row[column.field];
      const filterValue = filterText[column.field] || "";
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    })
  );

  // const columnsWithFilter = columns.map((column) => ({
  //   ...column,
  //   renderHeader: (params) => (
  //     <div
  //       style={{
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         padding: "8px",
  //         width: "100%",
  //         boxSizing: "border-box",
  //       }}
  //     >
  //       <div>{column.headerName}</div>
  //       <TextField
  //         variant="outlined"
  //         size="small"
  //         value={filterText[column.field] || ""}
  //         onClick={(e) => e.stopPropagation()} // Stop propagation to prevent sorting
  //         onChange={(e) => handleFilterChange(column.field, e.target.value)}
  //         style={{ width: "100%" }}
  //       />
  //     </div>
  //   ),
  // }));

  const handleMenuOpen = (event, row) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleNavigate = (mode) => {
    if (selectedRow) {
        navigate(`/${pageName}/${mode}/${selectedRow._id}`, {
            state: { rowData: selectedRow, pageName, mode },
        });
        handleMenuClose();
    }
  };
  const handleadd = (mode) => {
    navigate(`/${pageName}/${mode}`, {
        state: { pageName, mode },
    });
};
  const [selectedRows, setSelectedRows] = useState([]);  
  const isAllSelected = selectedRows.length === filteredRows.length && filteredRows.length > 0;

  const columnsWithFilter = [
    {
      field: "select",
      width: 20,
      padding: "0 10px",
      cellClassName: 'center-align',
      headerName: (
        <div style={{display:'flex', flexDirection:'column', margin:'auto', padding:'0 10px'}}>
        {/* <lable>Select All</lable> */}
        <Checkbox
          style={{color:'white', padding:'0'}}
          className= "select-all-check-box"
          checked={isAllSelected}
          indeterminate={selectedRows.length > 0 && !isAllSelected}
          onChange={(event) => handleSelectAllRows(event.target.checked)}
        />
        </div>
      ),
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.id)}
          onChange={(event) =>
            handleRowSelection(params.id, event.target.checked)
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      width: 20,
      renderCell: (params) => (
        
        <div>
          <IconButton
            onClick={(event) => {
              event.stopPropagation(); // Prevent checkbox selection
              handleMenuOpen(event, params.row); // Open the menu
            }}
            onContextMenu={(event) => {
              event.stopPropagation(); // Prevent checkbox selection
              handleMenuOpen(event, params.row); // Open the menu
            }}
            className="morevet-icon"
          >
            <MoreVertIcon />
          </IconButton>
          <GridMenu 
        anchorEl={anchorEl} 
        handleMenuClose={handleMenuClose} 
        handleNavigate={handleNavigate} 
        handleDeleteClick={handleDeleteClick} 
        selectedRow={selectedRow} 
      />
        </div>
      ),
    },
    ...columns.map((column) => ({
      ...column,
      cellClassName: 'center-align',

      renderHeader: (params) => (
        
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0",
            width: "100%",
            boxSizing: "border-box",
            // color: "white",
            // background: "#212529",
          }}
        >
          <div
            style={{
              marginBottom: "8px",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
            }}
          >
            {params.colDef.headerName}
          </div>
          <TextField
            variant="outlined"
            size="small"
            value={filterText[params.field] || ""}
            onClick={(e) => e.stopPropagation()} // Stop propagation to prevent sorting
            onChange={(e) => handleFilterChange(params.field, e.target.value)}
            style={{ width: "80%", background: "#ffffff", borderRadius:'10px' }}
            className="grid_search"
          />
        </div>
      ),
    })),
  ];


  const [menuAnchor, setMenuAnchor] = useState(null);
  const openMenu = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
  };

  const exportSelectedRows = () => {
    const selectedData = gridData.filter((row) =>
      selectedRows.includes(row.id)
    );

    if (selectedData.length === 0) {
      setError('No rows selected');
      setTimeout(() => setError(''), 3000);
      return;
    }
    // Set success message
    setSuccess('Data downloaded successfully');
    setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds

    const csvRows = [];
    const headers = Object.keys(selectedData[0]);
    csvRows.push(headers.join(","));

    for (const row of selectedData) {
      const values = headers.map((header) => row[header]);
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "exported_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const openColumnModal = () => {
    setTempVisibleColumns(columns);
    setShowColumnModal(true);
  };
  const handleCheckboxChange = (column, isChecked) => {
    setTempVisibleColumns((prev) => {
      if (isChecked) {
        // Add column to selected list
        return [...prev, column];
      } else {
        // Remove column from selected list
        return prev.filter((col) => col.field !== column.field);
      }
    });
  };

  const handleExportClick = () => {
    exportSelectedRows();
  };

  const handleSelectAllRows = (isChecked) => {
    if (isChecked) {
      const allRowIds = filteredRows.map((row) => row.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };
  
  
  const handleRowSelection = (rowId, isChecked) => {
    setSelectedRows((prevSelectedRows) => {
      if (isChecked) {
        return [...prevSelectedRows, rowId];
      } else {
        return prevSelectedRows.filter((id) => id !== rowId);
      }
    });
  };
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1); // Reset to the first page when the page size changes
  };
  
  // Add some CSS to increase the header height
  const [isBoxVisible, setIsBoxVisible] = useState(true);

  // Step 4: Handle the "Close" button click
  const handleBoxClose = () => {
    setIsBoxVisible(!isBoxVisible);
  };
  
  //Loader
  const [isLoading, setIsLoading] = useState(true); 

  if (isLoading) {
    return <Loader />; // Use the Loader component here
  }
  return (
    <div className="CallsGrid">
      {(error || success) && (
        <Stack sx={{ width:'100%',position: 'absolute', zIndex: '10'}} spacing={2}>
          <div style={{width:'fit-content', margin:'auto'}}>
          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
          </div>
        </Stack>
      )}
      <div className="box-visible" onClick={handleBoxClose}>{isBoxVisible ? "Close" : "Open"}</div>
      {isBoxVisible && (
      <Box
        className="Appbar"
        sx={{  
          display: {
          xs: "block",
          sm: "flex", 
          }, 
          justifyContent: "space-around",
          textAlign: {
            xs: "center",
          },}}
      >
        <Button onClick={openMenu} className='Action-btn' sx={{ color:'white', background:'#212529' }} >
          Actions
        </Button>
        <Button onClick={() => handleadd("add")}  className='Action-btn' sx={{ color:'white', background:'#212529' }} >
          Add
        </Button>
        <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}>
            <MenuItem onClick={handleExportClick}>Export Data</MenuItem>
        </Menu>
        
        <div className="dropdown" style={{ margin: "8px", width: "300px" }}>
          <select
            value={selectedValue}
            onChange={handleChange}
            style={{
              color: "white",
              background: "#212529",
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
              cursor: "pointer", // Add this line to change the cursor to a pointer
            }}
            aria-label="Without label"
          >
            {selectOptions.map((option, index) => (
              <option key={index} value={JSON.stringify(option.filter)}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
        <div>
        <span style={{ marginLeft: "16px" }}>
          Page {page} of {Math.ceil(totalRows / pageSize)}
        </span>
        <span style={{ marginLeft: "16px" }}>
          Total Rows: {totalRows}
        </span>
        
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          displayEmpty
          style={{ marginLeft: "16px", height:'35px'}}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
        </div>
        <Box mt={2} mb={2}>
        <Pagination
          count={Math.ceil(totalRows / pageSize)}
          siblingCount={0}
          page={page}
          style={{justifyContent:'center', display:'flex'}}
          onChange={handlePageChange}
        />
        
        </Box>
      </Box>
      )}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <div style={{height:'calc(100vh - 180px)'}}>
          <DataGrid
            key={key}
            rows={filteredRows.slice((page - 1) * pageSize, page * pageSize)}
            columns={columnsWithFilter}
            pageSize={pageSize}
            paginationMode="server"
            rowCount={totalRows}
            onPageChange={handlePageChange}
            page={page - 1}
            disableSelectionOnClick
            columnHeaderHeight={120}
            className="custom-data-grid"
          />
        </div>
      )}
      <Modal open={showColumnModal} onClose={closeColumnModal} aria-labelledby="modal-title" aria-describedby="modal-description">
  <Box sx={{ ...modalStyle, width: 500 }}>
    <Typography id="modal-title" variant="h6" component="h2">
      Choose Columns
    </Typography>
    <Box id="modal-description" sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Box sx={{ width: '45%', height: '300px', overflow: 'auto' }}>
        <Typography variant="subtitle1">Selected Columns</Typography>
        <div className="column-options">
          {tempVisibleColumns.map((column) => (
            <div key={column.field}>
              <input
                type="checkbox"
                checked={true}
                onChange={() => handleCheckboxChange(column, false)}
              />
              <span>{column.headerName}</span>
            </div>
          ))}
        </div>
      </Box>
      <Box sx={{ width: '45%', height: '300px', overflow: 'auto' }}>
        <Typography variant="subtitle1">Available Columns</Typography>
        <div className="column-options">
          {availableColumns
            .filter(column => !tempVisibleColumns.some(col => col.field === column.field))
            .map((column) => (
              <div key={column.field}>
                <input
                  type="checkbox"
                  checked={false}
                  onChange={() => handleCheckboxChange(column, true)}
                />
                <span>{column.headerName}</span>
              </div>
            ))}
        </div>
      </Box>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Button onClick={handleSelectAll}>Select All</Button>
      <Button onClick={handleDeselectAll}>Deselect All</Button>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
      <Button onClick={closeColumnModal}>Cancel</Button>
      <Button onClick={handleApplyColumns}>Apply</Button>
    </Box>
  </Box>
</Modal>
<ConfirmationDialog
  open={deleteDialogOpen}
  title="Confirm Delete"
  content={`Are you sure you want to delete this row?`}
  onConfirm={handleConfirmDelete}
  onCancel={handleCancelDelete}
/>

    </div>
  );
};

export default GridComponent;
