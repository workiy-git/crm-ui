import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import config from '../../config/config';
import { headers } from '../atoms/Authorization'
import { useLocation } from "react-router-dom";

const CustomDynamicForm = () => {
  const [dynamicFields, setDynamicFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [savedData, setSavedData] = useState([]);
  const location = useLocation();
  const pageName = location.state?.pageName; // Get the page name from state

  console.log("Received Page Name:", pageName);

  const [webformsData, setWebformsData] = useState([]);

  const fetchDataWithRetry = useCallback(
    async (url, retryCount = 3) => {
      try {
        const response = await axios.get(url, { headers });
        return response.data;
      } catch (error) {
        if (retryCount > 0) {
          console.warn("Retrying request, attempts left:", retryCount);
          return fetchDataWithRetry(url, retryCount - 1);
        } else {
          throw error;
        }
      }
    },
    [] // No dependencies, so it's memoized only once
  );
  
  useEffect(() => {
    const fetchWebformsData = async () => {
      try {
        const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/webforms`;
        const response = await fetchDataWithRetry(apiUrl);
        const fetchedWebformsData = response.data || [];
        const currentPage = fetchedWebformsData.find((page) => page.pageName === pageName);
        // setWebformsData(currentPage.fields);
        setDynamicFields(currentPage.fields);
        console.log("Webform Data:", currentPage.fields);
        } catch (error) {
        console.error("Error fetching Webform data:", error);
        }
    };
    fetchWebformsData();
    }, [fetchDataWithRetry]);

//   const fetchDataWithRetry = useCallback(
//     async (url, retryCount = 3) => {
//       try {
//         const response = await axios.get(url);
//         return response.data;
//       } catch (error) {
//         if (retryCount > 0) {
//           console.warn("Retrying request, attempts left:", retryCount);
//           return fetchDataWithRetry(url, retryCount - 1);
//         } else {
//           throw error;
//         }
//       }
//     },
//     [] // No dependencies, so it's memoized only once
//   );

//   useEffect(() => {
//     const fetchDynamicFields = async () => {
//       try {
//         // Replace with your API URL
//         const apiUrl = "https://api.example.com/webforms"; // Example URL
//         const response = await fetchDataWithRetry(apiUrl);

//         // Assume `response.data` contains the fields array
//         const currentPage = response.data.find((page) => page.pageName === "leads"); // Replace with the dynamic pageName logic
//         setDynamicFields(currentPage.fields);
//       } catch (error) {
//         console.error("Error fetching dynamic fields:", error);
//       }
//     };

//     fetchDynamicFields();
//   }, [fetchDataWithRetry]);

  // Handle input changes
  const handleInputChange = (fieldName, value) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });
  };

  // Save the form data
  const handleSave = async ()  => {
    // Get the dynamic name from the text field (you can specify a name field here)
    const dynamicName = formData["dynamicName"]; // Default to "New Leads" if empty

    // Transform the data into the desired structure
    const transformedData = {
      name: dynamicName, // Use the dynamic name entered by the user
      filter: [
        {
          $match: {
            pageName: pageName, // Replace with appropriate page name
            ...formData, // Add the form data to $match
          },
        },
      ],
    };

    // Update the saved data
    setSavedData([...savedData, transformedData]);
    setFormData({}); // Reset form data

    try {
        // First, fetch the leads data from /controls
        const response = await axios.get(`${config.apiUrl}/controls`, { headers });
    
        console.log('Custom Data received:', response.data.data);
    
        // Filter the response to get the item where pageName matches
        const leadsData = response.data.data.filter(item => item.pageName === pageName);
        if (leadsData.length > 0) {
          console.log('Leads Data:', leadsData[0].value); // Assuming you want the first match
          console.log('Saved Data:', JSON.stringify(savedData, null, 2)); // Log saved data after leadsData[0].value
    
          // Determine if you're adding or updating the control
          const controlId = leadsData[0]._id; // Get the ID of the existing control if it exists
    
          let dbResponse;
          if (controlId) {
            // If controlId exists, update the control
            dbResponse = await axios.put(`${config.apiUrl}/controls/${controlId}`, transformedData, { headers });
            console.log('Control updated successfully:', dbResponse.data);
          } else {
            // If no controlId, create a new control
            dbResponse = await axios.post(`${config.apiUrl}/controls`, transformedData, { headers });
            console.log('New control added successfully:', dbResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching control data or saving data:', error);
      }
  };

  console.log("filter data",` ${JSON.stringify(savedData, null, 2)}`)


  

  return (
    <div style={{ padding: "20px", height: "400px", overflow:'scroll' }}>
      <h3>Dynamic Form</h3>

      {/* Add a dynamic name input */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="dynamicName" style={{ marginRight: "10px" }}>
          Name
        </label>
        <input
          id="dynamicName"
          type="text"
          value={formData["dynamicName"] || ""}
          onChange={(e) => handleInputChange("dynamicName", e.target.value)}
          placeholder="Enter the name (e.g., New Leads)"
          style={{ padding: "5px", fontSize: "16px" }}
        />
      </div>

      {/* Dynamic Fields Rendering */}

      {dynamicFields.map((field) => {
        if (field.htmlControl === "input") {
          return (
            <div key={field.fieldName} style={{ marginBottom: "20px" }}>
              <label htmlFor={field.fieldName} style={{ marginRight: "10px" }}>
                {field.label}
                {/* {field.required ? "*" : ""} */}
              </label>
              <input
                id={field.fieldName}
                type={field.type || "text"}
                value={formData[field.fieldName] || ""}
                onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                placeholder={`Enter ${field.label}`}
                style={{ padding: "5px", fontSize: "16px" }}
                pattern={field.pattern || undefined}
                title={field.patternMessage || undefined}
                // required={field.required}
              />
            </div>
          );
        } else if (field.htmlControl === "select") {
          return (
            <div key={field.fieldName} style={{ marginBottom: "20px" }}>
              <label htmlFor={field.fieldName} style={{ marginRight: "10px" }}>
                {field.label} 
                {/* {field.required ? "*" : ""} */}
              </label>
              <select
                id={field.fieldName}
                value={formData[field.fieldName] || ""}
                onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
                style={{ padding: "5px", fontSize: "16px" }}
                // required={field.required}
              >
                <option value="" disabled>
                  -- Select {field.label} --
                </option>
                {field.options &&
                  field.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          );
        }
        return null;
      })}

      {/* Save Button */}
      <button
        onClick={handleSave}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save
      </button>

      {/* Display Saved Data */}
      <div style={{ marginTop: "40px" }}>
        <h4>Saved Data:</h4>
        <pre
          style={{
            background: "#f4f4f4",
            padding: "15px",
            borderRadius: "5px",
            overflow: "auto",
          }}
        >
          {JSON.stringify(savedData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CustomDynamicForm;
