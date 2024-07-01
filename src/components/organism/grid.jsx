import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Box, Button, Container, IconButton, Menu, MenuItem, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography, Paper } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import CloseIcon from '@mui/icons-material/Close';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Dropdown from '../atoms/dropdown';
import ActionButton from '../atoms/actionbutton';
import Pagination from '../atoms/pagination';
import Callfilter from "../atoms/callfilter";
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';
import EditModal from '../molecules/edit';
import DownloadDoneRoundedIcon from '@mui/icons-material/DownloadDoneRounded';
import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import "../../assets/styles/callsgrid.css";

const Grid = ({ endpoint }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [showColumns, setShowColumns] = useState({});
  const [rowToEdit, setRowToEdit] = useState(null);
  const [formState, setFormState] = useState({});
  const [errors, setErrors] = useState("");
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

        const initialShowColumnsState = {};
        response.data.data.forEach(row => {
          Object.keys(row).forEach(key => {
            if (!initialShowColumnsState.hasOwnProperty(key) && key !== "_id") {
              initialShowColumnsState[key] = true;
            }
          });
        });
        setShowColumns(initialShowColumnsState);
        setRows(response.data.data);
        console.log("users",response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [endpoint]);

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
      if (rowToEdit === null) {
        const response = await axios.post(`${config.apiUrl}${endpoint}`, formState);
        setRows([...rows, response.data.userData]);
      } else {
        const updatedRow = { ...formState };
        await axios.put(`${config.apiUrl}${endpoint}${updatedRow._id}`, updatedRow);
        setRows(rows.map((currRow, idx) => {
          if (idx !== rowToEdit) return currRow;
          return updatedRow;
        }));
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving user data:', error);
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

  const handleDeleteRow = async (row) => {
    try {
      await axios.delete(`${config.apiUrl}${endpoint}/${row._id}`);
      setRows(rows.filter(r => r._id !== row._id));
      setPopupVisible(false);
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  };

  const handleClickOutside = (event) => {
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
    setFormState(selectedRow);
    setRowToEdit(rows.findIndex(r => r._id === selectedRow._id));
    setModalOpen(true);
    setPopupVisible(false);
  };

  const handleDetailsClick = () => {
    navigate(`/details/${selectedRow._id}`);
    setPopupVisible(false);
  };

  return (
    <div className="CallsGrid" style={{ margin: '-160px 0px 10px 0px' }}>
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
            className={`letter ${selectedLetter === letter ? "selectedLetter" : ""}`}
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
          <div style={{ width:'95%', display:'flex', justifyContent:'center' }}>
            <div style={{position:'absolute', top:'10%', background: 'white', borderRadius: '10px', boxShadow: '0px 0px 11px black', zIndex:10, width:'40rem' }}>
              <div style={{ borderBottom:'2px solid #808080', fontSize:'20px', fontWeight:'bold', borderTopLeftRadius:'10px', borderTopRightRadius:'10px', padding:'3% 5%', display: 'flex', justifyContent: 'space-between' }}>
                <span>Configure Columns - Calls</span>
                <button onClick={toggleCheckboxes} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <CloseIcon />
                </button>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ height: 'auto', width: '55%', position: 'relative', display: 'flex', flexDirection: 'column', padding: '15px 25px' }}>
                  <div style={{ fontWeight: 'bold', padding: '10px', marginBottom: '10px', color:'#21252980' }}>
                    Select Fields
                  </div>
                  <div className="scroll-bar" style={{ display: 'flex', flexDirection: 'column', height: '250px', overflow: 'auto' }}>
                    {Object.entries(showColumns).map(([key, value]) => (
                      key !== '_id' && value && (
                        <label style={{ background:'#00AEF8', padding:'5px 10px', fontWeight:'500', marginBottom:'2px', marginRight:'5%', color: 'white', position: 'relative' }} id="selected_checkbox" key={key}>
                          <input
                            style={{ display:'none' }}
                            type="checkbox"
                            checked={value}
                            onChange={() => handleCheckboxChange(key)}
                          />
                          {key.replace(/_/g, ' ')}
                            <CloseRoundedIcon
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: '5px',
                                transform: 'translateY(-50%)',
                              }}
                            />
                        </label>
                      )
                    ))}
                  </div>
                </div>
                <div style={{ height: 'auto', width: '45%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '15px 25px' }}>
                  <div style={{ fontWeight: 'bold', padding: '10px', marginBottom: '10px', color:'#21252980' }}>
                    Available Fields
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: '10px', height:'30px' }}
                  />
                  <div className="scroll-bar" style={{ display: 'flex', flexDirection: 'column', height: '250px', overflow: 'auto' }}>
                    {Object.entries(showColumns).filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase())).map(([key, value]) => (
                      key !== '_id' && !value && (
                        <label style={{marginBottom:'1px', marginRight:'5%', color:selectedFields.includes(key) ?'white' :'#21252980', padding: selectedFields.includes(key) ?'7px' : '3px', fontWeight:'500', backgroundColor: selectedFields.includes(key) ? '#12E5E5' : 'white', position: 'relative' }} id="available_checkbox" key={key}>
                          <input
                            style={{ display:'none' }}
                            type="checkbox"
                            checked={selectedFields.includes(key)}
                            onChange={() => {
                              const updatedSelectedFields = [...selectedFields];
                              const fieldIndex = updatedSelectedFields.indexOf(key);
                              if (fieldIndex === -1) {
                                updatedSelectedFields.push(key);
                              } else {
                                updatedSelectedFields.splice(fieldIndex, 1);
                              }
                              setSelectedFields(updatedSelectedFields);
                            }}
                          />
                          {key.replace(/_/g, ' ')}
                          {selectedFields.includes(key) && (
                            <AddTaskRoundedIcon
                              style={{
                                position: 'absolute',
                                top: '50%',
                                right: '15px',
                                transform: 'translateY(-50%)',
                                color:'white'
                              }}
                            />
                          )}
                        </label>
                      )
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 25px', borderTop: '2px solid #808080', marginTop: '10px' }}>
                <div>
                  <button style={{ margin:'10px', color:'white', background:'#3E3E42', borderRadius:'5px', padding:'5px 15px', border:'none', boxShadow:'0px 0px 5px gray'  }} onClick={handleSelectAll}>Select All</button>
                  <button style={{ margin:'10px', color:'black', background:'#FFFFF', borderRadius:'5px', padding:'5px 15px', border:'none', boxShadow:'0px 0px 5px gray' }} onClick={handleDeselectAll}>Deselect All</button>
                </div>
                <div>
                  <button style={{ margin:'10px', color:'white', background:'#12E5E5', borderRadius:'100px', padding:'5px 15px', border:'none', boxShadow:'0px 0px 5px gray', display:'flex', alignItems:'center' }} onClick={handleApply}>Save  <DownloadDoneRoundedIcon style={{height:'20px', width:'auto', marginLeft:'10px'}} /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      <TableContainer className="table-wrapper" component={Paper}>
        <Table className="table" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              {Object.entries(showColumns).map(([key, value]) => (
                value && (
                  <TableCell key={key}>
                    {key.replace(/_/g, ' ')}
                  </TableCell>
                )
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(startIndex, endIndex).map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <IconButton onClick={(e) => handleIconClick(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
                {Object.entries(showColumns).map(([key, value]) => (
                  value && (
                    <TableCell key={key}>
                      {row[key]}
                    </TableCell>
                  )
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {popupVisible && (
        <Paper
          ref={popupRef}
          sx={{
            position: 'absolute',
            top: popupPosition.top,
            left: popupPosition.left,
            p: 2,
            zIndex: 1,
            boxShadow: 3,
            borderRadius: 2
          }}
        >
          <MenuItem onClick={handleDetailsClick}>Details</MenuItem>
          <MenuItem onClick={handleEditClick}>Edit</MenuItem>
          <MenuItem onClick={() => handleDeleteRow(selectedRow)}>Delete</MenuItem>
        </Paper>
      )}
      {/* <EditModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        row={formState}
        handleSave={handleSave}
        handleChange={handleChange}
      /> */}
    </div>
  );
};

export default Grid;