import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import axios from 'axios';
import Grid from '../organism/grid';
import config from '../../config/config';
import Loader from '../molecules/loader'; // Assuming Loader component is located here

const Container = () => {
  const { pageName } = useParams();
  const endpoint = '/appdata/retrieve';
  const [backgroundColor] = useState(localStorage.getItem('backgroundColor') || '#d9d9d9');
  const [rows, setRows] = useState([]);
  const [webformSchema, setWebformSchema] = useState([]);
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (filter = {}) => {
    setLoading(true);
    try {
      const postData = [
        {
          "$match": {
            "pageName": pageName,
            ...filter
          }
        }
      ];

      const appdataResponse = await axios.post(`${config.apiUrl.replace(/\/$/, '')}${endpoint}`, postData, {
        headers: { 'Content-Type': 'application/json' }
      });

      const webformResponse = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`);

      const appdata = appdataResponse.data.data;
      const webform = webformResponse.data.data;

      setRows(appdata);
      const schemaForPage = webform.find((page) => page.pageName === pageName);
      setWebformSchema(schemaForPage?.fields || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrors('Error fetching data');
    } finally {
      setLoading(false);
    }
  }, [endpoint, pageName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilterChange = (filter) => {
    fetchData(filter);
  };

  return (
    <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden' }}>
      <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
        <div style={{ width: '100%', backgroundColor: backgroundColor, overflow: 'hidden' }}>
          <Typography style={{ color: 'white', padding: '5px 10px', fontSize: '25px', background: 'linear-gradient(90deg, rgba(12,45,78,1) 0%, rgba(28,104,180,1) 100%)', fontWeight:'bold' }}>
            {pageName.charAt(0).toUpperCase() + pageName.slice(1)}
          </Typography>
          {loading ? <Loader /> : <Grid rows={rows} webformSchema={webformSchema} onFilterChange={handleFilterChange} pageName={pageName} />}
        </div>
      </div>
    </div>
  );
};

export default Container;
