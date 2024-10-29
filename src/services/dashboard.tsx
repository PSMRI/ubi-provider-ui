import axios, { AxiosRequestConfig } from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiDigitUrl = import.meta.env.VITE_DIGIT_BASE_URL;

// Application overview digit API
export const applicationOverviewDigit1 = async () => {
  const payload = {};
  try {
    const response = await axios.get(`${apiDigitUrl}/_appstat`, payload);
    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const applicationOverviewDigit = async () => {
  let data = JSON.stringify({});
  const config: AxiosRequestConfig = {
    method: "post",
    url: "/application/v1/_appstat", // Local proxy path
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API request error:", error);
  }
};
// Financial overview digit API
export const financialOverviewDigit = async () => {
  let data = JSON.stringify({});
  const config: AxiosRequestConfig = {
    method: "post",
    url: "/application/v1/_fundsstat", // Local proxy path
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API request error:", error);
  }
};

export const popularBenefitDigit = async () => {
  let data = JSON.stringify({});
  const config: AxiosRequestConfig = {
    method: "post",
    url: "/application/v1/scholarships/top-3", // Local proxy path
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API request error:", error);
  }
};

export const benefitSummaryDigit = async () => {
  let data = JSON.stringify({});
  const config: AxiosRequestConfig = {
    method: "post",
    url: "/application/v1/scholarships/details", // Local proxy path
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  try {
    const response = await axios(config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("API request error:", error);
  }
};

export const applicationOverview = async (id: number) => {
  try {
    const response = await axios.get(
      `${apiUrl}/provider/getApplicationOverview/${id}`
    );
    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
export const detailViewRow = async (id: string) => {
  try {
    const response = await axios.get(`${apiUrl}/benefit/getBenefit/${id}`);
    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  // Create an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Format the date to "DD Month YYYY"
  return `${date.getDate()} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
};
