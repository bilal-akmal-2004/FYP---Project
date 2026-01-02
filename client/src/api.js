// src/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if using localStorage token
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (data) => api.post("/api/auth/register", data);
export const login = (data) => api.post("/api/auth/login", data);
export const logout = () => api.post("/api/auth/logout");
export const getCurrentUser = () => api.get("/api/auth/me");
export const googleAuth = (code) => api.get(`/api/auth/google?code=${code}`);
export const setPassword = (data) => api.post("/api/auth/set-password", data);

// Chat APIs
export const sendMessage = (messages) => api.post("/api/chat", { messages });

export const getChats = () => api.get("/api/chats");

export const getChat = (chatId) => api.get(`/api/chats/${chatId}`);

export const saveChat = (data) => api.post("/api/chats/save", data);

export const deleteChat = (chatId) => api.delete(`/api/chats/${chatId}`);

export const clearChats = () => api.delete("/api/chats");

export default api;
