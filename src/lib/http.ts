import axios from "axios";
const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;
export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});
