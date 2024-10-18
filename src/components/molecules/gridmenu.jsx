import React, { useState, useEffect } from "react";
import axios from "axios";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import config from "../../config/config";
import { headers } from '../atoms/Authorization';

const GridMenu = ({
  anchorEl,
  handleMenuClose,
  handleNavigate,
  handleDeleteClick,
  selectedRow,
  pageName,
  onViewReport,
  convertToLead
}) => {

  const [menuConfig, setMenuConfig] = useState({});

  useEffect(() => {
    // Fetch the menu data and find the grid menu within the response
    axios.get(`${config.apiUrl}/menus`, { headers })
      .then((response) => {
        const menuDataArray = response.data.data;
        const gridData = menuDataArray.find(menu => menu.menu === 'grid');
        if (gridData) {
          setMenuConfig(gridData.gridMenu);
        }
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
      });
  }, []);

  // Function mappings for dynamic execution of functions
  const functionMap = {
    onViewReport: onViewReport,
    handleNavigate: handleNavigate,
    handleDeleteClick: handleDeleteClick,
    convertToLead: convertToLead
  };

  // Helper to evaluate condition and execute the corresponding function
  const evaluateCondition = (condition) => {
    // Dynamically evaluate condition if it exists
    if (condition) {
      return eval(condition);
    }
    return true; // If no condition, assume true
  };

  const handleMenuItemClick = (action) => {
    // Parse the function and any arguments from the menuConfig
    const functionName = action.split('(')[0]; // Extract function name
    const args = action.match(/\(([^)]+)\)/); // Extract arguments from parentheses
    const params = args ? args[1].split(',').map(arg => eval(arg.trim())) : [];

    // Execute the function dynamically using functionMap
    if (functionMap[functionName]) {
      functionMap[functionName](...params); // Call the function with params
    }
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      className='grid_popup_menu_bar'
    >
      {Object.keys(menuConfig).map((key, index) => {
        const item = menuConfig[key];

        // Check if the condition exists and is valid
        if (!evaluateCondition(item.condition)) {
          return null; // Skip rendering this item if condition fails
        }

        return (
          <MenuItem key={index} onClick={() => handleMenuItemClick(item.onClick)}>
            {item.title}
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default GridMenu;
