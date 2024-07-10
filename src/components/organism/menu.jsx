import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFeature from "../atoms/add_feature";
import Refresh from '../atoms/refresh';
import SlideButton from '../atoms/slide_button';
import CreateWidget from '../atoms/widgets';
import { AppBar, Toolbar, IconButton, Button, Box } from '@material-ui/core';
import '../../assets/styles/MenuComponent.css';
import config from '../../config/config';  // Ensure the correct path to config file

const localStorageKey = 'selectedTexts';

const MenuComponent = ({ backgroundColor, onSaveSelectedText }) => {
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [count, setCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    const storedSelectedTexts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    setSelectedTexts(storedSelectedTexts);
    setScrollIndex(0);

    axios.get(`${config.apiUrl}/appdata`)
      .then((response) => {
        console.log('Notification data received:', response.data);
        const { data } = response.data;
        setNotificationData(data);  // Store the fetched data
      })
      .catch((error) => {
        console.error('Error fetching notification data:', error);
      });
  }, []);

  const handleSaveSelectedText = (texts) => {
    setSelectedTexts(texts);
    localStorage.setItem(localStorageKey, JSON.stringify(texts));
    setScrollIndex(0);
    onSaveSelectedText(texts);
  };

  const handleScrollLeft = () => {
    setScrollIndex(Math.max(0, scrollIndex - 1));
  };

  const handleScrollRight = () => {
    setScrollIndex(Math.min(selectedTexts.length - 6, scrollIndex + 1));
  };

  const handleButtonClick = (index) => {
    setSelectedButtonIndex(index);
    const selectedTextTitle = selectedTexts[index].title;

    // Filter notification data based on the selected text title
    const filteredData = notificationData.filter(item => item.pageName === selectedTextTitle);
    console.log(`Filtered data for ${selectedTextTitle}:`, filteredData);

    const newWidgets = Array.from({ length: filteredData.length }, (_, i) => ({
      icon: '+',
      title: `Widget ${i + 1}`,
    }));

    setWidgets(newWidgets);
    setCount(filteredData.length);
    setNotificationCount(filteredData.length);
  };

  return (
    <>
      <AppBar position="static" className="menu-appBar" style={{ background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)' }}>
        <Toolbar className="menu-toolbar">
          <Box className="menu-selectedTextContainer">
            {selectedTexts.slice(scrollIndex, scrollIndex + 9).map((text, index) => (
              <Box key={index} className="menu-selectedTextItem">
                <Button
                  variant="contained"
                  color={selectedButtonIndex === index ? "secondary" : "primary"}
                  className="menu-featureButton"
                  onClick={() => handleButtonClick(index)}
                  style={{ backgroundColor: selectedButtonIndex === index ? 'rgb(255, 63, 20)' : 'white', color: selectedButtonIndex === index ? 'white' : '#264653', textTransform: 'none'  }}
                >
                  {text.title}
                </Button>
              </Box>
            ))}
          </Box>
          {selectedTexts.length > 9 && (
            <Box className="menu-buttonGroup">
              <SlideButton onScrollLeft={handleScrollLeft} direction="left" />
              <SlideButton onScrollRight={handleScrollRight} direction="right" />
            </Box>
          )}
          <Box className="menu-buttonGroup">
            <IconButton className="menu-iconButton">
              <AddFeature onSaveSelectedText={handleSaveSelectedText} storedSelectedTexts={selectedTexts} />
            </IconButton>
            <IconButton className="menu-iconButton" onClick={() => console.log('Refresh clicked')}>
              <Refresh />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {selectedButtonIndex !== null && (
        <div>
          <CreateWidget backgroundColor={backgroundColor} widgets={widgets} />
        </div>
      )}
    </>
  );
};

export default MenuComponent;
