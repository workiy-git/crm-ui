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

  const today = new Date().toISOString().split("T")[0];

  const getDateString = (offset) => {
    let date = new Date();
    date.setDate(date.getDate() + offset);
    return date.toISOString().split("T")[0];
  };

  const yesterday = getDateString(-1);
  const tomorrow = getDateString(1);

  // Calculate start and end of the current week (Monday to Sunday)
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay() + 1);
  const thisWeekEnd = new Date();
  thisWeekEnd.setDate(thisWeekEnd.getDate() - thisWeekEnd.getDay() + 7);

  // Calculate start and end of next week
  const nextWeekStart = new Date();
  nextWeekStart.setDate(thisWeekEnd.getDate() + 1);
  const nextWeekEnd = new Date();
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

  // Convert to YYYY-MM-DD format
  const thisWeekStartDate = thisWeekStart.toISOString().split("T")[0];
  const thisWeekEndDate = thisWeekEnd.toISOString().split("T")[0];
  const nextWeekStartDate = nextWeekStart.toISOString().split("T")[0];
  const nextWeekEndDate = nextWeekEnd.toISOString().split("T")[0];

  console.log("Today's date:", today);

  const getDateRange = (type) => {
    const today = new Date();
    let startDate, endDate;

    if (type === "thisMonth") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (type === "nextMonth") {
      startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    }

    switch (type) {
      case "last7days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 7);
        endDate = today;
        break;

      case "last30days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 30);
        endDate = today;
        break;

      case "last45days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 45);
        endDate = today;
        break;

      case "last60days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 60);
        endDate = today;
        break;

      case "last90days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 90);
        endDate = today;
        break;

      case "last120days":
        startDate = new Date();
        startDate.setDate(today.getDate() - 120);
        endDate = today;
        break;

      case "next7days":
        startDate = today;
        endDate = new Date();
        endDate.setDate(today.getDate() + 7);
        break;

      case "next30days":
        startDate = today;
        endDate = new Date();
        endDate.setDate(today.getDate() + 30);
        break;

      case "next45days":
        startDate = today;
        endDate = new Date();
        endDate.setDate(today.getDate() + 45);
        break;

      case "next60days":
        startDate = today;
        endDate = new Date();
        endDate.setDate(today.getDate() + 60);
        break;

      case "next90days":
        startDate = today;
        endDate = new Date();
        endDate.setDate(today.getDate() + 90);
        break;

      case "next120days":
        startDate = today;
        endDate = new Date();
        endDate.setDate(today.getDate() + 120);
        break;

      case "previousFinancialYear":
        startDate = new Date(today.getFullYear() - 1, 3, 1);
        endDate = new Date(today.getFullYear(), 2, 31);
        break;

      case "currentFinancialYear":
        startDate = new Date(today.getFullYear(), 3, 1);
        endDate = new Date(today.getFullYear() + 1, 2, 31);
        break;

      case "nextFinancialYear":
        startDate = new Date(today.getFullYear() + 1, 3, 1);
        endDate = new Date(today.getFullYear() + 2, 2, 31);
        break;

      case "previousWeek":
        startDate = new Date();
        startDate.setDate(today.getDate() - today.getDay() - 6);
        endDate = new Date();
        endDate.setDate(today.getDate() - today.getDay());
        break;

      case "previousWeek":
        const currentDay = today.getDay();
        const daysToSubtract = currentDay === 0 ? 7 : currentDay;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - daysToSubtract - 6);
        endDate = new Date(today);
        endDate.setDate(today.getDate() - daysToSubtract);
        break;

      default:
        return { error: "Invalid type selected" };
    }

    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    return {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    };
  };
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
            case "$^regex":
              matchConditions[condition.fieldName] = { $regex: `^${condition.value}`, $options: "i" };
              break;
            case "$regex$":
              matchConditions[condition.fieldName] = { $regex: `${condition.value}$`, $options: "i" };
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
            case "$gte_lte":
              if (condition.value?.start && condition.value?.end) {
                matchConditions[condition.fieldName] = {
                  $gte: condition.value.start,
                  $lte: condition.value.end,
                };
              }
              break;
            case "$eqto":
              matchConditions[condition.fieldName] = condition.value;
              break;
              case "$gte_today_lte":
                matchConditions["$expr"] = {
                  $and: [
                    { $ne: [`$${condition.fieldName}`, null] },
                    { $ne: [`$${condition.fieldName}`, ""] },
                    {
                      $eq: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: `$${condition.fieldName}` }
                          }
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$$NOW"
                          }
                        }
                      ]
                    }
                  ]
                };
                break;
              
            case "$gte_yesterday_lte":
              matchConditions["$expr"] = {
                $eq: [
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: { $toDate: `$${condition.fieldName}` }
                    }
                  },
                  {
                    $dateToString: {
                      format: "%Y-%m-%d",
                      date: {
                        $dateSubtract: {
                          startDate: "$$NOW",
                          unit: "day",
                          amount: 1
                        }
                      }
                    }
                  }
                ]
              };
              break;
            case "$gte_tomorrow_lte":
              matchConditions["$expr"] = {
                $and: [
                  { $ne: [`$${condition.fieldName}`, null] }, // Ensure field is not null
                  { $ne: [`$${condition.fieldName}`, ""] },  // Ensure field is not empty
                  {
                    $eq: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: { $toDate: `$${condition.fieldName}` }
                        }
                      },
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: {
                            $toDate: {
                              $dateAdd: {
                                startDate: "$$NOW",
                                unit: "day",
                                amount: 1
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              };
              break;
            case "$gte_thisweek_lte":
              matchConditions["$expr"] = {
                $and: [
                  { $ne: [`$${condition.fieldName}`, null] }, // Ensure field is not null
                  { $ne: [`$${condition.fieldName}`, ""] },  // Ensure field is not empty
                  {
                    $gte: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: { $toDate: `$${condition.fieldName}` }
                        }
                      },
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: {
                            $dateSubtract: {
                              startDate: "$$NOW",
                              unit: "day",
                              amount: { $subtract: [{ $dayOfWeek: "$$NOW" }, 1] }
                            }
                          }
                        }
                      }
                    ]
                  },
                  {
                    $lt: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: { $toDate: `$${condition.fieldName}` }
                        }
                      },
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: {
                            $dateAdd: {
                              startDate: "$$NOW",
                              unit: "day",
                              amount: { $subtract: [8, { $dayOfWeek: "$$NOW" }] }
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              };
              break;

            case "$gte_nextweek_lte":
              matchConditions["$expr"] = {
                $and: [
                  { $ne: [`$${condition.fieldName}`, null] }, // Ensure field is not null
                  { $ne: [`$${condition.fieldName}`, ""] },  // Ensure field is not empty
                  {
                    $gte: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: { $toDate: `$${condition.fieldName}` }
                        }
                      },
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: {
                            $dateAdd: {
                              startDate: "$$NOW",
                              unit: "day",
                              amount: { $subtract: [8, { $dayOfWeek: "$$NOW" }] }
                            }
                          }
                        }
                      }
                    ]
                  },
                  {
                    $lt: [
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: { $toDate: `$${condition.fieldName}` }
                        }
                      },
                      {
                        $dateToString: {
                          format: "%Y-%m-%d",
                          date: {
                            $dateAdd: {
                              startDate: "$$NOW",
                              unit: "day",
                              amount: { $subtract: [15, { $dayOfWeek: "$$NOW" }] }
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              };
              break;

              case "$gte_thismonth_lte":
                matchConditions["$expr"] = {
                  $and: [
                    { $ne: [`$${condition.fieldName}`, null] },
                    { $ne: [`$${condition.fieldName}`, ""] },
                    {
                      $gte: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: `$${condition.fieldName}` }
                          }
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                              $dateFromParts: {
                                year: { $year: "$$NOW" },
                                month: { $month: "$$NOW" },
                                day: 1
                              }
                            }
                          }
                        }
                      ]
                    },
                    {
                      $lt: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: `$${condition.fieldName}` }
                          }
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                              $dateFromParts: {
                                year: { $year: "$$NOW" },
                                month: { $add: [{ $month: "$$NOW" }, 1] },
                                day: 1
                              }
                            }
                          }
                        }
                      ]
                    }
                  ]
                };
                break;
              
              case "$gte_nextmonth_lte":
                matchConditions["$expr"] = {
                  $and: [
                    { $ne: [`$${condition.fieldName}`, null] },
                    { $ne: [`$${condition.fieldName}`, ""] },
                    {
                      $gte: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: `$${condition.fieldName}` }
                          }
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                              $dateFromParts: {
                                year: { $year: "$$NOW" },
                                month: { $add: [{ $month: "$$NOW" }, 1] },
                                day: 1
                              }
                            }
                          }
                        }
                      ]
                    },
                    {
                      $lt: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: `$${condition.fieldName}` }
                          }
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                              $dateFromParts: {
                                year: { $year: "$$NOW" },
                                month: { $add: [{ $month: "$$NOW" }, 2] },
                                day: 1
                              }
                            }
                          }
                        }
                      ]
                    }
                  ]
                };
                break;
              
              case "$gte_last7days_lte":
                matchConditions["$expr"] = {
                  $and: [
                    { $ne: [`$${condition.fieldName}`, null] },
                    { $ne: [`$${condition.fieldName}`, ""] },
                    {
                      $gte: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: `$${condition.fieldName}` }
                          }
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: {
                              $toDate: {
                                $dateSubtract: {
                                  startDate: "$$NOW",
                                  unit: "day",
                                  amount: 7
                                }
                              }
                            }
                          }
                        }
                      ]
                    },
                    {
                      $lt: [
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: `$${condition.fieldName}` }
                          }
                        },
                        {
                          $dateToString: {
                            format: "%Y-%m-%d",
                            date: { $toDate: "$$NOW" }
                          }
                        }
                      ]
                    }
                  ]
                };
                break;
              
                case "$gte_last30days_lte":
                  matchConditions["$expr"] = {
                    $and: [
                      { $ne: [`$${condition.fieldName}`, null] },
                      { $ne: [`$${condition.fieldName}`, ""] },
                      {
                        $gte: [
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: `$${condition.fieldName}` }
                            }
                          },
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: {
                                $toDate: {
                                  $dateSubtract: {
                                    startDate: "$$NOW",
                                    unit: "day",
                                    amount: 30
                                  }
                                }
                              }
                            }
                          }
                        ]
                      },
                      {
                        $lt: [
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: `$${condition.fieldName}` }
                            }
                          },
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: "$$NOW" }
                            }
                          }
                        ]
                      }
                    ]
                  };
                  break;
                
                case "$gte_last45days_lte":
                  matchConditions["$expr"] = {
                    $and: [
                      { $ne: [`$${condition.fieldName}`, null] },
                      { $ne: [`$${condition.fieldName}`, ""] },
                      {
                        $gte: [
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: `$${condition.fieldName}` }
                            }
                          },
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: {
                                $toDate: {
                                  $dateSubtract: {
                                    startDate: "$$NOW",
                                    unit: "day",
                                    amount: 45
                                  }
                                }
                              }
                            }
                          }
                        ]
                      },
                      {
                        $lt: [
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: `$${condition.fieldName}` }
                            }
                          },
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: "$$NOW" }
                            }
                          }
                        ]
                      }
                    ]
                  };
                  break;
                
                case "$gte_last60days_lte":
                  matchConditions["$expr"] = {
                    $and: [
                      { $ne: [`$${condition.fieldName}`, null] },
                      { $ne: [`$${condition.fieldName}`, ""] },
                      {
                        $gte: [
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: `$${condition.fieldName}` }
                            }
                          },
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: {
                                $toDate: {
                                  $dateSubtract: {
                                    startDate: "$$NOW",
                                    unit: "day",
                                    amount: 60
                                  }
                                }
                              }
                            }
                          }
                        ]
                      },
                      {
                        $lt: [
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: `$${condition.fieldName}` }
                            }
                          },
                          {
                            $dateToString: {
                              format: "%Y-%m-%d",
                              date: { $toDate: "$$NOW" }
                            }
                          }
                        ]
                      }
                    ]
                  };
                  break;
                
                  case "$gte_last90days_lte":
                    matchConditions["$expr"] = {
                      $and: [
                        { $ne: [`$${condition.fieldName}`, null] },
                        { $ne: [`$${condition.fieldName}`, ""] },
                        {
                          $gte: [
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: `$${condition.fieldName}` }
                              }
                            },
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: {
                                  $toDate: {
                                    $dateSubtract: {
                                      startDate: "$$NOW",
                                      unit: "day",
                                      amount: 90
                                    }
                                  }
                                }
                              }
                            }
                          ]
                        },
                        {
                          $lt: [
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: `$${condition.fieldName}` }
                              }
                            },
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: "$$NOW" }
                              }
                            }
                          ]
                        }
                      ]
                    };
                    break;
                  
                  case "$gte_last120days_lte":
                    matchConditions["$expr"] = {
                      $and: [
                        { $ne: [`$${condition.fieldName}`, null] },
                        { $ne: [`$${condition.fieldName}`, ""] },
                        {
                          $gte: [
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: `$${condition.fieldName}` }
                              }
                            },
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: {
                                  $toDate: {
                                    $dateSubtract: {
                                      startDate: "$$NOW",
                                      unit: "day",
                                      amount: 120
                                    }
                                  }
                                }
                              }
                            }
                          ]
                        },
                        {
                          $lt: [
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: `$${condition.fieldName}` }
                              }
                            },
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: "$$NOW" }
                              }
                            }
                          ]
                        }
                      ]
                    };
                    break;
                  
                  case "$gte_next7days_lte":
                    matchConditions["$expr"] = {
                      $and: [
                        { $ne: [`$${condition.fieldName}`, null] },
                        { $ne: [`$${condition.fieldName}`, ""] },
                        {
                          $gte: [
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: `$${condition.fieldName}` }
                              }
                            },
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: {
                                  $toDate: {
                                    $dateAdd: {
                                      startDate: "$$NOW",
                                      unit: "day",
                                      amount: 1
                                    }
                                  }
                                }
                              }
                            }
                          ]
                        },
                        {
                          $lt: [
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: { $toDate: `$${condition.fieldName}` }
                              }
                            },
                            {
                              $dateToString: {
                                format: "%Y-%m-%d",
                                date: {
                                  $toDate: {
                                    $dateAdd: {
                                      startDate: "$$NOW",
                                      unit: "day",
                                      amount: 8
                                    }
                                  }
                                }
                              }
                            }
                          ]
                        }
                      ]
                    };
                    break;
                  
                    case "$gte_next30days_lte":
                      matchConditions["$expr"] = {
                        $and: [
                          { $ne: [`$${condition.fieldName}`, null] },
                          { $ne: [`$${condition.fieldName}`, ""] },
                          {
                            $gte: [
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: { $toDate: `$${condition.fieldName}` }
                                }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: {
                                    $toDate: {
                                      $dateAdd: {
                                        startDate: "$$NOW",
                                        unit: "day",
                                        amount: 1
                                      }
                                    }
                                  }
                                }
                              }
                            ]
                          },
                          {
                            $lt: [
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: { $toDate: `$${condition.fieldName}` }
                                }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: {
                                    $toDate: {
                                      $dateAdd: {
                                        startDate: "$$NOW",
                                        unit: "day",
                                        amount: 31
                                      }
                                    }
                                  }
                                }
                              }
                            ]
                          }
                        ]
                      };
                      break;
                    
                    case "$gte_next45days_lte":
                      matchConditions["$expr"] = {
                        $and: [
                          { $ne: [`$${condition.fieldName}`, null] },
                          { $ne: [`$${condition.fieldName}`, ""] },
                          {
                            $gte: [
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: { $toDate: `$${condition.fieldName}` }
                                }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: {
                                    $toDate: {
                                      $dateAdd: {
                                        startDate: "$$NOW",
                                        unit: "day",
                                        amount: 1
                                      }
                                    }
                                  }
                                }
                              }
                            ]
                          },
                          {
                            $lt: [
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: { $toDate: `$${condition.fieldName}` }
                                }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: {
                                    $toDate: {
                                      $dateAdd: {
                                        startDate: "$$NOW",
                                        unit: "day",
                                        amount: 46
                                      }
                                    }
                                  }
                                }
                              }
                            ]
                          }
                        ]
                      };
                      break;
                    
                    case "$gte_next60days_lte":
                      matchConditions["$expr"] = {
                        $and: [
                          { $ne: [`$${condition.fieldName}`, null] },
                          { $ne: [`$${condition.fieldName}`, ""] },
                          {
                            $gte: [
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: { $toDate: `$${condition.fieldName}` }
                                }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: {
                                    $toDate: {
                                      $dateAdd: {
                                        startDate: "$$NOW",
                                        unit: "day",
                                        amount: 1
                                      }
                                    }
                                  }
                                }
                              }
                            ]
                          },
                          {
                            $lt: [
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: { $toDate: `$${condition.fieldName}` }
                                }
                              },
                              {
                                $dateToString: {
                                  format: "%Y-%m-%d",
                                  date: {
                                    $toDate: {
                                      $dateAdd: {
                                        startDate: "$$NOW",
                                        unit: "day",
                                        amount: 61
                                      }
                                    }
                                  }
                                }
                              }
                            ]
                          }
                        ]
                      };
                      break;
                    
                      case "$gte_next90days_lte":
                        matchConditions["$expr"] = {
                          $and: [
                            { $ne: [`$${condition.fieldName}`, null] },
                            { $ne: [`$${condition.fieldName}`, ""] },
                            {
                              $gte: [
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: { $toDate: `$${condition.fieldName}` }
                                  }
                                },
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: {
                                      $toDate: {
                                        $dateAdd: {
                                          startDate: "$$NOW",
                                          unit: "day",
                                          amount: 1
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            },
                            {
                              $lt: [
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: { $toDate: `$${condition.fieldName}` }
                                  }
                                },
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: {
                                      $toDate: {
                                        $dateAdd: {
                                          startDate: "$$NOW",
                                          unit: "day",
                                          amount: 91
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        };
                        break;
                      
                      case "$gte_next120days_lte":
                        matchConditions["$expr"] = {
                          $and: [
                            { $ne: [`$${condition.fieldName}`, null] },
                            { $ne: [`$${condition.fieldName}`, ""] },
                            {
                              $gte: [
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: { $toDate: `$${condition.fieldName}` }
                                  }
                                },
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: {
                                      $toDate: {
                                        $dateAdd: {
                                          startDate: "$$NOW",
                                          unit: "day",
                                          amount: 1
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            },
                            {
                              $lt: [
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: { $toDate: `$${condition.fieldName}` }
                                  }
                                },
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: {
                                      $toDate: {
                                        $dateAdd: {
                                          startDate: "$$NOW",
                                          unit: "day",
                                          amount: 121
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        };
                        break;
                      
                      case "$gte_previousFinancialYear_lte":
                        matchConditions["$expr"] = {
                          $and: [
                            { $ne: [`$${condition.fieldName}`, null] },
                            { $ne: [`$${condition.fieldName}`, ""] },
                            {
                              $gte: [
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: { $toDate: `$${condition.fieldName}` }
                                  }
                                },
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: {
                                      $toDate: {
                                        $dateFromParts: {
                                          year: { $subtract: [{ $year: "$$NOW" }, 1] },
                                          month: 4,
                                          day: 1
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            },
                            {
                              $lt: [
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: { $toDate: `$${condition.fieldName}` }
                                  }
                                },
                                {
                                  $dateToString: {
                                    format: "%Y-%m-%d",
                                    date: {
                                      $toDate: {
                                        $dateFromParts: {
                                          year: { $year: "$$NOW" },
                                          month: 4,
                                          day: 1
                                        }
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        };
                        break;
                      
                        case "$gte_currentFinancialYear_lte":
                          matchConditions["$expr"] = {
                            $and: [
                              { $ne: [`$${condition.fieldName}`, null] },
                              { $ne: [`$${condition.fieldName}`, ""] },
                              {
                                $gte: [
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: { $toDate: `$${condition.fieldName}` }
                                    }
                                  },
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: {
                                        $toDate: {
                                          $dateFromParts: {
                                            year: { $year: "$$NOW" },
                                            month: 4,
                                            day: 1
                                          }
                                        }
                                      }
                                    }
                                  }
                                ]
                              },
                              {
                                $lt: [
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: { $toDate: `$${condition.fieldName}` }
                                    }
                                  },
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: {
                                        $toDate: {
                                          $dateFromParts: {
                                            year: { $add: [{ $year: "$$NOW" }, 1] },
                                            month: 4,
                                            day: 1
                                          }
                                        }
                                      }
                                    }
                                  }
                                ]
                              }
                            ]
                          };
                          break;
                        
                        case "$gte_nextFinancialYear_lte":
                          matchConditions["$expr"] = {
                            $and: [
                              { $ne: [`$${condition.fieldName}`, null] },
                              { $ne: [`$${condition.fieldName}`, ""] },
                              {
                                $gte: [
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: { $toDate: `$${condition.fieldName}` }
                                    }
                                  },
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: {
                                        $toDate: {
                                          $dateFromParts: {
                                            year: { $add: [{ $year: "$$NOW" }, 1] },
                                            month: 4,
                                            day: 1
                                          }
                                        }
                                      }
                                    }
                                  }
                                ]
                              },
                              {
                                $lt: [
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: { $toDate: `$${condition.fieldName}` }
                                    }
                                  },
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: {
                                        $toDate: {
                                          $dateFromParts: {
                                            year: { $add: [{ $year: "$$NOW" }, 2] },
                                            month: 4,
                                            day: 1
                                          }
                                        }
                                      }
                                    }
                                  }
                                ]
                              }
                            ]
                          };
                          break;
                        
                        case "$gte_previousWeek_lte":
                          matchConditions["$expr"] = {
                            $and: [
                              { $ne: [`$${condition.fieldName}`, null] },
                              { $ne: [`$${condition.fieldName}`, ""] },
                              {
                                $gte: [
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: { $toDate: `$${condition.fieldName}` }
                                    }
                                  },
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: {
                                        $toDate: {
                                          $dateAdd: {
                                            startDate: "$$NOW",
                                            unit: "day",
                                            amount: -7
                                          }
                                        }
                                      }
                                    }
                                  }
                                ]
                              },
                              {
                                $lt: [
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: { $toDate: `$${condition.fieldName}` }
                                    }
                                  },
                                  {
                                    $dateToString: {
                                      format: "%Y-%m-%d",
                                      date: {
                                        $toDate: {
                                          $dateAdd: {
                                            startDate: "$$NOW",
                                            unit: "day",
                                            amount: 0
                                          }
                                        }
                                      }
                                    }
                                  }
                                ]
                              }
                            ]
                          };
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {dynamicFields.map((field) => (
            <div key={field.fieldName} style={{ display: "flex", alignItems: "center" }}>
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