import React, { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'; // npm install papaparse
import config from '../../config/config';
import { headers } from '../atoms/Authorization';

const CsvImporter = (pageName) => {
  const [csvFile, setCsvFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
    setUploadStatus('');
    setTotalCount(0);
    setUploadedCount(0);
  };

  const handleFileUpload = () => {
    if (!csvFile) {
      setUploadStatus('Please select a CSV file to upload.');
      return;
    }

    setIsLoading(true);
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const records = result.data;
        setTotalCount(records.length);
        setUploadedCount(0);
        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          try {
            const transformedRecord = Object.entries(record).reduce((acc, [key, value]) => {
              acc[key] = String(value ?? '');
              return acc;
            }, {});

            const now = new Date();
            transformedRecord.created_time = now.toISOString().slice(0, 16);
            transformedRecord.pageName = pageName.pageName;

            await axios.post(`${config.apiUrl}/appdata/create`, transformedRecord, {
              headers: headers
            });

            successCount++;
            setUploadedCount((prev) => prev + 1);
          } catch (error) {
            console.error('Error uploading record:', error.message);
            errorCount++;
          }
        }

        setUploadStatus(
          `Upload complete: ${successCount} records added successfully, ${errorCount} errors encountered.`
        );
        setIsLoading(false);
      },
      error: (err) => {
        console.error('Error parsing CSV:', err.message);
        setUploadStatus('Error parsing CSV file. Please try again.');
        setIsLoading(false);
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
          disabled={isLoading}
        />
        <button
          onClick={handleFileUpload}
          style={styles.uploadButton}
          disabled={isLoading}
        >
          {isLoading ? 'Uploading...' : 'Upload CSV'}
        </button>
      </div>

      {isLoading && (
        <p style={styles.loadingMessage}>
          Uploading... {uploadedCount} / {totalCount} records uploaded
        </p>
      )}

      {!isLoading && uploadStatus && (
        <p style={styles.statusMessage}>{uploadStatus}</p>
      )}
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
  statusMessage: {
    marginTop: '15px',
    fontSize: '1rem',
    color: '#666',
  },
  loadingMessage: {
    marginTop: '15px',
    fontSize: '1rem',
    color: '#007BFF',
    fontWeight: '500',
  },
};

export default CsvImporter;
