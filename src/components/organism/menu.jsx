import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFeature from "../atoms/add_feature";
import SlideButton from '../atoms/slide_button';
import CreateWidget from '../atoms/widgets';
import { AppBar, Toolbar, IconButton, Button, Box } from '@material-ui/core';
import '../../assets/styles/MenuComponent.css';
import MoleculeWidgets from '../molecules/MoleculeWidgets';
import config from '../../config/config';  // Ensure the correct path to config file

const localStorageKey = 'selectedTexts';
const selectedButtonIndexKey = 'selectedButtonIndex';

const MenuComponent = ({ backgroundColor, onSaveSelectedText }) => {
  const [selectedTexts, setSelectedTexts] = useState([]);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [dashboardName, setDashboardName] = useState(null);

  useEffect(() => {
    const storedSelectedTexts = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    const storedSelectedButtonIndex = JSON.parse(localStorage.getItem(selectedButtonIndexKey));
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
    localStorage.setItem(localStorageKey, JSON.stringify(texts));
    setScrollIndex(0);
    onSaveSelectedText(texts);
    if (texts.length > 0) {
      setSelectedButtonIndex(0);
      handleButtonClick(0, texts);
    }
  };

  const handleScrollLeft = () => {
    setScrollIndex(Math.max(0, scrollIndex - 1));
  };

  const handleScrollRight = () => {
    setScrollIndex(Math.min(selectedTexts.length - 6, scrollIndex + 1));
  };

  const handleButtonClick = async (index, texts = selectedTexts) => {
    setSelectedButtonIndex(index);
    localStorage.setItem(selectedButtonIndexKey, index);

    if (texts.length > index && index >= 0) {
      const selectedMenuKey = texts[index].title.toLowerCase(); // Convert title to lowercase
      console.log('Selected Menu Key:', selectedMenuKey);

      try {
        const response = await axios.post(
          `${config.apiUrl}/dashboards/retrieve`,
          [
            {
              "$match": {
                "dashboardName": selectedMenuKey
              }
            },
            {
              "$sort": { "createdAt": -1 }
            }
          ],
          {
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        console.log('Response Data:', response.data); // Log entire response data for inspection

        if (response.status === 200 && response.data && response.data.data) {
          const fetchedWidgets = response.data.data;
          console.log('Fetched Widgets:', fetchedWidgets); // Log fetched widgets for inspection

          // Filter widgets based on selectedMenuKey
          const matchedWidgets = fetchedWidgets.filter(widget => widget.dashboardName === selectedMenuKey);
          console.log('Matched Widgets:', matchedWidgets); // Log matched widgets for inspection

          setWidgets(matchedWidgets); // Set state with filtered widgets
          setDashboardName(selectedMenuKey); // Set dashboardName state
        } else {
          console.log('No widget data found or incorrect structure');
          setWidgets([]);
          setDashboardName(null);
        }
      } catch (error) {
        console.error('Error retrieving widgets data:', error);
        setWidgets([]);
        setDashboardName(null);
      }
    } else {
      console.error('Invalid index or selectedTexts array');
    }
  };

  return (
    <>
      <AppBar position="static" className="menu-appBar" style={{ background: '#E5E5E5' }}>
        <Toolbar style={{minHeight:'50px'}} className="menu-toolbar">
          <Box className="menu-selectedTextContainer">
            {selectedTexts.slice(scrollIndex, scrollIndex + 9).map((text, index) => (
              <Box key={index} className="menu-selectedTextItem">
                <Button
                  variant="contained"
                  color={selectedButtonIndex === index ? "secondary" : "primary"}
                  className="menu-featureButton"
                  onClick={() => handleButtonClick(index)}
                  style={{ backgroundColor: selectedButtonIndex === index ? '#80808080 ' : 'transparent', color: selectedButtonIndex === index ? '#212529' : '#212529', textTransform: 'none', boxShadow: 'none', borderBottom: selectedButtonIndex === index ?  '5px solid #FFC03D' : 'none', width:'max-content'
                    }}
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
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {dashboardName && (
        <MoleculeWidgets backgroundColor={backgroundColor} dashboardName={dashboardName} />
      )}
    </>
  );
};

export default MenuComponent;