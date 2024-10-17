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
