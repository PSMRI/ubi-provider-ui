import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;

export const registerProvider = async (name: string, email: string) => {
  try {
    const payload = {
      email: email,
      name: name,
    };
    const response = await axios.post(
      `${apiUrl}/provider/sendOtpForReg`,
      payload
    );
    return response?.data?.success;
  } catch (error) {
    console.log(error);
  }
};

export const LoginProvider = async (email: string) => {
  try {
    const payload = {
      email: email,
    };
    const response = await axios.post(
      `${apiUrl}/provider/sendOtpForLog`,
      payload
    );
    console.log(response?.data?.success);
    return response?.data?.success;
  } catch (error) {
    console.log(error);
  }
};

export const sendOTP = async (otp: number, email: string) => {
  try {
    const payload = {
      email: email,
      otp: otp,
    };
    const response = await axios.post(`${apiUrl}/provider/login`, payload);
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};

export const userRegister = async (otp: number, email: string) => {
  try {
    const payload = {
      email: email,
      otp: otp,
    };
    const response = await axios.post(`${apiUrl}/provider/register`, payload);
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};
