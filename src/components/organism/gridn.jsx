import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config/config";
import { DataGrid } from "@mui/x-data-grid";
import WidgetsOutlinedIcon from "@mui/icons-material/WidgetsOutlined";
import "../../assets/styles/callsgrid.css";

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
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Pagination from "@mui/material/Pagination";

const endpoint = "/controls/retrive";
const gridEndpoint = "/appdata/retrieve";

const GridComponent = ({ pageName }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Adjust this value as needed
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
  // const [filteredRows, setFilteredRows] = useState(gridData);
  //not confirmed

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  // const widget = location.state;

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
  const handlePageChange = (event, value) => {
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

  const handleNavigate = (path) => {
    if (selectedRow) {
      navigate(`${path}/${selectedRow.id}`, {
        state: { rowData: selectedRow, pageName },
      });
      handleMenuClose();
    }
  };

  const columnsWithFilter = [
    {
      field: "select",
      headerName: "",
      width: 60,
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.id)}
          onChange={(event) =>
            handleCheckboxChange(params.id, event.target.checked)
          }
        />
      ),
    },
    {
      // field: "actions",
      // headerName: "Actions",
      // width: 100,
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
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleNavigate("/edit")}>Edit</MenuItem>
            <MenuItem onClick={() => handleNavigate("/details")}>
              Details
            </MenuItem>
            <MenuItem onClick={() => handleNavigate("/delete")}>
              Delete
            </MenuItem>
          </Menu>
        </div>
      ),
    },
    ...columns.map((column) => ({
      ...column,
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
            style={{ width: "80%", background: "#ffffff" }}
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
      alert("No rows selected for export.");
      return;
    }

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
  const [selectedRows, setSelectedRows] = useState([]);
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
  
  // Add some CSS to increase the header height

  return (
    <div className="CallsGrid">
      <Box
        className="Appbar"
        sx={{ display: "flex", justifyContent: "space-around" }}
      >
        <Button onClick={openMenu} className='Action-btn' sx={{ color:'white', background:'#212529' }} >
          Actions
        </Button>
        <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}>
            <MenuItem onClick={handleExportClick}>Export Data</MenuItem>
        </Menu>
        <FormControl
          variant="outlined"
          style={{ minWidth: 200, marginBottom: 20 }}
        >
          <Button
            sx={{ color: "black" }}
            onClick={() => setShowColumnModal(true)}
          >
            <WidgetsOutlinedIcon />
          </Button>
        </FormControl>
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
        <Pagination
          pageSize={pageSize}
          paginationMode="server"
          rowCount={totalRows}
          onPageChange={handlePageChange}
          page={page - 1}
          disableSelectionOnClick
          columnHeaderHeight={120}
        />
      </Box>
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
        <div>
          <DataGrid
            rows={filteredRows}
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
    </div>
  );
};

export default GridComponent;
