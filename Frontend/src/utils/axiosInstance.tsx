import axios, { AxiosError } from "axios";
axios.defaults.withCredentials = true;
// Accessing the backend API URL from environment variables
const baseURL: string = import.meta.env.VITE_BACKEND_API_URL;
console.log(baseURL);

const axiosInstance = axios.create({
  baseURL, // Setting the base URL for axios
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const data = error.response.data as { message?: string };
        const errorMessage =
          data?.message || `Server Error: ${error.response.status}`;
        return Promise.reject(new Error(errorMessage));
      }
      if (error.request) {
        return Promise.reject(
          new Error("No response received from the server.")
        );
      }
    }
    return Promise.reject(new Error("Unexpected error occurred."));
  }
);

export default axiosInstance;
