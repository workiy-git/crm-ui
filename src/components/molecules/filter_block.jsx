import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Typography } from '@mui/material';
// import Theme from '../atoms/theme'

const FilterBlock = () => {
    const [filterData, setFilterData] = useState([]);
    const [isHovered, setIsHovered] = useState(false);
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);
    const [isHovered3, setIsHovered3] = useState(false);

    useEffect(() => {
        axios.get('http://127.0.0.1:9000/api/submenudata')
            .then((response) => {
                console.log('Data received:', response.data);
                setFilterData(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    return (
        <div style={{ width: 'fit-content', textAlign: 'center', display: 'flex',background: 'white', borderRadius: '5px', marginTop:"25px" }}>
            {filterData.map((item, index) => (
                <div
                    key={index}
                    style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '10px', gap: '10px'}}
                >
                    <div
                        style={{
                            display: 'flex',
                            backgroundColor: isHovered ? '#00AEF8' : 'white',
                            padding: isHovered ? '1px' : '0',
                            borderRadius: '10px'
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Avatar
                            src={item.add_home}
                            alt='icon'
                            sx={{
                                width: 30,
                                height: 30,
                                cursor: 'pointer',
                                borderRadius: '0',
                            }}
                        />
                        <Typography variant="body2" sx={{ display: isHovered ? 'flex' : 'none', alignItems: 'center', paddingRight: '10px', fontWeight:'bold' }}>
                            {item.dashboard_text}
                        </Typography>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            backgroundColor: isHovered1 ? '#00AEF8' : 'white',
                            padding: isHovered1 ? '1px' : '0',
                            borderRadius: '10px'
                        }}
                        onMouseEnter={() => setIsHovered1(true)}
                        onMouseLeave={() => setIsHovered1(false)}
                    >
                        <Avatar
                            src={item.filter}
                            alt='icon'
                            sx={{
                                width: 30,
                                height: 30,
                                cursor: 'pointer',
                                borderRadius: '0',
                                marginRight: '10px'
                            }}

                        />
                        <Typography variant="body2" sx={{ display: isHovered1 ? 'flex' : 'none', alignItems: 'center', paddingRight: '10px' , fontWeight:'bold'}}>
                            {item.filter_text}
                        </Typography>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            backgroundColor: isHovered2 ? '#00AEF8' : 'white',
                            padding: isHovered2 ? '1px' : '0',
                            borderRadius: '10px'
                        }}
                        onMouseEnter={() => setIsHovered2(true)}
                        onMouseLeave={() => setIsHovered2(false)}
                    >
                        <Avatar
                            src={item.widgets}
                            alt='icon'
                            sx={{
                                width: 30,
                                height: 30,
                                cursor: 'pointer',
                                borderRadius: '0',
                                marginRight: '10px'
                            }}
                        />
                        <Typography variant="body2" sx={{ display: isHovered2 ? 'flex' : 'none', alignItems: 'center', paddingRight: '10px',fontWeight:'bold' }}>
                            {item.target_text}
                        </Typography>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            backgroundColor: isHovered3 ? '#00AEF8' : 'white',
                            padding: isHovered3 ? '1px' : '0',
                            borderRadius: '10px'
                        }}
                        onMouseEnter={() => setIsHovered3(true)}
                        onMouseLeave={() => setIsHovered3(false)}
                    >
                        <Avatar
                            src={item.target}
                            alt='icon'
                            sx={{
                                width: 30,
                                height: 30,
                                cursor: 'pointer',
                                borderRadius: '0',
                                marginRight: '10px'
                            }}
                        />
                        <Typography variant="body2" sx={{ display: isHovered3 ? 'flex' : 'none', alignItems: 'center', paddingRight: '10px', fontWeight:'bold' }}>
                            {item.widgets_text}
                        </Typography>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FilterBlock;
