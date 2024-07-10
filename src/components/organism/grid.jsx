import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/callsgrid.css';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import Dropdown from '../atoms/dropdown';
import ActionButton from '../atoms/actionbutton';
import Pagination from '../atoms/pagination';
import Callfilter from '../atoms/callfilter';

const Grid = ({ endpoint, pageName }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(15);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [webformSchema, setWebformSchema] = useState([]);
  const [validatedData, setValidatedData] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appdataResponse = await axios.get(`${config.apiUrl.replace(/\/$/, '')}${endpoint}`);
        const webformResponse = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`);

        const appdata = appdataResponse.data.data.filter(data => data.pageName === pageName);
        const webform = webformResponse.data.data;

        console.log('Fetched appdata:', appdata);
        console.log('Fetched webform:', webform);

        setRows(appdata);
        const schemaForPage = webform.find((page) => page.pageName === pageName);
        setWebformSchema(schemaForPage?.fields || []);

        const validated = appdata.map((data) => {
          const validatedData = {};
          schemaForPage?.fields.forEach((field) => {
            if (data[field.fieldName] !== undefined) {
              validatedData[field.fieldName] = data[field.fieldName];
            } else {
              validatedData[field.fieldName] = ''; // Default value if field is missing
            }
          });
          return { ...data, ...validatedData }; // Merge original data with validatedData
        });

        setValidatedData(validated);

        // Initialize available columns
        const columns = schemaForPage?.fields.map(field => field.fieldName) || [];
        setAvailableColumns(columns);
        setVisibleColumns(columns);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors('Error fetching data');
      }
    };

    fetchData();
  }, [endpoint, pageName]);

  const handleMenuOpen = (event, row) => {
    setSelectedRow(row);
    setAnchorEl(event.currentTarget);
    console.log('Opened menu for row:', row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    console.log('Closed menu');
  };

  const handleEdit = () => {
    handleMenuClose();
    console.log('Editing row:', selectedRow);
    if (!selectedRow || !selectedRow._id) {
      console.error('Selected row or _id is not defined');
      return;
    }
    if (webformSchema.length === 0) {
      console.error('Webform schema is not available');
      return;
    }
    console.log('Navigating to edit page with ID:', selectedRow._id);
    navigate(`/edit/${selectedRow._id}`, { state: { rowData: selectedRow, schema: webformSchema } });
  };

  const handleDetails = () => {
    handleMenuClose();
    console.log('Viewing details for row:', selectedRow);
    // Add your code for handling details here
  };

  const handleDelete = async () => {
    handleMenuClose();
    console.log('Deleting row:', selectedRow);
    if (!selectedRow || !selectedRow._id) {
      console.error('Selected row or _id is not defined');
      return;
    }
    try {
      await axios.delete(`${config.apiUrl.replace(/\/$/, '')}/appdata/${selectedRow._id}`);
      setRows(rows.filter((row) => row._id !== selectedRow._id));
    } catch (error) {
      console.error('Error deleting data:', error);
      setErrors('Error deleting data');
    }
  };

  const totalPages = Math.ceil(rows.length / recordsPerPage);
  const startIndex = (pageNumber - 1) * recordsPerPage;
  const endIndex = Math.min(pageNumber * recordsPerPage, rows.length);

  const handleColumnToggle = (field) => {
    const updatedColumns = selectedColumns.includes(field)
      ? selectedColumns.filter((col) => col !== field)
      : [...selectedColumns, field];
    setSelectedColumns(updatedColumns);
  };

  const openColumnModal = () => {
    setSelectedColumns(visibleColumns);
    setShowColumnModal(true);
  };

  const closeColumnModal = () => {
    setShowColumnModal(false);
  };

  const applyColumnChanges = () => {
    setVisibleColumns(selectedColumns);
    setShowColumnModal(false);
  };

  const selectAllColumns = () => {
    setSelectedColumns(availableColumns);
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  

  return (
    <div className="CallsGrid">
      {/* <Toolbar /> */}
      <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'left' }}>
          <Box>
            <Button onClick={openColumnModal}>
              <WidgetsOutlinedIcon />
            </Button>
          </Box>
        </Box>
        <ActionButton />
        <Dropdown />
        {/* <Callfilter /> */}
        {/* <Pagination />*/}
        <div className="pagination-container">
      <Box className="pagination-box">
        <button
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="page-btn-arrow"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setPageNumber(pageNum)}
            className={`page-btn ${pageNumber === pageNum ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        ))}
        <button
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber === totalPages}
          className="page-btn-arrow"
        >
          &gt;
        </button>
      </Box>
    </div>
      </Box>
      <Box sx={{height: 'inherit', overflowY:'auto', overflowX:'hidden'}}>
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
              {errors && <Typography color="error">{errors}</Typography>}
              {/* Add fields for adding a new call */}
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </Box>
          </Modal>
          <Modal open={showColumnModal} onClose={closeColumnModal}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ marginBottom: '5px' }}>
                    Select Fields
                  </Typography>
                  <Box sx={{height:'20rem', overflow:'auto'}}>
                  {selectedColumns.map((field) => (
                    <Box key={field} sx={{ display: 'flex', alignItems: 'center', p:"0 20px", background:'skyblue', m:'10px' }}>
                      <Checkbox
                        checked={true}
                        onChange={() => handleColumnToggle(field)}
                        color="primary"
                        inputProps={{ 'aria-label': field }}
                      />
                      <Typography variant="body2">{field}</Typography>
                    </Box>
                  ))}
                </Box>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ marginBottom: '5px' }}>
                    Available Fields
                  </Typography>
                  <Box   sx={{height:'20rem', overflow:'auto'}}>
                  {availableColumns
                    .filter((field) => !selectedColumns.includes(field))
                    .map((field) => (
                      <Box key={field} sx={{ display: 'flex', alignItems: 'center', p:"0 20px", background:'skyblue', m:'10px' }} >
                        <Checkbox
                          checked={false}
                          onChange={() => handleColumnToggle(field)}
                          color="primary"
                          inputProps={{ 'aria-label': field }}
                        />
                        <Typography variant="body2">{field}</Typography>
                      </Box>
                    ))}
                </Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button onClick={selectAllColumns} variant="outlined" color="primary">
                  Select All
                </Button>
                <Button onClick={deselectAllColumns} variant="outlined" color="primary">
                  Deselect All
                </Button>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <Button onClick={applyColumnChanges} variant="contained" color="primary">
                  Apply
                </Button>
                <Button onClick={closeColumnModal} variant="outlined" color="secondary">
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
        <TableContainer
          component={Paper}
          style={{ borderRadius: '10px', border: '1px solid #808080', height: 'max-content' }}
        >
          <Table>
            <TableHead style={{ background: '#00000070', color: 'white' }}>
              <TableRow>
                <TableCell>Actions</TableCell>
                {webformSchema.map((field) => (
                  visibleColumns.includes(field.fieldName) && (
                    <TableCell key={field.fieldName}>{field.label}</TableCell>
                  )
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {validatedData.slice(startIndex, endIndex).map((row) => (
                <TableRow key={row._id}>
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuOpen(event, row)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                      <MenuItem onClick={handleEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleDetails}>Details</MenuItem>
                      <MenuItem onClick={handleDelete}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                  {webformSchema.map(
                    (field) =>
                      visibleColumns.includes(field.fieldName) && (
                        <TableCell sx={{p:0}} key={`${row._id}-${field.fieldName}`}>
                          {typeof row[field.fieldName] === 'object' && row[field.fieldName] !== null
                            ? JSON.stringify(row[field.fieldName])
                            : row[field.fieldName]}
                        </TableCell>
                      )
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Grid;