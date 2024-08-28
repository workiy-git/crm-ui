import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddFeature from "../atoms/add_feature";
import SlideButton from '../atoms/slide_button';
import WidgetsList from '../molecules/WidgetList';
import { AppBar, Toolbar, IconButton, Button, Box } from '@material-ui/core';
import '../../assets/styles/MenuComponent.css';
import config from '../../config/config';  // Ensure the correct path to config file

const sessionStorageKey = 'selectedTexts';
const selectedButtonIndexKey = 'selectedButtonIndex';

const MenuComponent = ({ backgroundColor, onSaveSelectedText }) => {
  const [selectedTexts, setSelectedTexts] = useState([]);
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
  };

  const handleScrollLeft = () => {
    setScrollIndex(Math.max(0, scrollIndex - 1));
  };

  const handleScrollRight = () => {
    setScrollIndex(Math.min(selectedTexts.length - 6, scrollIndex + 1));
  };

  // const handleButtonClick = async (index, texts = selectedTexts) => {
  //   setSelectedButtonIndex(index);
  //   sessionStorage.setItem(selectedButtonIndexKey, index);

  //   if (texts.length > index && index >= 0) {
  //     const selectedMenuKey = texts[index].title.toLowerCase(); // Convert title to lowercase
  //     console.log('Selected Menu Key:', selectedMenuKey);

  //     try {
  //       const response = await axios.post(
  //         `${config.apiUrl}/dashboards/retrieve`,
  //         [
  //           {
  //             "$match": {
  //               "dashboardName": selectedMenuKey
  //             }
  //           },
  //           {
  //             "$sort": { "createdAt": -1 }
  //           }
  //         ],
  //         {
  //           headers: {
  //             'Content-Type': 'application/json',
  //           }
  //         }
  //       );
  //       console.log('dashboardName:', selectedMenuKey); // Log selected menu key for inspection
  //       console.log('Response Data:', response.data); // Log entire response data for inspection

  //       if (response.status === 200 && response.data && response.data.data) {
  //         const fetchedWidgets = response.data.data;
  //         console.log('Fetched Widgets:', fetchedWidgets); // Log fetched widgets for inspection

  //         // Filter widgets based on selectedMenuKey
  //         const matchedWidgets = fetchedWidgets.filter(widget => widget.dashboardName === selectedMenuKey);
  //         console.log('Matched Widgets:', matchedWidgets); // Log matched widgets for inspection

  //         setWidgets(matchedWidgets); // Set state with filtered widgets
  //         setDashboardName(selectedMenuKey); // Set dashboardName state
  //       } else {
  //         console.log('No widget data found or incorrect structure');
  //         setWidgets([]);
  //         setDashboardName(null);
  //       }
  //     } catch (error) {
  //       console.error('Error retrieving widgets data:', error);
  //       setWidgets([]);
  //       setDashboardName(null);
  //     }
  //   } else {
  //     console.error('Invalid index or selectedTexts array');
  //   }
  // };

  const handleButtonClick = (index, texts = selectedTexts) => {
    setSelectedButtonIndex(index);
    sessionStorage.setItem(selectedButtonIndexKey, index);

    if (texts.length > index && index >= 0) {
      const selectedMenuKey = texts[index].title.toLowerCase(); // Convert title to lowercase
      setDashboardName(selectedMenuKey);
    }
  };

  return (
    <>
      <AppBar position="static" className="menu-appBar" style={{ background: '#F5BD71' }}>
        <Toolbar style={{minHeight:'50px'}} className="menu-toolbar">
          <Box className="menu-selectedTextContainer">
            {selectedTexts.slice(scrollIndex, scrollIndex + 9).map((text, index) => (
              <Box key={index} className="menu-selectedTextItem">
                <Button
                  variant="contained"
                  color={selectedButtonIndex === index ? "secondary" : "primary"}
                  className="menu-featureButton"
                  onClick={() => handleButtonClick(index)}
                  style={{ backgroundColor: selectedButtonIndex === index ? '#2C2C2CB2 ' : 'transparent', color: selectedButtonIndex === index ? '#ffff' : '#ffff', textTransform: 'none', boxShadow: 'none', borderRadius: selectedButtonIndex === index ?  '15px' : '', width:'max-content', padding: '3px 0px'
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
            <div className="menu-iconButton">
              <AddFeature onSaveSelectedText={handleSaveSelectedText} storedSelectedTexts={selectedTexts} />
            </div>
            <IconButton style={{visibility:'hidden'}} className="menu-iconButton" onClick={() => console.log('Refresh clicked')}>
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