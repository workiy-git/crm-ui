import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { Box, Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Dropdown from '../atoms/dropdown';
import ActionButton from '../atoms/actionbutton';
import Pagination from '../atoms/pagination';
import Callfilter from "../atoms/callfilter";
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';

const Grid = ({ endpoint }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [showColumns, setShowColumns] = useState({});
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
            if (!initialShowColumnsState.hasOwnProperty(key) && key !== "key") {
              initialShowColumnsState[key] = true;
            }
          });
        });
        setShowColumns(initialShowColumnsState);
        setRows(response.data.data);
        console.log("users", response.data.data);
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

  const totalPages = Math.ceil(rows.length / recordsPerPage);
  const startIndex = (pageNumber - 1) * recordsPerPage;
  const endIndex = Math.min(pageNumber * recordsPerPage, rows.length);

  const handleSelectAll = () => {
    const allFields = Object.keys(showColumns).filter(key => key !== 'key');
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
      await axios.delete(`${config.apiUrl}${endpoint}/${row.key}`);
      setRows(rows.filter(r => r.key !== row.key));
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
    navigate(`/edit/${selectedRow.key}`);
    setPopupVisible(false);
  };

  const handleDetailsClick = () => {
    navigate(`/details/${selectedRow.key}`);
    setPopupVisible(false);
  };

  return (
    <div style={{ margin: '-140px 10px 10px 10px' }}>
      <Toolbar />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <ActionButton />
        <Dropdown />
        <Callfilter />
        <Pagination />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={toggleCheckboxes}>
          <WidgetsOutlinedIcon />
        </IconButton>
        {alphabet.map(letter => (
          <Typography
            key={letter}
            sx={{
              padding: '5px',
              cursor: 'pointer',
              fontWeight: selectedLetter === letter ? 'bold' : 'normal'
            }}
            onClick={() => setSelectedLetter(letter)}
          >
            {letter}
          </Typography>
        ))}
      </Box>
      {showCheckboxes && (
        <div style={{ width: '95%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '10%', background: 'white', borderRadius: '10px', boxShadow: '0px 0px 11px black', zIndex: 10, width: '40rem' }}>
            <div style={{ borderBottom: '2px solid #808080', fontSize: '20px', fontWeight: 'bold', borderTopLeftRadius: '10px', borderTopRightRadius: '10px', padding: '3% 5%', display: 'flex', justifyContent: 'space-between' }}>
              <span>Configure Columns - Calls</span>
              <button onClick={toggleCheckboxes} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <CloseIcon />
              </button>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ height: 'auto', width: '55%', position: 'relative', display: 'flex', flexDirection: 'column', padding: '15px 25px' }}>
                <div style={{ fontWeight: 'bold', padding: '10px', marginBottom: '10px', color: '#21252980' }}>
                  Select Fields
                </div>
                <div className="scroll-bar" style={{ display: 'flex', flexDirection: 'column', height: '250px', overflow: 'auto' }}>
                  {Object.entries(showColumns).map(([key, value]) => (
                    key !== 'key' && value && (
                      <label style={{ background: '#00AEF8', padding: '5px 10px', fontWeight: '500', marginBottom: '2px', marginRight: '5%', color: 'white', position: 'relative' }} id="selected_checkbox" key={key}>
                        <input
                          style={{ display: 'none' }}
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
                <div style={{ fontWeight: 'bold', padding: '10px', marginBottom: '10px', color: '#21252980' }}>
                  Available Fields
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginBottom: '10px', height: '30px' }}
                />
                <div className="scroll-bar" style={{ display: 'flex', flexDirection: 'column', height: '250px', overflow: 'auto' }}>
                  {Object.entries(showColumns).map(([key, value]) => (
                    key !== 'key' && !value && key.toLowerCase().includes(searchQuery.toLowerCase()) && (
                      <label style={{ background: '#ddd', padding: '5px 10px', fontWeight: '500', marginBottom: '2px', marginRight: '5%' }} key={key}>
                        <input
                          style={{ marginRight: '10px' }}
                          type="checkbox"
                          checked={selectedFields.includes(key)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFields([...selectedFields, key]);
                            } else {
                              setSelectedFields(selectedFields.filter(field => field !== key));
                            }
                          }}
                        />
                        {key.replace(/_/g, ' ')}
                      </label>
                    )
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '3%', margin: '10px 0', borderTop: '1px solid #ddd' }}>
              <button
                style={{ color: '#888', marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  handleDeselectAll();
                  setSelectedFields([]);
                }}
              >
                Clear
              </button>
              <button
                style={{ color: '#00AEF8', marginRight: '10px', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={handleSelectAll}
              >
                Select All
              </button>
              <button
                style={{ color: '#fff', background: '#00AEF8', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', border: 'none' }}
                onClick={handleApply}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      <TableContainer component={Paper} style={{ height: '400px', overflow: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" />
              {Object.entries(showColumns).map(
                ([key, value]) =>
                  key !== 'key' &&
                  value && <TableCell key={key}>{key.replace(/_/g, ' ')}</TableCell>
              )}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(startIndex, endIndex).map((row) => (
              <TableRow key={row.key}>
                <TableCell padding="checkbox" />
                {Object.entries(showColumns).map(
                  ([key, value]) =>
                    key !== 'key' &&
                    value && <TableCell key={key}>{row[key]}</TableCell>
                )}
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
        <div
          ref={popupRef}
          style={{
            position: 'absolute',
            top: popupPosition.top,
            left: popupPosition.left,
            backgroundColor: 'white',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
            padding: '10px',
            zIndex: 1000,
            borderRadius: '8px',
          }}
        >
          <Button onClick={handleEditClick}>Edit</Button>
          <Button onClick={handleDetailsClick}>View Details</Button>
          <Button onClick={() => handleDeleteRow(selectedRow)}>Delete</Button>
        </div>
      )}
    </div>
  );
};

export default Grid;
