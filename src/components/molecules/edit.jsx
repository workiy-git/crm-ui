import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const EditDialog = ({ row, onSave, onClose }) => {
  const [editedRow, setEditedRow] = useState({ ...row });

  useEffect(() => {
    setEditedRow({ ...row });
  }, [row]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving edited row:", editedRow);
    onSave(editedRow);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Row</DialogTitle>
      <DialogContent>
        {Object.entries(editedRow).map(([key, value]) => (
          <TextField
            key={key}
            margin="dense"
            name={key}
            label={key}
            value={value}
            onChange={handleChange}
            fullWidth
          />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;

