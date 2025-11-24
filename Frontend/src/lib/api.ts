// src/lib/api.ts
import axios from "axios";
import { toast } from "sonner";

const API_BASE = "https://backend-ruby-theta-98.vercel.app/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Attach token
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      toast.error("Session expired. Please login again.");
      // small delay so toast shows
      setTimeout(() => {
        window.location.href = "/login";
      }, 400);
    }
    return Promise.reject(error);
  }
);

export default api;
