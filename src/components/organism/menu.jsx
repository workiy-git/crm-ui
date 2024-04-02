// MenuComponent.js
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import AddFeature from "../atoms/add_feature";
import Notification from '../atoms/notification';
import Refresh from '../atoms/refresh';
import Dayin from '../atoms/dayin';
import SelectedTextDisplay from '../atoms/SelectedTextDisplay';
import SlideButton from '../atoms/slide_button';

const localStorageKey = 'selectedTexts'; // Key for storing selected texts in localStorage

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: 'skyblue',
    height: '65px',
    boxShadow: 'none',
    marginLeft:"-10px",
  },
  iconButton: {
    color: 'white',
    '&:hover': {
      backgroundColor: 'transparent', // Set background color to transparent on hover
    },
  },
  badge: {
    top: '2px',
    right: '18px',
  },
}));

const MenuComponent = ({ backgroundColor }) => {
  const classes = useStyles();
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    // Load selected texts from localStorage on component mount
    const storedSelectedTexts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    setSelectedTexts(storedSelectedTexts);

    // Initially set the scrollIndex to the maximum value to start scrolling from the right
    setScrollIndex(storedSelectedTexts.length);
  }, []);

  const handleSaveSelectedText = (texts) => {
    const updatedSelectedTexts = [...selectedTexts, ...texts];
    setSelectedTexts(updatedSelectedTexts);
    // Save selected texts to localStorage
    localStorage.setItem(localStorageKey, JSON.stringify(updatedSelectedTexts));
    // Update the scrollIndex to scroll towards the left
    setScrollIndex(updatedSelectedTexts.length);
  };

  const handleScrollLeft = () => {
    if (scrollIndex > 0) {
      setScrollIndex(scrollIndex - 1);
    }
  };

  const handleScrollRight = () => {
    if (scrollIndex < selectedTexts.length - 1) {
      setScrollIndex(scrollIndex + 1);
    }
  };

  return (
    <AppBar position="static" className={classes.appBar} style={{ background: backgroundColor }}>
      <Toolbar>
        <SelectedTextDisplay selectedTexts={selectedTexts.slice(Math.max(0, scrollIndex - 5), scrollIndex)} />
        <div className={classes.grow} />
        <div style={{ marginRight: '5px' }}>
          <SlideButton onScrollLeft={handleScrollLeft} onScrollRight={handleScrollRight} />
        </div>
        <div style={{ marginLeft: "-2.5%" }}>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <Dayin />
          </Typography>
        </div>
        <IconButton className={classes.iconButton} style={{ marginLeft: "-3%" }} onClick={() => console.log('Add feature clicked')}>
          <AddFeature onSaveSelectedText={handleSaveSelectedText} />
        </IconButton>
        <IconButton className={classes.iconButton} style={{ marginLeft: "-4%" }}>
          <Badge badgeContent={18} color="error" classes={{ badge: classes.badge }}>
            <Notification />
          </Badge>
        </IconButton>
        <IconButton className={classes.iconButton} style={{ marginLeft: "-3%" }} onClick={() => console.log('Refresh clicked')}>
          <Refresh />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default MenuComponent;
