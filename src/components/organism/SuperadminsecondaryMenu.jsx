import React, { useEffect, useState } from 'react';
import { Avatar, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../atoms/CRMLogo';
import config from '../../config/config';
import axios from 'axios';
import { headers } from '../atoms/Authorization';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [pagesItems, setPagesItems] = useState([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

  useEffect(() => {
    axios.get(`${config.apiUrl}/pagesdata`, {headers})
      .then(response => {
        const pagesData = response.data[0];
        if (pagesData && pagesData.dashboard && pagesData.dashboard.sidemenu) {
          const mappedPagesItems = Object.entries(pagesData.dashboard.sidemenu).map(([key, pagesItem]) => ({
            ...pagesItem,
            path: `/${key}`
          }));
          setPagesItems(mappedPagesItems);

          const selectedIndex = mappedPagesItems.findIndex(item => item.path === location.pathname);
          setSelectedOptionIndex(selectedIndex);
        }
      })
      .catch(error => {
        console.error('Error fetching page data:', error);
      });
  }, [location.pathname]);

  const handleOptionClick = (path, index) => {
    setSelectedOptionIndex(index);
    navigate(path);
  };

  return (
    <div style={{ backgroundColor: "#0d2d4e", width:'fit-content', padding:'0 30px 0 10px'}}>
        <div  style={{ display:'flex',justifyContent:'center'}}>
      <div style={{ width: 'fit-content',display:'flex',justifyContent:'center', background: '#ffffff', borderRadius: '5px', padding:'0 22px 0 22px'}}>
        <Logo />
      </div>
      </div>
      <div style={{ width: 'fit-content', textAlign: 'center', margin: 'auto', padding: '0 5px 0 5px' }}>

        {pagesItems.map((pagesItem, index) => {
          const isSelected = selectedOptionIndex === index || (location.pathname === "/" && index === 0);
          return (
            <div
              key={pagesItem.title}
              style={{
                display: 'flex',
                textAlign: 'center',
                zIndex: '3',
                width: 'max-content',
                gap: '5px',
                marginTop: '20px',
                position: 'relative',
                transition: 'transform 0.3s ease',
                transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                padding: '0 10px 0 0',
                backgroundColor: isSelected ? '#ff3f14' : '',
                borderRadius: '5px'
              }}
              onClick={() => handleOptionClick(pagesItem.path, index)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.fontSize = '10px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
                e.currentTarget.style.fontSize = '13px';
              }}
            >
              <Avatar
                src={pagesItem.icon}
                alt={pagesItem.title}
                sx={{
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                  borderRadius: '0',
                  margin: '10px',
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  fontSize: '10px !important',
                  color: 'white',
                  transition: 'color 0.3s ease',
                  display:'flex',
                  alignItems:'center'
                }}
              >
                {pagesItem.title}
              </Typography>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
