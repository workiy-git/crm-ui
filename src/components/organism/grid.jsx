import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Modal, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import '../../assets/styles/callsgrid.css';
import ActionButton from '../atoms/actionbutton';
import Pagination from '../atoms/pagination';
import Dropdown from '../atoms/dropdown';
import axios from 'axios';
import config from '../../config/config';

const Grid = ({ rows, webformSchema, onFilterChange, pageName }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [validatedData, setValidatedData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
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

  const startIndex = (pageNumber - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = validatedData.slice(startIndex, endIndex);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/edit/${currentRow._id}`, { state: { rowData: currentRow, schema: webformSchema, pageName } });
  };
  

  const handleDetails = () => {
    handleMenuClose();
    navigate(`/details/${currentRow._id}`, { state: { rowData: currentRow } });
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
  };

  return (
    <div className="CallsGrid">
      <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'left' }}>
          <Box>
            <Button onClick={() => setShowColumnModal(true)}>
              <WidgetsOutlinedIcon />
            </Button>
          </Box>
        </Box>
        <ActionButton />
        <Dropdown pageName={pageName} onOptionSelected={handleFilterChange} /> {/* Use Dropdown component */}
        <div className="pagination-container">
          <Box className="pagination-box">
            <button
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber === 1}
              className="page-btn-arrow"
            >
              &lt;&lt; Previous
            </button>
            <button
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={pageNumber === Math.ceil(validatedData.length / recordsPerPage)}
              className="page-btn-arrow"
            >
              Next &gt;&gt;
            </button>
          </Box>
        </div>
      </Box>
      <Box sx={{ height: 'inherit', overflowY: 'auto', overflowX: 'hidden' }}>
        <Box>
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <Box
              component="form"
              sx={{
                margin: '50px auto',
                padding: '20px',
                backgroundColor: 'white',
                maxWidth: '500px',
              }}
            >
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </Modal>
          <Modal open={showColumnModal} onClose={() => setShowColumnModal(false)}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                height: 'auto',
              }}
            >
              <Typography variant="h6" gutterBottom>
                Configure Columns - Calls
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {availableColumns.map((column) => (
                  <Box key={column.fieldName} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.some((vc) => vc.fieldName === column.fieldName)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setVisibleColumns([...visibleColumns, column]);
                        } else {
                          setVisibleColumns(visibleColumns.filter((vc) => vc.fieldName !== column.fieldName));
                        }
                      }}
                    />
                    <Typography sx={{ marginLeft: '8px' }}>{column.label}</Typography>
                  </Box>
                ))}
              </Box>
              <Button onClick={() => setShowColumnModal(false)}>Close</Button>
            </Box>
          </Modal>
          <table className="GridTable">
            <thead>
              <tr>
                {visibleColumns.map((field) => (
                  <th key={field.fieldName}>{field.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row) => (
                <tr key={row._id}>
                  {visibleColumns.map((field) => (
                    <td key={field.fieldName}>{row[field.fieldName]}</td>
                  ))}
                  <td>
                    <IconButton onClick={(event) => handleMenuOpen(event, row)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleDetails}>Details</MenuItem>
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Box>
    </div>
  );
};

export default Grid;