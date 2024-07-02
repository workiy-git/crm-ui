import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
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
  Paper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DownloadDoneRoundedIcon from '@mui/icons-material/DownloadDoneRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import Dropdown from '../atoms/dropdown';
import ActionButton from '../atoms/actionbutton';
import Pagination from '../atoms/pagination';
import Callfilter from '../atoms/callfilter';
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/callsgrid.css';

const Grid = ({ endpoint }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [showColumns, setShowColumns] = useState({});
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState('');
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const popupRef = useRef(null);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}${endpoint}`);
      if (response.data && response.data.data && Array.isArray(response.data.data)) {  // Check if response.data.data is an array
        const initialShowColumnsState = {};
        response.data.data.forEach(row => {
          Object.keys(row).forEach(key => {
            if (!initialShowColumnsState.hasOwnProperty(key) && key !== '_id') {
              initialShowColumnsState[key] = true;
            }
          });
        });
        setShowColumns(initialShowColumnsState);
        setRows(response.data.data); // Set rows to response.data.data
        console.log('Fetched data:', response.data.data); // Log fetched data
      } else {
        console.error('Invalid data format received:', response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchData();
}, [endpoint]);

  

  useEffect(() => {
    console.log('Rows state:', rows); // Log rows state
  }, [rows]);

  const toggleCheckboxes = () => {
    setShowCheckboxes(!showCheckboxes);
  };

  const handleCheckboxChange = columnName => {
    setShowColumns({ ...showColumns, [columnName]: !showColumns[columnName] });
  };

  const handleChange = e => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    try {
      const updatedRow = { ...formState };
      await axios.put(`${config.apiUrl}${endpoint}/${updatedRow._id}`, updatedRow);
      setRows(rows.map(row => (row._id === updatedRow._id ? updatedRow : row)));
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving data:', error);
      setErrors('Error saving data');
    }
  };

  const totalPages = Math.ceil(rows.length / recordsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
  const startIndex = (pageNumber - 1) * recordsPerPage;
  const endIndex = Math.min(pageNumber * recordsPerPage, rows.length);

  const handleSelectAll = () => {
    const allFields = Object.keys(showColumns).filter(key => key !== '_id');
    setSelectedFields(allFields);
  };

  const handleDeselectAll = () => {
    setSelectedFields([]);
  };

  const handleApply = () => {
    const updatedShowColumns = { ...showColumns };
    selectedFields.forEach(field => {
      updatedShowColumns[field] = true;
    });
    setShowColumns(updatedShowColumns);
    setSelectedFields([]);
    toggleCheckboxes();
  };

  const handleDeleteRow = async row => {
    try {
      await axios.delete(`${config.apiUrl}${endpoint}/${row._id}`);
      setRows(rows.filter(r => r._id !== row._id));
      setPopupVisible(false);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleClickOutside = event => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setPopupVisible(false);
    }
  };

  useEffect(() => {
    if (popupVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popupVisible]);

  const handleIconClick = (event, row) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPopupPosition({ top: rect.bottom, left: rect.left });
    setSelectedRow(row);
    setPopupVisible(true);
  };

  const handleEditClick = () => {
    navigate(`/edit/${selectedRow._id}`, { state: { rowData: selectedRow } });
    setPopupVisible(false);
  };

  const handleDetailsClick = () => {
    navigate(`/details/${selectedRow._id}`);
    setPopupVisible(false);
  };

  return (
    <div className="CallsGrid">
      <Toolbar />
      <Box className="Appbar" sx={{ display: 'flex', justifyContent: 'space-around' }}>
        <ActionButton />
        <Dropdown />
        <Callfilter />
        <Pagination />
      </Box>
      <Box className="navbar" sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
        <IconButton className="icon-button" onClick={toggleCheckboxes}>
          <WidgetsOutlinedIcon />
        </IconButton>
        {alphabet.map(letter => (
          <Typography
            key={letter}
            className={`letter ${selectedLetter === letter ? 'selectedLetter' : ''}`}
            sx={{
              padding: '5px',
              cursor: 'pointer',
              fontWeight: selectedLetter === letter ? 'bold' : 'normal',
              border: '1px solid black'
            }}
            onClick={() => setSelectedLetter(letter)}
          >
            {letter}
          </Typography>
        ))}
      </Box>
      {showCheckboxes && (
        <div className="checkboxes">
          <div className="configure-columns">
            <span className="configure-columns-title">Configure Columns - Calls</span>
            <button className="close-btn" onClick={toggleCheckboxes}>
              <CloseIcon />
            </button>
            <div className="columns-wrapper">
              <div className="select-fields">
                <div className="select-fields-title">Select Fields</div>
                <div className="fields-list">
                  {Object.entries(showColumns).map(([key, value]) => (
                    key !== '_id' && !value && (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleCheckboxChange(key)}
                        />
                        {key}
                      </label>
                    )
                  ))}
                </div>
                <div className="select-buttons">
                  <button onClick={handleSelectAll}>Select All</button>
                  <button onClick={handleDeselectAll}>Deselect All</button>
                </div>
              </div>
              <div className="selected-fields">
                <div className="selected-fields-title">Selected Fields</div>
                <div className="fields-list">
                  {Object.entries(showColumns).map(([key, value]) => (
                    key !== '_id' && value && (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => handleCheckboxChange(key)}
                        />
                        {key}
                      </label>
                    )
                  ))}
                </div>
              </div>
            </div>
            <div className="buttons">
              <button onClick={toggleCheckboxes}>Cancel</button>
              <button onClick={handleApply}>Apply</button>
            </div>
          </div>
        </div>
      )}
      <Container style={{ marginTop: '50px' }}>
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box component="form" onSubmit={handleSave} sx={{ margin: '50px auto', padding: '20px', backgroundColor: 'white', maxWidth: '500px' }}>
            {errors && <Typography color="error">{errors}</Typography>}
            {Object.keys(showColumns).map(columnName => (
              showColumns[columnName] && (
                <TextField
                  key={columnName}
                  label={columnName}
                  name={columnName}
                  value={formState[columnName] || ''}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />
              )
            ))}
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </Modal>
        <TableContainer component={Paper} style={{ borderRadius: '10px', border: '1px solid #808080', height: 'max-content' }}>
          <Table>
            <TableHead style={{ background: '#00000070', color: 'white' }}>
              <TableRow>
                {Object.keys(showColumns).map(columnName => (
                  showColumns[columnName] && <TableCell key={columnName}>{columnName}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(startIndex, endIndex).map(row => (
                <TableRow key={row._id}>
                  {Object.keys(showColumns).map(columnName => (
                    showColumns[columnName] && <TableCell key={columnName}>{row[columnName]}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={(event) => handleIconClick(event, row)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {popupVisible && (
          <div ref={popupRef} style={{ position: 'absolute', top: popupPosition.top, left: popupPosition.left, background: 'white', padding: '10px', border: '1px solid black', borderRadius: '5px' }}>
            <MenuItem onClick={handleEditClick}>
              <AddTaskRoundedIcon /> Edit
            </MenuItem>
            <MenuItem onClick={handleDetailsClick}>
              <DownloadDoneRoundedIcon /> Details
            </MenuItem>
            <MenuItem onClick={() => handleDeleteRow(selectedRow)}>
              <CloseRoundedIcon /> Delete
            </MenuItem>
          </div>
        )}
      </Container>
      <Box style={{ display: 'flex', justifyContent: 'space-evenly', padding: '2%', margin: '20px 0', marginTop: '20px' }}>
        <button onClick={() => setPageNumber(pageNumber - 1)} disabled={pageNumber === 1} className="page-btn">
          &lt;
        </button>
        {pageNumbers.map(pageNum => (
          <button key={pageNum} onClick={() => setPageNumber(pageNum)} className={`page-btn ${pageNumber === pageNum ? 'active' : ''}`}>
            {pageNum}
          </button>
        ))}
        <button onClick={() => setPageNumber(pageNumber + 1)} disabled={pageNumber === totalPages} className="page-btn">
          &gt;
        </button>
      </Box>
    </div>
  );
};

export default Grid;
