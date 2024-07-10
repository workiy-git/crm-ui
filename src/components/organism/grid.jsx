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
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/callsgrid.css';

const Grid = ({ endpoint, pageName }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [webformSchema, setWebformSchema] = useState([]);
  const [validatedData, setValidatedData] = useState([]);

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
  
        // Validate data against the schema
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

  return (
    <div className="CallsGrid">
      <Toolbar />
      <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <Button onClick={() => setModalOpen(true)}>Add New Call</Button>
      </Box>
      <Container style={{ marginTop: '50px' }}>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box component="form" sx={{ margin: '50px auto', padding: '20px', backgroundColor: 'white', maxWidth: '500px' }}>
            {errors && <Typography color="error">{errors}</Typography>}
            {/* Add fields for adding a new call */}
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Modal>
        <TableContainer component={Paper} style={{ borderRadius: '10px', border: '1px solid #808080', height: 'max-content' }}>
          <Table>
            <TableHead style={{ background: '#00000070', color: 'white' }}>
              <TableRow>
                {webformSchema.map((field) => (
                  <TableCell key={field.fieldName}>{field.label}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {validatedData.slice(startIndex, endIndex).map((row) => (
                <TableRow key={row._id}>
                  {webformSchema.map((field) => (
                    <TableCell key={`${row._id}-${field.fieldName}`}>
                      {typeof row[field.fieldName] === 'object' && row[field.fieldName] !== null
                        ? JSON.stringify(row[field.fieldName])
                        : row[field.fieldName]}
                    </TableCell>
                  ))}
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box style={{ display: 'flex', justifyContent: 'space-evenly', padding: '2%', margin: '20px 0', marginTop: '20px' }}>
          <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1} className="page-btn">
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
            <button key={pageNum} onClick={() => setPageNumber(pageNum)} className={`page-btn ${pageNumber === pageNum ? 'active' : ''}`}>
              {pageNum}
            </button>
          ))}
          <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === totalPages} className="page-btn">
            &gt;
          </button>
        </Box>
      </Container>
    </div>
  );
};

export default Grid;
