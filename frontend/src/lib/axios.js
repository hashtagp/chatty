import axios from "axios";

// Get API URL from environment variables with fallback to production
const API_URL = import.meta.env.VITE_API_URL || "https://api.talksy.tech";

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});
