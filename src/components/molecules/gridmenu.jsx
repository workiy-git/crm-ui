import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import GridComponent from '../organism/gridn';

const GridMenu = ({ anchorEl, handleMenuClose, handleNavigate, handleDeleteClick, selectedRow, pageName={pageName}, onViewReport  }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      {pageName === 'reports' && (
        <MenuItem onClick={onViewReport}>View Report</MenuItem>
      )}
      <MenuItem onClick={() => handleNavigate("view")}>Details</MenuItem>
      <MenuItem onClick={() => handleNavigate("edit")}>Edit</MenuItem>
      <MenuItem onClick={() => handleDeleteClick(selectedRow)}>Delete</MenuItem>
    </Menu>
  );
};

export default GridMenu;