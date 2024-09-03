import React, { useState, useEffect, useReducer } from 'react';
import axios from 'axios';
import AddFeature from "../atoms/add_feature";
import WidgetsList from '../molecules/WidgetList';
import { AppBar, Toolbar, IconButton, Button, Box } from '@material-ui/core';
import '../../assets/styles/MenuComponent.css';
import config from '../../config/config';  // Ensure the correct path to config file

const sessionStorageKey = 'selectedTexts';
const selectedButtonIndexKey = 'selectedButtonIndex';

const MenuComponent = ({ backgroundColor, onSaveSelectedText }) => {
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [showAll, setShowAll] = useState(false); // State to manage whether to show all texts
  const [scrollIndex, setScrollIndex] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [dashboardName, setDashboardName] = useState(null);

  useEffect(() => {
    const storedSelectedTexts = JSON.parse(sessionStorage.getItem(sessionStorageKey)) || [];
    const storedSelectedButtonIndex = JSON.parse(sessionStorage.getItem(selectedButtonIndexKey));
    setSelectedTexts(storedSelectedTexts);
    setScrollIndex(0);

    axios.get(`${config.apiUrl}/appdata`)
      .then((response) => {
        console.log('Notification data received:', response.data);
        const { data } = response.data;
      })
      .catch((error) => {
        console.error('Error fetching notification data:', error);
      });

    if (storedSelectedTexts.length > 0) {
      const initialIndex = storedSelectedButtonIndex !== null ? storedSelectedButtonIndex : 0;
      setSelectedButtonIndex(initialIndex);
      handleButtonClick(initialIndex, storedSelectedTexts);
    }
  }, []);

  const handleSaveSelectedText = (texts) => {
    setSelectedTexts(texts);
    sessionStorage.setItem(sessionStorageKey, JSON.stringify(texts));
    setScrollIndex(0);
    onSaveSelectedText(texts);
    if (texts.length > 0) {
      setSelectedButtonIndex(0);
      handleButtonClick(0, texts);
    }
    else{
      // window.location.reload();
      setSelectedButtonIndex(null); // Clear the selected button index
      setDashboardName(null); // Clear the dashboard name to hide the WidgetsList
      sessionStorage.removeItem(selectedButtonIndexKey); // Optionally, remove the key from sessionStorage
    }
    
  };

  const handleButtonClick = (index, texts = selectedTexts) => {
    setSelectedButtonIndex(index);
    sessionStorage.setItem(selectedButtonIndexKey, index);

    if (texts.length > index && index >= 0) {
      const selectedMenuKey = texts[index].title.toLowerCase(); // Convert title to lowercase
      setDashboardName(selectedMenuKey);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <>
      <AppBar position="static" className="menu-appBar" style={{ background: '#F5BD71' }}>
        <Toolbar style={{ minHeight: '50px' }} className="menu-toolbar">
          <Box className="menu-selectedTextContainer">
            {(showAll ? selectedTexts : selectedTexts.slice(0, 5)).map((text, index) => (
              <Box key={index} className="menu-selectedTextItem">
                <Button
                  variant="contained"
                  color={selectedButtonIndex === index ? "secondary" : "primary"}
                  className="menu-featureButton"
                  onClick={() => handleButtonClick(index)}
                  style={{
                    backgroundColor: selectedButtonIndex === index ? '#2C2C2CB2 ' : 'transparent',
                    color: selectedButtonIndex === index ? '#ffff' : '#ffff',
                    textTransform: 'none',
                    boxShadow: 'none',
                    borderRadius: selectedButtonIndex === index ? '15px' : '',
                    width: 'max-content',
                    padding: '3px 0px'
                  }}
                >
                  {text.title}
                </Button>
              </Box>
            ))}
            {selectedTexts.length > 5 && (
              <Button
                variant="contained"
                className="menu-moreButton"
                onClick={toggleShowAll}
                style={{
                  backgroundColor: 'transparent',
                  color: '#ffff',
                  textTransform: 'none',
                  boxShadow: 'none',
                  width: 'max-content',
                  padding: '3px 0px'
                }}
              >
                {showAll ? '< Show Less' : 'More >'}
              </Button>
            )}
          </Box>
          <Box className="menu-buttonGroup">
            <div className="menu-iconButton">
              <AddFeature onSaveSelectedText={handleSaveSelectedText} storedSelectedTexts={selectedTexts} />
            </div>
            <IconButton style={{ visibility: 'hidden' }} className="menu-iconButton" onClick={() => console.log('Refresh clicked')}>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {dashboardName && (
        <WidgetsList dashboardName={dashboardName} />
      )}
    </>
  );
};

export default MenuComponent;
