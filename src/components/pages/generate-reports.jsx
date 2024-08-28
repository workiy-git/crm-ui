import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config/config';

const GenerateReportPage = () => {
  const [webforms, setWebforms] = useState([]);
  const [selectedPageName, setSelectedPageName] = useState('');
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Fetch the list of pages from the webforms collection
    const fetchWebforms = async () => {
      try {
        const response = await axios.get(
          `${config.apiUrl.replace(/\/$/, '')}/webforms`
        ); // Replace with your API endpoint
        setWebforms(response.data.data);
      } catch (error) {
        console.error('Error fetching webforms:', error);
      }
    };

    fetchWebforms();
  }, []);

  useEffect(() => {
    // Update fields when selectedPageName changes
    if (selectedPageName) {
      const selectedPage = webforms.find(page => page.pageName === selectedPageName);
      if (selectedPage) {
        setFields(selectedPage.fields);
      }
    } else {
      setFields([]);
    }
  }, [selectedPageName, webforms]);

  const handleFieldSelection = (fieldName) => {
    setSelectedFields(prevFields =>
      prevFields.includes(fieldName)
        ? prevFields.filter(f => f !== fieldName)
        : [...prevFields, fieldName]
    );
  };

  const handleConditionChange = (fieldName, condition, value) => {
    setConditions(prevConditions => {
      const existingCondition = prevConditions.find(cond => cond.field === fieldName);
      if (existingCondition) {
        return prevConditions.map(cond =>
          cond.field === fieldName ? { field: fieldName, condition, value } : cond
        );
      } else {
        return [...prevConditions, { field: fieldName, condition, value }];
      }
    });
  };

  const handleGenerateReport = async () => {
    // Prepare the data to be sent to the backend
    const selectedPage = webforms.find(page => page.pageName === selectedPageName);
    if (!selectedPage) {
      console.error('No page selected or page not found');
      return;
    }

    const pageId = selectedPage._id; // Assuming each page has a unique _id
    const dataToSend = {
      pageName: selectedPageName,
      pageId,
      fields: selectedFields,
      conditions: conditions.map(cond => ({
        field: cond.field,
        condition: cond.condition,
        value: cond.value,
      })),
    };

    try {
      const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/create`, dataToSend);
      console.log('Report submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const fetchFilteredData = async () => {
    // Prepare the filter criteria to fetch data
    const filterCriteria = {
      pageName: selectedPageName,
      fields: selectedFields,
      conditions: conditions.map(cond => ({
        $match: { [cond.field]: { [`$${cond.condition}`]: cond.value } }
      })),
    };

    try {
      const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/retrieve`, filterCriteria);
      setFilteredData(response.data.data); // Assuming 'data' is the key where results are returned
      console.log('Filtered data fetched successfully:', response.data.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

  return (
    <div>
      <h1>Generate Report</h1>

      {/* Stage 1: Select Page */}
      <h2>Stage 1: Select Page</h2>
      <select value={selectedPageName} onChange={(e) => setSelectedPageName(e.target.value)}>
        <option value="">Select a Page</option>
        {webforms.map((page, index) => (
          <option key={index} value={page.pageName}>
            {page.pageName}
          </option>
        ))}
      </select>

      {/* Stage 2: Select Fields */}
      {fields.length > 0 && (
        <>
          <h2>Stage 2: Select Fields</h2>
          <div>
            {fields.map((field, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={field.fieldName}
                    onChange={() => handleFieldSelection(field.fieldName)}
                  />
                  {field.label || field.fieldName}
                </label>
                {selectedFields.includes(field.fieldName) && (
                  <div>
                    <select
                      onChange={(e) =>
                        handleConditionChange(field.fieldName, e.target.value, '')
                      }
                    >
                      <option value="=">=</option>
                      <option value="!=">!=</option>
                      <option value="contains">Contains</option>
                      <option value="not">Not</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Enter value"
                      onChange={(e) =>
                        handleConditionChange(
                          field.fieldName,
                          conditions.find(cond => cond.field === field.fieldName)?.condition || '=',
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Stage 3: Define Match Criteria */}
      {conditions.length > 0 && (
        <>
          <button onClick={handleGenerateReport}>Generate Report</button>
          <button onClick={fetchFilteredData}>Fetch Filtered Data</button>
        </>
      )}

      {/* Display Filtered Data */}
      {filteredData.length > 0 && (
        <div>
          <h2>Filtered Data</h2>
          <ul>
            {filteredData.map((data, index) => (
              <li key={index}>{JSON.stringify(data)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GenerateReportPage;
