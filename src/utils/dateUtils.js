export const today = new Date().toISOString().split("T")[0];

export const getDateString = (offset) => {
  let date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().split("T")[0];
};

export const yesterday = getDateString(-1);
export const tomorrow = getDateString(1);

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
export const thisWeekStartDate = thisWeekStart.toISOString().split("T")[0];
export const thisWeekEndDate = thisWeekEnd.toISOString().split("T")[0];
export const nextWeekStartDate = nextWeekStart.toISOString().split("T")[0];
export const nextWeekEndDate = nextWeekEnd.toISOString().split("T")[0];

export const getDateRange = (type) => {
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
