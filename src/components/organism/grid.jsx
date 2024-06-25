import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Box, Button, Container, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography, Paper } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import EditDialog from "../molecules/EditDialog";
import config from "../../config/config";
import { useNavigate } from "react-router-dom";

const Grid = ({ endpoint }) => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowToEdit, setRowToEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}${endpoint}`);
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
        setRows([...rows, ...response.data.data]);
      }
    } catch (error) {
      console.error("Error saving row:", error);
    }
    setRowToEdit(null);
  };

  const handleModalClose = () => {
    setRowToEdit(null);
  };

  const allKeys = Array.from(new Set(rows.flatMap(Object.keys)));

  return (
    <Container>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Data Grid
            </Typography>
            <Button variant="contained" onClick={handleAddNewRow}>
              Add New
            </Button>
          </Box>
        </Toolbar>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {allKeys.map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row._id}>
                  {allKeys.map((key) => (
                    <TableCell key={key}>{row[key] ?? "-"}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton onClick={() => handleEditRow(row)}>
                      <MoreVertIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRow(row._id)}>
                      <CloseIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {rowToEdit !== null && (
          <EditDialog
            row={rowToEdit}
            onSave={handleSaveRow}
            onClose={handleModalClose}
            allKeys={allKeys}
          />
        )}
      </Box>
    </Container>
  );
};

export default Grid;
