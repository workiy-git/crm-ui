import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';


function Companylogo() {
    const [companylogoData, setcompanylogoData] = useState([]);

    useEffect(() => {
        document.title = 'Logo';

        return () => {
            document.title = 'Default Title';
        };
    }, []);

    useEffect(() => {
        axios.get('http://127.0.0.1:9000/api/headerdata')
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
                    <img alt="" src={item.company_logo} style={logoHeightStyle} />
                    </IconButton>
                    <IconButton size="large" color="inherit">
                    <img alt="" src={item.workiy_logo} style={logoHeightStyle} />
                    </IconButton>
                    </Box>
                </div>
            ))}
        </div>
    );
}

export default Companylogo;