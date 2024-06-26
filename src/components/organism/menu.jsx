import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddFeature from "../atoms/add_feature";
import { Toolbar, IconButton, Typography, Box } from '@material-ui/core';
import axios from 'axios';
import config from '../../config/config';

const localStorageKey = 'selectedTexts';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  toolbar: {
    backgroundColor: '#D9D9D9',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  iconButton: {
    color: 'white',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  selectedTextItem: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px',
    padding: '5px',
    borderRadius: '10px',
    boxShadow: '0px 0px 3px 1px gray',
  },
  selectedTextIcon: {
    width: '30px',
    height: 'auto',
    marginRight: '5px',
  },
  selectedTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    overflowX: 'hidden',
    width: '70%',
    marginLeft: '40px',
  },
  slideButton: {
    width: '40px',
    height: '40px',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const MenuComponent = ({ onSaveSelectedText }) => {
  const classes = useStyles();
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [leftArrowIcon, setLeftArrowIcon] = useState('');
  const [rightArrowIcon, setRightArrowIcon] = useState('');

  useEffect(() => {
    const storedSelectedTexts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    console.log('Loaded selectedTexts from localStorage:', storedSelectedTexts);
    setSelectedTexts(storedSelectedTexts);
    setScrollIndex(0);

    axios.get(`${config.apiUrl}/menu_bar`)
      .then(response => {
        const menuBar = response.data.find(item => item.menu === 'menu_images');
        if (menuBar) {
          const { left_arrow_icon, right_arrow_icon } = menuBar.menu_images;
          setLeftArrowIcon(left_arrow_icon.icon);
          setRightArrowIcon(right_arrow_icon.icon);
        }
      })
      .catch(error => {
        console.error('Error fetching menu images:', error);
      });
  }, []);

  const handleSaveSelectedText = (texts) => {
    console.log('handleSaveSelectedText called with texts:', texts);
    setSelectedTexts(texts);
    localStorage.setItem(localStorageKey, JSON.stringify(texts));
    setScrollIndex(0);
    onSaveSelectedText(texts);
  };

  const handleScrollLeft = () => {
    console.log('handleScrollLeft called. Current scrollIndex:', scrollIndex);
    setScrollIndex(Math.max(0, scrollIndex - 1));
  };

  const handleScrollRight = () => {
    console.log('handleScrollRight called. Current scrollIndex:', scrollIndex, 'Selected texts length:', selectedTexts ? selectedTexts.length : 0);
    if (selectedTexts && selectedTexts.length > 6) {
      setScrollIndex(Math.min(selectedTexts.length - 6, scrollIndex + 1));
    }
  };

  return (
    <Box className={classes.toolbar}>
      {selectedTexts && selectedTexts.length > 6 && (
        <IconButton onClick={handleScrollLeft} className={classes.iconButton}>
          <img src={leftArrowIcon} alt="left arrow" className={classes.slideButton} />
        </IconButton>
      )}
      <Box className={classes.selectedTextContainer}>
        {selectedTexts && selectedTexts.slice(scrollIndex, scrollIndex + 6).map((text, index) => (
          <Box key={index} className={classes.selectedTextItem}>
            <img src={text.icon} alt={text.title} className={classes.selectedTextIcon} />
            <Typography style={{ width: 'max-content' }} variant="body2">{text.title}</Typography>
          </Box>
        ))}
      </Box>
      {selectedTexts && selectedTexts.length > 6 && (
        <IconButton onClick={handleScrollRight} className={classes.iconButton}>
          <img src={rightArrowIcon} alt="right arrow" className={classes.slideButton} />
        </IconButton>
      )}
      <Box className={classes.buttonGroup}>
        <IconButton className={classes.iconButton}>
          <AddFeature onSaveSelectedText={handleSaveSelectedText} storedSelectedTexts={selectedTexts} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MenuComponent;
