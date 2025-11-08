import axios, { AxiosError } from "axios";

export const ApiEndPoint = "http://localhost:5000"
export const EndPoint = "http://localhost:5000"

export const getPopularCars = async () => {
    try {
      const response = await axios.get(EndPoint + "/cars/popular");
      // console.log(data);
      return response.data.content;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      console.log(err.response?.data?.error || "Unknown Error");
    }
  };
  
