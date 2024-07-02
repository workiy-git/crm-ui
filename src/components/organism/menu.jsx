import React, { useState, useEffect } from 'react';
import AddFeature from "../atoms/add_feature";
import { AppBar, Toolbar, IconButton, Typography, Box } from '@material-ui/core';
import Refresh from '../atoms/refresh';
import SlideButton from '../atoms/slide_button';
import '../../assets/styles/MenuComponent.css'; 

const localStorageKey = 'selectedTexts';
const MenuComponent = ({ backgroundColor, onSaveSelectedText }) => {
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);

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
  };

  const handleScrollLeft = () => {
    setScrollIndex(Math.max(0, scrollIndex - 1));
  };

  const handleScrollRight = () => {
    setScrollIndex(Math.min(selectedTexts.length - 6, scrollIndex + 1));
  };

  return (

    <AppBar position="static" className="menu-appBar"style={{ background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)' }}>
      <Toolbar className="menu-toolbar">
        <Box className="menu-selectedTextContainer">
          {selectedTexts.slice(scrollIndex, scrollIndex + 9).map((text, index) => ( 
            <Box key={index} className="menu-selectedTextItem">
              <img src={text.icon} alt={text.title} className="menu-selectedTextIcon" />
              <Typography className="menu-text" variant="body2">{text.title}</Typography>
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
  );
};

export default MenuComponent;