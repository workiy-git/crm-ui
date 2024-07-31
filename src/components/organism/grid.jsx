import React, { useState, useEffect, useRef } from 'react';
import InputBase from '@mui/material/InputBase';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Button, Modal, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import Text from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';
import config from '../../config/config';
import '../../assets/styles/callsgrid.css';
import ActionButton from '../atoms/actionbutton';
import Dropdown from '../atoms/dropdown';
import { useNavigate } from 'react-router-dom';
import Loader from '../molecules/loader';

const Grid = ({ rows, webformSchema, onFilterChange, pageName, loading }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [validatedData, setValidatedData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [tempVisibleColumns, setTempVisibleColumns] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});
  const [filter, setFilter] = useState({});
  const [dropdownValue, setDropdownValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const validated = rows.map((data) => {
      const validatedData = {};
      webformSchema.forEach((field) => {
        validatedData[field.fieldName] = data[field.fieldName] !== undefined ? data[field.fieldName] : ''; // Default value if field is missing
      });
      validatedData._id = data._id; // Ensure ObjectId is included for key
      return validatedData;
    });

    setValidatedData(validated);

    const columns = webformSchema.map(field => ({ fieldName: field.fieldName, label: field.label })) || [];
    setAvailableColumns(columns);
    setVisibleColumns(columns);
  }, [rows, webformSchema]);

  useEffect(() => {
    // Retrieve and apply the filter from localStorage
    const storedFilter = localStorage.getItem('widgetFilter');
    if (storedFilter) {
      // Remove unnecessary characters and parse the filter
      const cleanedFilterString = storedFilter.replace(/\\/g, '').replace(/^"|"$/g, '');
      let parsedFilter;
      try {
        parsedFilter = JSON.parse(cleanedFilterString);
        if (parsedFilter && parsedFilter.call_status) {
          const statusFilterValue = parsedFilter.call_status;
          console.log('statusFilterValue:', statusFilterValue);
          setDropdownValue(statusFilterValue); // Set the dropdown value
          const statusFilter = { call_status: statusFilterValue };
          setFilter(statusFilter); // Apply the filter to the grid
          handleFilterChange(statusFilter); // Call handleFilterChange directly
        }
      } catch (error) {
        console.error('Failed to parse the stored filter:', error);
      }
    }
  }, []);

  const totalPages = Math.ceil(rows.length / recordsPerPage);
  const startIndex = (pageNumber - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = validatedData
    .filter((row) =>
      Object.keys(filter).every(key => row[key] === filter[key])
    )
    .slice(startIndex, endIndex);

  const closeColumnModal = () => {
    setShowColumnModal(false);
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleDetails = () => {
    handleMenuClose();
    navigate(`/details/${currentRow._id}`, { state: { rowData: currentRow, schema: webformSchema, pageName } });
  };

  const handleDelete = async () => {
    handleMenuClose();
    const apiUrl = `${config.apiUrl.replace(/\/$/, '')}/appdata/${currentRow._id}`;
    try {
      const response = await axios.delete(apiUrl);
      if (response.status === 200) {
        alert('Data deleted successfully');
        setValidatedData(validatedData.filter(item => item._id !== currentRow._id));
      } else {
        alert('Error deleting data: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      alert('Error deleting data');
    }
  };

  const handleFilterChange = (filterCondition) => {
    onFilterChange(filterCondition);
    setFilter(filterCondition); // Apply the filter to the grid
  };

  const handleApplyColumns = () => {
    setVisibleColumns(tempVisibleColumns);
    closeColumnModal();
  };

  const handleSelectAll = () => {
    setTempVisibleColumns(availableColumns);
  };

  const handleDeselectAll = () => {
    setTempVisibleColumns([]);
  };

  const handleSearchChange = (columnName, value) => {
    setSearchTerms(prevSearchTerms => ({
      ...prevSearchTerms,
      [columnName]: value.toLowerCase() // Store lowercase for case-insensitive search
    }));
  };

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setDropdownValue(value);
    const statusFilter = { call_status: value };
    setFilter(statusFilter);
    handleFilterChange(statusFilter);
  };

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      onFilterChange(filter);
    }
  }, [filter]);

  const renderPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPageNumber(i)}
            className={`page-btn ${pageNumber === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          onClick={() => setPageNumber(1)}
          className={`page-btn ${pageNumber === 1 ? 'active' : ''}`}
        >
          1
        </button>
      );

      if (pageNumber > 3) {
        pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
      }

      const startPage = Math.max(2, pageNumber - 1);
      const endPage = Math.min(totalPages - 1, pageNumber + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setPageNumber(i)}
            className={`page-btn ${pageNumber === i ? 'active' : ''}`}
          >
            {i}
          </button>
        );
      }

      if (pageNumber < totalPages - 2) {
        pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => setPageNumber(totalPages)}
          className={`page-btn ${pageNumber === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }
    return pages;
  };

  const wrapper1Ref = useRef(null);
  const wrapper2Ref = useRef(null);

  useEffect(() => {
    const handleScroll = (source, target) => {
      target.scrollLeft = source.scrollLeft;
    };

    const wrapper1 = wrapper1Ref.current;
    const wrapper2 = wrapper2Ref.current;

    if (wrapper1 && wrapper2) {
      const handleWrapper1Scroll = () => handleScroll(wrapper1, wrapper2);
      const handleWrapper2Scroll = () => handleScroll(wrapper2, wrapper1);

      wrapper1.addEventListener('scroll', handleWrapper1Scroll);
      wrapper2.addEventListener('scroll', handleWrapper2Scroll);

      return () => {
        wrapper1.removeEventListener('scroll', handleWrapper1Scroll);
        wrapper2.removeEventListener('scroll', handleWrapper2Scroll);
      };
    }
  }, []);

  useEffect(() => {
    // Retrieve and apply the filter from localStorage
    const storedFilter = localStorage.getItem('widgetFilter');
    if (storedFilter) {
      // Remove unnecessary characters and parse the filter
      const cleanedFilterString = storedFilter.replace(/\\/g, '').replace(/^"|"$/g, '');
      let parsedFilter;
      try {
        parsedFilter = JSON.parse(cleanedFilterString);
  
        if (parsedFilter) {
          // Find the key and value from the parsedFilter
          const filterKey = Object.keys(parsedFilter)[0];
          const filterValue = parsedFilter[filterKey];
  
          // Log the key and value for debugging
          console.log('Filter Key:', filterKey);
          console.log('Filter Value:', filterValue);
  
          // Only update state if the value has changed
          if (filterValue !== dropdownValue) {
            setDropdownValue(filterValue); // Set the dropdown value
          }
  
          const statusFilter = { [filterKey]: filterValue };
  
          // Only apply filter if it has changed
          if (JSON.stringify(statusFilter) !== JSON.stringify(filter)) {
            setFilter(statusFilter); // Apply the filter to the grid
            handleFilterChange(statusFilter); // Call handleFilterChange with the statusFilter
          }
        }
      } catch (error) {
        console.error('Failed to parse the stored filter:', error);
      }
    }
  }, [dropdownValue, filter, handleFilterChange]);

  useEffect(() => {
    if (Object.keys(filter).length > 0) {
      onFilterChange(filter);
    }
  }, [filter]);

  return (
    <div className="CallsGrid">
      <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <ActionButton />
        <Button sx={{ color: 'black' }} onClick={() => setShowColumnModal(true)}>
          Columns <KeyboardArrowDownIcon />
        </Button>
        <Dropdown pageName={pageName} onOptionSelected={handleFilterChange} value={dropdownValue} onChange={handleDropdownChange} />
        <div className="pagination-container">
          <div className='tatoal-pageination-div'>
            <Text style={{ marginRight: '20px' }}>
              <span>Showing : </span>
              <span className='pagination-current-page'>{startIndex + 1} - {Math.min(endIndex, rows.length)}</span>
              <span> of </span>
              <span className='pagination-current-page'>{rows.length}</span>
            </Text>
          </div>
          <Box className="pagination-box">
            <button
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber === 1}
              className="page-btn-arrow"
            >
              &lt;&lt; Previous
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={pageNumber === totalPages}
              className="page-btn-arrow"
            >
              Next &gt;&gt;
            </button>
          </Box>
        </div>
      </Box>

      <Box sx={{ height: 'inherit', overflowY: 'auto', overflowX: 'hidden' }}>
        <div className="wrapper1" ref={wrapper1Ref}>
          <div className="div1"></div>
        </div>
        <TableContainer style={{ border: '1px solid #808080', height: 'max-content' }}>
          <div className="wrapper2" ref={wrapper2Ref}>
            {loading ? (
              <Loader />
            ) : (
              <Table>
                <TableHead className='table-head' style={{ background: '#D9D9D9', border: '1px solid #D9D9D9' }}>
                  <TableRow>
                    {visibleColumns.map(column => (
                      <TableCell key={column.fieldName}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span>{column.label}</span>
                          <InputBase
                            value={searchTerms[column.fieldName] || ''}
                            onChange={(event) => handleSearchChange(column.fieldName, event.target.value)}
                            placeholder={`Search ${column.label}`}
                            inputProps={{ 'aria-label': `Search ${column.label}` }}
                            sx={{
                              width: '100%',
                              padding: '6px 10px',
                              fontSize: '0.8rem',
                              border: 'none',
                              outline: 'none',
                              '&::placeholder': { color: 'rgba(0, 0, 0, 0.6)' },
                              '& .MuiInputBase-input': { padding: 0 },
                            }}
                          />
                        </div>
                      </TableCell>
                    ))}
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((row) => (
                    <TableRow key={row._id}>
                    {visibleColumns.map(column => (
                      <TableCell key={column.fieldName}>
                        {row[column.fieldName] !== undefined && row[column.fieldName] !== null
                          ? row[column.fieldName].toString() // Ensure it's a valid React node
                          : ''}
                      </TableCell>
                    ))}
                    <TableCell>
                      <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleMenuOpen(event, row)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleDetails}>Details</MenuItem>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TableContainer>
      </Box>

      <Modal open={showColumnModal} onClose={closeColumnModal}>
        <Box className="modal-style">
          <Typography variant="h6">Column Chooser</Typography>
          <Box>
            <Button onClick={handleSelectAll}>Select All</Button>
            <Button onClick={handleDeselectAll}>Deselect All</Button>
          </Box>
          <Box>
            {availableColumns.map(column => (
              <label key={column.fieldName}>
                <input
                  type="checkbox"
                  checked={tempVisibleColumns.includes(column)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setTempVisibleColumns([...tempVisibleColumns, column]);
                    } else {
                      setTempVisibleColumns(tempVisibleColumns.filter(col => col !== column));
                    }
                  }}
                />
                {column.label}
              </label>
            ))}
          </Box>
          <Box>
            <Button onClick={handleApplyColumns}>Apply</Button>
            <Button onClick={closeColumnModal}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Grid;