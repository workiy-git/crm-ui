// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from '../../config/config';

// const GenerateReportPage = () => {
//   const [webforms, setWebforms] = useState([]);
//   const [selectedPageName, setSelectedPageName] = useState('');
//   const [fields, setFields] = useState([]);
//   const [selectedFields, setSelectedFields] = useState([]);
//   const [conditions, setConditions] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     // Fetch the list of pages from the webforms collection
//     const fetchWebforms = async () => {
//       try {
//         const response = await axios.get(
//           `${config.apiUrl.replace(/\/$/, '')}/webforms`
//         ); // Replace with your API endpoint
//         setWebforms(response.data.data);
//       } catch (error) {
//         console.error('Error fetching webforms:', error);
//       }
//     };

//     fetchWebforms();
//   }, []);

//   useEffect(() => {
//     // Update fields when selectedPageName changes
//     if (selectedPageName) {
//       const selectedPage = webforms.find(page => page.pageName === selectedPageName);
//       if (selectedPage) {
//         setFields(selectedPage.fields);
//       }
//     } else {
//       setFields([]);
//     }
//   }, [selectedPageName, webforms]);

//   const handleFieldSelection = (fieldName) => {
//     setSelectedFields(prevFields =>
//       prevFields.includes(fieldName)
//         ? prevFields.filter(f => f !== fieldName)
//         : [...prevFields, fieldName]
//     );
//   };

//   const handleConditionChange = (fieldName, condition, value) => {
//     setConditions(prevConditions => {
//       const existingCondition = prevConditions.find(cond => cond.field === fieldName);
//       if (existingCondition) {
//         return prevConditions.map(cond =>
//           cond.field === fieldName ? { field: fieldName, condition, value } : cond
//         );
//       } else {
//         return [...prevConditions, { field: fieldName, condition, value }];
//       }
//     });
//   };

//   const handleGenerateReport = async () => {
//     // Prepare the data to be sent to the backend
//     const selectedPage = webforms.find(page => page.pageName === selectedPageName);
//     if (!selectedPage) {
//       console.error('No page selected or page not found');
//       return;
//     }

//     const pageId = selectedPage._id; // Assuming each page has a unique _id
//     const dataToSend = {
//       pageName: selectedPageName,
//       pageId,
//       fields: selectedFields,
//       conditions: conditions.map(cond => ({
//         field: cond.field,
//         condition: cond.condition,
//         value: cond.value,
//       })),
//     };

//     try {
//       const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/create`, dataToSend);
//       console.log('Report submitted successfully:', response.data);
//     } catch (error) {
//       console.error('Error submitting report:', error);
//     }
//   };

//   const fetchFilteredData = async () => {
//     // Prepare the filter criteria to fetch data
//     const filterCriteria = {
//       pageName: selectedPageName,
//       fields: selectedFields,
//       conditions: conditions.map(cond => ({
//         $match: { [cond.field]: { [`$${cond.condition}`]: cond.value } }
//       })),
//     };

//     try {
//       const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/retrieve`, filterCriteria);
//       setFilteredData(response.data.data); // Assuming 'data' is the key where results are returned
//       console.log('Filtered data fetched successfully:', response.data.data);
//     } catch (error) {
//       console.error('Error fetching filtered data:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Generate Report</h1>

//       {/* Stage 1: Select Page */}
//       <h2>Stage 1: Select Page</h2>
//       <select value={selectedPageName} onChange={(e) => setSelectedPageName(e.target.value)}>
//         <option value="">Select a Page</option>
//         {webforms.map((page, index) => (
//           <option key={index} value={page.pageName}>
//             {page.pageName}
//           </option>
//         ))}
//       </select>

//       {/* Stage 2: Select Fields */}
//       {fields.length > 0 && (
//         <>
//           <h2>Stage 2: Select Fields</h2>
//           <div>
//             {fields.map((field, index) => (
//               <div key={index}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={field.fieldName}
//                     onChange={() => handleFieldSelection(field.fieldName)}
//                   />
//                   {field.label || field.fieldName}
//                 </label>
//                 {selectedFields.includes(field.fieldName) && (
//                   <div>
//                     <select
//                       onChange={(e) =>
//                         handleConditionChange(field.fieldName, e.target.value, '')
//                       }
//                     >
//                       <option value="=">=</option>
//                       <option value="!=">!=</option>
//                       <option value="contains">Contains</option>
//                       <option value="not">Not</option>
//                     </select>
//                     <input
//                       type="text"
//                       placeholder="Enter value"
//                       onChange={(e) =>
//                         handleConditionChange(
//                           field.fieldName,
//                           conditions.find(cond => cond.field === field.fieldName)?.condition || '=',
//                           e.target.value
//                         )
//                       }
//                     />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Stage 3: Define Match Criteria */}
//       {conditions.length > 0 && (
//         <>
//           <button onClick={handleGenerateReport}>Generate Report</button>
//           <button onClick={fetchFilteredData}>Fetch Filtered Data</button>
//         </>
//       )}

//       {/* Display Filtered Data */}
//       {filteredData.length > 0 && (
//         <div>
//           <h2>Filtered Data</h2>
//           <ul>
//             {filteredData.map((data, index) => (
//               <li key={index}>{JSON.stringify(data)}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateReportPage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from '../../config/config';

// const GenerateReportPage = () => {
//   const [webforms, setWebforms] = useState([]);
//   const [selectedPageName, setSelectedPageName] = useState('');
//   const [fields, setFields] = useState([]);
//   const [selectedFields, setSelectedFields] = useState([]);
//   const [conditions, setConditions] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     // Fetch the list of pages from the webforms collection
//     const fetchWebforms = async () => {
//       try {
//         const response = await axios.get(
//           `${config.apiUrl.replace(/\/$/, '')}/webforms`
//         ); // Replace with your API endpoint
//         setWebforms(response.data.data);
//       } catch (error) {
//         console.error('Error fetching webforms:', error);
//       }
//     };

//     fetchWebforms();
//   }, []);

//   useEffect(() => {
//     // Update fields when selectedPageName changes
//     if (selectedPageName) {
//       const selectedPage = webforms.find(page => page.pageName === selectedPageName);
//       if (selectedPage) {
//         setFields(selectedPage.fields);
//       }
//     } else {
//       setFields([]);
//     }
//   }, [selectedPageName, webforms]);

//   const handleFieldSelection = (fieldName) => {
//     setSelectedFields(prevFields =>
//       prevFields.includes(fieldName)
//         ? prevFields.filter(f => f !== fieldName)
//         : [...prevFields, fieldName]
//     );
//   };

//   const handleConditionChange = (fieldName, condition, value) => {
//     setConditions(prevConditions => {
//       const existingCondition = prevConditions.find(cond => cond.field === fieldName);
//       if (existingCondition) {
//         return prevConditions.map(cond =>
//           cond.field === fieldName ? { field: fieldName, condition, value } : cond
//         );
//       } else {
//         return [...prevConditions, { field: fieldName, condition, value }];
//       }
//     });
//   };

//   const handleGenerateReport = async () => {
//     // Prepare the data to be sent to the backend
//     const selectedPage = webforms.find(page => page.pageName === selectedPageName);
//     if (!selectedPage) {
//       console.error('No page selected or page not found');
//       return;
//     }

//     const pageId = selectedPage._id; // Assuming each page has a unique _id
//     const dataToSend = {
//       pageName: selectedPageName,
//       module: selectedPageName,
//       pageId,
//       selected_columns: selectedFields,
//       filter: conditions.map(cond => {
//         const field = cond.field;
//         const condition = cond.condition;
//         const value = cond.value;

//         switch (condition) {
//           case '=':
//             return { [field]: value };
//           case '!=':
//             return { [field]: { $ne: value } };
//           case 'contains':
//             return { [field]: { $regex: value, $options: 'i' } };
//           case 'does not contain':
//             return { [field]: { $not: { $regex: value, $options: 'i' } } };
//           default:
//             return {};
//         }
//       }),
//     };

//     try {
//       const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/create`, dataToSend);
//       console.log('Report submitted successfully:', response.data);
//     } catch (error) {
//       console.error('Error submitting report:', error);
//     }
//   };

//   const fetchFilteredData = async () => {
//     // Prepare the filter criteria to fetch data
//     const filterCriteria = {
//       pageName: selectedPageName,
//       fields: selectedFields,
//       conditions: conditions.map(cond => {
//         const field = cond.field;
//         const condition = cond.condition;
//         const value = cond.value;
  
//         switch (condition) {
//           case '=':
//             return { [field]: value };
//           case '!=':
//             return { [field]: { $ne: value } };
//           case 'contains':
//             return { [field]: { $regex: value, $options: 'i' } };
//           case 'does not contain':
//             return { [field]: { $not: { $regex: value, $options: 'i' } } };
//           default:
//             return {};
//         }
//       }),
//     };

//     try {
//       const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/retrieve`, filterCriteria);
//       setFilteredData(response.data.data); // Assuming 'data' is the key where results are returned
//       console.log('Filtered data fetched successfully:', response.data.data);
//     } catch (error) {
//       console.error('Error fetching filtered data:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Generate Report</h1>

//       {/* Stage 1: Select Page */}
//       <h2>Stage 1: Select Page</h2>
//       <select value={selectedPageName} onChange={(e) => setSelectedPageName(e.target.value)}>
//         <option value="">Select a Page</option>
//         {webforms.map((page, index) => (
//           <option key={index} value={page.pageName}>
//             {page.pageName}
//           </option>
//         ))}
//       </select>

//       {/* Stage 2: Select Fields for $project */}
//       {fields.length > 0 && (
//         <>
//           <h2>Stage 2: Select Fields for $project</h2>
//           <div>
//             {fields.map((field, index) => (
//               <div key={index}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={field.fieldName}
//                     onChange={() => handleFieldSelection(field.fieldName)}
//                   />
//                   {field.label || field.fieldName}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Stage 3: Define Match Criteria */}
//       {fields.length > 0 && (
//         <>
//           <h2>Stage 3: Define Match Criteria</h2>
//           <div>
//             {fields.map((field, index) => (
//               <div key={index}>
//                 <label>{field.label || field.fieldName}</label>
//                 <select
//                   onChange={(e) =>
//                     handleConditionChange(field.fieldName, e.target.value, '')
//                   }
//                 >
//                   <option value="=">=</option>
//                   <option value="!=">!=</option>
//                   <option value="contains">Contains</option>
//                   <option value="not">Not</option>
//                 </select>
//                 <input
//                   type="text"
//                   placeholder="Enter value"
//                   onChange={(e) =>
//                     handleConditionChange(
//                       field.fieldName,
//                       conditions.find(cond => cond.field === field.fieldName)?.condition || '=',
//                       e.target.value
//                     )
//                   }
//                 />
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Generate Report and Fetch Filtered Data */}
//       {selectedFields.length > 0 && conditions.length > 0 && (
//         <>
//           <button onClick={handleGenerateReport}>Generate Report</button>
//           <button onClick={fetchFilteredData}>Fetch Filtered Data</button>
//         </>
//       )}

//       {/* Display Filtered Data */}
//       {filteredData.length > 0 && (
//         <div>
//           <h2>Filtered Data</h2>
//           <ul>
//             {filteredData.map((data, index) => (
//               <li key={index}>{JSON.stringify(data)}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateReportPage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from '../../config/config';

// const GenerateReportPage = () => {
//   const [webforms, setWebforms] = useState([]);
//   const [filterConditions, setFilterConditions] = useState({});
//   const [selectedPageName, setSelectedPageName] = useState('');
//   const [fields, setFields] = useState([]);
//   const [selectedFields, setSelectedFields] = useState([]);
//   const [conditions, setConditions] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     // Fetch the list of pages from the webforms collection
//     const fetchWebforms = async () => {
//       try {
//         const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms`);
//         setWebforms(response.data.data);

//         // Fetch filter conditions
//         const filterResponse = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms/reportfilters`);
//         setFilterConditions(filterResponse.data.data.filterConditions);
//       } catch (error) {
//         console.error('Error fetching webforms:', error);
//       }
//     };

//     fetchWebforms();
//   }, []);

//   useEffect(() => {
//     // Update fields when selectedPageName changes
//     if (selectedPageName) {
//       const selectedPage = webforms.find(page => page.pageName === selectedPageName);
//       if (selectedPage) {
//         setFields(selectedPage.fields);
//       }
//     } else {
//       setFields([]);
//     }
//   }, [selectedPageName, webforms]);

//   const handleFieldSelection = (fieldName) => {
//     setSelectedFields(prevFields =>
//       prevFields.includes(fieldName)
//         ? prevFields.filter(f => f !== fieldName)
//         : [...prevFields, fieldName]
//     );
//   };

//   const handleConditionChange = (fieldName, condition, value) => {
//     setConditions(prevConditions => {
//       const existingCondition = prevConditions.find(cond => cond.field === fieldName);
//       if (existingCondition) {
//         return prevConditions.map(cond =>
//           cond.field === fieldName ? { field: fieldName, condition, value } : cond
//         );
//       } else {
//         return [...prevConditions, { field: fieldName, condition, value }];
//       }
//     });
//   };

//   const constructQuery = (field, condition, value) => {
//     const fieldType = fields.find(f => f.fieldName === field).dataType;
//     const conditionConfig = filterConditions[fieldType][condition];

//     if (conditionConfig.operator === '$regex' || conditionConfig.suboperator === '$regex') {
//       return { [field]: { [conditionConfig.operator]: value, $options: conditionConfig.options } };
//     } else if (conditionConfig.operator === '$not') {
//       return { [field]: { $not: { [conditionConfig.suboperator]: value, $options: conditionConfig.options } } };
//     } else {
//       return { [field]: { [conditionConfig.operator]: value } };
//     }
//   };

//   const handleGenerateReport = async () => {
//     // Prepare the data to be sent to the backend
//     const selectedPage = webforms.find(page => page.pageName === selectedPageName);
//     if (!selectedPage) {
//       console.error('No page selected or page not found');
//       return;
//     }

//     const pageId = selectedPage._id; // Assuming each page has a unique _id
//     const dataToSend = {
//       pageName: selectedPageName,
//       module: selectedPageName,
//       pageId,
//       selected_columns: selectedFields,
//       filter: conditions.map(cond => constructQuery(cond.field, cond.condition, cond.value)),
//     };

//     try {
//       const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/create`, dataToSend);
//       console.log('Report submitted successfully:', response.data);
//     } catch (error) {
//       console.error('Error submitting report:', error);
//     }
//   };

//   const fetchFilteredData = async () => {
//     // Prepare the filter criteria to fetch data
//     const filterCriteria = {
//       pageName: selectedPageName,
//       fields: selectedFields,
//       conditions: conditions.map(cond => constructQuery(cond.field, cond.condition, cond.value)),
//     };

//     try {
//       const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/retrieve`, filterCriteria);
//       setFilteredData(response.data.data); // Assuming 'data' is the key where results are returned
//       console.log('Filtered data fetched successfully:', response.data.data);
//     } catch (error) {
//       console.error('Error fetching filtered data:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Generate Report</h1>

//       {/* Stage 1: Select Page */}
//       <h2>Stage 1: Select Page</h2>
//       <select value={selectedPageName} onChange={(e) => setSelectedPageName(e.target.value)}>
//         <option value="">Select a Page</option>
//         {webforms.map((page, index) => (
//           <option key={index} value={page.pageName}>
//             {page.pageName}
//           </option>
//         ))}
//       </select>

//       {/* Stage 2: Select Fields for $project */}
//       {fields.length > 0 && (
//         <>
//           <h2>Stage 2: Select Fields for $project</h2>
//           <div>
//             {fields.map((field, index) => (
//               <div key={index}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     value={field.fieldName}
//                     onChange={() => handleFieldSelection(field.fieldName)}
//                   />
//                   {field.label || field.fieldName}
//                 </label>
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Stage 3: Define Match Criteria */}
//       {fields.length > 0 && filterConditions && (
//         <>
//           <h2>Stage 3: Define Match Criteria</h2>
//           <div>
//             {fields.map((field, index) => (
//               <div key={index}>
//                 <label>{field.label || field.fieldName}</label>
//                 <select
//                   onChange={(e) =>
//                     handleConditionChange(field.fieldName, e.target.value, '')
//                   }
//                 >
//                   {filterConditions[field.dataType] && Object.keys(filterConditions[field.dataType]).map((condition, idx) => (
//                     <option key={idx} value={condition}>
//                       {filterConditions[field.dataType][condition].description}
//                     </option>
//                   ))}
//                 </select>
//                 <input
//                   type="text"
//                   placeholder="Enter value"
//                   onChange={(e) =>
//                     handleConditionChange(
//                       field.fieldName,
//                       conditions.find(cond => cond.field === field.fieldName)?.condition || '=',
//                       e.target.value
//                     )
//                   }
//                 />
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Generate Report and Fetch Filtered Data */}
//       {selectedFields.length > 0 && conditions.length > 0 && (
//         <>
//           <button onClick={handleGenerateReport}>Generate Report</button>
//           <button onClick={fetchFilteredData}>Fetch Filtered Data</button>
//         </>
//       )}

//       {/* Display Filtered Data */}
//       {filteredData.length > 0 && (
//         <div>
//           <h2>Filtered Data</h2>
//           <ul>
//             {filteredData.map((data, index) => (
//               <li key={index}>{JSON.stringify(data)}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GenerateReportPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Select, MenuItem, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import config from '../../config/config';

const GenerateReportPage = () => {
  const [fields, setFields] = useState([]);
  const [filterConditions, setFilterConditions] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedFields, setSelectedFields] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [pageNames, setPageNames] = useState([]);
  const [selectedPageName, setSelectedPageName] = useState([]);
  const [moduleFields, setModuleFields] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedFieldConditions, setSelectedFieldConditions] = useState({});

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

  const handleConditionChange = (fieldName, condition, value) => {
    setConditions(prevConditions => {
      const existingCondition = prevConditions.find(cond => cond.field === fieldName);
      if (existingCondition) {
        console.log('Selected Condition:', condition);
        return prevConditions.map(cond =>
          cond.field === fieldName ? { field: fieldName, condition, value } : cond
        );
      } else {
        console.log('Selected Condition:', condition);
        return [...prevConditions, { field: fieldName, condition, value }];
      }
    });
  };

  const handleFieldSelectChange = async (selectedPageName, fieldName, selectedField) => {
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
  
      setSelectedFieldConditions(prevState => ({
        ...prevState,
        [fieldName]: matchedConditions
      }));
    } else {
      try {
        const response = await axios.get(`${config.apiUrl.replace(/\/$/, '')}/webforms/reportfilters`);
        const filterConditions = response.data.data.filterConditions;
        sessionStorage.setItem('filterConditions', JSON.stringify(filterConditions));
        const matchedConditions = filterConditions[fieldType] || {};
  
        setSelectedFieldConditions(prevState => ({
          ...prevState,
          [fieldName]: matchedConditions
        }));
      } catch (error) {
        console.error('Error fetching filter conditions:', error);
        setSelectedFieldConditions(prevState => ({
          ...prevState,
          [fieldName]: {}
        }));
      }
    }
    handleConditionChange(fieldName, '', '');
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
    // Construct the pipeline
    const pipeline = [
      { "$match": { "pageName": formData.module } },
      { "$project": selectedFields.reduce((acc, column) => ({ ...acc, [column]: 1 }), {}) },
      { "$match": conditions.reduce((acc, filter) => {
        const conditionConfig = selectedFieldConditions[filter.field]?.[filter.condition];
        if (conditionConfig) {
          if (conditionConfig.operator === '$not') {
            return { ...acc, [filter.field]: { $not: { [conditionConfig.suboperator]: filter.value, $options: conditionConfig.options } } };
          } else {
            return { ...acc, [filter.field]: { [conditionConfig.operator]: filter.value } };
          }
        }
        return acc;
      }, {}) }
    ];
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
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  const fetchFilteredData = async () => {
    const filterCriteria = {
      pageName: 'reports',
      fields: selectedFields,
      conditions: conditions.map(cond => constructQuery(cond.field, cond.condition, cond.value)),
    };

    try {
      const response = await axios.post(`${config.apiUrl.replace(/\/$/, '')}/appdata/retrieve`, filterCriteria);
      setFilteredData(response.data.data);
      console.log('Filtered data fetched successfully:', response.data.data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
    }
  };

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
              renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}
              onChange={(e) => field.fieldName === 'selected_columns' ? setSelectedFields(e.target.value) : handleInputChange(e, field.fieldName)}
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
      case 'filter':
        return (
          <div key={field.fieldName}>
            <label>{label}</label>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', marginTop: '10px' }}>
              <Select
                onChange={(e) => handleFieldSelectChange(selectedPageName, field.fieldName, e.target.value)}
                displayEmpty
                value={conditions.find(cond => cond.field === field.fieldName)?.field || ''}
                style={{ width: '30%' }}
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
                onChange={(e) => handleConditionChange(field.fieldName, e.target.value, '')}
                displayEmpty
                value={conditions.find(cond => cond.field === field.fieldName)?.condition || ''}
                style={{ width: '30%' }}
              >
                <MenuItem disabled value="">
                  Select condition
                </MenuItem>
                {selectedFieldConditions[field.fieldName] && Object.keys(selectedFieldConditions[field.fieldName]).map((condition, idx) => (
                  <MenuItem key={idx} value={condition}>
                    {selectedFieldConditions[field.fieldName][condition].description}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                type="text"
                placeholder="Enter value"
                value={conditions.find(cond => cond.field === field.fieldName)?.value || ''}
                onChange={(e) => handleConditionChange(field.fieldName, conditions.find(cond => cond.field === field.fieldName)?.condition || '=', e.target.value)}
                style={{ width: '30%' }}
              />
            </div>
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
        padding: 2,
        boxSizing: 'border-box',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        className='details_form_container'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {fields.map((field) => renderInputField(field))}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 2,
          }}
        >
          <button
            type="button"
            onClick={handleGenerateReport}
            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
          >
            Generate Report
          </button>
          <button
            type="button"
            onClick={fetchFilteredData}
            style={{ backgroundColor: '#2196F3', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
          >
            Fetch Filtered Data
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