import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'; // Install via npm: npm install papaparse
import config from '../../config/config';
import { headers } from '../atoms/Authorization'


const CsvImporter = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Handle file selection
  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
    setUploadStatus('');
  };

  // Parse and upload CSV data
  const handleFileUpload = () => {
    if (!csvFile) {
      setUploadStatus('Please select a CSV file to upload.');
      return;
    }
  
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const records = result.data;
  
        let successCount = 0;
        let errorCount = 0;
  
        for (const record of records) {
          try {
            // Store all values as strings
            const transformedRecord = Object.entries(record).reduce((acc, [key, value]) => {
              acc[key] = String(value ?? ''); // Ensure null/undefined are handled as empty strings
              return acc;
            }, {});
  
            // Send record to the API
            await axios.post(`${config.apiUrl}/appdata/create`, transformedRecord, {
              headers: headers
            });
  
            successCount++;
          } catch (error) {
            console.error('Error uploading record:', error.message);
            errorCount++;
          }
        }
  
        setUploadStatus(
          `Upload complete: ${successCount} records added successfully, ${errorCount} errors encountered.`
        );
      },
      error: (err) => {
        console.error('Error parsing CSV:', err.message);
        setUploadStatus('Error parsing CSV file. Please try again.');
      },
    });
  };
  

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>CSV Importer</h1>
      <div style={styles.fileInputContainer}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        <button onClick={handleFileUpload} style={styles.uploadButton}>
          Upload CSV
        </button>
      </div>
      {uploadStatus && <p style={styles.statusMessage}>{uploadStatus}</p>}
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '20px auto',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333',
  },
  fileInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center',
  },
  fileInput: {
    display: 'block',
    padding: '10px',
    fontSize: '1rem',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  uploadButton: {
    padding: '10px 20px',
    fontSize: '1rem',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  uploadButtonHover: {
    backgroundColor: '#0056b3',
  },
  statusMessage: {
    marginTop: '15px',
    fontSize: '1rem',
    color: '#666',
  },
};

export default CsvImporter;
