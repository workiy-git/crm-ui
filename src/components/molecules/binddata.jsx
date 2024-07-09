import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from '@mui/material';
import config from '../../config/config'; // Import the configuration file

const Search = () => {
  const [appData, setappData] = useState([]);
  const [webformData, setwebformData] = useState([]);


  useEffect(() => {
    axios.get(`${config.apiUrl}/appdata`)
      .then((response) => {
        console.log('Data received:', response.data);
        setappData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get(`${config.apiUrl}/webformdata`)
      .then((response) => {
        console.log('Data received:', response.data);
        setwebformData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);


  return (
    <Container style={{padding:'10px'}}>
     
    </Container>
  );
};

export default Search;
