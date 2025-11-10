import axios, { AxiosError } from "axios";

export const ApiEndPoint = "https://rentalbee-backend.onrender.com"
export const EndPoint = "https://rentalbee-backend.onrender.com"

export const getPopularCars = async () => {
    try {
      const response = await axios.get(EndPoint + "/cars/popular");
      return response.data.content;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      console.log(err.response?.data?.error || "Unknown Error");
    }
  };