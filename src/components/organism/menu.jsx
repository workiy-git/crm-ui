import React, { useState, useEffect } from 'react';
import AddFeature from "../atoms/add_feature";
import Refresh from '../atoms/refresh';
import SlideButton from '../atoms/slide_button';
import CreateWidget from '../atoms/create_widget';
import { AppBar, Toolbar, IconButton, Button, Box } from '@material-ui/core';
import '../../assets/styles/MenuComponent.css';

const localStorageKey = 'selectedTexts';

const MenuComponent = ({ backgroundColor, onSaveSelectedText }) => {
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [widgets, setWidgets] = useState([]); // State for storing widgets

  useEffect(() => {
    const storedSelectedTexts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    setSelectedTexts(storedSelectedTexts);
    setScrollIndex(0);
  }, []);

  const handleSaveSelectedText = (texts) => {
    setSelectedTexts(texts);
    localStorage.setItem(localStorageKey, JSON.stringify(texts));
    setScrollIndex(0);
    onSaveSelectedText(texts);
    fetchWidgets(texts); // Fetch widgets when text is saved
  };

  const fetchWidgets = (texts) => {
    const widgets = texts.flatMap(text => text.widgets);
    setWidgets(widgets);
  };

  const handleScrollLeft = () => {
    setScrollIndex(Math.max(0, scrollIndex - 1));
  };

  const handleScrollRight = () => {
    setScrollIndex(Math.min(selectedTexts.length - 6, scrollIndex + 1));
  };

  const handleButtonClick = (index) => {
    setSelectedButtonIndex(index); // Set the index of the selected button
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
                  color={selectedButtonIndex === index ? "secondary" : "primary"} // Change color based on selectedButtonIndex state
                  className="menu-featureButton"
                  onClick={() => handleButtonClick(index)} // Handle button click to set selected index
                  style={{ backgroundColor: selectedButtonIndex === index ? 'rgb(255, 63, 20)' : 'white', color: selectedButtonIndex === index ? 'white' : '#264653' }}
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
      <CreateWidget backgroundColor={backgroundColor} widgets={widgets} /> {/* Render CreateWidget */}
    </>
  );
};

export default MenuComponent;
