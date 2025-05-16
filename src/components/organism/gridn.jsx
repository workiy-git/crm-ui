import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import config from "../../config/config";
import { DataGrid } from "@mui/x-data-grid";
import ConfirmationDialog from '../molecules/confirmation-dialog';
import "../../assets/styles/callsgrid.css";
import GridMenu from "../molecules/gridmenu";
import Papa from 'papaparse';
import CsvImporter from "../molecules/csvImpoter";
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import dayjs from "dayjs";



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
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import Loader from "../molecules/loader";
import Pagination from "@mui/material/Pagination";
import { useNotifications } from '../atoms/notification'; // Import the hook
import { headers } from '../atoms/Authorization';
import { jwtDecode } from "jwt-decode";


const endpoint = "controls/retrive";
const gridEndpoint = "appdata/retrieve";


const GridComponent = ({ pageName }) => {
  const [open, setOpen] = useState(false);
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
  const [dynamicFields, setDynamicFields] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [sortModel, setSortModel] = useState([]);
  const [SelectedColumns, setSelectedColumns] = useState([]);
  const [dropdownFilter, setDropdownFilter] = useState([]);


  const postDataWithRetry = useCallback(
    async (url, payload, retryCount = 3) => {
      try {
        const response = await axios.post(url, payload, { headers });
        return response.data;
      } catch (error) {
        if (retryCount > 0) {
          console.warn("Retrying POST request, attempts left:", retryCount);
          return postDataWithRetry(url, payload, retryCount - 1);
        } else {
          throw error;
        }
      }
    },
    []
  );
  

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
      if (pageName) {
        setSelectedColumns([]);
        setIsLoading(true); // Show loading spinner when pageName changes
        setDateRange({ startDate: null, endDate: null }); // Reset date range
        // Clear filterText and reset pagination to initial state
        setFilterText({}); // Reset all filter fields
        setPage(1);        // Reset current page number
        setInputPage(1);   // Reset input page number
      }
    }, [pageName]);
    
  // const [filteredRows, setFilteredRows] = useState(gridData);
  //not confirmed
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    // Check if data already exists in sessionStorage
    const cachedMenuData = sessionStorage.getItem('menuData');
    if (cachedMenuData) {
      setMenuData(JSON.parse(cachedMenuData));
      return; // Exit early to avoid unnecessary API call
    }
  
    axios.get(`${config.apiUrl}/menus`, { headers })
      .then((response) => {
        const containerData = response.data.data.find(menu => menu.menu === 'container');
        setMenuData(containerData);
        sessionStorage.setItem('menuData', JSON.stringify(containerData));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);
  

  const [userData, setUserData] = useState({});
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      // setJwtToken(token);
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
          // setUserName(user);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.error("Token not found");
    }
  }, []);
  

    // Open the Import Data Modal
    const handleOpenImportModal = () => {
      setIsImportModalOpen(true);
      closeMenu(); // Close the menu when opening the modal
    };
  
    // Close the Import Data Modal
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

  const columnsData = JSON.stringify(tempVisibleColumns);
  sessionStorage.setItem(`visibleColumns_${pageName}`, columnsData);
  localStorage.setItem(`visibleColumns_${pageName}`, columnsData);

  closeColumnModal();
};

  const handleDeleteClick = (row) => {
    
    handleMenuClose();
    setRowToDelete(row); // Set the row to be deleted
    setDeleteDialogOpen(true); // Open the confirmation dialog
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
        setDeleteDialogOpen(false); // Close the dialog
        setRowToDelete(null); // Clear the selected row
        
      } catch (error) {
        console.error('Error deleting data:', error);
        setError(error)
        setTimeout(() => setError(''), 3000);
      }
    }
    else {
      setError('You can not delete your own data');
      setTimeout(() => setError(''), 3000);
      setDeleteDialogOpen(false); // Close the dialog
      
    }
    }
  };
  
  
  const handleCancelDelete = () => {
    setDeleteDialogOpen(false); // Close the dialog
    setRowToDelete(null); // Clear the selected row
  };
  
const [existingControl, setExistingControl] = useState([]);
  // Fetch select options
  const fetchSelectOptions = async () => {
    try {
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/${endpoint}`,
        {
          pageName: pageName,
          control_type: "dropdown",
        },
        {
          headers: headers, // Pass the headers here
        }
      );
  
      setExistingControl(response.data.data.find((control) => control.pageName === pageName));
  
      const options = response.data.data[0].value.map((option) => ({
        name: option.name,
        filter: option.filter,
        fields: option.fields,
      }));
  
      setSelectOptions(options); // Assuming the API returns an object with an 'options' array
  
      setKey((prevKey) => prevKey + 1);
  
      if (options.length > 0) {
        if (widget) {
          const selectedOption = options.find(
            (option) => option.name === widget
          );
          if (selectedOption) {
            setSelectedValue(JSON.stringify(selectedOption.filter));
            setSelectedColumns(JSON.stringify(selectedOption.fields));
          } else {
            setSelectedValue(JSON.stringify(options[0].filter)); // Fallback to the first option if no match is found
            setSelectedColumns(JSON.stringify(options[0].fields));
          }
          setWidget(""); // Clear the widget value after initial use
        } else {
          setSelectedValue(JSON.stringify(options[0].filter)); // Set default value to the first option
          setSelectedColumns(JSON.stringify(options[0].fields));
        }
      }
    } catch (error) {
      console.error("Error fetching select options:", error);
    }
  };
  
  // Call fetchSelectOptions inside useEffect
  useEffect(() => {
    fetchSelectOptions();
  }, [pageName]);

  const handleDeleteOption = async (index, option) => {
    
    // Show confirmation dialog before deleting
    const isConfirmed = window.confirm(`Are you sure you want to delete "${option.name}"?`);
    
    if (!isConfirmed) {
        return; // Exit if user cancels
    }

    
    

    try {
        // Remove the selected option from existingControl.value
        const updatedOptions = existingControl.value.filter((_, i) => i !== index);
        

        // Create an object excluding `_id`
        const { _id, ...updatedControl } = existingControl; // Exclude `_id`
        updatedControl.value = updatedOptions; // Update value array

        // Send a PUT request to update the backend
        await axios.put(`${config.apiUrl}/controls/${_id}`, updatedControl, { headers });

        // Update state with new options
        setSelectOptions(updatedOptions);

        // Update selected value if needed
        if (updatedOptions.length > 0) {
            setSelectedValue(JSON.stringify(updatedOptions[0].filter));
        } else {
            setSelectedValue(""); // Clear selection if empty
        }

    } catch (error) {
        console.error("Error deleting option:", error);
    }
};

const handleEditOption = (index, option) => {
  console.log("Edit option:", option);
  navigate(`/${pageName}/customdropdown`, { state: { filters: option, pageName: pageName } });
};
const handleFieldOption = (index, option) => {
  setSelectedColumns(option.fields);
};
  
  
  
  // Handle page change
  const [key, setKey] = useState(0);
  const handlePageChange = (event, value) => {
    const currentPage = value;
    const currentpageSize = pageSize;
    setLoading(true);
    
    // Use the existing filterText state and sortModel to fetch data for the selected filter
    const filter = JSON.parse(selectedValue);
    const sortField = sortModel[0]?.field || null;
    const sortOrder = sortModel[0]?.sort || null;

    fetchGridData(filter, currentPage, currentpageSize, sortField, sortOrder);
    
    setPage(value);
    setInputPage(value);
    
  };

  // Fetch grid data based on the selected filter
  useEffect(() => {
    if (selectedValue) {
      handleChange({ target: { value: selectedValue } });
    }
  }, [selectedValue]);

  const handleCustomDropDown =() => {
    navigate(`/${pageName}/customdropdown`, { state: { pageName: pageName } });
  }
  
  //Drop Down Change
  const handleChange = (event, currentPage, currentpageSize) => {


    const selectedValue = event.target.value;
    console.log("event", selectedValue);

    setSelectedValue(selectedValue);
    if (selectedValue === "custom") {
      handleCustomDropDown(); // Call your custom dropdown function
      return; // Exit early to avoid fetching grid data
    }
    
    const filter = JSON.parse(selectedValue);
    setDropdownFilter(filter);
  
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
  
  const fetchGridData = async (filter, currentPageNumber, currentNumberofRow, sortField = null, sortOrder = null) => {
    try {
        
      
      
      const queryParams = new URLSearchParams({
        page: currentPageNumber,
        pageSize: currentNumberofRow,
      });
 
      if (sortField && sortOrder) {
        queryParams.append("sortField", sortField);
        queryParams.append("sortOrder", sortOrder);
      }
 
      // Make the API request
      const response = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/${gridEndpoint}?${queryParams.toString()}`,
        filter, // Send filter in the request body
        {
          headers: headers, // Include headers for authorization
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
      setGridData(dataWithIds); // Ensure gridData is set with the fetched data
      setTotalRows(dataWithIds.length);

      console.log("SelectedColumns", SelectedColumns);

       const responses = await axios.post(
              `${config.apiUrl.replace(/\/$/, "")}/${endpoint}`,
              {
                pageName: pageName,
                control_type: "dropdown",
              },
              {
                headers: headers, // Pass the headers here
              }
            );
        const initialdropDowncolumn = responses.data.data[0].value;

        console.log("initialdropDowncolumn", initialdropDowncolumn);
        console.log("filter", filter);

        // Assuming `filter` is the one you're trying to match against
// and `initialdropDowncolumn` is the array from the API response

// Deep comparison utility to match filters (JSON.stringify works if order is consistent)
function isFilterMatch(filter1, filter2) {
  return JSON.stringify(filter1) === JSON.stringify(filter2);
}

// Find the matching dropdown config
const matchedDropdown = initialdropDowncolumn.find(item =>
  isFilterMatch(item.filter, filter)
);

// Get the fields if a match is found
const matchedFields = matchedDropdown ? matchedDropdown.fields : [];

console.log("Matched Fields:", matchedFields);

          const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/webforms`;
          const fieldresponse = await fetchDataWithRetry(apiUrl);
          const fetchedWebformsData = fieldresponse.data || [];
          const currentPage = fetchedWebformsData.find(
            (page) => page.pageName === pageName
          );
          const currentPageFields = currentPage.fields || [];
          setDynamicFields(currentPageFields);
          console.log("currentPageFields", currentPageFields);


      if (response.data.data.length > 0) {
        const excludedKeys = [
          "pageId", "pageName", "_id", "appdata", "history", "id", "comments",
          "pageID", "filter", "formatted_filter", "selected_columns",
          "profile_img", "roles", "property_type", "project_name","fb_form_name", "fb_page_name", "fb_form_id", "landing_number", "acp", "alternative_email", "sm", "description"
        ];
        
        const CurrentDropDownFields = matchedFields.map(field => ({
          fieldName: field,
          label: field,
        }));
        const fieldsToUse = CurrentDropDownFields.length > 0 ? CurrentDropDownFields : currentPageFields;
        
        const dynamicColumns = fieldsToUse
        .filter(field => field.fieldName && !excludedKeys.includes(field.fieldName))
          .map((field) => {
            const key = field.fieldName;
            const label = field.label || key.replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase());
            if (key === "created_time") {
              return {
                field: key,
                headerName: "Created Time",
                width: 200,
                renderCell: (params) => {
                  const utcDate = new Date(params.value);
            
                  const timezoneOffset = utcDate.getTimezoneOffset();
                  const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000);
            
                  // Extract components
                  const year = localTime.getFullYear();
                  const month = String(localTime.getMonth() + 1).padStart(2, '0');
                  const day = String(localTime.getDate()).padStart(2, '0');
            
                  const time = localTime.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  });
            
                  const formattedLocalTime = `${year}/${month}/${day}, ${time}`;
            
                  return formattedLocalTime;
                }
              };
            }
            
            if (key === "follow_up_on" || key === "site_visit_on" || key === "Modified_at") {
              return {
                field: key,
                headerName: key
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase()),
                width: 200,
                renderCell: (params) => {
                  if (!params.value) return ""; // Return empty string if no data
            
                  const utcDate = new Date(params.value); // Convert to Date object (UTC time)
            
                  // Get the offset in minutes for local time relative to UTC
                  const timezoneOffset = utcDate.getTimezoneOffset();
            
                  // Adjust the UTC time based on the offset
                  const localTime = new Date(utcDate.getTime() - timezoneOffset * 60000);
            
                  // Format the date manually to "YYYY/MM/DD, hh:mm:ss AM/PM"
                  const year = localTime.getFullYear();
                  const month = String(localTime.getMonth() + 1).padStart(2, '0');
                  const day = String(localTime.getDate()).padStart(2, '0');
            
                  const time = localTime.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  });
            
                  return `${year}/${month}/${day}, ${time}`;
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
        }, 2000); // 2000 milliseconds = 2 seconds
      }
      
    } catch (error) {
      console.error("Error fetching grid data:", error);
    }
  };
  ;

  const handleSortModelChange = (newSortModel) => {
      
    setSortModel(newSortModel); // Update the sort model state
 
    if (newSortModel.length > 0) {
      const { field, sort } = newSortModel[0]; // Extract field and sort order
      const currentPage = 1; // Reset to the first page when sorting changes
      setLoading(true);
      fetchGridData(JSON.parse(selectedValue), currentPage, pageSize, field, sort);
      setPage(currentPage); // Reset the page state
    } else {
      // If no sorting is applied, fetch data without sort parameters
      setLoading(true);
      fetchGridData(JSON.parse(selectedValue), 1, pageSize);
      setPage(1);
    }
  };

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
  // Reset page number and fetch the grid data
  setPage(1);
  setInputPage(1);
  fetchGridData(filter, 1, currentNumberOfRow);
};

const handleFilterChangeAndSearch = (field, value, isDropdown) => {
  let filterValue = value;

  if (isDropdown) {
    filterValue = Array.isArray(value) ? value : [value];

    if (filterValue.length === 0) {
      setFilterText({});
      return;
    }
  } else if (typeof value === "object") {
    // If value is an object (startDate & endDate), store it as is
    filterValue = value;
  } else {
    filterValue = typeof value === "string" ? value.trim() : "";
  }

  setFilterText((prev) => ({
    ...prev,
    [field]: filterValue,
  }));
};

const handleDateChange = (field, type) => (e) => {
  const value = e.target.value;
  setDateRange((prev) => ({
    ...prev,
    [type]: value ? dayjs(value).format("YYYY-MM-DD") : null,
  }));
};

const handleDateSearch = (field) => {
  if (dateRange.startDate || dateRange.endDate) {
    handleFilterChangeAndSearch(field, {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    }, false);
  }
};

// 🆕 useEffect to trigger search when filterText changes
useEffect(() => {
  performSearch();
}, [filterText]); // Run performSearch when filterText updates

const performSearch = () => {
  const activeFilters = Object.entries(filterText)
    .filter(([key, val]) => (Array.isArray(val) ? val.length > 0 : String(val).trim() !== "")) // Exclude empty filters
    .reduce((acc, [key, val]) => {
      if (key === "created_time" || key === "follow_up_on" || key === "site_visit_on" || key === "Modified_at") {
        if (val.startDate && val.endDate) {
          // If both startDate and endDate are provided, use them as a range
          const startOfDay = `${dayjs(val.startDate).format("YYYY-MM-DD")}T00:00:00.000Z`;
          const endOfDay = `${dayjs(val.endDate).format("YYYY-MM-DD")}T23:59:59.999Z`;

          acc[key] = {
            $gte: startOfDay,
            $lt: endOfDay,
          };
        } else if (val.startDate) {
          // If only startDate is provided, use it for the entire day
          const startOfDay = `${dayjs(val.startDate).format("YYYY-MM-DD")}T00:00:00.000Z`;
          const endOfDay = `${dayjs(val.startDate).format("YYYY-MM-DD")}T23:59:59.999Z`;

          acc[key] = {
            $gte: startOfDay,
            $lt: endOfDay,
          };
        } else if (val.endDate) {
          // If only endDate is provided, use it for the entire day
          const startOfDay = `${dayjs(val.endDate).format("YYYY-MM-DD")}T00:00:00.000Z`;
          const endOfDay = `${dayjs(val.endDate).format("YYYY-MM-DD")}T23:59:59.999Z`;

          acc[key] = {
            $gte: startOfDay,
            $lt: endOfDay,
          };
        }
      } else if (Array.isArray(val)) {
        acc[key] = { $in: val }; // Handle multi-select filters
      } else {
        acc[key] = {
          $regex: String(val).trim(), // Partial text search
          $options: "i",      // Case-insensitive
        };
      }
      return acc;
    }, {});

  const filter = [
    {
      $match: {
        pageName: pageName,
        ...Object.assign({}, ...(dropdownFilter.map(obj => obj.$match || {}))),
        ...activeFilters, // Include all active filters dynamically
      },
    },
  ];
  setSelectedValue(JSON.stringify(filter)); // Update the selected value for the dropdown
  
  const currentNumberOfRow = pageSize || 25;
  setPage(1);
  setInputPage(1);
  fetchGridData(filter, 1, currentNumberOfRow);
};

const filteredRows = gridData.map((row) => {
  const flattenedRow = flattenObject(row);
  return {
    ...flattenedRow,
    id: row._id,
  };
});

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
        
        handleMenuClose();
    }
  };
  const handleDoubleClick = (mode, params) => {
    handleMenuClose();
  if (params) {
      navigate(`/${pageName}/${mode}/${ params.row._id}`, {
          state: { rowData:  params.row, pageName, mode },
      });
      
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

  // Close the dialog after confirmation
  setConvertDialogOpen(false);
};

const handleCancelconcertToLead = () => {
  setConvertDialogOpen(false); // Close the dialog without doing anything
};

const handleEditReport = async () => {
  if (!selectedRow) return;

  try {
    // Fetch the app data using the ID from the selected row
    const reportId = selectedRow._id;
    const reportResponse = await axios.get(
      `${config.apiUrl.replace(/\/$/, "")}/appdata/${reportId}`, { headers }
    );
  
    const selectedReportData = reportResponse.data.data;
    

    // Navigate to the edit report page and pass the selectedReportData
    navigate(`/edit-report/${reportId}`, { 
      state: { selectedReportData }  // Pass the selectedReportData in the state
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
  }
};
const openColumnModal = () => {
  setTempVisibleColumns(columns);
  setShowColumnModal(true);
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
    

    const pipeline = reportData.formatted_filter;

    

    // Ensure the pipeline is sent directly as an array
    const appDataResponse = await axios.post(
      `${config.apiUrl.replace(/\/$/, "")}/appdata/retrieve`,
      pipeline,  // Send the pipeline array directly
      { headers: headers }
    );
    
    const filteredData_reportId = appDataResponse.data.data; // Store the fetched data
    

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
      headerName: (
        <div style={{ display: "flex", flexDirection: "column", margin: "auto", padding: "0 10px" }}>
          <IconButton
            style={{ padding: "0", color: "white" }}
            onClick={openColumnModal}
          >
            <WidgetsOutlinedIcon />
            
          </IconButton>
        </div>
      ),
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
      // sortable: false,
      disableColumnMenu: true,
      cellClassName: 'center-align',
      renderHeader: (params) => {
        // Get the field type from dynamicFields
        const fieldType = dynamicFields.find((field) => field.fieldName === params.field)?.type || "text";
        // 
        
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "0", 
              width: "100%",
              boxSizing: "border-box",
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
  
            {/* Render search input based on field type */}
            {fieldType === "dropdown" ? (
              <Select
                multiple
                value={filterText[params.field] || []} // Always expects an array
                onChange={(e) => handleFilterChangeAndSearch(params.field, e.target.value, true)}
                displayEmpty
                variant="outlined"
                size="small"
                style={{ width: "100%", background: "#ffffff", borderRadius: "10px", height: '20px' }}
                renderValue={(selected) => (selected && selected.length > 0 ? selected.join(", ") : "Select")}
              >
                <MenuItem disabled value="">
                  Select
                </MenuItem>
                {(dynamicFields.find((field) => field.fieldName === params.field)?.options || []).map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={filterText[params.field]?.includes(option) || false} />
                    {option}
                  </MenuItem>
                ))}
              </Select>
            ) : fieldType === "date" ? (
              <TextField
                type="date"
                variant="outlined"
                size="small"
                value={filterText[params.field] || ""}
                onChange={(e) => handleFilterChangeAndSearch(params.field, e.target.value, false)}
                style={{ width: "80%", background: "#ffffff", borderRadius: "10px" }}
                className="grid_search"
              />
            ) : fieldType === "datetime-local" ? (
              <>
              <div>
      {/* Button to open modal */}
      <Button style={{ width: "90%", background: "#ffffff", borderRadius: "10px", padding: "0px 30px", color: 'black' }}  variant="contained" size="small" onClick={() => setOpen(true)}>
        Select Date
      </Button>

      {/* Date Picker Popup */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Date Range</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            variant="outlined"
            size="small"
            value={dateRange.startDate || ""}
            onChange={handleDateChange(params.field, "startDate")}
            style={{ width: "100%", marginBottom: "10px" }}
            placeholder="Start Date"
          />
          <TextField
            type="date"
            variant="outlined"
            size="small"
            value={dateRange.endDate || ""}
            onChange={handleDateChange(params.field, "endDate")}
            style={{ width: "100%" }}
            placeholder="End Date"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={() => { 
            handleDateSearch(params.field); 
            setOpen(false);
          }} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </div>
              </>
            ) : fieldType === "boolean" ? (
              <Select
                value={filterText[params.field] || ""}
                onChange={(e) => handleFilterChangeAndSearch(params.field, e.target.value, false)}
                displayEmpty
                variant="outlined"
                size="small"
                style={{ width: "100%", background: "#ffffff", borderRadius: "10px", height: '20px' }}
              >
                <MenuItem disabled value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            ) : (
              <TextField
                variant="outlined"
                size="small"
                value={filterText[params.field] || ""}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleFilterChangeAndSearch(params.field, e.target.value, false);
                  }
                }}
                onChange={(e) => handleFilterChangeAndSearch(params.field, e.target.value, false)}
                style={{ width: "80%", background: "#ffffff", borderRadius: "10px" }}
                className="grid_search"
              />
            )}
          </div>
        );
      },
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
    

    if (selectedData.length === 0) {
      setError('No rows selected');
      setTimeout(() => setError(''), 3000);
      return;
    };
     // Navigate to another component with selected data
     navigate('/selected/edit', { state: { selectedData } });
    
  };
  
  const emailSelectedRows = () => {
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

  // Add some CSS to increase the header height
  const [isBoxVisible, setIsBoxVisible] = useState(true);

  // Step 4: Handle the "Close" button click
  const handleBoxClose = () => {
    setIsBoxVisible(!isBoxVisible);
  };

  const handleGenerateReportClick = () => {
    navigate('/generate-report');
  }
  
  //Loader
  const [isLoading, setIsLoading] = useState(true); 


  useEffect(() => {
    const savedColumns = sessionStorage.getItem(`visibleColumns_${pageName}`) || localStorage.getItem(`visibleColumns_${pageName}`);
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
  }, [pageName]);

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
        <div>{selectedRows.length} out of {pageSize}</div>
        <Button onClick={openMenu} className='Action-btn' sx={{ color:'white', background:'#212529' }} >
          Actions
        </Button>
        <Dialog open={isImportModalOpen} onClose={handleCloseImportModal} fullWidth maxWidth="sm">
        <DialogTitle>Import CSV Data</DialogTitle>
        <DialogContent>
          <CsvImporter pageName={pageName} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportModal} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        {menuData.add && menuData.add.title && pageName !== 'reports' && pageName !== 'calls' && pageName !== 'leads' &&(
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
          {pageName !== 'leads' &&  menuData.import && menuData.import.title &&
            <MenuItem onClick={handleOpenImportModal}>{menuData.import.title}</MenuItem>
          }
          {menuData.export && menuData.export.title &&
            <MenuItem onClick={handleExportClick}>{menuData.export.title}</MenuItem>
          }
            {pageName === 'leads' && (
              <MenuItem onClick={handleEditClick}>Edit</MenuItem>
            )}
        </Menu>
        
        <div className="dropdown" style={{ margin: "8px", width: "250px" }}>
          <FormControl style={{ width: "250px" }}>
  <Select
    className="DropDown-select-option"
    style={{
      color: "white",
      background: "rgb(70, 70, 70)",
      width: "100%",
      padding: "5px 10px",
      borderRadius: "4px",
      border: "1px solid rgb(206, 212, 218)",
      cursor: "pointer",
    }}
    value={selectedValue}
    onChange={handleChange}
  >
    {selectOptions.map((option, index) => (
      <MenuItem
      className="grid_menu_option_list"
        key={index}
        value={JSON.stringify(option.filter)}
        style={{ display: "flex", justifyContent: "space-between" }}
        onClick={(e) => {
          handleFieldOption(index, option);
        }}
      >
        <div>{option.name}</div>

        <div className="grid_menu_btn">
        <div className="grid_menu_edit_btn"
          style={{ cursor: "pointer", color: "black", marginLeft: "10px" }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent dropdown from closing
            handleEditOption(index, option);
          }}
        >
          <EditNoteOutlinedIcon style={{height:'35px', width:'20px'}} />
        </div>
        <div className="grid_menu_delete_btn"
          style={{ cursor: "pointer", color: "black", marginLeft: "10px"}}
          onClick={(e) => {
            e.stopPropagation(); // Prevent dropdown from closing
            handleDeleteOption(index, option);
          }}
        >
          <DeleteIcon style={{height:'30px', width:'18px'}} />
        </div>
        </div>
        
      </MenuItem>
    ))}
    <MenuItem value="custom">Custom</MenuItem>
  </Select>
</FormControl>


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

              // Handle Enter key press for page validation
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
            rows={loading ? [] : filteredRows}
            columns={columnsWithFilter}
            paginationMode="server"
            disableSelectionOnClick
            getRowHeight={() => 35}
            className="custom-data-grid-main"
            onSortModelChange={handleSortModelChange}
            sortModel={sortModel}
            onRowDoubleClick={(params) => {
              
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