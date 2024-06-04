import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';

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
        axios.get(`${config.apiUrl}/pagesdata`) // Use apiUrl from the configuration file
            .then((response) => {
                console.log('Data received:', response.data);
                setcompanylogoData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

  

    return (
        <div>
            {companylogoData.map((item, index) => (

                <div key ={index} style={{display:'flex',justifyContent:'center'}}>
                    
                    <IconButton size="large" color="inherit" style={{padding:'0'}}>
                    <img alt="" src={item.dashboard.Images.dashboardLogo}  style={{height:'40px'}}/>
                    </IconButton>
              
                   
                </div>
            ))}
        </div>
    );
}

export default Companylogo;
