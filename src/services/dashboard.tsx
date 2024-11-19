import axios, { AxiosRequestConfig } from "axios";

const apiUrl = import.meta.env.VITE_APP_PROXY_API;

export const applicationOverviewDigit = async () => {
  const data = JSON.stringify({});
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${apiUrl}/application/v1/_appstat`, // Local proxy path
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
  const data = JSON.stringify({});
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${apiUrl}/application/v1/_fundsstat`, // Local proxy path
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
  const data = JSON.stringify({});
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${apiUrl}/application/v1/scholarships/top-3`, // Local proxy path
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
  const data = JSON.stringify({});
  const config: AxiosRequestConfig = {
    method: "post",
    url: `${apiUrl}/application/v1/scholarships/details`, // Local proxy path
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

export const detailViewRow = async (id: string) => {
  try {
    const data = {
      benefitId: id,
    };
    const response = await axios.post(
      `${apiUrl}/benefits/v1/collapse/_get`,
      data
    );
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
