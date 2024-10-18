import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

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
