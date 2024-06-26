import React, { useState, useEffect } from "react";
import axios from 'axios';
import {
  Box, Button, Container, IconButton, Menu, MenuItem, Modal, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Typography, Paper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditDialog from '../molecules/edit'; // Import the new EditDialog component
import config from '../../config/config';
import { useNavigate } from 'react-router-dom';

const Grid = ({ endpoint }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [showColumns, setShowColumns] = useState({});
  const [rowToEdit, setRowToEdit] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}${endpoint}`);
        const initialShowColumnsState = {};
        response.data.data.forEach((row) => {
          Object.keys(row).forEach((key) => {
            initialShowColumnsState[key] = true;
          });
        });
        setShowColumns(initialShowColumnsState);
        setRows(response.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [endpoint]);

  const handleEditRow = (row) => {
    setRowToEdit(row);
  };

  const handleDeleteRow = async (id) => {
    try {
      await axios.delete(`${config.apiUrl}${endpoint}/${id}`);
      setRows(rows.filter((row) => row._id !== id));
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  const handleAddNewRow = () => {
    setRowToEdit({});
  };

  const handleSaveRow = async (editedRow) => {
    try {
      const { _id, ...updateData } = editedRow;
      if (_id) {
        const response = await axios.put(`${config.apiUrl}${endpoint}/${_id}`, updateData);
        setRows(rows.map((row) => (row._id === _id ? response.data.data : row)));
      } else {
        const response = await axios.post(`${config.apiUrl}${endpoint}`, editedRow);
        setRows([...rows, response.data.data]);
      }
    } catch (error) {
      console.error("Error saving row:", error);
    }
    setRowToEdit(null);
  };

  const handleModalClose = () => {
    setRowToEdit(null);
  };

  const handleMenuOpen = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedRowId(rowId);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedRowId(null);
  };

  const handleMenuEdit = () => {
    const row = rows.find((r) => r._id === selectedRowId);
    handleEditRow(row);
    handleMenuClose();
  };

  const handleMenuDelete = () => {
    handleDeleteRow(selectedRowId);
    handleMenuClose();
  };

  const handleMenuDetails = () => {
    navigate(`/summary`);
    handleMenuClose();
  };

  return (
    <Container style={{maxWidth:'fit-content', borderRadius:'10px',maxHeight:'fit-content'}}>
      <Box sx={{ width: '100%', overflowX: 'auto' , maxWidth:'fit-content'}}>
        <TableContainer component={Paper} sx={{maxHeight:'fit-content',overflowY: 'auto' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead style={{backgroundColor:'#ff3f14'}}>
              <TableRow style={{background:'#ffffff'}} >
                <TableCell style={{backgroundColor:'#ff3f14', fontWeight:'bold', color:'#ffffff'}}>Actions</TableCell> 
                {Object.keys(showColumns).map((column) => (
                  showColumns[column] && <TableCell key={column} style={{backgroundColor:'#ff3f14', fontWeight:'bold', color:'#ffffff' }}>{column}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow 
                  key={row._id} 
                  sx={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : 'lightgray',
                    '&:hover': {
                      backgroundColor: '#d0efff',
                    } // Adjust height as per your requirement
                  }}
                >
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuOpen(event, row._id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor && selectedRowId === row._id)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuEdit}>Edit</MenuItem>
                      <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
                      <MenuItem onClick={handleMenuDetails}>Details</MenuItem>
                    </Menu>
                  </TableCell >
                  {Object.entries(row).map(([key, value]) =>
                    showColumns[key] && <TableCell key={key} style={{lineHeight:'1.00', fontSize:'12px', boarder:'2px solid #000000'}}>{value}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {rowToEdit && (
          <EditDialog
            row={rowToEdit}
            onSave={handleSaveRow}
            onClose={handleModalClose}
          />
        )}
      </Box>
    </Container>
  );
};

export default Grid;