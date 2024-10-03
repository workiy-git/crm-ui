import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

import '../../assets/styles/style.css';
const ConfirmationDialog = ({ open, title, content, onConfirm, onCancel }) => {
  return (
    <Dialog open={open} onClose={onCancel} > 
    <DialogTitle >{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions >
      <Button onClick={onCancel} style={{border:'1px solid #c2c2c2' ,color:'#000',padding:'5px 15px'}} >
        Cancel
      </Button>
      {/* <Button onClick={onConfirm} style={{background:'#dedede', color:'#000',padding:'5px 20px'}} startIcon={<Delete />}> */}
      <Button onClick={onConfirm} style={{background:'#dedede', color:'#000',padding:'5px 20px'}}>
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
  );
};

export default ConfirmationDialog;
