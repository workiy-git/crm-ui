import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Badge, Typography } from '@material-ui/core';
import AddFeature from "../atoms/add_feature";
import Notification from '../atoms/notification';
import Refresh from '../atoms/refresh';
import Dayin from '../atoms/dayin';
import SelectedTextDisplay from '../atoms/SelectedTextDisplay';
import SlideButton from '../atoms/slide_button';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    backgroundColor: 'skyblue',
    height: '65px',
    boxShadow: 'none',
    borderTopLeftRadius:"10px",
  },
  iconButton: {
    color: 'white',
    marginRight: "-40px",
    '&:hover': {
      backgroundColor: 'transparent', // Set background color to transparent on hover
    },
  },
  badge: {
    top: '2px',
    right: '18px',
  },
}));

const MenuComponent = ({ backgroundColor }) => { // Accept backgroundColor prop
  const classes = useStyles();
  const [selectedTexts, setSelectedTexts] = useState([]);

  const handleSaveSelectedText = (text) => {
    if (!selectedTexts.includes(text)) {
      setSelectedTexts([...selectedTexts, text]);
    } else {
      setSelectedTexts(selectedTexts.filter(item => item !== text));
    }
  };

  return (
    <AppBar position="static" className={classes.appBar} style={{ background: backgroundColor }}> {/* Use backgroundColor prop */}
      <Toolbar>

        <SelectedTextDisplay selectedTexts={selectedTexts} />
        <div className={classes.grow} />
        <IconButton className={classes.iconButton} >
          <SlideButton /> {/* Moved SlideButton to the left */}
        </IconButton>
        <div style={{ marginLeft: "0.7%" }}> {/* This will push Dayin to the right */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            <Dayin  /> 
          </Typography>
        </div>
        <IconButton className={classes.iconButton} style={{ marginLeft: "-2.5%" }} onClick={() => console.log('Add feature clicked')}>
          <AddFeature onSaveSelectedText={handleSaveSelectedText} />
        </IconButton>
        <IconButton className={classes.iconButton} style={{ marginLeft: "-0.5%" }}>
          <Badge badgeContent={18} color="error" classes={{ badge: classes.badge }}>
            <Notification />
          </Badge>
        </IconButton>
        <IconButton className={classes.iconButton} onClick={() => console.log('Refresh clicked')}>
          <Refresh />
        </IconButton>
     
      </Toolbar>
    </AppBar>
  );
};

export default MenuComponent;
