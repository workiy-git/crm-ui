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
  Button,
  TextField,
  IconButton,
  Menu,
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
  const [filterText, setFilterText] = useState("");
  // const [filteredRows, setFilteredRows] = useState(gridData);
  //not confirmed

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  // const widget = location.state;

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
      console.log("filter", filter);
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}${gridEndpoint}`,
        filter
      );
      // Ensure each row has a unique `id` property
      const dataWithIds = response.data.data.map((item, index) => ({
        ...item,
        id: item._id || index, // Use existing `_id` or fallback to index
      }));
      setGridData(dataWithIds); // Update grid data with the response
      setTotalRows(dataWithIds.length); // Update total rows if available
      // console.log("dataWithIds.total", response.data.data.length);
      // console.log("totalRows", totalRows);
      // console.log("page", page);
      // console.log(
      //   "Math.ceil(totalRows / pageSize)",
      //   Math.ceil(totalRows / pageSize)
      // );

      // Dynamically set columns based on the keys of the first object in the data array
      if (response.data.data.length > 0) {
        const dynamicColumns = Object.keys(dataWithIds[0]).map((key) => ({
          field: key,
          headerName: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase()), // Format header name
          width: 150,
        }));
        // console.log("dynamicColumns", dynamicColumns);
        setColumns(dynamicColumns);
      }
    } catch (error) {
      // console.log("error", error);
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

  const handleNavigate = (path, mode) => {
    if (selectedRow) {
      navigate(`${path}/${selectedRow._id}`, {
        state: { rowData: selectedRow, pageName, mode },
      });
      handleMenuClose();
    }
  };
  

  const columnsWithFilter = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
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
            <MenuItem onClick={() => handleNavigate("/details", "details")}>Details</MenuItem>
            <MenuItem onClick={() => handleNavigate("/details", "edit")}>Edit</MenuItem>
            <MenuItem onClick={() => handleNavigate("/details", "delete")}>Delete</MenuItem>

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
            padding: "8px",
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
            style={{ width: "100%", background: "#ffffff" }}
          />
        </div>
      ),
    })),
  ];

  // Add some CSS to increase the header height

  return (
    <div className="CallsGrid">
      <Box
        className="Appbar"
        sx={{ display: "flex", justifyContent: "space-around" }}
      >
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
          count={Math.ceil(totalRows / pageSize)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          style={{ marginTop: 20 }}
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
            checkboxSelection
            columnHeaderHeight={120}
            className="custom-data-grid"
          />
        </div>
      )}
      {/* <Pagination
        count={Math.ceil(totalRows / pageSize)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: 20 }}
      /> */}
    </div>
  );
};

export default GridComponent;
