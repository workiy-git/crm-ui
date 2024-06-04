import React, { useState} from 'react';
import { Button, Popover, Typography, TextField, Select, MenuItem, FormControl, DialogActions , InputLabel } from '@mui/material';
// import config from '../../config/config';
// import axios from 'axios';

function Callfilter() {
  // const [subMenuData, setSubMenuData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [searchValue, setSearchValue] = useState(''); 
  // const [companylogoData, setcompanylogoData] = useState([]);


//   useEffect(() => {
//     axios.get(`${config.apiUrl}/menudata`)
//         .then((response) => {
//             console.log('Data received:', response.data);
//             setcompanylogoData(response.data);
//         })
//         .catch((error) => {
//             console.error('Error fetching data:', error);
//         });
// }, []);


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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleApply = () => {
    console.log('Changes applied');
    handleClose();
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSort = () => {
    // Implement sort functionality here
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    // Implement filter logic based on searchValue
    // Example: update filtered data based on searchValue
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
       {/* {companylogoData.map((item, index) => ( */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }} >
                <Button 
                  style={{ color: '#212529', border: '2px solid #04aa6d' }} 
                  onClick={handleClick}
                >
                  Filter    <div style={{fontWeight:'bolder', color:'#04aa6d'}}>  &nbsp; &nbsp; &gt;</div>
{/*               
                    <Avatar
                      src={item.menu.submenu.filter.icon}
                      sx={{
                        width: 20,
                        height: 20,
                        cursor: 'pointer',
                        borderRadius: '0',
                        margin: '10px',
                      }}
                    /> */}
                  
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <div style={{ padding: '16px', width: '300px' }}>
                    <Typography variant="h6">Filter Options</Typography>
                    <div style={{display:'flex', justifyContent: 'center' }}>
                      <Button 
                        style={{ marginTop: '16px' }} 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSort}
                      >
                        Sort A-Z
                      </Button>
                    </div>
                    <div className="form-group" style={{padding:'5px'}}>
                      <label htmlFor="toDate">From</label>
                      <input
                        type="date"
                        name="from"
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
                        placeholder="Select date"
                      />
                    </div>
                    <TextField
                      label="Call Direction"
                      variant="outlined"
                      fullWidth
                      value={searchValue}
                      onChange={handleSearchChange}
                      style={{ marginBottom: '16px' }}
                    />
                    <FormControl fullWidth style={{ marginTop: '16px' }}>
                      <InputLabel id="select-label">Assigned To</InputLabel>
                      <Select
                        labelId="select-label"
                        value={selectedOption}
                        onChange={handleOptionChange}
                      >
                        <MenuItem value="option1">Hari</MenuItem>
                        <MenuItem value="option2">Satish</MenuItem>
                        <MenuItem value="option3">Prabhu</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth style={{ marginTop: '16px' }}>
                      <InputLabel id="select-label">All</InputLabel>
                      <Select
                        labelId="select-label"
                        value={selectedOption}
                        onChange={handleOptionChange}
                      >
                        <MenuItem value="option1">Today calls</MenuItem>
                        <MenuItem value="option2">Total calls</MenuItem>
                        <MenuItem value="option3">Today Missed calls</MenuItem>
                      </Select>
                    </FormControl>
                    <DialogActions style={{paddingTop:'20px '}}>
                      <Button onClick={handleApply} style={{color:'#45F28A'}}>
                        Apply
                      </Button>
                      <Button onClick={handleClose} style={{color:'#F73F3F'}}>
                        Close
                      </Button>
                    </DialogActions>
                  </div>
                </Popover>
              </div>
        
    </div>
  );
}

export default Callfilter;