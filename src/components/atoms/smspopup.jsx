import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@material-ui/core';
import axios from 'axios';
import config from '../../config/config';

function MyDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown1Value, setDropdown1Value] = useState('');
  const [dropdown2Value, setDropdown2Value] = useState('');
  const [description, setDescription] = useState('');
  const [companylogoData, setCompanylogoData] = useState([]);

  useEffect(() => {
    axios.get(`${config.apiUrl}/popupdata`)
      .then((response) => {
        console.log('Data received:', response.data);
        setCompanylogoData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleSubmit = () => {
    // Handle form submission logic here
    console.log('Form submitted!');
    // For example, you can reset the form and close the dialog
    setDropdown1Value('');
    setDropdown2Value('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <div>
      {companylogoData.map((item, index) => (
        <div key={index}>
          <Button onClick={() => setIsOpen(true)} style={{height:'20px' , Weight:'auto'}}> 
          <img src={item.sms.smsIcon} alt="" style={{height:'20px' , Weight:'auto'}}/>
          </Button>
          <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            style={{ boxShadow: '10px 10px 10px 10px white', padding: '100px' }}
          >
            <DialogActions style={{ background: '#12e5e5' }}>
              <Button onClick={() => setIsOpen(false)} color="primary" style={{ borderRadius: '200px', color: 'red', fontWeight: 'bold' }}>x</Button>
            </DialogActions>
            <DialogTitle style={{ background: '#12e5e5', position: 'absolute', height: '10px' }}>
              {item.sms.title}
            </DialogTitle>

            <DialogContent style={{ padding: '50px', overflow: 'hidden' }}>
              <FormControl fullWidth style={{ border: '2px dashed #12e5e5', padding: '5px', borderRadius: '10px' }}>
                <InputLabel style={{ paddingTop: '2px' }}>Receipent Number</InputLabel>
                <Select value={dropdown1Value} onChange={(e) => setDropdown1Value(e.target.value)}>
                  {/* Dropdown 1 options */}
                  <MenuItem value={'option1'}>Option 1</MenuItem>
                  <MenuItem value={'option2'}>Option 2</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ border: '2px dashed #12e5e5', padding: '5px', borderRadius: '10px', marginTop: '10px' }}>
                <InputLabel>Choose the Template</InputLabel>
                <Select value={dropdown2Value} onChange={(e) => setDropdown2Value(e.target.value)}>
                  {/* Dropdown 2 options */}
                  <MenuItem value={'option1'}>Option 1</MenuItem>
                  <MenuItem value={'option2'}>Option 2</MenuItem>
                </Select>
              </FormControl>
              <TextField
                multiline
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="Description"
                placeholder="Enter description..."
                style={{ border: '2px dashed #12e5e5', padding: '5px', borderRadius: '10px', marginTop: '10px' }}
              />
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
              <Button onClick={handleSubmit} color="primary" style={{ background: '#00AEF8', opacity: '50%', color: 'white', fontWeight: '600', borderRadius: '5px' }}>Submit</Button>
            </DialogActions>
          </Dialog>
        </div>
      ))}
    </div>
  );
}

export default MyDialog;