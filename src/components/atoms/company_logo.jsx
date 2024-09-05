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
        axios.get(`${config.apiUrl}/menus/header`) // Use apiUrl from the configuration file
            .then((response) => {
                // console.log('Data received:', response.data);
                setcompanylogoData(response.data.data.company_logo);
            })
            .catch((error) => {
                // console.error('Error fetching data:', error);
            });
    }, []);

    const dashedBorderStyle = {
        // borderRight: '3px dashed gray',
        borderRadius: '0',
        background: 'white',
        padding:'2px 10px 1px 2px'
        ,height:'55px'
      };
    const logoHeightStyle = {
        height: '100%'
      };

    return (
        <div>
                <div>
                    <Box sx={{ display: 'flex'  }}>
                    <IconButton size="large" color="inherit" style={dashedBorderStyle} sx={{ 
       }}>
                    <img alt="" src={companylogoData.business_logo}  style={logoHeightStyle}/>
                    </IconButton>
                    {/* <IconButton size="large" color="inherit" sx={{  height:{xs : '50px', md :'70px'} }}> 
                    <img alt="" src={companylogoData.product_logo} style={logoHeightStyle} />
                    </IconButton> */}
                    </Box>
                </div>
        </div>
    );
}

export default Companylogo;
