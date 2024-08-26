import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const GridMenu = ({ anchorEl, handleMenuClose, handleNavigate, handleDeleteClick, selectedRow }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleNavigate("view")}>Details</MenuItem>
      <MenuItem onClick={() => handleNavigate("edit")}>Edit</MenuItem>
      <MenuItem onClick={() => handleDeleteClick(selectedRow)}>Delete</MenuItem>
    </Menu>
  );
};

export default GridMenu;