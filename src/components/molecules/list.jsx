// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Dropdown from '@mui/joy/Dropdown';
// import IconButton from '@mui/joy/IconButton';
// import Menu from '@mui/joy/Menu';
// import MenuButton from '@mui/joy/MenuButton';
// import MenuItem from '@mui/joy/MenuItem';

// export default function IconButtonMenu() {
//   const [hamburgerData, setHamburgerData] = useState([]);

//   useEffect(() => {
//     axios.get('http://127.0.0.1:9000/api/headerdata')
//       .then((response) => {
//         console.log('Data received:', response.data);
//         setHamburgerData(response.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);

//   return (
//     <Dropdown>
//       <MenuButton
//         slots={{ root: IconButton }}
//         slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
//         sx={{
//           marginRight: 2,
//         }}
//       >
//         {hamburgerData?.[0]?.list?.[0] && (
//           <img
//             alt=""
//             src={hamburgerData[0].list[0].list_icon}
//             style={{ width: '30px', height: 'auto', cursor: 'pointer' }}
//           />
//         )}
//       </MenuButton>
//       <Menu sx={{ padding: '0 10px' }}>
//         {hamburgerData?.[0]?.list?.slice(1).map((item, index) => (
//           <MenuItem key={index}>{item.label}</MenuItem>
//         ))}
//       </Menu>
//     </Dropdown>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { useHistory } from 'react-router-dom';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';

export default function IconButtonMenu() {
  const [hamburgerData, setHamburgerData] = useState([]);
  const [showSubmenuIndex, setShowSubmenuIndex] = useState(null);
  const [submenuTimer, setSubmenuTimer] = useState(null); // Timer to delay hiding submenu
  // const history = useHistory();

  useEffect(() => {
    axios.get('http://127.0.0.1:9000/api/headerdata')
      .then((response) => {
        console.log('Data received:', response.data);
        setHamburgerData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleMouseEnter = (index) => {
    setShowSubmenuIndex(index);
    clearTimeout(submenuTimer); // Clear any existing timer
  };

  const handleMouseLeave = () => {
    // Set a timer to hide submenu after 3 seconds
    const timer = setTimeout(() => {
      setShowSubmenuIndex(null);
    }, 3000); // 3000 milliseconds = 3 seconds
    setSubmenuTimer(timer);
  };

  // const navigateToPage = (pageUrl) => {
  //   history.push(pageUrl); // Navigate to the specified page URL
  // };

  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
        sx={{
          marginRight: 2, 
          border:'none !important'
        }}
      >
        {hamburgerData?.[0]?.list?.[0] && (
          <img
            alt=""
            src={hamburgerData[0].list[0].list_icon}
            style={{ width: '30px', height: 'auto', cursor: 'pointer' }}
          />
        )}
      </MenuButton>
      <Menu sx={{ padding: '0 20px' }}>
        <MenuItem 
          onMouseEnter={() => handleMouseEnter(0)}
          onMouseLeave={handleMouseLeave}
        >
          {hamburgerData?.[0]?.list?.[0]?.label}
          {showSubmenuIndex === 0 && hamburgerData?.[0]?.list?.[0]?.sub_values && (
            <Menu sx={{marginLeft:'9rem !important', marginTop:'2rem !important'}}>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[0].sub_values[0].sub_label}</MenuItem>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[0].sub_values[1].sub_label}</MenuItem>
            </Menu>
          )}
        </MenuItem>
        
        <MenuItem 
          onMouseEnter={() => handleMouseEnter(1)}
          onMouseLeave={handleMouseLeave}
        >
          {hamburgerData?.[0]?.list?.[1]?.label}
          {showSubmenuIndex === 1 && hamburgerData?.[0]?.list?.[1]?.sub_values && (
            <Menu sx={{marginLeft:'9rem !important', marginTop:'2rem !important'}}>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[1].sub_values[0].sub_label}</MenuItem>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[1].sub_values[1].sub_label}</MenuItem>
            </Menu>
          )}
        </MenuItem>

        <MenuItem 
          onMouseEnter={() => handleMouseEnter(2)}
          onMouseLeave={handleMouseLeave}
        >
          {hamburgerData?.[0]?.list?.[2]?.label}
          {showSubmenuIndex === 2 && hamburgerData?.[0]?.list?.[2]?.sub_values && (
            <Menu sx={{marginLeft:'9rem !important', marginTop:'2rem !important'}}>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[2].sub_values[0].sub_label}</MenuItem>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[2].sub_values[1].sub_label}</MenuItem>
            </Menu>
          )}
        </MenuItem>

        <MenuItem 
          onMouseEnter={() => handleMouseEnter(3)}
          onMouseLeave={handleMouseLeave}
        >
          {hamburgerData?.[0]?.list?.[3]?.label}
          {showSubmenuIndex === 3 && hamburgerData?.[0]?.list?.[3]?.sub_values && (
            <Menu sx={{marginLeft:'9rem !important', marginTop:'2rem !important'}}>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[3].sub_values[0].sub_label}</MenuItem>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[3].sub_values[1].sub_label}</MenuItem>
            </Menu>
          )}
        </MenuItem>

        <MenuItem 
          onMouseEnter={() => handleMouseEnter(4)}
          onMouseLeave={handleMouseLeave}
        >
          {hamburgerData?.[0]?.list?.[4]?.label}
          {showSubmenuIndex === 4 && hamburgerData?.[0]?.list?.[4]?.sub_values && (
            <Menu sx={{marginLeft:'9rem !important', marginTop:'2rem !important'}}>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[4].sub_values[0].sub_label}</MenuItem>
              <MenuItem sx={{marginLeft:'auto'}}>{hamburgerData[0].list[4].sub_values[1].sub_label}</MenuItem>
            </Menu>
          )}
        </MenuItem>
        {/* Repeat for other items */}

      </Menu>
    </Dropdown>
  );
}