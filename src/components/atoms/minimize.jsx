// src/atoms/WindowControls.js
import React from 'react';
import IconButton from '@mui/material/IconButton';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from '@mui/icons-material/Close';

const WindowControls = ({ onMinimize, onMaximize, onClose }) => {
  return (
    <>
      <IconButton onClick={onMinimize}>
        <MinimizeIcon />
      </IconButton>
      <IconButton onClick={onMaximize}>
        <MaximizeIcon />
      </IconButton>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </>
  );
};

export default WindowControls;