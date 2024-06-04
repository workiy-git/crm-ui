import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import config from '../../config/config';

const SubMenu = () => {
  const [subMenuData, setSubMenuData] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0); // Default to the first option
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown1Value, ] = useState('');
  const [dropdown2Value, setDropdown2Value] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const [formState, setFormState] = useState({
    page: "",
    description: "",
    status: "live",
    author: "",
    createdDate: "",
    fromDate: "",
    toDate: ""
  });

  useEffect(() => {
    axios.get(`${config.apiUrl}/menudata`)
      .then((response) => {
        console.log('Menu data received:', response.data);
        const menuData = response.data[0];
        if (menuData && menuData.menu && menuData.menu.submenu) {
          setSubMenuData(menuData.menu.submenu);
        }
      })
      .catch((error) => {
        console.error('Error fetching menu data:', error);
      });
  }, []);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleSubmit = () => {
    // Handle submission logic here
    console.log('Dropdown 1:', dropdown1Value);
    console.log('Dropdown 2:', dropdown2Value);
    console.log('Description:', description);
    setIsOpen(false);
  };

  const handleMenuItemClick = (index) => {
    // Check if the clicked menu item is "Filter"
    const selectedItem = Object.values(subMenuData)[index];
    if (selectedItem.title === "Filter") {
      setSelectedOptionIndex(index);
      setIsOpen(true);
    } else {
      // For other options, do nothing
      setSelectedOptionIndex(index);
    }
  };
  

  return (
    <div>
      <div position="static" style={{ height: '70px', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 'fit-content', textAlign: 'center', display: 'flex', background: 'white', borderRadius: '5px', margin: '10px 0 10px 50px' }}>
          {Object.entries(subMenuData).map(([key, menuItem], index) => (
            <div style={{ width: 'fit-content' }} key={key}>
              <div
                style={{
                  display: 'flex',
                  background: selectedOptionIndex === index ? '#ff3f14' : hoveredIndex === index ? '#ff3f14' : 'transparent',
                  borderRadius: '5px',
                  paddingRight: selectedOptionIndex === index || hoveredIndex === index ? '10px' : '0',
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}
                onClick={() => handleMenuItemClick(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <Avatar
                  src={menuItem.icon}
                  alt={menuItem.title}
                  sx={{
                    width: 20,
                    height: 20,
                    cursor: 'pointer',
                    borderRadius: '0',
                    margin: '10px',
                    transition: 'transform 0.3s ease',
                    transform: selectedOptionIndex === index || hoveredIndex === index ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
                {selectedOptionIndex === index && (
                  <p
                    sx={{
                      transform: 'translateX(-50%)',
                      transition: 'color 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      padding: '5px',
                      color: 'black',
                      fontSize: '12px'
                    }}
                  >
                    {menuItem.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* MUI Dialog */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} style={{ boxShadow: '10px 10px 10px 10px #000000' }}>
        <div style={{padding:'0px  50px'}}>
          <DialogTitle style={{fontWeight:'bolder'}}>Filter</DialogTitle>
          <DialogContent style={{ padding: '20px', overflow: 'hidden' }}>
            <div className="form-group">
              <label htmlFor="fromDate">From</label>
              <input
                type="date"
                name="fromDate"
                onChange={handleChange}
                value={formState.fromDate}
              />
            </div>
            <div className="form-group">
              <label htmlFor="toDate">To</label>
              <input
                type="date"
                name="toDate"
                onChange={handleChange}
                value={formState.toDate}
              />
            </div>
            <FormControl fullWidth style={{ marginTop: '20px' }}>
              <InputLabel>Telecallers(0 Of 10 Users)</InputLabel>
              <Select value={dropdown2Value} onChange={(e) => setDropdown2Value(e.target.value)}>
                <MenuItem value={'option1'}>Hari</MenuItem>
                <MenuItem value={'option2'}> brabhu</MenuItem>
              </Select>
            </FormControl>
            <TextField
              multiline
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              label="Description"
              placeholder="Enter description..."
              style={{ marginTop: '20px' }}
            />
          </DialogContent>
          <DialogActions style={{display:'flex', justifyContent:"space-between", width:'50%', margin:'auto'}}>       
            <Button onClick={() => setIsOpen(false)} style={{ background: '#ffffff', opacity: '100%', color: '#000000', borderRadius: '5px',  boxShadow:'2px 2px 5px 1px #808080' }}>Close</Button>
            <Button onClick={handleSubmit} color="primary" style={{ background: '#12e5e5', opacity: '100%', color: '#ffffff', borderRadius: '5px', boxShadow:'2px 2px 5px 1px #808080'  }}>Submit</Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default SubMenu;