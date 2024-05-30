import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddFeature from "../atoms/add_feature";
import { AppBar, Toolbar, IconButton, Typography, Box } from '@material-ui/core';
import Refresh from '../atoms/refresh';
import SlideButton from '../atoms/slide_button';

const localStorageKey = 'selectedTexts';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  
  },
  appBar: {
    backgroundColor: '#D9D9D9',
    boxShadow: 'none',
  
  },
  iconButton: {
    color: 'white',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  badge: {
    top: '2px',
    right: '18px',
  },
  selectedTextItem: {
    display: 'flex',
    alignItems: 'center',
    margin:'10px',
    padding:'5px',
    borderRadius:'10px',
    boxShadow:'0px 0px 3px 1px gray'

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
    width: '80%',
    marginLeft:'40px'
  },
  slideButton: {
    width: '40px',
    height: '40px',
  },
  productivityBox: {
    boxShadow: '1px 1px 5px 0px #808080',
    background: 'white',
    color: 'black',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 3rem',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '10px',
    marginRight: '1rem',
  },
  toolbar: {
    padding: 0,
    justifyContent: 'space-between',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const MenuComponent = ({ backgroundColor, onSaveSelectedText }) => {
  const classes = useStyles();
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
    setScrollIndex(Math.min(selectedTexts.length - 9, scrollIndex + 1));
  };

  return (
    <AppBar position="static" className={classes.appBar} style={{ background: backgroundColor }}>
      <Toolbar className={classes.toolbar}>
        <Box className={classes.selectedTextContainer}>
          {selectedTexts.slice(scrollIndex, scrollIndex + 9).map((text, index) => (
            <Box key={index} className={classes.selectedTextItem}>
              <img src={text.icon} alt={text.title} className={classes.selectedTextIcon} />
              <Typography style={{ width: 'max-content' }} variant="body2">{text.title}</Typography>
            </Box>
          ))}
        </Box>
        {selectedTexts.length > 9 && (
          <Box className={classes.buttonGroup}>
            <SlideButton onScrollLeft={handleScrollLeft} direction="left" />
            <SlideButton onScrollRight={handleScrollRight} direction="right" />
          </Box>
        )}
        <Box className={classes.buttonGroup}>
          <IconButton className={classes.iconButton}>
            <AddFeature onSaveSelectedText={handleSaveSelectedText} storedSelectedTexts={selectedTexts} />
          </IconButton>
          
          <IconButton className={classes.iconButton} onClick={() => console.log('Refresh clicked')}>
            <Refresh />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuComponent;