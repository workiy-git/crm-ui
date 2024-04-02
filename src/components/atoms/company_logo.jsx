import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import config from '../../config/config'; // Import the configuration file

function Companylogo() {
    const [companylogoData, setcompanylogoData] = useState([]);

    useEffect(() => {
        document.title = 'Logo';

        return () => {
            document.title = 'Default Title';
        };
    }, []);

    useEffect(() => {
        axios.get(`${config.apiUrl}/menudata`) // Use apiUrl from the configuration file
            .then((response) => {
                console.log('Data received:', response.data);
                setcompanylogoData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const dashedBorderStyle = {
        borderRight: '3px dashed gray',
        borderRadius: '0',
      };
    const logoHeightStyle = {
        height: '40px',
      };

    return (
        <div>
            {companylogoData.map((item, index) => (

                <div key ={index}>
                    <Box sx={{ display: { md: 'flex' } }}>
                    <IconButton size="large" color="inherit" style={dashedBorderStyle}>
                    <img alt="" src={item.menu.header.company_logo.business_logo} style={logoHeightStyle} />
                    </IconButton>
                    <IconButton size="large" color="inherit">
                    <img alt="" src={item.menu.header.company_logo.product_logo} style={logoHeightStyle} />
                    </IconButton>
                    </Box>
                </div>
            ))}
        </div>
    );
}

export default Companylogo;
