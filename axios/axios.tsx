// D:\Sugumar\taxi-store\axios\axios.tsx
// Ensure correct baseURL
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
});

export default axiosInstance;