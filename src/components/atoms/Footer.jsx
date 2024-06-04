import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';
import config from '../../config/config';


function Footer() {
    const [showFooter, setShowFooter] = useState(false);
    const [companylogoData, setcompanylogoData] = useState([]);

    let timeoutId;

    useEffect(() => {
        axios.get(`${config.apiUrl}/menudata`)
            .then((response) => {
                console.log('Data received:', response.data);
                setcompanylogoData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleMouseEnter = () => {
        clearTimeout(timeoutId);
        setShowFooter(true);
    };

    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => {
            setShowFooter(false);
        }, 2000);
    };

    return (
        <div style={{ position: 'relative', background: 'none', width: '100%' }}>
            {companylogoData.map((item, index) => (
                <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }} key={index}>
                    <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            position: 'absolute',
                            background: '#ffffff',
                            height: '10px',
                            width: '300px',
                            borderRadius: '10px 10px 0 0',
                            bottom: '0'
                        }}
                    ></div>
                    {showFooter && (
                        <div style={{
                            position: 'absolute',
                            background: '#ffffff',
                            height: '30px',
                            width: '500px',
                            borderRadius: '10px 10px 0 0',
                            bottom: '0',
                            
                        }}>
                            <div style={{ textAlign: 'center', bottom: 'auto', zIndex: '2', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    align="center"
                                    style={{
                                        background: '#ffffff',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        position: 'absolute',
                                        zIndex:'10'
                                    }}
                                >
                                    {item.menu.footer.copyright}
                                    <Link color="inherit" href={item.menu.footer.url} style={{ color: '#12E5E5' }}>
                                        {item.menu.footer.company_name}
                                    </Link>{' '}
                                    {new Date().getFullYear()}
                                    {item.menu.footer.dot}
                                </Typography>

                                <div style={{ textAlign: 'center', bottom: 'auto', display: 'flex', justifyContent: 'end', zIndex: '2', width: '100%', position: "" }}>

                                    <div style={{ marginRight: '5px' }}>
                                        <img
                                            src={item.menu.footer.brand}
                                            alt='icon'
                                            style={{ height: 'auto', width: '25px', paddingBottom: '15px', paddingTop: '15px', marginRight: '20PX' }}
                                        />
                                    </div>
                                    <div style={{ marginRight: '35px' }}>
                                        <img
                                            src={item.menu.footer.workiy}
                                            alt='brand'
                                            style={{ height: 'auto', width: '25px', paddingBottom: '15px', paddingTop: '15px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default Footer;