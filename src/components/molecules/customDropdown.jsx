import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import config from "../../config/config";
import { headers } from "../atoms/Authorization";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Stack } from "@mui/material";
import {
  today,
  getDateString,
  yesterday,
  tomorrow,
  thisWeekStartDate,
  thisWeekEndDate,
  nextWeekStartDate,
  nextWeekEndDate,
  getDateRange,
} from "../../utils/dateUtils"; // Import date utilities
import { buildMatchCondition } from "../../utils/conditionBuilder";

const CustomDynamicForm = () => {
  const [dynamicFields, setDynamicFields] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [formData, setFormData] = useState({ dynamicName: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const location = useLocation();
  // const pageName = location.state?.pageName;
  const initialPageName = location.state?.pageName;
  const [pageName, setPageName] = useState(initialPageName);
  const navigate = useNavigate();
  const [filterConditions, setFilterConditions] = useState({});
  const [selectedFields, setSelectedFields] = useState([]); // State to store selected fields


  useEffect(() => {
    const fetchFilterConditions = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/webforms`, { headers });
        // Extract only the object where pageName is "customfilters"
        const customFiltersData = response.data.data.find(
          (item) => item.pageName === "CustomFilter"
        );

        setFilterConditions(customFiltersData.filterConditions || {});
        setConditions([...conditions, { fieldName: "", operator: "", value: "" }]);
        console.log("Custom Filters Datas:", customFiltersData.filterConditions);
        console.log("Custom Filters Datas (htmlControl):", customFiltersData.filterConditions.map(fc => fc.htmlControl));
      } catch (error) {
        console.error("Error fetching filter conditions:", error);
      }
    };

    fetchFilterConditions();
  }, []);

  console.log("Today's date:", today);

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
    if (!pageName) return; // prevent call if pageName is not set

    const fetchWebformsData = async () => {
      try {
        const apiUrl = `${config.apiUrl.replace(/\/$/, "")}/webforms`;
        const response = await fetchDataWithRetry(apiUrl);
        const fetchedWebformsData = response.data || [];
        const currentPage = fetchedWebformsData.find(
          (page) => page.pageName === pageName
        );
        setDynamicFields(currentPage?.fields || []);
      } catch (error) {
        console.error("Error fetching Webform data:", error);
      }
    };

    fetchWebformsData();
  }, [fetchDataWithRetry, pageName]);


  const handleAddCondition = () => {
    setConditions([...conditions, { fieldName: "", operator: "", value: "" }]);
  };

  const handleConditionChange = (index, key, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[index][key] = value;

    if (key === "operator") {
      updatedConditions[index].value = ""; // Reset value when operator changes
    }

    setConditions(updatedConditions);
    console.log("Updated Conditions:", updatedConditions);
  };

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // Function to handle field selection
  const handleFieldSelection = (field) => {
    setSelectedFields((prevFields) =>
      prevFields.includes(field)
        ? prevFields.filter((f) => f !== field) // Remove field if already selected
        : [...prevFields, field] // Add field if not selected
    );
  };

  const handleSave = async () => {
    if (!formData["dynamicName"]) {
      setError("Custom Filter Name is required.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (selectedFields.length === 0) {
      setError("At least one field must be selected.");
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
      if (condition.operator !== "") {
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
          const match = buildMatchCondition(condition);
          if (match) {
            Object.assign(matchConditions, match);
          }
        }

        

      }
    });

    const transformedData = {
      name: dynamicName,
      filter: [{ $match: matchConditions }],
      fields: selectedFields, // Include selected fields
    };

    try {
      const response = await axios.get(`${config.apiUrl}/controls`, { headers });
      const controls = response.data.data;
      const existingControl = controls.find((control) => control.pageName === pageName);

      if (existingControl) {
        const updatedValue = existingControl.value
          ? [...existingControl.value, transformedData]
          : [transformedData];
        const updatedControl = { ...existingControl, value: updatedValue };

        delete updatedControl._id;

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
        navigate(-1);
      }, 3000);
    } catch (error) {
      console.error("Error saving filter:", error);
      setError("An error occurred while saving the filter.");
      setTimeout(() => setError(null), 3000);
    }
  };


  const handleDeleteCondition = (index) => {
    if (index === 0) {
      alert("The first condition cannot be deleted.");
      return;
    }
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);
  };




  return (
    <div style={{ maxHeight: "90vh", overflow: "auto" }}>
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
        <div style={{ margin: "10px" }}>
          <label htmlFor="dynamicName" style={{ marginRight: "10px" }}>
            Filter Name *
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
        {initialPageName === "reports" && (
          <div style={{ margin: "10px", width: '30%' }}>
            <label htmlFor="dynamicName" style={{ marginRight: "10px" }}>
              Select Module *
            </label>
            <select
              id="dynamicName"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              style={{ padding: "5px", fontSize: "16px" }}
            >
              <option value="">--Select--</option>
              <option value="calls">Calls</option>
              <option value="enquiry">Enquiry</option>
              <option value="leads">Leads</option>
            </select>
          </div>
        )}

        {conditions.map((condition, index) => {
          const selectedField = dynamicFields.find(
            (field) => field.fieldName === condition.fieldName
          );

          return (
            <div
              className="input_main"
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
                style={{ padding: "5px", fontSize: "16px", width: "20%" }}
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

              <select
                value={condition.operator}
                onChange={(e) => handleConditionChange(index, "operator", e.target.value)}
                style={{ padding: "5px", fontSize: "16px", width: "20%" }}
              >
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
                  style={{ padding: "5px", fontSize: "16px", width: "20%" }}
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
              ) : selectedField?.htmlControl === "date" ? (
                condition.operator === "$gte_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={condition.value.start || ""}
                      onChange={(e) =>
                        handleConditionChange(index, "value", { ...condition.value, start: e.target.value })
                      }
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={condition.value.end || ""}
                      onChange={(e) =>
                        handleConditionChange(index, "value", { ...condition.value, end: e.target.value })
                      }
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_today_lte" ? (
                  <input
                    type="date"
                    value={today}
                    onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                    readOnly
                    style={{ padding: "5px", fontSize: "16px", width: "20%" }}
                  />
                ) : condition.operator === "$gte_yesterday_lte" ? (
                  <input
                    type="date"
                    value={yesterday}
                    onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                    readOnly
                    style={{ padding: "5px", fontSize: "16px", width: "20%" }}
                  />
                ) : condition.operator === "$gte_tomorrow_lte" ? (
                  <input
                    type="date"
                    value={tomorrow}
                    onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                    readOnly
                    style={{ padding: "5px", fontSize: "16px", width: "20%" }}
                  />
                ) : condition.operator === "$gte_thisweek_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={thisWeekStartDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={thisWeekEndDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_nextweek_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={nextWeekStartDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={nextWeekEndDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_previousWeek_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("previousWeek").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("previousWeek").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_thismonth_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("thisMonth").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("thisMonth").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_nextmonth_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("nextMonth").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("nextMonth").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_last7days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("last7days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("last7days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_last30days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("last30days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("last30days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_last45days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("last45days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("last45days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_last60days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("last60days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("last60days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_last90days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("last90days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("last90days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_last120days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("last120days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("last120days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_next7days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("next7days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("next7days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_next30days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("next30days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("next30days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_next45days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("next45days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("next45days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_next60days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("next60days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("next60days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_next90days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("next90days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("next90days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_next120days_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("next120days").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("next120days").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_previousFinancialYear_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("previousFinancialYear").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("previousFinancialYear").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_currentFinancialYear_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("currentFinancialYear").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("currentFinancialYear").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : condition.operator === "$gte_nextFinancialYear_lte" ? (
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="date"
                      value={getDateRange("nextFinancialYear").startDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                    <input
                      type="date"
                      value={getDateRange("nextFinancialYear").endDate}
                      readOnly
                      style={{ padding: "5px", fontSize: "16px", width: "45%" }}
                    />
                  </div>
                ) : (
                  <input
                    type="date"
                    value={condition.value}
                    onChange={(e) => handleConditionChange(index, "value", e.target.value)}
                    style={{ padding: "5px", fontSize: "16px", width: "20%" }}
                  />
                )
              ) : (
                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) =>
                    handleConditionChange(index, "value", e.target.value)
                  }
                  placeholder="Enter Value"
                  style={{ padding: "5px", fontSize: "16px", width: "20%" }}
                />
              )}

              <button
                onClick={() => handleDeleteCondition(index)}
                disabled={index === 0}
                style={{
                  padding: "5px 10px",
                  fontSize: "14px",
                  backgroundColor: index === 0 ? "#ccc" : "#FF4D4D",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: index === 0 ? "not-allowed" : "pointer",
                  display: index === 0 ? "none" : "block",
                }}
              >
                Delete
              </button>

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

      <div style={{ margin: "10px" }}>
        <label>Select Fields:</label>
        <div style={{ columnCount: '6' }}>
          {dynamicFields.map((field) => (
            <div
              className="custom-dropdown-columns"
              key={field.fieldName}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "5px",
                margin: "5px",
                ...(selectedFields.includes(field.fieldName) && {
                  backgroundColor: "rgb(245, 189, 113)",
                  color: "white",
                  borderRadius: "5px",
                }),
              }}
            >
              <input
                type="checkbox"
                id={field.fieldName}
                checked={selectedFields.includes(field.fieldName)}
                onChange={() => handleFieldSelection(field.fieldName)}
              />
              <label htmlFor={field.fieldName} style={{ marginLeft: "5px" }}>
                {field.label}
              </label>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomDynamicForm;