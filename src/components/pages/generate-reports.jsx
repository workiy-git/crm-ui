

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel, Button } from '@mui/material';
import config from '../../config/config';
import { Margin } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';

const GenerateReportPage = () => {
  const [fields, setFields] = useState([]);
  const [filterConditions, setFilterConditions] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedField, setSelectedField] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [pageNames, setPageNames] = useState([]);
  const [selectedPageName, setSelectedPageName] = useState([]);
  const [moduleFields, setModuleFields] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedFieldConditions, setSelectedFieldConditions] = useState({});
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      const storedWebforms = sessionStorage.getItem('webforms');
      const storedFilterConditions = sessionStorage.getItem('filterConditions');

      if (storedWebforms && storedFilterConditions) {
        const webforms = JSON.parse(storedWebforms);
        const filterConditions = JSON.parse(storedFilterConditions);

        const reportsPage = webforms.find(page => page.pageName === 'reports');
        if (reportsPage) {
          setFields(reportsPage.fields);
          console.log('Fields set:', reportsPage.fields); // Log the fields
        }

        const pageNames = webforms.map(page => page.pageName);
        setPageNames(pageNames);
        setFilterConditions(filterConditions);
      } else {
        try {
          const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`);
          const webforms = response.data.data;
          sessionStorage.setItem('webforms', JSON.stringify(webforms));

          const reportsPage = webforms.find(page => page.pageName === 'reports');
          if (reportsPage) {
            setFields(reportsPage.fields);
            console.log('Fields set:', reportsPage.fields); // Log the fields
          }

          const pageNames = webforms.map(page => page.pageName);
          setPageNames(pageNames);

          const filterResponse = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms/reportfilters`);
          const filterConditions = filterResponse.data.data.filterConditions;
          sessionStorage.setItem('filterConditions', JSON.stringify(filterConditions));
          setFilterConditions(filterConditions);
        } catch (error) {
          console.error('Error fetching fields:', error);
        }
      }
    };

    fetchFields();
  }, []);

  const handleInputChange = async (e, fieldName) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prevState => ({
      ...prevState,
      [fieldName]: value,
    }));
  
    if (fieldName === 'module') {
      const storedWebforms = sessionStorage.getItem('webforms');
      if (storedWebforms) {
        const webforms = JSON.parse(storedWebforms);
        const selectedPage = webforms.find(page => page.pageName === value);
        console.log('Selected page:', selectedPage.pageName); // Log the selected page
        if (selectedPage) {
          setModuleFields(selectedPage.fields);
          setAvailableColumns(selectedPage.fields);
          setSelectedPageName(value); // Update selectedPageName with the module value
        }
      } else {
        try {
          const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`);
          const webforms = response.data.data;
          sessionStorage.setItem('webforms', JSON.stringify(webforms));
          const selectedPage = webforms.find(page => page.pageName === value);
          console.log('Selected page:', selectedPage.pageName); // Log the selected page
          if (selectedPage) {
            setModuleFields(selectedPage.fields);
            setAvailableColumns(selectedPage.fields);
            setSelectedPageName(value); // Update selectedPageName with the module value
          }
        } catch (error) {
          console.error('Error fetching module fields:', error);
        }
      }
    }
  };

  const handleFieldSelection = (fieldName) => {
    setSelectedFields(prevFields =>
      prevFields.includes(fieldName)
        ? prevFields.filter(f => f !== fieldName)
        : [...prevFields, fieldName]
    );
  };

  // const handleConditionChange = (fieldName, condition, value) => {
  //   setConditions(prevConditions => {
  //     const existingCondition = prevConditions.find(cond => cond.field === fieldName);
  //     if (existingCondition) {
  //       console.log('Selected Condition:', condition);
  //       return prevConditions.map(cond =>
  //         cond.field === fieldName ? { field: fieldName, condition, value } : cond
  //       );
  //     } else {
  //       console.log('Selected Condition:', condition);
  //       return [...prevConditions, { field: fieldName, condition, value }];
  //     }
  //   });
  // };
  const handleConditionChange = (fieldName, condition, value, index) => {
    setConditions(prevConditions => {
      const newConditions = [...prevConditions];
      newConditions[index] = { ...newConditions[index], condition, value };
      return newConditions;
    });
  };

  const addCondition = () => {
    setConditions(prevConditions => [...prevConditions, { field: '', condition: '', value: '' }]);
  };

  const handleFieldSelectChange = async (selectedPageName, fieldName, selectedField, index) => {
    console.log('Selected pageName:', selectedPageName, 'Selected field:', selectedField);
    
    const webforms = JSON.parse(sessionStorage.getItem('webforms'));
    console.log('Webforms:', webforms);
    const selectedPage = webforms.find(page => page.pageName === selectedPageName);
    const fieldType = selectedPage?.fields.find(f => f.fieldName === selectedField)?.dataType;
    
    console.log('Selected field:', selectedField, 'Field type:', fieldType);

    if (!fieldType) {
      console.error(`Field type for selected field "${selectedField}" not found.`);
      setSelectedFieldConditions(prevState => ({
        ...prevState,
        [fieldName]: {}
      }));
      return;
    }

    const storedFilterConditions = sessionStorage.getItem('filterConditions');
    if (storedFilterConditions) {
      const filterConditions = JSON.parse(storedFilterConditions);
      const matchedConditions = filterConditions[fieldType] || {};

      console.log('Matched conditions from storage:', matchedConditions);

      setSelectedFieldConditions(prevState => ({
        ...prevState,
        [selectedField]: matchedConditions
      }));
    } else {
      try {
        const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms/reportfilters`);
        const filterConditions = response.data.data.filterConditions;
        sessionStorage.setItem('filterConditions', JSON.stringify(filterConditions));
        const matchedConditions = filterConditions[fieldType] || {};

        console.log('Matched conditions from API:', matchedConditions);

        setSelectedFieldConditions(prevState => ({
          ...prevState,
          [selectedField]: matchedConditions
        }));
      } catch (error) {
        console.error('Error fetching filter conditions:', error);
        setSelectedFieldConditions(prevState => ({
          ...prevState,
          [selectedField]: {}
        }));
      }
    }

    // Update the selected field for the specific filter
    setConditions(prevConditions => {
      const newConditions = [...prevConditions];
      newConditions[index] = { ...newConditions[index], field: selectedField };
      return newConditions;
    });

    handleConditionChange(selectedField, '', '', index);
  };

  const constructQuery = (field, condition, value) => {
    const fieldType = fields.find(f => f.fieldName === field)?.dataType;
    console.log('Constructing query for field:', field, 'with type:', fieldType); // Log the field type
    const conditionConfig = filterConditions[fieldType]?.[condition];

    if (!conditionConfig) return {};

    if (conditionConfig.operator === '$regex' || conditionConfig.suboperator === '$regex') {
      return { [field]: { [conditionConfig.operator]: value, $options: conditionConfig.options } };
    } else if (conditionConfig.operator === '$not') {
      return { [field]: { $not: { [conditionConfig.suboperator]: value, $options: conditionConfig.options } } };
    } else {
      return { [field]: { [conditionConfig.operator]: value } };
    }
  };

  const handleGenerateReport = async () => {
    // Construct the initial pipeline
    const pipeline = [
      { "$match": { "pageName": formData.module } },
      { "$project": selectedFields.reduce((acc, column) => ({ ...acc, [column]: 1 }), {}) }
    ];

    // Combine all filter conditions into a single $match stage
    const combinedMatchStage = conditions.reduce((acc, filter) => {
      const conditionConfig = selectedFieldConditions[filter.field]?.[filter.condition];
      console.log('filter.field:', filter.field);
      console.log('filter.condition:', filter.condition);
      console.log('conditionConfig:', conditionConfig);
      console.log('selectedFieldConditions:', selectedFieldConditions);

      if (conditionConfig) {
        if (conditionConfig.operator === '$not') {
          acc[filter.field] = { $not: { [conditionConfig.suboperator]: filter.value, $options: conditionConfig.options } };
        } else {
          acc[filter.field] = { [conditionConfig.operator]: filter.value };
        }
      }
      return acc;
    }, {});

    // Add the combined $match stage to the pipeline
    pipeline.push({ "$match": combinedMatchStage });

    console.log('pipeline:', pipeline);

    // Construct the data object dynamically
    const dataToSend = {
      pageName: 'reports',
      filter: conditions.map(cond => ({
        field: cond.field,
        condition: cond.condition,
        value: cond.value,
        operator: selectedFieldConditions[cond.field]?.[cond.condition]?.operator
      })),
      formatted_filter: pipeline
    };

    // Add other fields dynamically from formData
    Object.keys(formData).forEach(key => {
      if (key !== 'pageName' && key !== 'filter') {
        dataToSend[key] = formData[key];
      }
    });

    // Add selected columns
    dataToSend.selected_columns = selectedFields;

    try {
      const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/create`, dataToSend);
      console.log('Report submitted successfully:', response.data);

      // Navigate to /view-report with the filtered data
      navigate('/view-report', { state: { filteredData: response.data } });
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

 

  const handleViewReport = async () => {
    if (!selectedRow) return;
  
    try {
      // Fetch the app data using the ID from the selected row
      const reportId = selectedRow._id;
      const reportResponse = await axios.get(
        `${config.apiUrl.replace(/\/$/, "")}/appdata/${reportId}`
      );
      
      const reportData = reportResponse.data.data;
      console.log('Fetched report data:', reportData);
  
      const module = reportData.module || 'defaultModule';
      const selectedColumns = Array.isArray(reportData.selected_columns) ? reportData.selected_columns : [];
      const filters = Array.isArray(reportData.filter) ? reportData.filter : [];
  
      const pipeline = reportData.formatted_filter;
  
      console.log('Pipeline array:', pipeline);
  
      // Ensure the pipeline is sent directly as an array
      const appDataResponse = await axios.post(
        `${config.apiUrl.replace(/\/$/, "")}/appdata/retrieve`,
        pipeline,  // Send the pipeline array directly
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      const filteredData_reportId = appDataResponse.data.data; // Store the fetched data
      console.log('Fetched app data:', filteredData_reportId);
  
      // Update the state with the fetched data
      setFilteredData(filteredData_reportId);
  
      // Navigate to the ReportGrid component and pass the filtered data
      navigate('/view-report', { state: { filteredData: filteredData_reportId } });
  
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };
  
  // Ensure you have a navigate hook
  const navigate = useNavigate();

  const renderInputField = (field) => {
    const isFileInput = field.type === 'file';
    const value = !isFileInput && (formData[field.fieldName] === 'N/A' ? '' : formData[field.fieldName] || '');
    const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;
    const isRequired = field.required === 'true';
  
    const commonProps = {
      name: field.fieldName,
      placeholder: field.placeholder || 'Not Specified',
      fullWidth: true,
      onChange: (e) => handleInputChange(e, field.fieldName),
      ...(isRequired && { required: true }) // Add the required property if isRequired is true
    };
  
    const inputProps = {
      ...(isFileInput ? {} : { value }),
      ...(field.pattern && { pattern: field.pattern }), // Apply pattern if provided
    };
  
    if (!isFileInput) {
      commonProps.value = value;
    }
  
    const formControlStyles = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '70%',
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: 1,
      paddingTop: 1,
      paddingLeft: 2,
      paddingRight: 2,
      boxSizing: 'border-box',
      margin: 'auto'
    };
  
    const labelStyles = {
      width: '40%',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#333',
      fontSize: '12px',
    };
  
    switch (field.htmlControl) {
      case 'input':
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={formControlStyles}>
            <label style={labelStyles}>{label}</label>
            <TextField
              className='edit-field-input'
              {...commonProps}
              sx={{
                width: '50%',
                textAlign: 'left',
                color: '#666',
                fontSize: '12px',
              }}
              type={field.type || 'text'}
              inputProps={inputProps}
            />
          </FormControl>
        );
      case 'select':
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={formControlStyles}>
          <label style={labelStyles}>{label}</label>
          <Select
            className='edit-field-input'
            {...commonProps}
            value={field.fieldName === 'selected_columns' ? selectedFields : (formData[field.fieldName] || '')}
            style={{
              width: '50%',
              textAlign: 'left',
              color: '#666',
              fontSize: '12px',
            }}
            displayEmpty
            multiple={field.fieldName === 'selected_columns'}
            renderValue={(selected) => {
              // Check if field uses multiple values (like checkboxes)
              if (Array.isArray(selected) && field.fieldName === 'selected_columns') {
                // Find the labels of the selected columns
                return selected
                  .map(sel => moduleFields.find(field => field.fieldName === sel)?.label || sel)
                  .join(', ');
              }
              // For other cases
              return Array.isArray(selected) ? selected.join(', ') : selected;
            }}
            onChange={(e) => 
              field.fieldName === 'selected_columns' 
                ? setSelectedFields(e.target.value) 
                : handleInputChange(e, field.fieldName)
            }
          >
            <MenuItem className='edit-field-input-select' disabled value="">
              Select an option
            </MenuItem>
            {field.fieldName === 'module' ? (
              pageNames.map((pageName, index) => (
                <MenuItem className='edit-field-input-select' key={index} value={pageName}>
                  {pageName}
                </MenuItem>
              ))
            ) : (
              Array.isArray(field.options) && field.options.map((option, index) => (
                <MenuItem className='edit-field-input-select' key={index} value={option}>
                  {option}
                </MenuItem>
              ))
            )}
            {field.fieldName === 'selected_columns' && moduleFields.map((column, index) => (
              <MenuItem className='edit-field-input-select' key={index} value={column.fieldName}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFields.includes(column.fieldName)}
                      onChange={() => handleFieldSelection(column.fieldName)}
                    />
                  }
                  label={column.label}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        );
      case 'checkbox':
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={formControlStyles}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData[field.fieldName] || false}
                  onChange={(e) => handleInputChange(e, field.fieldName)}
                />
              }
              label={label}
            />
          </FormControl>
        );
      case 'file':
        return (
          <FormControl className='details_page_inputs' key={field.fieldName} style={formControlStyles}>
            <label style={labelStyles}>{label}</label>
            <input
              className='edit-field-input'
              type='file'
              name={field.fieldName}
              onChange={(e) => handleInputChange(e, field.fieldName)}
            />
          </FormControl>
        );
      default:
        return null;
    }
  };
  const renderInputFields = (field) => {
    const isFileInput = field.type === 'file';
    const value = !isFileInput && (formData[field.fieldName] === 'N/A' ? '' : formData[field.fieldName] || '');
    const label = `${field.label || field.fieldName}${field.required ? ' *' : ''}`;
    const isRequired = field.required === 'true';
  
    const commonProps = {
      name: field.fieldName,
      placeholder: field.placeholder || 'Not Specified',
      fullWidth: true,
      onChange: (e) => handleInputChange(e, field.fieldName),
      ...(isRequired && { required: true }) // Add the required property if isRequired is true
    };
  
    const inputProps = {
      ...(isFileInput ? {} : { value }),
      ...(field.pattern && { pattern: field.pattern }), // Apply pattern if provided
    };
  
    if (!isFileInput) {
      commonProps.value = value;
    }
  
    const formControlStyles = {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      width: '50%',
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: 1,
      paddingTop: 1,
      paddingLeft: 2,
      paddingRight: 2,
      boxSizing: 'border-box',
    };
  
    const labelStyles = {
      width: '40%',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#333',
      fontSize: '12px',
    };
  
    switch (field.htmlControl) {
      
        case 'filter':
          return (
            <div key={field.fieldName}>
              {/* 
         <label>{label}</label> */}     <Button onClick={addCondition} variant="contained" style={{ marginTop: '10px', background:'#D9D9D9', color:'black', borderRadius:'100px' }}>
               <AddIcon style={{marginRight:'10px', fontSize:'20px'}}/> Add Condition
              </Button>
              {conditions.map((condition, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '10px', background:'#F5F5F5', padding:'15px', borderRadius:'10px' }}>
                  <Select
                    onChange={(e) => handleFieldSelectChange(formData.module, condition.fieldName, e.target.value, index)}
                    displayEmpty
                    value={condition.field || ''}
                    className='edit-field-input'
                    style={{ width: '60%', margin:'auto' }}
                  >
                    <MenuItem disabled value="">
                      Select field
                    </MenuItem>
                    {availableColumns.length > 0 && availableColumns.map((column) => (
                      <MenuItem key={column.fieldName} value={column.fieldName}>
                        {column.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <Select
                    onChange={(e) => handleConditionChange(condition.field, e.target.value, '', index)}
                    displayEmpty
                    value={condition.condition || ''}
                    className='edit-field-input'
                    style={{ width: '60%', margin:'auto' }}
                  >
                    <MenuItem disabled value="">
                      Select condition
                    </MenuItem>
                    {selectedFieldConditions[condition.field] && Object.keys(selectedFieldConditions[condition.field]).map((cond, idx) => (
                      <MenuItem key={idx} value={cond}>
                        {selectedFieldConditions[condition.field][cond].description}
                      </MenuItem>
                    ))}
                  </Select>
                  <TextField
                    type="text"
                    placeholder="Enter value"
                    value={condition.value || ''}
                    onChange={(e) => handleConditionChange(condition.field, condition.condition || '=', e.target.value, index)}
                    className='edit-field-input'
                    style={{ width: '60%', margin:'auto' }}
                  />
                </div>
              ))}
             
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <Box
      className='page_box'
      sx={{
        width: '100%',
        // padding: 2,
        boxSizing: 'border-box',
      }}
    >
      <div style={{background:'#F5BD71', color:'black', padding:'10px 20px', fontWeight:'bold'}}>Reports</div>
      <Box
        className='details_form_container'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height:'78vh'
        }}
      >
        <div style={{display:'flex', width:'100%', height:'70vh'}}>
          <div style={{width:'60%', margin: '10px', height:'100%'}}>
            <div style={{background:'#2C2C2C', color:'#FFC03D', padding:'10px'}}>Gernearte Report</div>
            <div style={{marginTop:'10px', height:'80%', overflow:'auto'}}>{fields.map((field) => renderInputField(field))}</div>
          </div>
          <div style={{width:'35%', margin: '10px', height:'100%'}}>
            <div style={{background:'#2C2C2C', color:'#FFC03D', padding:'10px', display:'flex', alignItems:'center'}}> <FilterAltOutlinedIcon style={{marginRight:'10px', borderRadius:'5px', padding:'1px', border: '1px solid'}}/> Filter</div>
            <div style={{height:'80%', overflow:'auto'}}>{fields.map((field) => renderInputFields(field))}</div>
          </div>
        </div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            marginTop: 2,
          }}
        >
          <button
            type="button"
            onClick={handleGenerateReport}
            style={{ backgroundColor: '#D9D9D9', color: 'black', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius:'10px', fontWeight:'bold' }}
          >
            Generate Report
          </button>
         
        </Box>
        {filteredData.length > 0 && (
          <Box
            sx={{
              width: '100%',
              marginTop: 2,
              padding: 2,
              backgroundColor: '#fff',
              boxShadow: 1,
              borderRadius: 1,
            }}
          >
            <h3>Filtered Data:</h3>
            <pre>{JSON.stringify(filteredData, null, 2)}</pre>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default GenerateReportPage;