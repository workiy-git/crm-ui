import React  from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import FilterBlock from '../molecules/filter_block';


function Submenu({ themecolor }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
        <Toolbar sx={{ flexGrow: 1 }}>
          <FilterBlock/>
        </Toolbar>
    </Box>
  );
}

export default Submenu;
