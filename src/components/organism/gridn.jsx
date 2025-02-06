import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config/config";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmationDialog from '../molecules/confirmation-dialog';
import "../../assets/styles/callsgrid.css";
import GridMenu from "../molecules/gridmenu";
import Papa from 'papaparse';
import CsvImporter from "../molecules/csvImpoter";



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
  Alert,
  Dialog, DialogTitle, DialogContent, DialogActions 
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Loader from "../molecules/loader";
import Pagination from "@mui/material/Pagination";
import { useNotifications } from '../atoms/notification';
import { headers } from '../atoms/Authorization';
import { jwtDecode } from "jwt-decode";


const endpoint = "controls/retrive";
const gridEndpoint = "appdata/retrieve";


const GridComponent = ({ pageName }) => {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25); // Adjust this value as needed
  const [totalRows, setTotalRows] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
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
  const { fetchNotifications } = useNotifications();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [inputPage, setInputPage] = useState("");


  const [menuData, setMenuData] = useState([]);
  useEffect(() => {
    axios.get(`${config.apiUrl}/menus`, {headers}) // Use apiUrl from the configuration file
      .then((response) => {
        const containerData = response.data.data.find(menu => menu.menu === 'container');

        setMenuData(containerData);
        console.log("menusss", response.data.data)
        
      })
      .catch((error) => {
      });
  }, []);

  const [userData, setUserData] = useState({});
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const user = decodedToken.username;

      axios
        .post(
          `${config.apiUrl}/appdata/retrieve`,
          [
            {
              $match: {
                pageName: "users",
                username: user,
              },
            },
          ],
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
              Access: "true",
            },
          }
        )
        .then((response) => {
          setUserData(response.data.data[0]);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.error("Token not found");
    }
  }, []);
  console.log("userdata", userData);

    const handleOpenImportModal = () => {
      setIsImportModalOpen(true);
      closeMenu(); 
    };
  
    const handleCloseImportModal = () => {
      setIsImportModalOpen(false);
    };

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
    console.log("row", row);
    handleMenuClose();
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (rowToDelete) {
      const id = rowToDelete._id; // Assuming `_id` is the unique identifier for the row
      if (rowToDelete._id !== userData._id) {
      try {
        await axios.delete(
          `${config.apiUrl.replace(/\/$/, '')}/appdata/${id}`, 
          {
            headers: headers // The configuration object where headers are passed
          }
        );
        
        setGridData((prevData) => prevData.filter((row) => row._id !== id));
        setSuccess('Data deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
        fetchNotifications();
        setDeleteDialogOpen(false);
        setRowToDelete(null); 
      } catch (error) {
        console.error('Error deleting data:', error);
        setError(error)
        setTimeout(() => setError(''), 3000);
      }
    }
    else {
      setError('You can not delete your own data');
      setTimeout(() => setError(''), 3000);
      setDeleteDialogOpen(false); 
    }
    }
  };
  
  
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false); 
    setRowToDelete(null); 
  };

  useEffect(() => {
    if (pageName) {
      setIsLoading(true); // Set the loader to true when pageName changes
      setPage(1); // Reset to the first page when the pageName changes
      setInputPage(1); // Reset the input page number when the pageName changes
    }
  }, [pageName]);
  
  

  // Fetch select options
  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {

        const response = await axios.post(
          
          `${config.apiUrl.replace(/\/$/, "")}/${endpoint}`,
          {
            pageName: pageName,
            control_type: "dropdown",
          },
          {
            // This is the config object where headers should go
            headers: headers, // Pass the headers here
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
            setSelectedValue(JSON.stringify(options[0].filter)); 
          }
        }
      } catch (error) {
        console.error("Error fetching select options:", error);
      }
    };
    fetchSelectOptions();
  }, [pageName]);

  // Handle page change
  const [key, setKey] = useState(0);
  const handlePageChange = (event, value) => {
    // setKey(prevKey => prevKey + 1);
    const currentPage = value;
    const currentpageSize = pageSize;
    setLoading(true);
    
    handleChange({ target: { value: selectedValue } }, currentPage, currentpageSize);
    setPage(value);
    setInputPage(value);
    console.log("current page", value);
  };

  useEffect(() => {
    if (selectedValue) {
      handleChange({ target: { value: selectedValue } });
    }
  }, [selectedValue]);

  const handleCustomDropDown =() => {
    navigate("/customdropdown", { state: { pageName: pageName } });
  }
  
  useEffect(() => {
    if (pageName) {
      setIsLoading(true); // Show loading spinner when pageName changes
  
      // Clear filterText and reset pagination to initial state
      setFilterText({}); // Reset all filter fields
      setPage(1);        // Reset current page number
      setInputPage(1);   // Reset input page number
    }
  }, [pageName]);
  
  const handleChange = (event, currentPage, currentpageSize) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
  
    if (selectedValue === "custom") {
      handleCustomDropDown(); // Call your custom dropdown function
      return; // Exit early to avoid fetching grid data
    }
  
    const filter = JSON.parse(selectedValue);
  
    const currentPageNumber = currentPage || 1;
    const currentNumberofRow = currentpageSize || 25;
    setLoading(true);
    fetchGridData(filter, currentPageNumber, currentNumberofRow); // Fetch grid data for the selected option
  };
  
  
  const flattenObject = (obj, parent = '', res = {}) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], `${parent}${key}.`, res);
      } else {
        res[`${key}`] = obj[key];
      }
    }
    return res;
  };
  
  const fetchGridData = async (filter, currentPageNumber, currentNumberofRow) => {
    try {
      console.log("filter", filter);  
      console.log("current PAges", currentPageNumber);
      console.log("current PAges Size", currentNumberofRow);
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/${gridEndpoint}?page=${currentPageNumber}&pageSize=${currentNumberofRow}`, 
        filter, // This is the body (data you are sending)
        
        {
          headers: headers, // This is the config object where headers go
        }
      );
      
      
      const dataWithIds = response.data.data.map((item, index) => {
        const flattenedItem = flattenObject(item); // Flatten the object
        return {
          ...flattenedItem,
          id: item._id || index,
        };
      });
      setTotalRecord(response.data.pagination.totalCount);
  
      setGridData(dataWithIds);
      setTotalRows(dataWithIds.length);
  
      if (response.data.data.length > 0) {
        const dynamicColumns = Object.keys(dataWithIds[0])
          .filter((key) => key !== "pageId" && key !== "pageName" &&  key !== "_id" && key !== "appdata" && key !== "history" 
          && key !== "id" && key !== "comments" && key !== "pageID" && key !== "filter" && key !== "formatted_filter" && key !== "selected_columns" 
          && key !== "profile_img" && key !== "roles") 
          .map((key) => {
            if (key === "created_time") {
              return {
                field: key,
                headerName: "Created Time",
                width: 200,
                renderCell: (params) => {
                  const utcDate = new Date(params.value); // Convert to Date object (UTC time)
                  const timezoneOffset = utcDate.getTimezoneOffset(); 
                  const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000); 
                  const formattedLocalTime = localTime.toLocaleString();
                  return formattedLocalTime;
                }
              };
            }
            return {
              field: key,
              headerName: key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()),
              width: 150,
            };
          });
      
        setIsLoading(false);
        setLoading(false);
        setColumns(dynamicColumns);
        setAvailableColumns(dynamicColumns); // Set available columns here
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setLoading(false);
        }, 2000); 
      }
      
    } catch (error) {
      console.error("Error fetching grid data:", error);
    }
  };
  ;

  const handleFilterChange = (field, value) => {
    setPage(1);
    setInputPage(1);
    setFilterText((prev) => ({ ...prev, [field]: value }));
  };

  // This function updates the text in the field without triggering a search
const handleFilterTextChange = (field, value) => {
  setFilterText((prev) => ({ ...prev, [field]: value }));
};

// This function triggers the search when Enter is pressed
const handleSearch = (field, value) => {
  if (value.trim() === "") return; // Prevent empty search
  const filter = [
    {
      $match: {
        pageName: "leads",
        [field]: value, // Dynamically add the field and value
      },
    },
  ];
  

  const currentNumberOfRow = pageSize || 25;
  setPage(1);
  setInputPage(1);
  fetchGridData(filter, 1, currentNumberOfRow);
};

const handleFilterChangeAndSearch = (field, value, triggerSearch = false) => {
  setFilterText((prev) => ({ ...prev, [field]: value }));
  if (triggerSearch) {
    const updatedFilters = { ...filterText, [field]: value };
    const activeFilters = Object.entries(updatedFilters)
      .filter(([_, v]) => v.trim() !== "") // Exclude empty filters
      .reduce((acc, [key, val]) => {
        acc[key] = {
          $regex: val.trim(), // Partial matching
          $options: "i",      // Case-insensitive
        };
        return acc;
      }, {});

    const filter = [
      {
        $match: {
          pageName: pageName,
          ...activeFilters, // Include all active filters dynamically
        },
      },
    ];

    const currentNumberOfRow = pageSize || 25;
    // Reset page number and fetch the grid data
    setPage(1);
    setInputPage(1);
    fetchGridData(filter, 1, currentNumberOfRow);
  }
};

  const filteredRows = gridData.filter((row) =>
    columns.every((column) => {
      const value = row[column.field];
      const filterValue = filterText[column.field] || "";
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    })
  );

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
      handleMenuClose();
    if (selectedRow) {
        navigate(`/${pageName}/${mode}/${selectedRow._id}`, {
            state: { rowData: selectedRow, pageName, mode },
        });
        console.log("rowdata",selectedRow)
        handleMenuClose();
    }
  };
  const handleDoubleClick = (mode, params) => {
    handleMenuClose();
  if (params) {
      navigate(`/${pageName}/${mode}/${ params.row._id}`, {
          state: { rowData:  params.row, pageName, mode },
      });
      console.log("rowdata", params.row)
      handleMenuClose();
  }
};
  const handleadd = (mode) => {
    navigate(`/${pageName}/${mode}`, {
        state: { pageName, mode },
    });
};
  const handleAsignedTo = () => {
    navigate("/users/assignedto");

  };

const [filteredData, setFilteredData] = useState([]);
const [convertDialogOpen, setConvertDialogOpen] = useState(false);

const openConfirmationDialog = () => {
  setConvertDialogOpen(true);
};

const handleConfirmconcertToLead = async () => {
  handleMenuClose(); // Close the menu if needed

  if (selectedRow) {
    const id = selectedRow._id; // Get the unique ID for the row
    const updatedRow = { pageName: "leads" }; // Only updating the pageName field

    // Log for debugging purposes
    console.log('ID:', id);
    console.log('Updated Data being sent:', updatedRow);

    try {
      // Send the PUT request with only the pageName field
      await axios.put(`${config.apiUrl}/appdata/${id}`, updatedRow);
      setSuccess('Convert To Lead successfully');
      fetchGridData(); // Refetch the grid data after the update
      setTimeout(() => setSuccess(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error Converting Data:', error);
    }
  }

  setConvertDialogOpen(false);
};

const handleCancelconcertToLead = () => {
  setConvertDialogOpen(false); // Close the dialog without doing anything
};

const handleEditReport = async () => {
  if (!selectedRow) return;

  try {
    const reportId = selectedRow._id;
    const reportResponse = await axios.get(
      `${config.apiUrl.replace(/\/$/, "")}/appdata/${reportId}`, { headers }
    );
  
    const selectedReportData = reportResponse.data.data;
    console.log('Fetched report data:', selectedReportData);

    // Navigate to the edit report page and pass the selectedReportData
    navigate(`/edit-report/${reportId}`, { 
      state: { selectedReportData }  // Pass the selectedReportData in the state
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
  }
};

const handleViewReport = async () => {
  if (!selectedRow) return;

  try {
    // Fetch the app data using the ID from the selected row
    const reportId = selectedRow._id;
    const reportResponse = await axios.get(
      `${config.apiUrl.replace(/\/$/, "")}/appdata/${reportId}`, {headers}
    );
    
    const reportData = reportResponse.data.data;
    console.log('Fetched report data:', reportData);

    const pipeline = reportData.formatted_filter;

    console.log('Pipeline array:', pipeline);

    const appDataResponse = await axios.post(
      `${config.apiUrl.replace(/\/$/, "")}/appdata/retrieve`,
      pipeline,  // Send the pipeline array directly
      { headers: headers }
    );
    
    const filteredData_reportId = appDataResponse.data.data; // Store the fetched data
    console.log('Fetched app data:', filteredData_reportId);

    // Update the state with the fetched data
    setFilteredData(filteredData_reportId);

    // Navigate to the ReportGrid component and pass the filtered data
    navigate('/view-report', { state: { filteredData: filteredData_reportId } });

  } catch (error) {
    console.error('Error fetching report data:', error);
  }
};

  const [selectedRows, setSelectedRows] = useState([]);  
  const isAllSelected = selectedRows.length === filteredRows.length && filteredRows.length > 0;

  const columnsWithFilter = [
    {
      field: "select",
      width: 20,
      padding: "0 0px",
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
      disableColumnMenu: true,
      renderCell: (params) => (
        <Checkbox
        style={{padding:"0"}}
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
      disableColumnMenu: true,
      width: 20,
      renderCell: (params) => (
        
        <div>
          <IconButton
  onClick={(event) => {
    event.stopPropagation(); // Prevents triggering row navigation
    handleMenuOpen(event, params.row);
  }}
  onDoubleClick={(event) => {
    event.stopPropagation(); // Prevents triggering row navigation
    handleMenuOpen(event, params.row);
  }}
  onContextMenu={(event) => {
    event.stopPropagation(); // Prevents triggering row navigation
    handleMenuOpen(event, params.row);
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
        pageName={pageName} 
        onViewReport={handleViewReport}
        onEditReport={handleEditReport}
        convertToLead={openConfirmationDialog}
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
            // height: "40px",
            width: "100%",
            boxSizing: "border-box",
            // color: "white",
            // background: "#212529",
          }}
        >
          <div
            style={{
              marginBottom: "5px",
              fontWeight: "bold",
              textAlign: "center",
              width: "100%",
              fontSize: "10px",
            }}
          >
            {params.colDef.headerName}
          </div>
<TextField
 variant="outlined"
 size="small"
 onClick={(e) => e.stopPropagation()} // Stop propagation to prevent sorting
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleFilterChangeAndSearch(params.field, e.target.value, true); // Trigger search on Enter
    }
  }}
  style={{ width: "80%", background: "#ffffff", borderRadius: "10px" }}
  className="grid_search">

</TextField>
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

  const editSelectedRows = () => {
    const selectedData = gridData.filter((row) =>
      selectedRows.includes(row.id)
    );
    console.log("Selected Data:", selectedData);

    if (selectedData.length === 0) {
      setError('No rows selected');
      setTimeout(() => setError(''), 3000);
      return;
    };
     // Navigate to another component with selected data
     navigate('/selected/edit', { state: { selectedData } });
    
  };
  
  const emailSelectedRows = () => {
    // Filter the gridData to get the selected rows
    const selectedData = gridData.filter((row) =>
      selectedRows.includes(row.id)
    );
    const emailAddresses = selectedData
      .map((row) => row.caller_email || row.email)  // Extract email addresses
      .filter((email) => typeof email === 'string' && email.trim() !== ""); // Remove undefined and empty emails
    return emailAddresses;
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
      
      // Get the current date and format it as DD-MM-YYYY
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0'); // Add leading zero for single-digit days
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, add 1
      const year = now.getFullYear();
      const formattedDate = `${day}-${month}-${year}`; // Format as DD-MM-YYYY
    
      // Set the filename with the formatted date
      const fileName = `exported_data_${formattedDate}.csv`;
    
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
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
    closeMenu();
    exportSelectedRows();
  };
  const handleEmailClick = () => {
    closeMenu();
    emailSelectedRows();
  };
  const handleEditClick = () => {
    closeMenu();
    editSelectedRows();
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
    const currentPage = 1;
    const currentpageSize = event.target.value;
    handleChange({ target: { value: selectedValue } }, currentPage, currentpageSize);
  };
  
  const handlePageInputChange = (e) => {
    setInputPage(e.target.value); // Update the input value
    
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const pageNum = parseInt(inputPage, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= Math.ceil(totalRecord / pageSize)) {
        const currentPage = pageNum;
        handleChange({ target: { value: selectedValue } }, currentPage);
        setPage(pageNum); // Set the page if valid
      } else {
        setError("Please enter a valid page number.");
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const [isBoxVisible, setIsBoxVisible] = useState(true);
  const handleBoxClose = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  const handleGenerateReportClick = () => {
    navigate('/generate-report');
  }
  
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
          width: '100%', 
          display: {
          xs: "block",
          sm: "flex", 
          }, 
          justifyContent: "space-around",
          textAlign: {
            xs: "center",
          },}}
      >
        <Box
        className="Appbar"
        sx={{  
          width: '50%', 
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
        <Dialog open={isImportModalOpen} onClose={handleCloseImportModal} fullWidth maxWidth="sm">
        <DialogTitle>Import CSV Data</DialogTitle>
        <DialogContent>
          <CsvImporter />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        {menuData.add && menuData.add.title && pageName !== 'reports' && pageName !== 'calls' && (
          <Button 
            onClick={() => handleadd("add")} 
            className='Action-btn' 
            sx={{ color: 'white', background: '#212529' }}
          >
            {menuData.add.title}
          </Button>
        )}
        {pageName === 'users' && (
          <Button 
            onClick={() => handleAsignedTo()} 
            className='Action-btn' 
            sx={{ color: 'white', background: '#212529' }}
          >
            Assign To
          </Button>
        )}

        {pageName === 'reports' && (
            <Button 
              onClick={handleGenerateReportClick}  
              className='Action-btn' 
              sx={{ color: 'white', background: '#212529' }}
            >
              Generate Reports
            </Button>
          )}

        <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}>
            <MenuItem onClick={handleOpenImportModal}>Import Data</MenuItem>
            <MenuItem onClick={handleExportClick}>Export Data</MenuItem>
            {pageName === 'leads' && (
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            )}
        </Menu>
        
        <div className="dropdown" style={{ margin: "8px", width: "250px" }}>
          <select
            value={selectedValue}
            onChange={handleChange}
            style={{
              color: "white",
              background: "#464646",
              width: "100%",
              padding: "5px 10px",
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
            <option value="custom">Custom</option>
          </select>
        </div>
        </Box>
        <Box
        className="Appbar"
        sx={{ 
          width: '50%', 
          display: {
          xs: "block",
          sm: "flex", 
          }, 
          justifyContent: "space-around",
          textAlign: {
            xs: "center",
          },}}
      >
        <div style={{fontSize:'12px', display: 'flex', alignItems:'center'}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>Page</div>
          <div style={{ width: '40px', margin: '0 15px' }}> {/* Increased width to give more space */}
          <input
          type="text"
          value={inputPage}
          onChange={handlePageInputChange}
          onKeyDown={(e) => {
            // Allow only numeric keys and control keys like Backspace, Delete, and arrow keys
            if (!/^\d*$/.test(e.key) && 
                e.key !== 'Backspace' && 
                e.key !== 'Delete' && 
                e.key !== 'ArrowLeft' && 
                e.key !== 'ArrowRight' && 
                e.key !== 'Enter') {
              e.preventDefault(); // Prevent invalid key press
            }
              if (e.key === 'Enter') {
                const pageNum = parseInt(inputPage, 10);
                
                // Ensure the page number is numeric and within the valid range
                if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= Math.ceil(totalRecord / pageSize)) {
                  const currentPage = pageNum;
                  handleChange({ target: { value: selectedValue } }, currentPage);
                  setPage(pageNum); // Set the page if valid
                } else {
                  setError("Please enter a valid page number.");
                  setTimeout(() => setError(''), 3000); // Clear error after 3 seconds
                }
              }
            }}
            placeholder="Go to page"
            style={{
              width: '100%',
              padding: '3px 3px',
              borderRadius: '4px',
              border: '1px solid #ced4da',
              boxSizing: 'border-box', // Ensures padding doesn't affect width
            }}
          />

        </div>
        <div>of</div>
        <div  style={{ margin: '0 7px', width: '50px' }}>{Math.ceil(totalRecord / pageSize)}</div>
      </div>
        <span style={{ marginLeft: "16px" }}>
          Total Rows:
        </span> 
        <span style={{width: '50px'}}>{totalRecord}</span>
        
        
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
          displayEmpty
          className="total_page_select"
          style={{ marginLeft: "16px", height:'25px', fontSize:'12px !important' }}
        >
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={75}>75</MenuItem>
        </Select>
        </div>
       
        <Box>
      <Pagination
        count={Math.ceil(totalRecord / pageSize)}
        // siblingCount={0}
        page={page}
        onChange={handlePageChange}
        className="pagination_main"
        style={{ justifyContent: "center", display: "flex" }}
      />
        </Box>
        </Box>
      </Box>
      )}
        
        <div style={{height:'calc(100vh - 140px)'}}>
          <DataGrid
            // rows={filteredRows}
            rows={loading ? [] : filteredRows}
            columns={columnsWithFilter}
            paginationMode="server"
            disableSelectionOnClick
            getRowHeight={() => 35}
            className="custom-data-grid-main"
            onRowDoubleClick={(params) => {
              console.log("Row double-clicked:", params.row);
              handleDoubleClick("view", params)
            }}           
          />
        </div>
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
<ConfirmationDialog
        open={convertDialogOpen}
        title="Convert To Lead"
        content={`Are you sure you want to Convert To Lead?`}
        onConfirm={handleConfirmconcertToLead}
        onCancel={handleCancelconcertToLead}
      />

    </div>
  );
};

export default GridComponent;