import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import config from "../../config/config";
import { headers } from "../atoms/Authorization";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Stack } from "@mui/material";

const CustomDynamicForm = () => {
  const [dynamicFields, setDynamicFields] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [formData, setFormData] = useState({ dynamicName: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const location = useLocation();
  const pageName = location.state?.pageName;
  const navigate = useNavigate();
  const [filterConditions, setFilterConditions] = useState({});

useEffect(() => {
  const fetchFilterConditions = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/webforms`, { headers });
     // Extract only the object where pageName is "customfilters"
     const customFiltersData = response.data.data.find(
      (item) => item.pageName === "CustomFilter"
    );

    setFilterConditions(customFiltersData.filterConditions || {}); 
    console.log("Custom Filters Datas:", customFiltersData.filterConditions);
    console.log("Custom Filters Datas (htmlControl):", customFiltersData.filterConditions.map(fc => fc.htmlControl));
    } catch (error) {
      console.error("Error fetching filter conditions:", error);
    }
  };

  fetchFilterConditions();
}, []);


  // Function to fetch data with retry logic
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
    []
  );

  useEffect(() => {
    const fetchWebformsData = async () => {
      try {
        const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/webforms`;
        const response = await fetchDataWithRetry(apiUrl);
        const fetchedWebformsData = response.data || [];
        const currentPage = fetchedWebformsData.find(
          (page) => page.pageName === pageName
        );
        setDynamicFields(currentPage.fields);
      } catch (error) {
        console.error("Error fetching Webform data:", error);
      }
    };
    fetchWebformsData();
  }, [fetchDataWithRetry]);

  // Add a new condition
  const handleAddCondition = () => {
    setConditions([...conditions, { fieldName: "", operator: "", value: "" }]);
  };

  // Handle changes in condition fields
  const handleConditionChange = (index, key, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][key] = value;
    setConditions(updatedConditions);
    console.log("Updated Conditions:", updatedConditions);
  };

  // Handle changes in the custom filter name
  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // Save the filter
  // const handleSave = async () => {
  //   if (!formData["dynamicName"]) {
  //     setError("Custom Filter Name is required.");
  //     setTimeout(() => setError(null), 3000);
  //     return;
  //   }

  //   const dynamicName = formData["dynamicName"];
  //   const transformedData = {
  //     name: dynamicName,
  //     filter: [
  //       {
  //         $match: {
  //           pageName: pageName,
  //           $expr: conditions, // Save conditions
  //         },
  //       },
  //     ],
  //   };

  //   try {
  //     const response = await axios.get(`${config.apiUrl}/controls`, { headers });
  //     const controls = response.data.data;
  //     const existingControl = controls.find((control) => control.pageName === pageName);

  //     if (existingControl) {
  //       // Update existing control
  //       const updatedValue = [...existingControl.value, transformedData];
  //       const updatedControl = { ...existingControl, value: updatedValue };
  //       delete updatedControl._id;

  //       try {
  //         await axios.put(`${config.apiUrl}/controls/${existingControl._id}`, updatedControl, { headers });
  //         setSuccess("Filter updated successfully.");
  //       } catch (error) {
  //         console.error("Error updating the control:", error);
  //         setError("Failed to update the filter.");
  //       }
  //     } else {
  //       // Create a new control
  //       try {
  //         await axios.post(`${config.apiUrl}/controls`, transformedData, { headers });
  //         setSuccess("Filter created successfully.");
  //       } catch (error) {
  //         console.error("Error creating a new control:", error);
  //         setError("Failed to create the filter.");
  //       }
  //     }

  //     setTimeout(() => {
  //       setSuccess(null);
  //       navigate(-1); // Navigate back
  //     }, 3000);
  //   } catch (error) {
  //     console.error("Error saving filter:", error);
  //     setError("An error occurred while saving the filter.");
  //     setTimeout(() => setError(null), 3000);
  //   }
  // };

  const handleSave = async () => {
    if (!formData["dynamicName"]) {
      setError("Custom Filter Name is required.");
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    const dynamicName = formData["dynamicName"];
    let matchConditions = { pageName: pageName };
  
    if (!filterConditions || !dynamicFields.length) {
      console.error("Filter conditions or dynamic fields are not loaded yet.");
      return;
    }
  
    conditions.forEach((condition) => {
      if (condition.operator && condition.value !== "") {
        const selectedField = dynamicFields.find(
          (field) => field.fieldName === condition.fieldName
        );
  
        if (!selectedField) return;
  
        const fieldConditionMappings =
          filterConditions
            .find((fc) => fc.htmlControl === selectedField?.htmlControl)
            ?.typeMappings?.find((typeMapping) => typeMapping.type === selectedField?.type)
            ?.conditions || [];
  
        const directConditions =
          filterConditions.find((fc) => fc.htmlControl === selectedField?.htmlControl)
            ?.conditions || [];
  
        const allConditions = [...fieldConditionMappings, ...directConditions];
  
        const fieldCondition = allConditions.find((cond) => cond.operator === condition.operator);
  
        if (fieldCondition) {
          switch (condition.operator) {
            case "$eq":
            case "$ne":
            case "$gt":
            case "$lt":
              matchConditions[condition.fieldName] = { [condition.operator]: condition.value };
              break;
            case "$regex":
              matchConditions[condition.fieldName] = { [condition.operator]: condition.value, $options: "i" };
              break;
            case "doesNotContain":
              matchConditions[condition.fieldName] = { $not: { $regex: condition.value, $options: "i" } };
              break;
            case "is checked":
              matchConditions[condition.fieldName] = true;
              break;
            case "is not checked":
              matchConditions[condition.fieldName] = false;
              break;
            default:
              console.warn("Operator not handled:", condition.operator);
          }
        }
      }
    });
  
    const transformedData = {
      name: dynamicName,
      filter: [{ $match: matchConditions }],
    };
  
    try {
      const response = await axios.get(`${config.apiUrl}/controls`, { headers });
      const controls = response.data.data;
      const existingControl = controls.find((control) => control.pageName === pageName);
  
      if (existingControl) {
        const updatedValue = existingControl.value ? [...existingControl.value, transformedData] : [transformedData];
        const updatedControl = { ...existingControl, value: updatedValue };
  
        delete updatedControl._id; // Ensure _id is not included in the update request
  
        try {
          await axios.put(`${config.apiUrl}/controls/${existingControl._id}`, updatedControl, { headers });
          setSuccess("Filter updated successfully.");
        } catch (error) {
          console.error("Error updating the control:", error);
          setError("Failed to update the filter.");
        }
      } else {
        try {
          await axios.post(`${config.apiUrl}/controls`, transformedData, { headers });
          setSuccess("Filter created successfully.");
        } catch (error) {
          console.error("Error creating a new control:", error);
          setError("Failed to create the filter.");
        }
      }
  
      setTimeout(() => {
        setSuccess(null);
        navigate(-1); // Navigate back
      }, 3000);
    } catch (error) {
      console.error("Error saving filter:", error);
      setError("An error occurred while saving the filter.");
      setTimeout(() => setError(null), 3000);
    }
  };
  
  
  
  

  return (
    <div>
      {(error || success) && (
        <Stack sx={{ width: "100%", position: "absolute", zIndex: "10" }} spacing={2}>
          <div style={{ width: "fit-content", margin: "auto" }}>
            {success && <Alert severity="success">{success}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
          </div>
        </Stack>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#F5BD71",
          color: "black",
          height: "65px",
        }}
      >
        <h2 style={{ margin: "auto 40px", textTransform: "capitalize" }}>
          Custom Filter
        </h2>
      </div>
      <div style={{ padding: "20px" }}>
        {/* Input for custom filter name */}
        <div style={{ margin: "10px" }}>
          <label htmlFor="dynamicName" style={{ marginRight: "10px" }}>
            Custom Filter Name *
          </label>
          <input
            id="dynamicName"
            type="text"
            value={formData["dynamicName"]}
            onChange={(e) => handleInputChange("dynamicName", e.target.value)}
            placeholder="Enter the name (e.g., New Leads)"
            style={{ padding: "5px", fontSize: "16px" }}
          />
        </div>

        {/* Dynamic conditions */}
        {conditions.map((condition, index) => {
          const selectedField = dynamicFields.find(
            (field) => field.fieldName === condition.fieldName
          );

          return (
            <div
              key={index}
              style={{
                margin: "20px 10px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <select
                value={condition.fieldName}
                onChange={(e) =>
                  handleConditionChange(index, "fieldName", e.target.value)
                }
                style={{ padding: "5px", fontSize: "16px", width: '25%' }}
              >
                <option value="" disabled>
                  -- Select Field --
                </option>
                {dynamicFields.map((field) => (
                  <option key={field.fieldName} value={field.fieldName}>
                    {field.label}
                  </option>
                ))}
              </select>


              {/* <select
                value={condition.operator}
                onChange={(e) => handleConditionChange(index, "operator", e.target.value)}
                style={{ padding: "5px", fontSize: "16px" }}
              >
                <option value="" disabled>
                  -- Select Operator --
                </option>
                {selectedField && filterConditions[selectedField.type] &&
                  Object.entries(filterConditions[selectedField.type]).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.description}
                    </option>
                  ))}
              </select> */}
       {/* {filterConditions
        .find(fc => fc.htmlControl === selectedField?.htmlControl)?.typeMappings
        ?.find(typeMapping => typeMapping.type === selectedField?.type)?.conditions && ( */}
        {/* )} */}
          
          
        <select 
        value={condition.operator}
        onChange={(e) => handleConditionChange(index, "operator", e.target.value)}
        style={{ padding: "5px", fontSize: "16px", width: '25%' }}>

          <option value="">-- Select Condition --</option>
          {filterConditions
            .find(fc => fc.htmlControl === selectedField?.htmlControl)
            ?.typeMappings?.find(typeMapping => typeMapping.type === selectedField?.type)
            ?.conditions.map((condition, index) => (
              <option key={index} value={condition.operator}>
                {condition.label}
              </option>
            )) ||
            filterConditions
              .find(fc => fc.htmlControl === selectedField?.htmlControl)
              ?.conditions?.map((condition, index) => (
                <option key={index} value={condition.operator}>
                  {condition.label}
                </option>
              ))}
        </select>





              {selectedField?.htmlControl === "select" && selectedField.options ? (
                <select
                  value={condition.value}
                  onChange={(e) =>
                    handleConditionChange(index, "value", e.target.value)
                  }
                  style={{ padding: "5px", fontSize: "16px", width: '25%' }}
                >
                  <option value="" disabled>
                    -- Select {selectedField.label} --
                  </option>
                  {selectedField.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) =>
                    handleConditionChange(index, "value", e.target.value)
                  }
                  placeholder="Enter Value"
                  style={{ padding: "5px", fontSize: "16px", width: '25%' }}
                />
              )}
            </div>
          );
        })}

        <button
          onClick={handleAddCondition}
          style={{
            margin: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Add Condition
        </button>

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
            margin: "10px", 
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CustomDynamicForm;
